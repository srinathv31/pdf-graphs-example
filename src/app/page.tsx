import DashboardPageClient from "@/components/dashboard/DashboardPageClient";
import { dashboardData } from "@/data/dashboardData";

export default function Home() {
  const dashboardTitle = "Dashboard";
  const dashboardDescription = "This is a dashboard";

  return (
    <DashboardPageClient
      title={dashboardTitle}
      description={dashboardDescription}
      data={dashboardData}
    />
  );
}
