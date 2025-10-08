"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  lastActivity: string;
};

type Memory = {
  id: string;
  type: "regular" | "treasured";
  priority: string;
  priorityColor: string;
  isCloseToHeart?: boolean;
  icon: string;
  iconBg: string;
  description: string;
  tags: string[];
  timestamp: string;
};

interface UserDetailsProps {
  user: User;
  categories: string[];
  memories: Memory[];
  treasuredMemories: Memory[];
}

export default function UserDetails({ user, categories, memories, treasuredMemories }: UserDetailsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] sm:text-[20px] font-semibold text-gray-900">{user.name}</h2>
              {user.isPremium && (
                <img src="/icons/Memory/Icon.svg" alt="Premium" className="w-4 h-4" />
              )}
            </div>
            <p className="text-[14px] text-gray-500">{user.email}</p>
            <p className="text-[12px] text-gray-400">Last Activity: {user.lastActivity}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button className="px-4 py-2 bg-[#757575] text-white rounded-lg text-[14px] font-medium hover:brightness-95 transition-colors cursor-pointer">
            + Add
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-[14px] font-medium hover:bg-red-50 transition-colors cursor-pointer">
            Reset Memory
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
              selectedCategory === category
                ? "bg-gray-400 text-gray-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Memories Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/icons/Icon (6).svg" alt="Memories" className="w-4 h-4" />
            <h3 className="text-[16px] font-semibold text-gray-900">Memories</h3>
            <span className="text-[12px] sm:text-[14px] text-gray-500 hidden sm:inline">See all {user.name}'s memories</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[12px] sm:text-[14px] text-gray-500 sm:hidden">See all {user.name}'s memories</span>
            <span className="text-[12px] text-gray-500">{memories.length} treasured memories</span>
          </div>
        </div>

        <div className="space-y-3">
          {memories.map((memory) => (
            <Card key={memory.id} className="p-3 sm:p-4 bg-gray-50 rounded-xl border-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${memory.iconBg}`}>
                    <img src={memory.icon} alt="Memory icon" className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${memory.priorityColor}`}>
                        {memory.priority}
                      </span>
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-gray-700 mb-3 break-words">{memory.description}</p>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      {memory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-[9px] sm:text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[9px] sm:text-[10px] text-gray-400">{memory.timestamp}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Treasured Memories Section */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-gray-900">Treasured Memories</h3>
        <div className="space-y-3">
          {treasuredMemories.map((memory) => (
            <Card key={memory.id} className="p-3 sm:p-4 bg-gray-50 rounded-xl border-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${memory.iconBg}`}>
                    <img src={memory.icon} alt="Memory icon" className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-medium ${memory.priorityColor}`}>
                        {memory.priority}
                      </span>
                      {memory.isCloseToHeart && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-600 border border-pink-200 rounded-full text-[9px] sm:text-[10px] font-medium">
                          Close to Heart
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-gray-700 mb-3 break-words">{memory.description}</p>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      {memory.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-[9px] sm:text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[9px] sm:text-[10px] text-gray-400">{memory.timestamp}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
