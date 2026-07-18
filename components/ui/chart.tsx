"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: "" } as const;

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a <ChartContainer />");
  return ctx;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line]:stroke-border/40",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-sector]:outline-none",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.color);
  if (!colorConfig.length) return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, c]) => (c.color ? `  --color-${key}: ${c.color};` : "")).join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  labelFormatter,
  valueFormatter,
  hideLabel = false,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; name?: string; value?: number | string; color?: string; payload?: Record<string, unknown> }>;
  label?: string | number;
  className?: string;
  labelFormatter?: (label: unknown, payload: unknown) => React.ReactNode;
  valueFormatter?: (value: number | string) => React.ReactNode;
  hideLabel?: boolean;
  nameKey?: string;
}) {
  const { config } = useChart();
  if (!active || !payload?.length) return null;

  return (
    <div className={cn("border border-border bg-card px-3 py-2 text-xs shadow-lifted", className)}>
      {!hideLabel && (
        <div className="mb-1 font-medium text-foreground">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item, i) => {
          const key = String(item.dataKey ?? item.name ?? i);
          const cfg = config[key];
          return (
            <div key={i} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0"
                style={{ backgroundColor: item.color || `var(--color-${key})` }}
              />
              <span className="text-muted-foreground">{cfg?.label ?? key}</span>
              <span className="ml-auto font-mono text-foreground">
                {valueFormatter && item.value != null ? valueFormatter(item.value) : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
