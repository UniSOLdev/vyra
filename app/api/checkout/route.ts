import { NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { getStripePriceId } from "@/lib/stripe-products"
import { getProductBySlug } from "@/data/products"

export const runtime = "nodejs"

type Body = {
  slug: string
  quantity?: number
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null
  if (!body?.slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 })
  }

  const product = getProductBySlug(body.slug)
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 })
  }

  if (product.category === "Supplements") {
    return NextResponse.json({ error: "Unavailable" }, { status: 400 })
  }

  const quantity = Math.max(1, Math.min(10, Math.floor(body.quantity ?? 1)))
  const price = getStripePriceId(product.slug)

  const origin = req.headers.get("origin") ?? "http://localhost:3000"
  const successUrl = `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${origin}/shop?canceled=1`

  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [{ price, quantity }],
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    automatic_tax: { enabled: true },
    client_reference_id: product.slug,
    metadata: {
      productSlug: product.slug,
      productName: product.name,
      category: product.category,
    },
  })

  return NextResponse.json({ url: session.url })
}

