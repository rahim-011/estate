import { CalendarDays, Phone, Mail } from "lucide-react";
import AdminToursFilter from "@/components/AdminToursFilter";
import { getAllTours, ToursList } from "@/lib/services/admin.service";
import type { ToursStatuses } from "@prisma/client";
import TourSelect from "@/components/TourStatusSelect";
import EmptyPendingTours from "@/components/EmptyPendingTours";

type pageProps = { searchParams: Promise<{ status?: ToursStatuses; search?: string }> };

export default async function TourRequestsPage({ searchParams }: pageProps) {
  const { status, search } = await searchParams;
  const res = await getAllTours(status as ToursStatuses, search as string);
  if (!res.success) {
    return <div>{"Failed to get the tours data"}</div>;
  }
  const tourRequests = (res.allTours as ToursList) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Contacted":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-emerald-100 text-emerald-800";
      case "Cancelled":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Requests</h1>
          <p className="text-sm text-black/50">Manage viewing appointments submitted by potential buyers and tenants.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <CalendarDays className="w-4 h-4" />
          <span>{tourRequests.length} Total Requests</span>
        </div>
      </div>

      <AdminToursFilter />

      <div className="bg-white border border-black/15 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-black/40 font-medium">
              <tr>
                <th className="pb-3">Client</th>
                <th className="pb-3">Property</th>
                <th className="pb-3">Requested Time</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {tourRequests.length > 0 ? (
                tourRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{item.clientName}</p>
                        <p className="text-xs text-black/50 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {item.phone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-black/10" />
                        <p className="font-medium text-gray-900">{item.name}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-xs">
                        <p className="font-semibold text-gray-900">{"date"}</p>
                        <p className="text-black/50">{"time"}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <TourSelect status={item.status} tourId={item.id} />
                        <a
                          href={`tel:${item.phone}`}
                          className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors"
                          title="Call Client"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${item.email}`}
                          className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                          title="Email Client"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyPendingTours colSpan={5} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}