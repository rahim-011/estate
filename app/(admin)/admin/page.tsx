export const dynamic = 'force-dynamic';

import { getCachedDashboardStatistics, getPendingDataReview } from "@/lib/services/admin.service";
import { ListingTypes, ToursStatuses } from "@prisma/client";
import { Building2, Clock, CalendarDays, Users, ArrowUpRight } from "lucide-react";
import PropertiesPendingReview from "@/components/PropertiesPendingReview";
import Link from "next/link";
import EmptyPendingTours from "@/components/EmptyPendingTours";
import EmptyPendingProperties from "@/components/EmptyPendingProperties";

interface DashboardStatistics {
  totalUsers: number;
  totalPendingProperties: number;
  totalActiveProperties: number;
  totalTourRequests: number;
}

export interface PendingListings {
  id: string;
  price: number;
  listingType: ListingTypes;
  name: string;
  seller: {
    email: string;
  };
}

interface PendingTour {
  status: ToursStatuses;
  user: {
    name: string;
  };
  Property?: {
    name: string;
  };
  property?: {
    name: string;
  };
  scheduled_at?: string | Date;
  scheduledAt?: string | Date;
}

function formatDate(dateInput?: string | Date) {
  if (!dateInput) return "Date unavailable";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TourRequestsSection({ pendingToursReview }: { pendingToursReview: PendingTour[] }) {
  return (
    <div className="space-y-3">
      {pendingToursReview.map((tour, index) => {
        const propertyName = tour.Property?.name || tour.property?.name || "Property";
        const dateString = formatDate(tour.scheduled_at || tour.scheduledAt);

        return (
          <div key={index} className="p-3 border border-black/10 rounded-xl space-y-1 bg-gray-50/50">
            <div className="flex justify-between items-center gap-2">
              <span className="font-semibold text-sm text-gray-900 truncate">{tour.user.name}</span>
              <span
                className={`text-[0.7rem] px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${
                  tour.status === "pending" || tour.status === ("pending" as ToursStatuses)
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {tour.status.toLowerCase()}
              </span>
            </div>
            <p className="text-xs text-black/60 truncate">{propertyName}</p>
            <p className="text-[0.75rem] text-black/40">{dateString}</p>
          </div>
        );
      })}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [statsResponse, pendingReview] = await Promise.all([
    getCachedDashboardStatistics(),
    getPendingDataReview(),
  ]);

  if (!statsResponse || !pendingReview) {
    return (
      <div className="p-8 text-center bg-white border border-black/15 rounded-2xl">
        <p className="text-sm text-black/60">Unable to load dashboard data right now.</p>
      </div>
    );
  }

  const cachedDashboardStatistics = statsResponse as DashboardStatistics;
  const pendingListingsReview = pendingReview?.pendingListingsReview ?? [];
  const pendingToursReview = (pendingReview?.pendingToursReview as PendingTour[]) ?? [];

  const { totalUsers, totalPendingProperties, totalActiveProperties, totalTourRequests } =
    cachedDashboardStatistics;

  const stats = [
    { title: "Pending Properties", value: totalPendingProperties, icon: Clock, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { title: "Active Properties", value: totalActiveProperties, icon: Building2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { title: "Tour Requests", value: totalTourRequests, icon: CalendarDays, color: "text-blue-700 bg-blue-50 border-blue-200" },
    { title: "Total Users", value: totalUsers, icon: Users, color: "text-purple-700 bg-purple-50 border-purple-200" },
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-xs sm:text-sm text-black/50">Manage pending approvals and monitor platform activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-4 sm:p-5 bg-white border border-black/15 rounded-2xl flex items-center justify-between min-w-0">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-medium text-black/50 truncate">{stat.title}</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl border shrink-0 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white border border-black/15 rounded-2xl p-4 sm:p-6 min-w-0">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-5">
            <div>
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">Pending Approvals</h2>
              <p className="text-xs text-black/50">Properties submitted from Sell page</p>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full shrink-0">
              {pendingListingsReview.length} Action Required
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            {pendingListingsReview.length > 0 ? (
              <PropertiesPendingReview pendingListingsReview={pendingListingsReview} />
            ) : (
              <EmptyPendingProperties />
            )}
          </div>
        </div>

        <div className="bg-white border border-black/15 rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-w-0 min-h-[320px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-900 text-base sm:text-lg">Tour Requests</h2>
              <ArrowUpRight className="w-4 h-4 text-black/40" />
            </div>

            {pendingToursReview.length > 0 ? (
              <TourRequestsSection pendingToursReview={pendingToursReview} />
            ) : (
              <EmptyPendingTours />
            )}
          </div>

          <Link
            href="/admin/tours"
            className="w-full mt-6 py-2.5 bg-teal-700 text-white text-sm font-medium rounded-xl hover:bg-teal-800 transition-colors text-center block"
          >
            View All Requests
          </Link>
        </div>
      </div>
    </div>
  );
}