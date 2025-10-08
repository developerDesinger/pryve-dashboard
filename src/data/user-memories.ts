export const userMemories: {
  [key: string]: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string;
      isPremium: boolean;
      lastActivity: string;
    };
    categories: string[];
    memories: Array<{
      id: string;
      type: "regular" | "treasured";
      priority: string;
      priorityColor: string;
      icon: string;
      iconBg: string;
      description: string;
      tags: string[];
      timestamp: string;
    }>;
    treasuredMemories: Array<{
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
    }>;
  };
} = {
  "1": {
    user: {
      id: "1",
      name: "Emma Johnson",
      email: "emma.j@gmail.com",
      avatar: "/icons/Memory/base.svg",
      isPremium: true,
      lastActivity: "1 day ago"
    },
    categories: ["All", "Career", "Communication", "Relationship", "Happiness", "Stress", "Wellness", "Supportive", "+3"],
    memories: [
      {
        id: "1",
        type: "regular" as const,
        priority: "Medium",
        priorityColor: "bg-amber-100 text-amber-600",
        icon: "/icons/Memory/Icon (1).svg",
        iconBg: "bg-amber-100",
        description: "Works as a marketing manager at a tech startup. Recently got promoted to senior role.",
        tags: ["Career", "Promotion", "Tech"],
        timestamp: "Jan 18, 2024, 05:00 AM"
      },
      {
        id: "2", 
        type: "regular" as const,
        priority: "Medium",
        priorityColor: "bg-amber-100 text-amber-600",
        icon: "/icons/Memory/Icon (2).svg",
        iconBg: "bg-purple-100",
        description: "Feeling stressed about work-life balance. Mentioned wanting to start meditation.",
        tags: ["Stress", "Wellness", "Meditation"],
        timestamp: "Jan 18, 2024, 05:00 AM"
      }
    ],
    treasuredMemories: [
      {
        id: "3",
        type: "treasured" as const,
        priority: "High",
        priorityColor: "bg-pink-100 text-pink-600",
        isCloseToHeart: true,
        icon: "/icons/Memory/Icon (9).svg",
        iconBg: "bg-pink-100",
        description: "Dating someone new for 3 months. Feels positive about the relationship.",
        tags: ["Dating", "Happiness", "Relationship"],
        timestamp: "Jan 18, 2024, 05:00 AM"
      },
      {
        id: "4",
        type: "treasured" as const, 
        priority: "High",
        priorityColor: "bg-pink-100 text-pink-600",
        isCloseToHeart: true,
        icon: "/icons/Memory/Icon (1).svg",
        iconBg: "bg-amber-100",
        description: "Prefers morning conversations. Likes gentle, supportive tone. Not a fan of direct advice.",
        tags: ["Communication", "Morning Person", "Supportive"],
        timestamp: "Jan 18, 2024, 05:00 AM"
      }
    ]
  }
};
