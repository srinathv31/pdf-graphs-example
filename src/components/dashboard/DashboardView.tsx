import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./SummaryCard";
import MonthlyBarChart from "./MonthlyBarChart";
import DepartmentPieChart from "./DepartmentPieChart";
import DailyVisitsAreaChart from "./DailyVisitsAreaChart";
import CustomersAreaChart from "./CustomersLineChart";
import dynamic from "next/dynamic";

const ChartExportClientWrapper = dynamic(
  () => import("./ChartExportClientWrapper"),
  { ssr: false }
);

interface DashboardViewProps {
  data: any;
}

export default function DashboardView({ data }: DashboardViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.summaryCards.map((card: any, index: number) => (
        <ChartExportClientWrapper key={index} id={`summary-card-${index}`}>
          <SummaryCard
            title={card.title}
            description={card.description}
            data={card.data}
            color={card.color}
          />
        </ChartExportClientWrapper>
      ))}

      <ChartExportClientWrapper id="monthly-sales">
        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{data.monthlySales.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyBarChart data={data.monthlySales} />
          </CardContent>
        </Card>
      </ChartExportClientWrapper>

      <ChartExportClientWrapper id="department-sales">
        <Card>
          <CardHeader>
            <CardTitle>{data.departmentSales.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentPieChart data={data.departmentSales} />
          </CardContent>
        </Card>
      </ChartExportClientWrapper>

      <ChartExportClientWrapper id="daily-visits">
        <Card>
          <CardHeader>
            <CardTitle>{data.dailyVisits.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyVisitsAreaChart data={data.dailyVisits} />
          </CardContent>
        </Card>
      </ChartExportClientWrapper>

      <ChartExportClientWrapper id="customers">
        <Card>
          <CardHeader>
            <CardTitle>{data.customers.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-4">
              {data.customers.value}
            </div>
            <CustomersAreaChart data={data.customers} />
          </CardContent>
        </Card>
      </ChartExportClientWrapper>
    </div>
  );
}
