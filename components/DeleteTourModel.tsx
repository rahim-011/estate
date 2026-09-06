"use client";

import { cancelUserTour } from "@/lib/services/tour.service";
import { LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  tourId,
}: ConfirmDeleteModalProps) {
  if (!isOpen || !tourId) return null;

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const toastId = toast.loading('Cancelling the tour...');
    try {
      const res = await cancelUserTour(id);
      if (!res.success) {
        toast.error(res.error || 'Failed to cancel tour', { id: toastId });
        return;
      }
      toast.success(res.message || 'Tour cancelled successfully', { id: toastId });
      onClose();
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg sm:max-w-xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto bg-white max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-bold text-base cursor-pointer border border-black/40 hover:scale-105"
        >
          <X size={20}/>
        </button>

        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center text-4xl sm:text-5xl border border-red-500/20 shadow-inner">
          🗑️
        </div>

        <div className="space-y-2.5 max-w-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-8">
            Confirm Deletion
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Are you sure you want to delete this tour? This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-4 w-full pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 px-5 py-3.5 sm:py-4 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-base font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isDeleting}
            type="button"
            onClick={() => handleDelete(tourId)}
            className="w-full sm:flex-1 px-5 py-3.5 sm:py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-base font-bold transition-all shadow-lg shadow-red-600/25 cursor-pointer flex items-center justify-center"
          >
            {isDeleting ? <LoaderCircle size={22} className="animate-spin text-white/80" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}