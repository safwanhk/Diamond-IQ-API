import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { userRepository } from "@/repositories/user.repository";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await userRepository.findById(session.userId);
  if (!user) redirect("/login");

  return <DashboardClient user={user} />;
}
