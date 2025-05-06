import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from "./SummaryCard";
import MonthlyBarChart from "./MonthlyBarChart";
import DepartmentPieChart from "./DepartmentPieChart";
import DailyVisitsAreaChart from "./DailyVisitsAreaChart";
import CustomersAreaChart from "./CustomersLineChart";

interface DashboardViewProps {
  data: any;
}

const DashboardView = ({ data }: DashboardViewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.summaryCards.map((card: any, index: number) => (
        <SummaryCard
          key={index}
          title={card.title}
          description={card.description}
          data={card.data}
          color={card.color}
        />
      ))}

      <Card className="md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>{data.monthlySales.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyBarChart data={data.monthlySales} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{data.departmentSales.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentPieChart data={data.departmentSales} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{data.dailyVisits.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyVisitsAreaChart data={data.dailyVisits} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{data.customers.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-4xl font-bold mb-4">{data.customers.value}</div>
          <CustomersAreaChart data={data.customers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
