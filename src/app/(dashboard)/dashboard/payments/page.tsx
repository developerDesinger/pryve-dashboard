"use client";

import { useState, useEffect } from "react";
import UserStatMiniCard from "@/components/dashboard/UserStatMiniCard";
import EditPricingModal from "@/components/dashboard/EditPricingModal";
import { paymentsAPI, type Payment, type PaymentStats } from "@/lib/api/payments";

export default function PaymentsPage() {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  // Reset to page 1 when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await paymentsAPI.getPayments(currentPage, itemsPerPage);
        
        if (response.success && response.data) {
          // Set payments data
          setPayments(response.data.data || []);
          
          // Set pagination info from meta
          if (response.data.meta) {
            setTotalPages(response.data.meta.totalPages || 1);
            setTotalItems(response.data.meta.total || 0);
            // Update current page if it exceeds total pages
            if (currentPage > (response.data.meta.totalPages || 1)) {
              setCurrentPage(1);
            }
          }
          
          // Note: Stats are not included in this API response
          // They would need to come from a separate endpoint
        } else {
          setError(response.message || 'Failed to fetch payments');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, itemsPerPage]);

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map(p => p.id));
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('active') || statusLower.includes('success') || statusLower.includes('completed')) {
      return "bg-green-100 text-green-800";
    }
    if (statusLower.includes('pending') || statusLower.includes('processing')) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (statusLower.includes('failed') || statusLower.includes('cancelled') || statusLower.includes('inactive')) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount?: number, currency: string = 'USD') => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Payments are already paginated from the API
  const paginatedPayments = payments;

  const handleSavePricing = (pricingData: {
    isActive: boolean;
    tierName: string;
    price: string;
    discount: string;
    billingInterval: string;
  }) => {
    console.log("Pricing data saved:", pricingData);
    // Handle saving pricing data here
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
        {loading ? (
          <div className="text-center py-8 col-span-full">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-[#757575] rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading payment stats...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 col-span-full">
            <p className="text-red-600 font-medium mb-2">Error loading stats</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : paymentStats ? (
          <>
            <UserStatMiniCard
              id="monthly-revenue"
              title="Monthly Revenue"
              value={formatCurrency(paymentStats.monthlyRevenue)}
              iconSrc="/icons/Payments/Icon (1).svg"
              iconBg="#eef5ff"
            />
            <UserStatMiniCard
              id="active-subscriptions"
              title="Active Subscriptions"
              value={paymentStats.activeSubscriptions ?? 0}
              iconSrc="/icons/Payments/Icon (2).svg"
              iconBg="#e9f1ff"
            />
            <UserStatMiniCard
              id="free-users"
              title="Free Users"
              value={paymentStats.freeUsers ?? 0}
              iconSrc="/icons/Payments/Icon (3).svg"
              iconBg="#eaf8f1"
            />
            <UserStatMiniCard
              id="failed-payments"
              title="Failed Payments"
              value={paymentStats.failedPayments ?? 0}
              iconSrc="/icons/Payments/Icon (4).svg"
              iconBg="#fee2e2"
            />
          </>
        ) : (
          <div className="text-center py-8 col-span-full">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment stats available</h3>
            <p className="text-gray-500">Payment statistics will be loaded from API</p>
          </div>
        )}
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
                    checked={payments.length > 0 && selectedPayments.length === payments.length}
                    onChange={handleSelectAll}
                    disabled={loading || payments.length === 0}
                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600 disabled:opacity-50"
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
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-[#757575] rounded-full animate-spin"></div>
                    <p className="text-gray-500">Loading payments...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <p className="text-red-600 font-medium mb-2">Error loading payments</p>
                    <p className="text-sm text-gray-500">{error}</p>
                  </td>
                </tr>
              ) : paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment data available</h3>
                    <p className="text-gray-500">No payments found</p>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                        {payment.userAvatar ? (
                          <img
                            src={payment.userAvatar}
                            alt={payment.userName || payment.userEmail || 'User'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                            {(payment.userName || payment.userEmail || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-[14px] font-medium text-gray-900">
                            {payment.userName || payment.userEmail || 'Unknown User'}
                          </div>
                          {payment.userEmail && payment.userName && (
                            <div className="text-[12px] text-gray-500">{payment.userEmail}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[14px] text-gray-900">
                        {payment.planName || payment.plan || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[14px] font-medium text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(payment.status || '')}`}>
                        {payment.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[14px] text-gray-600">
                        {formatDate(payment.paymentDate || payment.createdAt)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[14px] text-gray-600">
                        {formatDate(payment.nextBilling || payment.nextBillingDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-[14px] text-[#757575] hover:text-[#5a5a5a] font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
            <span className="text-muted-foreground">/ {totalItems}</span>
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
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl border border-gray-200 bg-white text-gray-400 cursor-not-allowed w-full sm:w-auto text-[10px] sm:text-[12px] disabled:opacity-50 disabled:cursor-not-allowed enabled:text-gray-700 enabled:hover:bg-gray-50 enabled:cursor-pointer" 
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#757575] text-white hover:brightness-95 cursor-pointer w-full sm:w-auto text-[10px] sm:text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Pricing Modal */}
      <EditPricingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePricing}
      />
    </div>
  );
}


