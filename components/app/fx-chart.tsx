"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FX_CHART, fxCurrent, fxChange, fxChangePct } from "@/lib/fx";
import { Pill, PillDelta } from "@/components/kibo-ui/pill";

const chartConfig = {
  rate: { label: "USD → INR", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

/* USD→INR line chart — shadcn/recharts, themed brutal-dark (lime line). */
export function FxChart() {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">USD → INR · 30d</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-tight">
            ₹{fxCurrent.toFixed(2)}
          </p>
        </div>
        <Pill>
          <PillDelta delta={fxChangePct} />
          {fxChange >= 0 ? `+${fxChange.toFixed(2)}` : fxChange.toFixed(2)} ({fxChangePct}%) today
        </Pill>
      </div>

      <ChartContainer config={chartConfig} className="mt-4 aspect-auto h-40 w-full">
        <LineChart accessibilityLayer data={FX_CHART} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <YAxis hide domain={["dataMin - 0.2", "dataMax + 0.2"]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                valueFormatter={(v) => `₹${Number(v).toFixed(2)}`}
                labelFormatter={(v) =>
                  new Date(v as string).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            }
          />
          <Line dataKey="rate" type="monotone" stroke="var(--color-rate)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
