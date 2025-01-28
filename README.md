# Fruit Store POS System

This is a [Next.js](https://nextjs.org) project that implements a Point of Sale (POS) system for a fruit store.

## Implemented Features

### Customer Features
- View available fruits with stock levels and pricing
- Add fruits to shopping cart
- Adjust quantities in cart
- See real-time total amount
- Submit orders with customer name

### Owner/Admin Features
- View all customer orders
- Track order status
- Monitor inventory levels

## User Stories Completed

✅ **As a customer**, I want to:
- See a list of fruits that are available to buy (with stock and pricing information)
- Keep track of fruits and quantities in my cart
- See the total amount I need to pay
- Submit my order when I'm done shopping

✅ **As an owner**, I want to:
- See all customer orders
- View order details including customer information and items purchased
- Track order status (pending/completed)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Navigation

- `/` - Customer store view
- `/admin` - Admin dashboard for order management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deployment

### Prerequisites
1. Create a [Vercel account](https://vercel.com/signup)
2. Create a PostgreSQL database (you can use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))
3. Have your environment variables ready (see `.env.example`)

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [Vercel New Project](https://vercel.com/new)
3. Import your GitHub repository
4. Configure your environment variables:
   - Add `DATABASE_URL` pointing to your production database
5. Deploy!

### Post-Deployment

After deploying, you'll need to run the database migrations and seed the database:

1. From your Vercel project dashboard, go to Settings → Environment Variables
2. Add your production `DATABASE_URL`
3. Run the following commands locally, targeting your production database:
   ```bash
   # Update DATABASE_URL in your local .env to point to production
   npx prisma db push
   npm run seed
   ```

### Development vs Production

- Development: Uses local PostgreSQL database
- Production: Uses Vercel Postgres or your preferred PostgreSQL host
- Environment variables are managed through Vercel's dashboard

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your local database credentials
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run database migrations:
   ```bash
   npx prisma db push
   ```
6. Seed the database:
   ```bash
   npm run seed
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Deploy on Vercel

I have deployed the [app](https://raid-project.vercel.app) on Vercel.
