"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  memoriesCount: number;
  memoriesColor: string;
};

interface UserSearchProps {
  users: User[];
  selectedUserId?: string;
  onUserSelect?: (userId: string) => void;
}

export default function UserSearch({ users, selectedUserId, onUserSelect }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const colorClasses = [
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
  ];

  const getInitial = (name: string) => (name?.trim()?.charAt(0)?.toUpperCase() || "U");
  const getColorForName = (name: string) => colorClasses[(name?.charCodeAt(0) || 0) % colorClasses.length];
  const shouldShowInitial = (avatar?: string) => !avatar || avatar.includes('default-profile.png');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Find someone special"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 sm:h-12 px-3 sm:px-4 pr-10 sm:pr-12 bg-gray-50 rounded-xl border-0 text-[14px] sm:text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400 sm:w-5 sm:h-5"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-2 sm:space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-colors ${
              selectedUserId === user.id 
                ? "bg-gray-100 shadow-sm" 
                : ""
            }`}
            onClick={() => onUserSelect?.(user.id)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {!shouldShowInitial(user.avatar) ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold ${getColorForName(user.name)}`}
                    >
                      {getInitial(user.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h3 className="font-semibold text-[14px] sm:text-[16px] text-gray-900 truncate">{user.name}</h3>
                    {user.isPremium && (
                      <img src="/icons/Memory/Icon.svg" alt="Premium" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[12px] sm:text-[14px] text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[12px] font-medium flex-shrink-0 ${user.memoriesColor}`}>
                {user.memoriesCount} memories
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
