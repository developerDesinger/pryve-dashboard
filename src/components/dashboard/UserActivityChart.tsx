"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
// import activity from "@/data/activity.json"; // Removed mock data
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

// Rename to avoid clashing with chart.js Point type
type ActivityPoint = { label: string; users: number; messages: number };
type Period = "Daily" | "Weekly" | "Monthly";

// Mock data structure for chart - will be replaced with API data
const DATASETS: Record<Period, ActivityPoint[]> = {
  Daily: [],
  Weekly: [],
  Monthly: []
};

// Safe gradient factory to avoid SSR/initial layout issues
function makeVerticalGradient(from: string, to: string) {
  return (context: any) => {
    const chart = context?.chart;
    const ctx = chart?.ctx;
    const chartArea = chart?.chartArea;
    if (!ctx || !chartArea) {
      // Fallback solid color until layout is ready
      return from;
    }
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, from);
    gradient.addColorStop(1, to);
    return gradient;
  };
}

// Custom crosshair (dashed vertical line)
const crosshairPlugin: Plugin = {
  id: "dashedCrosshair",
  afterDatasetsDraw(chart) {
    const tooltip = chart.tooltip as any;
    if (!tooltip || !tooltip?._active?.length) return;
    const ctx = chart.ctx as CanvasRenderingContext2D;
    const x = tooltip._active[0].element.x;
    const top = chart.chartArea.top;
    const bottom = chart.chartArea.bottom;
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#0b0c0f";
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.restore();
  },
};

// External tooltip to match the design
function externalTooltip(context: any) {
  const { chart, tooltip } = context;
  let el = document.getElementById("ua-tooltip");
  if (!el) {
    el = document.createElement("div");
    el.id = "ua-tooltip";
    el.style.position = "absolute";
    el.style.pointerEvents = "none";
    el.style.zIndex = "10";
    chart.canvas.parentNode!.appendChild(el);
  }
  if (tooltip.opacity === 0) {
    el.style.opacity = "0";
    return;
  }
  const users = tooltip.dataPoints?.find((d: any) => d.dataset.label === "Users");
  const messages = tooltip.dataPoints?.find((d: any) => d.dataset.label === "Messages");
  el.innerHTML = `
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.08);overflow:hidden;">
      <div style="display:grid;grid-template-columns:1fr 1fr;">
        <div style="padding:12px 16px;">
          <div style="font-size:12px;color:#667085;">Users</div>
          <div style="font-size:22px;font-weight:700;color:#e38a8a;">${Number(users?.formattedValue ?? 0).toLocaleString()}</div>
        </div>
        <div style="padding:12px 16px;border-left:1px solid #e5e7eb;">
          <div style="font-size:12px;color:#667085;">Messages</div>
          <div style="font-size:22px;font-weight:700;color:#6b5562;">${Number(messages?.formattedValue ?? 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
    <svg width="18" height="10" viewBox="0 0 18 10" style="display:block;margin:2px auto 0;">
      <path d="M9 10 L18 0 H0 Z" fill="#ffffff" stroke="#e5e7eb" />
    </svg>
  `;
  const { offsetLeft: left, offsetTop: top } = chart.canvas;
  const x = left + tooltip.caretX - el.clientWidth / 2;
  const y = top + tooltip.caretY - 70; // raise above line
  el.style.opacity = "1";
  el.style.left = `${Math.max(chart.chartArea.left, Math.min(x, chart.chartArea.right - el.clientWidth))}px`;
  el.style.top = `${Math.max(chart.chartArea.top, y)}px`;
}

export default function UserActivityChart({ className }: { className?: string }) {
  const [period, setPeriod] = React.useState<Period>("Monthly");
  const dataArr = DATASETS[period];

  const labels = dataArr.map((d) => d.label);
  const users = dataArr.map((d) => d.users);
  const messages = dataArr.map((d) => d.messages);

  const data = {
    labels,
    datasets: [
      {
        label: "Messages",
        data: messages,
        borderColor: "#475569",
        backgroundColor: makeVerticalGradient("rgba(71, 85, 105, 0.24)", "rgba(71, 85, 105, 0.06)"),
        fill: true,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      },
      {
        label: "Users",
        data: users,
        borderColor: "#111827",
        backgroundColor: makeVerticalGradient("rgba(239,68,68,0.24)", "rgba(239,68,68,0.06)"),
        fill: true,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        external: externalTooltip,
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#667085", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: { color: "#667085", font: { size: 12 }, callback: (v: any) => Number(v).toLocaleString() },
      },
    },
    interaction: { mode: "index" as const, intersect: false },
  } as const;

  return (
    <Card className={cn("rounded-2xl p-5 bg-white dark:bg-white w-full min-w-0", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-border inline-flex items-center justify-center">
            <img src="/icons/Unselect-side/analytics.svg" alt="chart" className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[20px] font-semibold">User Activity Trends</div>
            <div className="text-[14px] text-muted-foreground">Daily active users and message volume</div>
          </div>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="h-9 px-3 rounded-xl border border-border bg-white dark:bg-white text-[14px]"
        >
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>

      <div className="relative w-full min-w-0" style={{ height: 320 }}>
        <Line data={data} options={options} plugins={[crosshairPlugin]} />
      </div>
    </Card>
  );
}


