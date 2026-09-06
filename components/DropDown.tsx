'use client'

import { DropDownProps, filterKey } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DropDown<K extends filterKey>({
  options,
  placeholder,
  filterKey
}: DropDownProps<K>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = searchParams.get(filterKey) || "";
  const selectedOption = (options as any[]).find((opt) => String(opt?.value ?? opt) === String(currentValue));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleFilter = (value: any) => {
    const params = new URLSearchParams(searchParams);
    const strValue = String(value).trim();

    if (strValue) {
      params.set(filterKey, strValue);
    } else {
      params.delete(filterKey);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    function closeDropDown(e: MouseEvent) {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', closeDropDown);
    return () => document.removeEventListener('mousedown', closeDropDown);
  }, []);

  return (
    <div className="relative w-full" ref={dropDownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between gap-1.5 rounded-xl border border-gray-300 bg-white px-3 text-left transition-all hover:border-gray-400 focus:outline-none"
      >
        <span className={`truncate text-xs md:text-sm ${!selectedOption ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
          {selectedOption ? (selectedOption.label ?? selectedOption) : placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[150px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
          <ul className="flex flex-col">
            {(options as any[]).map((option) => {
              const val = option?.value ?? option;
              const label = option?.label ?? option;
              return (
                <li
                  key={String(val)}
                  onClick={() => {
                    handleFilter(val);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}