export interface Payment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  plan: string;
  amount: string;
  status: "Active" | "Inactive" | "Pending";
  paymentDate: string;
  nextBilling: string;
}

export const payments: Payment[] = [
  {
    id: "1",
    user: {
      name: "Sarah",
      avatar: "/icons/Memory/base.svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Sep 9, 2022",
    nextBilling: "Aug 9, 2014"
  },
  {
    id: "2",
    user: {
      name: "Maya",
      avatar: "/icons/Memory/base (1).svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Aug 24, 2025",
    nextBilling: "Sep 31, 2017"
  },
  {
    id: "3",
    user: {
      name: "Gloria",
      avatar: "/icons/Memory/base (2).svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "May 31, 2024",
    nextBilling: "Aug 29, 2017"
  },
  {
    id: "4",
    user: {
      name: "Alex",
      avatar: "/icons/Memory/base.svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Jul 15, 2023",
    nextBilling: "Aug 15, 2023"
  },
  {
    id: "5",
    user: {
      name: "Emma",
      avatar: "/icons/Memory/base (1).svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Jun 8, 2024",
    nextBilling: "Jul 8, 2024"
  },
  {
    id: "6",
    user: {
      name: "David",
      avatar: "/icons/Memory/base (2).svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Apr 12, 2023",
    nextBilling: "May 12, 2023"
  },
  {
    id: "7",
    user: {
      name: "Lisa",
      avatar: "/icons/Memory/base.svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Mar 20, 2024",
    nextBilling: "Apr 20, 2024"
  },
  {
    id: "8",
    user: {
      name: "John",
      avatar: "/icons/Memory/base (1).svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Feb 14, 2023",
    nextBilling: "Mar 14, 2023"
  },
  {
    id: "9",
    user: {
      name: "Maria",
      avatar: "/icons/Memory/base (2).svg"
    },
    plan: "Premium monthly ****243",
    amount: "$99.99",
    status: "Active",
    paymentDate: "Jan 30, 2024",
    nextBilling: "Feb 30, 2024"
  }
];
