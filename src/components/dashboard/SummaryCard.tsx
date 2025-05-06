"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area } from "recharts";

interface SummaryCardProps {
  title: string;
  description: string;
  data: number[];
  color: string;
}

const SummaryCard = ({ title, description, data, color }: SummaryCardProps) => {
  // Convert the data array to the format expected by Recharts
  const chartData = data.map((value, index) => ({
    name: index.toString(),
    value,
  }));

  // Set up chartConfig for shadcn chart
  const chartConfig = {
    value: {
      label: title,
      color: color.includes(".") ? `hsl(var(--${color}))` : color,
    },
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-24">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full min-h-0"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                fill={color.includes(".") ? `hsl(var(--${color}))` : color}
                stroke={color.includes(".") ? `hsl(var(--${color}))` : color}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
