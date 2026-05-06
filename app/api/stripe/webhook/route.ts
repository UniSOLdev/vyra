import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const unix = (sub as unknown as { current_period_end?: number | null }).current_period_end
  if (!unix) return null
  return new Date(unix * 1000)
}

async function syncSubscriptionState(args: {
  userId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  status: string | null
  currentPeriodEnd: Date | null
}) {
  const admin = createAdminClient()
  const active = args.status === "active" || args.status === "trialing"

  const { data: profile } = await admin.from("profiles").select("email").eq("id", args.userId).maybeSingle()
  const email = profile?.email ?? "unknown@vyra.invalid"

  await admin
    .from("profiles")
    .update({
      is_pro: active,
      stripe_subscription_id: args.stripeSubscriptionId,
      subscription_status: args.status,
      subscription_current_period_end: args.currentPeriodEnd?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", args.userId)

  if (args.stripeCustomerId) {
    await admin.from("customers").upsert(
      {
        user_id: args.userId,
        email,
        stripe_customer_id: args.stripeCustomerId,
      },
      { onConflict: "user_id" }
    )

    const { data: cust } = await admin.from("customers").select("id").eq("user_id", args.userId).maybeSingle()

    if (cust?.id && args.stripeSubscriptionId) {
      await admin.from("subscriptions").upsert(
        {
          customer_id: cust.id,
          stripe_subscription_id: args.stripeSubscriptionId,
          status: args.status,
          plan: "vyra_pro",
          current_period_end: args.currentPeriodEnd?.toISOString() ?? null,
        },
        { onConflict: "stripe_subscription_id" }
      )
    }
  }
}

export async function POST(req: Request) {
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!signingSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }
  if (!serviceKey) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 })
  }

  const body = await req.text()
  const sig = (await headers()).get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, signingSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const stripe = getStripe()

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === "subscription" && session.metadata?.supabase_user_id) {
        const userId = session.metadata.supabase_user_id
        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null
        if (subId) {
          const subRaw = await stripe.subscriptions.retrieve(subId)
          const sub = subRaw as unknown as Stripe.Subscription
          await syncSubscriptionState({
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: sub.id,
            status: sub.status,
            currentPeriodEnd: subscriptionPeriodEnd(sub),
          })
        }
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      if (userId) {
        await syncSubscriptionState({
          userId,
          stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
          stripeSubscriptionId: sub.id,
          status: sub.status,
          currentPeriodEnd: subscriptionPeriodEnd(sub),
        })
      }
    }
  } catch (e) {
    console.error("stripe webhook handler error", e)
    return NextResponse.json({ error: "handler_failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
