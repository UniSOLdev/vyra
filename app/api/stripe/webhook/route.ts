import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signingSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    )
  }

  const body = await req.text()
  const sig = (await headers()).get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 })
  }

  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, signingSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Minimal webhook: validate signature + ack. Extend for fulfillment later.
  if (event.type === "checkout.session.completed") {
    // const session = event.data.object as Stripe.Checkout.Session
  }

  return NextResponse.json({ received: true })
}

