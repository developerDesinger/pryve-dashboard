"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  widthClass?: string; // tailwind width classes
  render?: (row: T, index: number) => React.ReactNode;
};

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export default function DataTable<T extends { id: string | number }>({
  title,
  columns,
  data,
  rightSlot,
  selectable = true,
  pagination,
  onPageChange,
  onLimitChange,
  bodyMaxHeight = 520,
}: {
  title: string;
  columns: Column<T>[];
  data: T[];
  rightSlot?: React.ReactNode;
  selectable?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  bodyMaxHeight?: number;
}) {
  return (
    <Card className="rounded-2xl bg-white dark:bg-white border border-border w-full min-w-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="text-[18px] font-semibold">{title}</div>
        <div className="inline-flex items-center gap-2">{rightSlot}</div>
      </div>
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: bodyMaxHeight }}>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-accent">
            <tr className="text-[10px] sm:text-[12px] text-muted-foreground bg-accent border-b border-border">
              {selectable && (
                <th className="px-1 sm:px-4 py-2 sm:py-3 w-8 sm:w-10">
                  <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4 rounded border-border accent-gray-600" />
                </th>
              )}
              {columns.map((c) => (
                <th key={String(c.key)} className={`px-1 sm:px-4 py-2 sm:py-3 font-medium bg-accent whitespace-nowrap ${c.widthClass ?? ""}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id} className="border-t border-border hover:bg-accent bg-white">
                {selectable && (
                  <td className="px-1 sm:px-4 py-2 sm:py-4 w-8 sm:w-10">
                    <input type="checkbox" className="w-3 h-3 sm:w-4 sm:h-4 rounded border-border accent-gray-600" />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-1 sm:px-4 py-2 sm:py-4 align-middle bg-white text-[10px] sm:text-[14px] whitespace-nowrap">
                    {c.render ? c.render(row, i) : (row as any)[c.key as any]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-2 sm:px-4 py-3 border-t border-border text-[12px] sm:text-[14px] text-foreground bg-white rounded-b-2xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-muted-foreground text-[10px] sm:text-[12px]">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of {pagination.totalItems} results
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[10px] sm:text-[12px]">Rows per page</span>
              <select 
                value={pagination.limit} 
                onChange={(e) => onLimitChange?.(Number(e.target.value))}
                className="h-8 sm:h-9 rounded-xl border border-border bg-white px-2 sm:px-3 text-[10px] sm:text-[12px]"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:justify-end">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-foreground text-[10px] sm:text-[12px]">Page</span>
              <span className="text-muted-foreground text-[10px] sm:text-[12px]">
                {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="inline-flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => onPageChange?.(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl border border-border bg-white text-foreground/80 disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:bg-accent w-full sm:w-auto text-[10px] sm:text-[12px]"
              >
                Previous
              </button>
              <button 
                onClick={() => onPageChange?.(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#757575] text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-auto text-[10px] sm:text-[12px]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}


