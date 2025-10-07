"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  widthClass?: string; // tailwind width classes
  render?: (row: T, index: number) => React.ReactNode;
};

export default function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  rightSlot,
  selectable = true,
  page = 1,
  totalPages = 25,
  bodyMaxHeight = 520,
}: {
  title: string;
  columns: Column<T>[];
  data: T[];
  rightSlot?: React.ReactNode;
  selectable?: boolean;
  page?: number;
  totalPages?: number;
  bodyMaxHeight?: number;
}) {
  return (
    <Card className="rounded-2xl bg-white dark:bg-white border border-border w-full min-w-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="text-[18px] font-semibold">{title}</div>
        <div className="inline-flex items-center gap-2">{rightSlot}</div>
      </div>
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: bodyMaxHeight }}>
        <table className="w-full text-left border-collapse">
          <thead className="bg-accent">
            <tr className="text-[11px] sm:text-[12px] text-muted-foreground bg-accent border-b border-border">
              {selectable && (
                <th className="px-2 sm:px-4 py-2 sm:py-3 w-10">
                  <input type="checkbox" className="w-4 h-4 rounded border-border" />
                </th>
              )}
              {columns.map((c) => (
                <th key={String(c.key)} className={`px-2 sm:px-4 py-2 sm:py-3 font-medium bg-accent ${c.widthClass ?? ""}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id} className="border-t border-border hover:bg-accent bg-white">
                {selectable && (
                  <td className="px-2 sm:px-4 py-3 sm:py-4 w-10">
                    <input type="checkbox" className="w-4 h-4 rounded border-border" />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-2 sm:px-4 py-3 sm:py-4 align-middle bg-white text-[13px] sm:text-[14px]">
                    {c.render ? c.render(row, i) : (row as any)[c.key as any]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-border text-[14px] text-foreground bg-white rounded-b-2xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-muted-foreground">Rows per page</span>
          <select defaultValue="50" className="h-9 rounded-xl border border-border bg-white px-3">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="flex items-center gap-4 flex-wrap sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-foreground">Go To Page</span>
            <input defaultValue={page} className="h-9 w-12 text-center rounded-xl border border-border bg-white" />
            <span className="text-muted-foreground">of {totalPages}</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-border" />
          <div className="inline-flex gap-2 w-full sm:w-auto">
            <button className="h-9 px-4 rounded-xl border border-border bg-white text-foreground/80 cursor-not-allowed w-full sm:w-auto" disabled>
              Previous
            </button>
            <button className="h-9 px-4 rounded-xl bg-[#757575] text-white hover:brightness-95 cursor-pointer w-full sm:w-auto">Next</button>
          </div>
        </div>
      </div>
    </Card>
  );
}


