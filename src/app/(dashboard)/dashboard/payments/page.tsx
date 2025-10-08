"use client";

import UserStatMiniCard from "@/components/dashboard/UserStatMiniCard";
import paymentStats from "@/data/payment-stats.json";
import { payments } from "@/data/payments";
import { useState } from "react";

export default function PaymentsPage() {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = 25;

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map(payment => payment.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Payments & Billing</h1>
          <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
            Manage subscriptions, payments, and pricing
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-[14px] font-medium text-gray-700 transition-colors cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentStats.map((stat) => (
          <UserStatMiniCard
            key={stat.id}
            id={stat.id}
            title={stat.title}
            value={stat.value}
            iconSrc={stat.iconSrc}
            iconBg={stat.iconBg}
          />
        ))}
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-200">
          <h2 className="text-[18px] font-semibold text-gray-900">Payment</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-[14px] font-medium text-gray-700 transition-colors cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sort By
            </button>
            <div className="relative">
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer pr-8">
                <option value="all">All Plans</option>
                <option value="premium">Premium</option>
                <option value="basic">Basic</option>
                <option value="free">Free</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr className="text-[12px] sm:text-[14px] text-gray-700 border-b border-gray-200">
                <th className="text-left py-3 px-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedPayments.length === payments.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600"
                  />
                </th>
                <th className="text-left py-3 px-4 font-semibold">User</th>
                <th className="text-left py-3 px-4 font-semibold">Plan</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Payment Date</th>
                <th className="text-left py-3 px-4 font-semibold">Next Billing</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => handleSelectPayment(payment.id)}
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={payment.user.avatar} 
                        alt={payment.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-[12px] sm:text-[14px] text-gray-900 font-medium">{payment.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[12px] sm:text-[14px] text-gray-700">{payment.plan}</td>
                  <td className="py-3 px-4 text-[12px] sm:text-[14px] text-gray-700 font-medium">{payment.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] sm:text-[12px] font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[12px] sm:text-[14px] text-gray-700">{payment.paymentDate}</td>
                  <td className="py-3 px-4 text-[12px] sm:text-[14px] text-gray-700">{payment.nextBilling}</td>
                  <td className="py-3 px-4">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="5" r="2" fill="currentColor"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        <circle cx="12" cy="19" r="2" fill="currentColor"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 text-[12px] sm:text-[14px] text-gray-600 bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-muted-foreground">Showing</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="h-8 sm:h-9 rounded-xl border border-gray-200 bg-white px-2 sm:px-3 text-[10px] sm:text-[12px]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-muted-foreground">/ 50</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:justify-end">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-foreground text-[10px] sm:text-[12px]">Go To Page</span>
              <input 
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="h-8 sm:h-9 w-10 sm:w-12 text-center rounded-xl border border-gray-200 bg-white text-[10px] sm:text-[12px]" 
              />
              <span className="text-muted-foreground text-[10px] sm:text-[12px]">of {totalPages}</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-200" />
            <div className="inline-flex gap-2 w-full sm:w-auto">
              <button 
                disabled={currentPage === 1}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl border border-gray-200 bg-white text-gray-400 cursor-not-allowed w-full sm:w-auto text-[10px] sm:text-[12px] disabled:opacity-50" 
              >
                Previous
              </button>
              <button className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#757575] text-white hover:brightness-95 cursor-pointer w-full sm:w-auto text-[10px] sm:text-[12px]">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


