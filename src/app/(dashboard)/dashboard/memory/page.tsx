"use client";

import UserStatMiniCard from "@/components/dashboard/UserStatMiniCard";
import memoryStats from "@/data/memory-stats.json";
import UserSearch from "@/components/dashboard/UserSearch";
import UserDetails from "@/components/dashboard/UserDetails";
import { memoryUsers } from "@/data/memory-users";
import { userMemories } from "@/data/user-memories";
import { useState } from "react";

export default function MemoryPage() {
  const [selectedUserId, setSelectedUserId] = useState("1");
  const selectedUserData = userMemories[selectedUserId as keyof typeof userMemories];

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
        {memoryStats.map((item) => (
          <UserStatMiniCard
            key={item.id}
            id={item.id}
            title={item.title}
            value={item.value}
            iconSrc={item.iconSrc}
            iconBg={item.iconBg}
          />
        ))}
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
              users={memoryUsers} 
              selectedUserId={selectedUserId}
              onUserSelect={setSelectedUserId}
            />
          </div>
        </div>

        {/* Main Content - User Details */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 min-w-0 overflow-y-auto h-[500px] lg:h-[calc(100vh-300px)]">
          {selectedUserData && (
            <UserDetails
              user={selectedUserData.user}
              categories={selectedUserData.categories}
              memories={selectedUserData.memories}
              treasuredMemories={selectedUserData.treasuredMemories}
            />
          )}
        </div>
      </div>
    </div>
  );
}


