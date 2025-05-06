"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyBarChartProps {
  data: {
    categories: string[];
    series: Array<{
      name: string;
      data: number[];
      color: string;
    }>;
  };
}

const MonthlyBarChart = ({ data }: MonthlyBarChartProps) => {
  // Convert the data to the format expected by Recharts
  const chartData = data.categories.map((category, index) => {
    const dataPoint: any = { name: category };
    data.series.forEach((series) => {
      dataPoint[series.name] = series.data[index];
    });
    return dataPoint;
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend />
          {data.series.map((series, index) => (
            <Bar
              key={index}
              dataKey={series.name}
              fill={`theme(${series.color})`}
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
