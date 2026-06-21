import { NextRequest, NextResponse } from "next/server";
import { getStripe, planFromPriceId } from "@/lib/stripe";
import { userRepository } from "@/repositories/user.repository";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await userRepository.updatePlan(
        userId,
        plan as "STARTER" | "PRO" | "ENTERPRISE",
        session.subscription as string
      );
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? planFromPriceId(priceId) : null;
    const customerId = subscription.customer as string;

    if (plan) {
      const { prisma } = await import("@/lib/db");
      const found = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (found) {
        await userRepository.updatePlan(found.id, plan, subscription.id);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const { prisma } = await import("@/lib/db");
    const found = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    if (found) {
      await userRepository.updatePlan(found.id, "FREE");
    }
  }

  return NextResponse.json({ received: true });
}
