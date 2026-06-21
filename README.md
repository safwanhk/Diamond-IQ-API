# DiamondIQ API

Production-ready SaaS REST API for instant diamond market valuation. Built for jewelry stores, diamond traders, marketplaces, and e-commerce platforms.

## Features

- **Diamond Valuation Engine** — Isolated service layer with carat, color, clarity, cut, and certificate multipliers
- **Subscription Plans** — Free, Starter ($29), Pro ($99), Enterprise (unlimited)
- **API Key Authentication** — Secure key-based access with usage tracking and rate limiting
- **Stripe Billing** — Checkout sessions and webhook-driven plan upgrades
- **Admin Dashboard** — Users, revenue, API usage, pricing rules
- **Customer Dashboard** — API keys, usage charts, billing, recent requests
- **Developer Experience** — OpenAPI/Swagger docs, interactive playground, SDK examples (JS, TS, Python, PHP)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (dashboard) + API Keys (API) |
| Payments | Stripe |
| Deployment | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for billing)

### 1. Install dependencies

```bash
cd diamondiq-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL, JWT secret, and Stripe keys.

### 3. Set up database

```bash
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin (or admin@admin.com) | admin |
| Customer | demo@diamondiq.com | customer123! |

**Demo API Key:** `diq_demo_key_for_testing_purposes_only`

## API Usage

### Valuation Request

```bash
curl -X POST http://localhost:3000/api/v1/valuation \
  -H "X-API-Key: diq_demo_key_for_testing_purposes_only" \
  -H "Content-Type: application/json" \
  -d '{
    "carat": 1.2,
    "color": "D",
    "clarity": "VVS1",
    "cut": "Excellent",
    "certificate": "GIA"
  }'
```

### Response

```json
{
  "estimatedPrice": 12500,
  "lowPrice": 11800,
  "highPrice": 13200,
  "confidence": 94,
  "trend": "UP",
  "investmentScore": 88
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/valuation` | Get diamond valuation |
| GET | `/api/v1/history` | Valuation history |
| GET | `/api/v1/trends` | Market trends |
| GET | `/api/v1/account/usage` | API usage stats |
| POST | `/api/v1/apikeys` | Create API key (JWT) |
| GET | `/api/docs` | OpenAPI specification |

## Project Structure

```
diamondiq-api/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Demo data
├── src/
│   ├── app/               # Next.js App Router pages & API routes
│   ├── components/        # UI components (Shadcn)
│   ├── lib/               # Auth, DB, Stripe, utilities
│   ├── repositories/      # Data access layer
│   ├── services/          # Business logic (valuation, usage)
│   └── types/             # TypeScript types & Zod schemas
├── .env.example
└── vercel.json
```

## Subscription Plans

| Plan | Price | Requests/month |
|------|-------|----------------|
| Free | $0 | 100 |
| Starter | $29 | 10,000 |
| Pro | $99 | 100,000 |
| Enterprise | Custom | Unlimited |

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Use Vercel Postgres or external PostgreSQL (e.g. Neon, Supabase)
5. Run `npx prisma db push` against production database
6. Configure Stripe webhook: `https://your-domain.com/api/stripe/webhook`

### Required Environment Variables

```
DATABASE_URL
JWT_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_STARTER_PRICE_ID
STRIPE_PRO_PRICE_ID
STRIPE_ENTERPRISE_PRICE_ID
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

## Security

- API key authentication on all v1 endpoints
- Monthly rate limiting per subscription plan
- JWT httpOnly cookies for dashboard sessions
- Input validation with Zod schemas
- Prisma ORM (parameterized queries — SQL injection protection)
- Security headers (XSS, clickjacking, MIME sniffing)
- Request logging for audit trail

## License

MIT
