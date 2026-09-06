import { Calendar } from "lucide-react";

interface EmptyPendingToursProps {
  colSpan?: number;
}

export default function EmptyPendingTours({ colSpan }: EmptyPendingToursProps) {
  const content = (
    <div className="w-full border border-dashed border-black/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-2 bg-gray-50/30">
      <Calendar className="w-8 h-8 text-black/30" />
      <h4 className="text-sm font-semibold text-black/70">No Tour Requests</h4>
      <p className="text-xs text-black/40">New tour bookings will appear here.</p>
    </div>
  );

  if (colSpan) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-0">
          {content}
        </td>
      </tr>
    );
  }

  return content;
}