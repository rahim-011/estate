import { Building2 } from "lucide-react";

export default function EmptyAdminProperties() {
  return (
    <tbody>
      <tr>
        <td colSpan={5} className="py-12 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
              <Building2 className="h-6 w-6 text-black/40" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mt-2">
              No Properties Found
            </h3>
            <p className="text-sm text-black/50 max-w-sm">
              There are currently no property listings in the system to review or manage.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}