"use client";

import { useState } from "react";

interface EditPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pricingData: {
    isActive: boolean;
    tierName: string;
    price: string;
    discount: string;
    billingInterval: string;
  }) => void;
}

export default function EditPricingModal({ isOpen, onClose, onSave }: EditPricingModalProps) {
  const [formData, setFormData] = useState({
    isActive: false,
    tierName: "Free",
    price: "99.99",
    discount: "0",
    billingInterval: "Monthly"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-[20px] font-semibold text-gray-900">Edit Pricing</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-[16px] font-semibold text-gray-900">Active:</label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                formData.isActive ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Tier Name */}
          <div>
            <label className="block text-[16px] font-semibold text-gray-900 mb-2">
              Tier name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.tierName}
                onChange={(e) => setFormData(prev => ({ ...prev, tierName: e.target.value }))}
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Free"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Pricing Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-[16px] font-semibold text-gray-900 mb-2">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[16px]">$</span>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full h-12 pl-8 pr-4 bg-white border border-gray-200 rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="99.99"
                />
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-[16px] font-semibold text-gray-900 mb-2">
                Discount
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                  className="w-full h-12 px-4 pr-8 bg-white border border-gray-200 rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[16px]">%</span>
              </div>
            </div>

            {/* Billing Interval */}
            <div>
              <label className="block text-[16px] font-semibold text-gray-900 mb-2">
                Billing Interval
              </label>
              <div className="relative">
                <select
                  value={formData.billingInterval}
                  onChange={(e) => setFormData(prev => ({ ...prev, billingInterval: e.target.value }))}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Daily">Daily</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
                  className="px-8 py-3 bg-[#757575] text-white rounded-lg text-[16px] font-semibold hover:brightness-95 transition-colors cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
