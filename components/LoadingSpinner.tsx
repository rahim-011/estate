import { LoaderCircle } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div 
      className="w-full min-h-[50vh] flex items-center justify-center" 
      role="status" 
      aria-label="Loading content"
    >
      <LoaderCircle size={30} className="text-primary animate-spin" />
    </div>
  );
}