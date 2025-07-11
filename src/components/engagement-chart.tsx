"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartTooltipContent, ChartContainer, ChartTooltip } from "@/components/ui/chart"

const chartData = [
  { time: "0-5 min", engagement: 85 },
  { time: "5-10 min", engagement: 92 },
  { time: "10-15 min", engagement: 78 },
  { time: "15-20 min", engagement: 88 },
  { time: "20-25 min", engagement: 75 },
  { time: "25-30 min", engagement: 95 },
];

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "hsl(var(--accent))",
  },
}

export function EngagementChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                    dataKey="time" 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 6)}
                    />
                <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[60, 100]}
                />
                <Tooltip cursor={true} content={<ChartTooltipContent />} />
                <Line
                    dataKey="engagement"
                    type="monotone"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{
                        fill: "hsl(var(--accent))",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                    />
            </LineChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
