"use client";

import {
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  LucideIcon,
} from "lucide-react";

// 1. Defined strong types for the data
interface User {
  name: string;
  email?: string;
}

interface Sale {
  id: string;
  totalAmount: number | string;
  createdAt: string | Date;
  user: User;
}

interface DashboardProps {
  stats: {
    totalEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
    recentSales: Sale[];
  };
}

// 2. Extracted Reusable Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "blue" | "purple";
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => {
  // Map colors to Tailwind classes dynamically
  const colorStyles = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          label="Tickets Sold"
          value={stats.totalTicketsSold}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Active Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Recent Sales
          </h3>
        </div>

        {/* Added max-height and overflow for scrolling if list gets long */}
        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
          {stats.recentSales.length === 0 ? (
            <p className="p-6 text-center text-gray-500 text-sm">
              No sales yet.
            </p>
          ) : (
            stats.recentSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">
                    {sale.user.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sale.user.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">
                  +${Number(sale.totalAmount).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
