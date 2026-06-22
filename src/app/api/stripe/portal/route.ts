import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { userRepository } from "@/repositories/user.repository";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await userRepository.findById(session.userId);
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe to a paid plan first." },
      { status: 400 }
    );
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
