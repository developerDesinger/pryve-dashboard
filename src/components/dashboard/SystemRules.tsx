"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { systemRulesAPI, type SystemRule } from "@/lib/api/systemRules";
import { useToast } from "@/hooks/useToast";
import { cookieUtils } from "@/lib/cookies";
import AddSystemRuleModal from "./AddSystemRuleModal";
import ConfirmationModal from "@/components/ui/confirmation-modal";

export default function SystemRules() {
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rules, setRules] = useState<SystemRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // Confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'multiple'>('single');
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  // Memoized load function to prevent unnecessary re-renders
  const loadSystemRules = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await systemRulesAPI.getSystemRules(
        token,
        currentPage,
        itemsPerPage,
        selectedCategory || undefined
      );
      
      if (response.success && response.data) {
        setRules(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        showError(response.message || 'Failed to load system rules');
      }
    } catch (error) {
      console.error('Error loading system rules:', error);
      showError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, currentPage, itemsPerPage, selectedCategory]);

  // Load system rules on component mount and when dependencies change
  useEffect(() => {
    loadSystemRules();
  }, [loadSystemRules]);

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
      setSelectedRules(rules.map(rule => rule.id).filter((id): id is string => id !== undefined));
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    if (!user) return;
    
    setIsSaving(true);
    const loadingToast = showLoading('Updating rule status...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await systemRulesAPI.toggleSystemRule(token, ruleId);
      
      if (response.success && response.data) {
        dismiss(loadingToast);
        showSuccess(`Rule ${response.data.isActive ? 'activated' : 'deactivated'} successfully!`);
        setRules(prev => prev.map(rule => 
          rule.id === ruleId ? { ...rule, isActive: response.data!.isActive } : rule
        ));
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Failed to update rule status');
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRule = async (newRule: {
    name: string;
    category: string;
    ruleType: string;
    content: string;
    description: string;
    priority: number;
    severity: string;
  }) => {
    if (!user) return;
    
    // Validate all required fields before creating
    if (!newRule.name.trim()) {
      showError('Please enter a name for the system rule');
      return;
    }
    if (!newRule.content.trim()) {
      showError('Please enter content for the system rule');
      return;
    }
    if (!newRule.description.trim()) {
      showError('Please enter a description for the system rule');
      return;
    }
    
    setIsSaving(true);
    const loadingToast = showLoading('Creating system rule...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await systemRulesAPI.createSystemRule(token, {
        name: newRule.name.trim(),
        category: newRule.category,
        ruleType: newRule.ruleType,
        content: newRule.content.trim(),
        description: newRule.description.trim(),
        priority: newRule.priority,
        severity: newRule.severity,
        isActive: true
      });
      
      if (response.success && response.data) {
        dismiss(loadingToast);
        showSuccess('System rule created successfully!');
        setRules(prev => [response.data!, ...prev]);
        setIsModalOpen(false);
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Failed to create system rule');
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteType('single');
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRule = async () => {
    if (!user || !ruleToDelete) return;
    
    setIsSaving(true);
    const loadingToast = showLoading('Deleting system rule...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await systemRulesAPI.deleteSystemRule(token, ruleToDelete);
      
      if (response.success) {
        dismiss(loadingToast);
        showSuccess('System rule deleted successfully!');
        setRules(prev => prev.filter(rule => rule.id !== ruleToDelete));
        setSelectedRules(prev => prev.filter(id => id !== ruleToDelete));
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Failed to delete system rule');
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
      setIsDeleteModalOpen(false);
      setRuleToDelete(null);
    }
  };

  const handleDeleteSelected = () => {
    if (!user) return;
    
    // Validate that rules are selected
    if (selectedRules.length === 0) {
      showError('Please select at least one rule to delete');
      return;
    }
    
    setDeleteType('multiple');
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = async () => {
    if (!user) return;
    
    setIsSaving(true);
    const loadingToast = showLoading('Deleting selected rules...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Delete rules one by one since we don't have bulk delete API
      for (const ruleId of selectedRules) {
        await systemRulesAPI.deleteSystemRule(token, ruleId);
      }
      
      dismiss(loadingToast);
      showSuccess(`${selectedRules.length} system rules deleted successfully!`);
      setRules(prev => prev.filter(rule => !selectedRules.includes(rule.id!)));
      setSelectedRules([]);
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-50 border-red-300 text-red-600';
      case 'HIGH': return 'bg-orange-50 border-orange-300 text-orange-600';
      case 'MEDIUM': return 'bg-yellow-50 border-yellow-300 text-yellow-600';
      case 'LOW': return 'bg-green-50 border-green-300 text-green-600';
      default: return 'bg-gray-50 border-gray-300 text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CONTENT_FILTER': return 'bg-red-50 border-red-300 text-red-600';
      case 'IDENTITY': return 'bg-blue-50 border-blue-300 text-blue-600';
      case 'BEHAVIOR': return 'bg-purple-50 border-purple-300 text-purple-600';
      case 'SAFETY': return 'bg-orange-50 border-orange-300 text-orange-600';
      case 'GENERAL': return 'bg-gray-50 border-gray-300 text-gray-600';
      default: return 'bg-gray-50 border-gray-300 text-gray-600';
    }
  };

  return (
    <Card className="p-6 bg-white rounded-2xl border-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900">System Rules</h2>
          <p className="text-[14px] text-gray-600 mt-1">Control AI behavior, content restrictions, and identity</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedRules.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isSaving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-[14px] font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Delete Selected ({selectedRules.length})
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-[#757575] text-white rounded-lg text-[14px] font-medium hover:brightness-95 transition-colors cursor-pointer disabled:opacity-50"
          >
            + Add Rule
          </button>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none cursor-pointer pr-8"
            >
              <option value="">All Categories</option>
              <option value="CONTENT_FILTER">Content Filter</option>
              <option value="IDENTITY">Identity</option>
              <option value="BEHAVIOR">Behavior</option>
              <option value="SAFETY">Safety</option>
              <option value="GENERAL">General</option>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
              <p className="text-[14px] text-gray-500 mt-2">Loading system rules...</p>
            </div>
          </div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4">
                  <input
                    type="checkbox"
                    checked={selectedRules.length === rules.length && rules.length > 0}
                    onChange={handleSelectAll}
                    disabled={isSaving}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600 disabled:opacity-50"
                  />
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Name</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Category</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Severity</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Content</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Status</th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-[12px] sm:text-[14px] font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No system rules found. Create your first rule to get started.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <input
                        type="checkbox"
                        checked={selectedRules.includes(rule.id!)}
                        onChange={() => handleSelectRule(rule.id!)}
                        disabled={isSaving}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 cursor-pointer accent-gray-600 disabled:opacity-50"
                      />
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-[10px] sm:text-[14px] text-gray-900 font-medium max-w-[150px]">
                      <div className="truncate" title={rule.name}>
                        {rule.name}
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-[10px] sm:text-[12px] font-medium whitespace-nowrap ${getCategoryColor(rule.category)}`}>
                        {rule.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-[10px] sm:text-[12px] font-medium whitespace-nowrap ${getSeverityColor(rule.severity)}`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-[10px] sm:text-[14px] text-gray-700 max-w-[250px]">
                      <div className="max-h-16 sm:max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {rule.content}
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <button
                        onClick={() => handleToggleRule(rule.id!)}
                        disabled={isSaving}
                        className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-[10px] sm:text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50 ${
                          rule.isActive 
                            ? 'bg-green-50 border-green-300 text-green-600 hover:bg-green-100' 
                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <button 
                        onClick={() => handleDeleteRule(rule.id!)}
                        disabled={isSaving}
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete rule"
                      >
                        <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-gray-600">Showing</span>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            disabled={isSaving}
            className="w-16 px-2 py-1 border border-gray-200 rounded text-[14px] text-center focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          />
          <span className="text-[14px] text-gray-600">/ {rules.length}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-600">Go To Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              disabled={isSaving}
              className="w-16 px-2 py-1 border border-gray-200 rounded text-[14px] text-center focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            />
            <span className="text-[14px] text-gray-600">of {totalPages}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1 || isSaving}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 text-gray-600 bg-white border border-gray-200 rounded text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages || isSaving}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1 text-gray-600 bg-white border border-gray-200 rounded text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      <AddSystemRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRule}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRuleToDelete(null);
        }}
        onConfirm={deleteType === 'single' ? confirmDeleteRule : confirmDeleteSelected}
        title={deleteType === 'single' ? 'Delete System Rule' : 'Delete Selected Rules'}
        message={
          deleteType === 'single' 
            ? 'Are you sure you want to delete this system rule? This action cannot be undone.'
            : `Are you sure you want to delete ${selectedRules.length} selected system rule(s)? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isSaving}
      />
    </Card>
  );
}