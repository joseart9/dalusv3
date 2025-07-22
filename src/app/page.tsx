import { getStats } from "@/server/services/stats";
import { DashboardView } from "./dashboard-view";

export default async function Dashboard() {
  const stats = await getStats();
  const data = stats.data;

  return <DashboardView data={data} />;
}
