import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { DashboardUserProvider } from "@/components/providers/dashboard-user-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await userRepository.findById(session.userId);
  if (!user) redirect("/login");

  return (
    <DashboardUserProvider
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        stripeCustomerId: user.stripeCustomerId,
      }}
    >
      {children}
    </DashboardUserProvider>
  );
}
