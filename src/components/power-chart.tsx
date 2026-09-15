"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {useEffect, useState} from "react";
import type {Locale} from "@/i18n/routing";

export function PowerChart({
  locale = "nl",
  powerUnit = "pk",
  stages,
  stockPower,
  stockLabel = "Stock",
  stockTorque
}: {
  locale?: Locale;
  powerUnit?: string;
  stages: {name: string; powerHp?: number; torqueNm?: number}[];
  stockPower: number;
  stockLabel?: string;
  stockTorque?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const data = [
    {
      name: stockLabel,
      pk: stockPower,
      nm: stockTorque ?? null
    },
    ...stages.map((stage) => ({
      name: stage.name.replace("Stage ", "S"),
      pk: stage.powerHp ?? null,
      nm: stage.torqueNm ?? null
    }))
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <><div className="h-64 w-full rounded-lg bg-white/[0.035]" /><ChartCaption locale={locale} /></>;
  }

  return (
    <><div className="h-64 min-w-0 w-full" data-testid="catalog-power-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{left: -20, right: 12, top: 14, bottom: 0}}>
          <defs>
            <linearGradient id="power" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c4ff28" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#c4ff28" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="torque" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd000" stopOpacity={0.65} />
              <stop offset="100%" stopColor="#ffd000" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.55)" tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.55)" tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0d1117",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: 8
            }}
          />
          <Area
            dataKey="pk"
            name={powerUnit}
            stroke="#c4ff28"
            strokeWidth={3}
            fill="url(#power)"
            type="monotone"
          />
          <Area
            dataKey="nm"
            name="Nm"
            stroke="#ffd000"
            strokeWidth={2}
            fill="url(#torque)"
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div><ChartCaption locale={locale} /></>
  );
}

function ChartCaption({locale}: {locale: Locale}) {
  return <p className="mt-2 text-xs leading-5 text-muted-foreground" data-testid="catalog-chart-caption">{{
    nl: "Catalogusillustratie van piekwaarden; geen rollenbankmeting of gemeten toerentalcurve.",
    en: "Catalog illustration of peak values; not a dyno measurement or measured RPM curve.",
    pl: "Ilustracja katalogowych wartości szczytowych; nie jest pomiarem z hamowni ani zmierzoną krzywą obrotów."
  }[locale]}</p>;
}
