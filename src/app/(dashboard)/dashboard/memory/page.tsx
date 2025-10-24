"use client";

import UserStatMiniCard from "@/components/dashboard/UserStatMiniCard";
// import memoryStats from "@/data/memory-stats.json"; // Removed mock data
import UserSearch from "@/components/dashboard/UserSearch";
import UserDetails from "@/components/dashboard/UserDetails";
// import { memoryUsers } from "@/data/memory-users"; // Removed mock data
// import { userMemories } from "@/data/user-memories"; // Removed mock data
import { useState } from "react";

export default function MemoryPage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  // const selectedUserData = userMemories[selectedUserId as keyof typeof userMemories]; // Will be populated from API

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Memory Sanctuary</h1>
          <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          A caring space to understand and nurture user connections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Memory stats will be populated from API data */}
        <div className="text-center py-8 col-span-full">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memory stats available</h3>
          <p className="text-gray-500">Memory statistics will be loaded from API</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 lg:gap-6">
        {/* Sidebar - User Search */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 overflow-y-auto h-[400px] lg:h-[calc(100vh-300px)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-[16px] lg:text-[18px] font-semibold text-gray-900">Users</h2>
            </div>
            <UserSearch 
              users={[]} // Will be populated from API
              selectedUserId={selectedUserId}
              onUserSelect={setSelectedUserId}
            />
          </div>
        </div>

        {/* Main Content - User Details */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 min-w-0 overflow-y-auto h-[500px] lg:h-[calc(100vh-300px)]">
          {selectedUserId ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No user selected</h3>
              <p className="text-gray-500">Select a user to view their memory details</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" className="text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No user data available</h3>
              <p className="text-gray-500">User memory data will be loaded from API</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


