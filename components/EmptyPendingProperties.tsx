import { Building2 } from "lucide-react";

interface EmptyPendingPropertiesProps {
  colSpan?: number;
}

export default function EmptyPendingProperties({ colSpan }: EmptyPendingPropertiesProps) {
  const content = (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center gap-2">
      <div className="p-3 bg-gray-100 rounded-full text-black/40 mb-1">
        <Building2 className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-black/70">No Pending Approvals</h4>
      <p className="text-xs text-black/40 max-w-sm">
        Properties submitted from the Sell page will appear here for review.
      </p>
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