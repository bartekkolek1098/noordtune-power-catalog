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
import type {StageDefinition} from "@/data/catalog";

export function PowerChart({
  powerUnit = "pk",
  stages,
  stockPower,
  stockLabel = "Stock",
  stockTorque
}: {
  powerUnit?: string;
  stages: StageDefinition[];
  stockPower: number;
  stockLabel?: string;
  stockTorque: number;
}) {
  const [mounted, setMounted] = useState(false);
  const data = [
    {
      name: stockLabel,
      pk: stockPower,
      nm: stockTorque
    },
    ...stages.map((stage) => ({
      name: stage.name.replace("Stage ", "S"),
      pk: stage.powerHp,
      nm: stage.torqueNm
    }))
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full rounded-lg bg-white/[0.035]" />;
  }

  return (
    <div className="h-64 min-w-0 w-full">
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
    </div>
  );
}
