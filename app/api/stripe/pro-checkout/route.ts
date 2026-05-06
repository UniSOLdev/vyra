import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { getProSubscriptionPriceId } from "@/lib/stripe-products"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const priceId = getProSubscriptionPriceId()
  if (!priceId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ disabled: true }, { status: 503 })
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000"
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/insights?checkout=1`,
    cancel_url: `${origin}/insights?canceled=1`,
    allow_promotion_codes: true,
    metadata: {
      supabase_user_id: user.id,
      vyra_product: "pro_subscription",
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
      },
    },
  })

  return NextResponse.json({ url: session.url })
}
