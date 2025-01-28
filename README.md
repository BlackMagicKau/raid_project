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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
