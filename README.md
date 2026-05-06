VYRA is a premium performance MVP built with Next.js App Router.

## Getting Started

### Local dev

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Stripe + Vercel setup

1) Copy env template:

```bash
cp .env.example .env.local
```

2) Fill in:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_*` for each SKU in `data/products.ts`

3) Run:

```bash
npm run dev
```

The shop uses **Stripe Checkout Sessions** (`POST /api/checkout`) and a signed webhook endpoint (`POST /api/stripe/webhook`).

### Deploy to Vercel

- Import the repo in Vercel.
- Add the same environment variables in Vercel Project Settings.
- Set the Stripe webhook in the Stripe dashboard to:
  - `https://<your-domain>/api/stripe/webhook`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
