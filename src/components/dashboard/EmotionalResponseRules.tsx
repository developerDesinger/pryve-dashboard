"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import AddEmotionalRuleModal from "./AddEmotionalRuleModal";

const emotionalRules = [
  {
    id: "1",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "2",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "3",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "4",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "5",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "6",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "7",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "8",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "9",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  },
  {
    id: "10",
    trigger: "Anxiety",
    responseType: "Soft Comfort Tone",
    tone: "Calm & Reassuring",
    description: "When user experience Anxiety, provide gentle reassurance and breathing techniques"
  }
];

export default function EmotionalResponseRules() {
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState(emotionalRules);
  const totalPages = 25;

  const handleSelectRule = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRules.length === rules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(rules.map(rule => rule.id));
    }
  };

  const handleAddRule = (newRule: {
    trigger: string;
    responseType: string;
    tone: string;
    description: string;
  }) => {
    const rule = {
      id: (rules.length + 1).toString(),
      ...newRule
    };
    setRules(prev => [...prev, rule]);
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[18px] font-semibold text-gray-900">Emotional Response Rules</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#757575] text-white rounded-lg text-[14px] font-medium hover:brightness-95 transition-colors cursor-pointer"
          >
            + Add Rule
          </button>
          <div className="relative">
            <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer pr-8">
              <option value="anxiety">Anxiety</option>
              <option value="depression">Depression</option>
              <option value="stress">Stress</option>
              <option value="anger">Anger</option>
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
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4">
                <input
                  type="checkbox"
                  checked={selectedRules.length === rules.length}
                  onChange={handleSelectAll}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600"
                />
              </th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Trigger</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Response Type</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Tone</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Description</th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <input
                    type="checkbox"
                    checked={selectedRules.includes(rule.id)}
                    onChange={() => handleSelectRule(rule.id)}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600"
                  />
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="px-2 py-1 sm:px-4 sm:py-2 bg-yellow-50 border border-yellow-300 text-orange-500 rounded-full text-[10px] sm:text-[14px] font-medium whitespace-nowrap">
                      {rule.trigger}
                    </span>
                  </span>
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-[10px] sm:text-[14px] text-gray-700 whitespace-nowrap">{rule.responseType}</td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-[10px] sm:text-[14px] text-gray-700 whitespace-nowrap">{rule.tone}</td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-[10px] sm:text-[14px] text-gray-700 max-w-[200px] sm:max-w-[300px]">
                  <div className="max-h-16 sm:max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {rule.description}
                  </div>
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                    <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-gray-600">Showing</span>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="w-16 px-2 py-1 border border-gray-200 rounded text-[14px] text-center focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <span className="text-[14px] text-gray-600">/ 50</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-600">Go To Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-[14px] text-center focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <span className="text-[14px] text-gray-600">of {totalPages}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              className="px-3 py-1 text-gray-400 bg-gray-100 rounded text-[14px] font-medium cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-gray-600 bg-white border border-gray-200 rounded text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      <AddEmotionalRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRule}
      />
    </Card>
  );
}
