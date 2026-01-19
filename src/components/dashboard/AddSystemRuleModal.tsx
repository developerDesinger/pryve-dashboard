"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddSystemRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: {
    name: string;
    category: string;
    ruleType: string;
    content: string;
    description: string;
    priority: number;
    severity: string;
  }) => void;
}

export default function AddSystemRuleModal({ isOpen, onClose, onSave }: AddSystemRuleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "CONTENT_FILTER",
    ruleType: "RESTRICTION",
    content: "",
    description: "",
    priority: 5,
    severity: "MEDIUM"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Rule name is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Rule content is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.priority < 1 || formData.priority > 10) {
      newErrors.priority = "Priority must be between 1 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      category: "CONTENT_FILTER",
      ruleType: "RESTRICTION",
      content: "",
      description: "",
      priority: 5,
      severity: "MEDIUM"
    });
    setErrors({});
    onClose();
  };

  const categoryOptions = [
    { value: "CONTENT_FILTER", label: "Content Filter" },
    { value: "IDENTITY", label: "Identity" },
    { value: "BEHAVIOR", label: "Behavior" },
    { value: "SAFETY", label: "Safety" },
    { value: "GENERAL", label: "General" }
  ];

  const ruleTypeOptions = [
    { value: "RESTRICTION", label: "Restriction" },
    { value: "INSTRUCTION", label: "Instruction" },
    { value: "IDENTITY", label: "Identity" },
    { value: "GUIDELINE", label: "Guideline" }
  ];

  const severityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
    { value: "CRITICAL", label: "Critical" }
  ];

  const getExampleContent = () => {
    switch (formData.category) {
      case "CONTENT_FILTER":
        return "Do not provide responses to sexual, explicit, or adult content questions. Politely decline and redirect to appropriate topics.";
      case "IDENTITY":
        return "You are MyBot AI, developed by MyCompany Inc. Always introduce yourself with this identity when asked.";
      case "BEHAVIOR":
        return "Always maintain a professional and empathetic tone. Use respectful language in all interactions.";
      case "SAFETY":
        return "Never ask for or store personal information like passwords, social security numbers, or credit card details.";
      case "GENERAL":
        return "Provide accurate information to the best of your knowledge. If unsure, acknowledge the uncertainty.";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold text-gray-900">Add System Rule</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Rule Name */}
          <div>
            <Label htmlFor="name" className="text-[14px] font-medium text-gray-700">
              Rule Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Sexual Content Restriction"
              className={`mt-1 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
          </div>

          {/* Category and Rule Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-[14px] font-medium text-gray-700">
                Category *
              </Label>
              <div className="relative mt-1">
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer pr-8"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="ruleType" className="text-[14px] font-medium text-gray-700">
                Rule Type *
              </Label>
              <div className="relative mt-1">
                <select
                  id="ruleType"
                  value={formData.ruleType}
                  onChange={(e) => handleInputChange("ruleType", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer pr-8"
                >
                  {ruleTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Priority and Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" className="text-[14px] font-medium text-gray-700">
                Priority (1-10) *
              </Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", parseInt(e.target.value) || 1)}
                className={`mt-1 ${errors.priority ? 'border-red-300 focus:ring-red-500' : ''}`}
              />
              {errors.priority && <p className="text-red-500 text-[12px] mt-1">{errors.priority}</p>}
              <p className="text-[12px] text-gray-500 mt-1">Higher numbers = higher priority</p>
            </div>

            <div>
              <Label htmlFor="severity" className="text-[14px] font-medium text-gray-700">
                Severity *
              </Label>
              <div className="relative mt-1">
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) => handleInputChange("severity", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer pr-8"
                >
                  {severityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Rule Content */}
          <div>
            <Label htmlFor="content" className="text-[14px] font-medium text-gray-700">
              Rule Content *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder={getExampleContent()}
              rows={4}
              className={`mt-1 ${errors.content ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.content && <p className="text-red-500 text-[12px] mt-1">{errors.content}</p>}
            <p className="text-[12px] text-gray-500 mt-1">
              This is the actual instruction that will be added to the AI prompt
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-[14px] font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this rule does and why it's important"
              rows={2}
              className={`mt-1 ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-[12px] mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-4 py-2 text-[14px] font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-[#757575] text-white text-[14px] font-medium hover:brightness-95 transition-colors"
          >
            Create Rule
          </Button>
        </div>
      </div>
    </div>
  );
}