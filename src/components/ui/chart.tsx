"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { Payload } from "recharts/types/component/DefaultTooltipContent"; // Import Payload type

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: { color: CSS_VAR_VALUE } }
// EXAMPLE: { "light": { "fill": "hsl(213 31% 91%)" } }
export type ChartConfig = {
  [k: string]: {
    label?: string;
    icon?: React.ComponentType<{ className?: string }>;
  } & (
    | { color?: string; theme?: never }
    | { theme?: Record<string, string>; color?: never }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function ChartProvider({ config, children }: React.PropsWithChildren<ChartContextProps>) {
  return (
    <ChartContext.Provider value={{ config }}>{children}</ChartContext.Provider>
  );
}

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartProvider>");
  }

  return context;
}

type ChartProps = React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer> & {
  config: ChartConfig;
};

const Chart = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ChartProps>
>(({ config, className, children, ...props }, ref) => (
  <ChartProvider config={config}>
    <div
      ref={ref}
      className={cn("flex h-[400px] w-full flex-col", className)}
    >
      <RechartsPrimitive.ResponsiveContainer {...props}>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  </ChartProvider>
));
Chart.displayName = "Chart";

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    formatter?: (
      value: number,
      name: string,
      item: Payload<any, any>, // Use the imported Payload type with generic arguments
      index: number,
      payload: Payload<any, any>[] // Use the imported Payload type with generic arguments
    ) => React.ReactNode;
  }
>(
  (
    {
      active,
      payload,
      formatter,
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      className, // Destructure className here for the outer div
      ...props // Remaining props for RechartsPrimitive.Tooltip
    },
    ref
  ) => {
    const { config } = useChart();

    if (
      !(active && payload && payload.length) ||
      (hideLabel && hideIndicator && !formatter)
    ) {
      return null;
    }

    const formattedLabel = labelFormatter ? labelFormatter(label, payload) : label;

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[130px] items-center break-words rounded-md border border-slate-200 bg-white/95 p-1.5 text-sm text-slate-950 shadow-md backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-50",
          className // Apply className here
        )}
        // Do NOT spread ...props here, as they are for RechartsPrimitive.Tooltip, not a div
      >
        {!hideLabel && formattedLabel ? (
          <div className="border-b border-slate-200 p-1.5 pb-1 dark:border-slate-800">
            <p className="font-medium">{formattedLabel}</p>
          </div>
        ) : null}
        <div className="space-y-1.5 p-1.5">
          {payload.map((item, index) => {
            // Ensure item.dataKey is a string before passing
            const dataKey = typeof item.dataKey === 'string' ? item.dataKey : String(item.dataKey);
            const [itemValue, itemConfig] = getPayloadConfigFromPayload(config, item, dataKey);

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex items-center gap-2",
                  item.color
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn("h-2 w-2 shrink-0 rounded-full", itemConfig?.color)}
                  />
                )}
                {formatter ? (
                  formatter(itemValue as number, item.name!, item, index, payload)
                ) : (
                  <div className="flex flex-1 justify-between">
                    {itemConfig?.label ? (
                      <p className="text-slate-700 dark:text-slate-400">
                        {itemConfig.label}
                      </p>
                    ) : (
                      item.name && <p>{item.name}</p>
                    )}
                    <p className="font-medium text-slate-950 dark:text-slate-50">
                      {item.value}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

function getPayloadConfigFromPayload(
  config: ChartConfig,
  item: Payload<any, any>, // Use the imported Payload type with generic arguments
  key: string
) {
  const itemConfig = config[key];
  const color = item.stroke ?? item.fill;

  if (!itemConfig) {
    return [color, { color }];
  }

  return [
    item.value,
    {
      ...itemConfig,
      color: itemConfig.color ?? color,
    },
  ];
}

export {
  Chart,
  ChartTooltip,
  ChartTooltipContent,
  ChartProvider,
  useChart,
};