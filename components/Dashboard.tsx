"use client";

import { BarChart3, Calendar, DollarSign, Users } from "lucide-react";

interface DashboardProps {
  stats: {
    totalEvents: number;
    totalTicketsSold: number;
    totalRevenue: number;
    recentSales: any[];
  };
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Tickets Sold</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-900">
                {stats.totalTicketsSold}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Events</p>
              <h3 className="text-2xl font-bold mt-2 text-gray-900">
                {stats.totalEvents}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            Recent Sales
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.recentSales.length === 0 ? (
            <p className="p-6 text-center text-gray-500 text-sm">
              No sales yet.
            </p>
          ) : (
            stats.recentSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {sale.user.name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sale.user.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">
                  +${Number(sale.totalAmount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
