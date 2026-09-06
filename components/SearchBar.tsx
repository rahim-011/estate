'use client'

import { ArrowRight, MapPin, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { WILAYA_KEYS } from "@/lib/constants";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
    targetPath?: string;
}

export default function SearchBar({ targetPath }: SearchBarProps) {
    const [error, setError] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initial = searchParams.get('wilaya') || '';

    const [cursorIndex, setCursorIndex] = useState(1);
    const [currentSearch, setCurrentSearch] = useState(initial);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const searchDropRef = useRef<HTMLDivElement>(null);

    const [filtredWilayas, setFiltredWilayas] = useState(WILAYA_KEYS);

    const debouncedFilter = useDebouncedCallback((value: string) => {
        const trimmed = value.trim();
        if (trimmed.length > 0) {
            const filtred = WILAYA_KEYS.filter((wilaya) =>
                wilaya.toLowerCase().includes(trimmed.toLowerCase())
            );
            setFiltredWilayas(filtred as any);
            setCursorIndex(1);
            setIsOpen(filtred.length > 0);
        } else {
            setFiltredWilayas(WILAYA_KEYS as any);
            setIsOpen(false);
        }
    }, 150);

    const handleFiltredSearch = (value: string) => {
        setError('');
        setCurrentSearch(value);
        debouncedFilter(value);
    };

    const handleSearch = (value: string) => {
        setError('');
        const trimmed = value.trim();

        if (trimmed) {
            const isExist = WILAYA_KEYS.some(
                (w) => w.toLowerCase() === trimmed.toLowerCase()
            );
            if (!isExist) {
                setError('Please select a valid wilaya');
                return;
            }
        }

        setCurrentSearch(trimmed);
        setIsOpen(false);

        const basePath = targetPath || pathname;
        const params = new URLSearchParams(basePath === pathname ? searchParams : '');

        if (trimmed) {
            params.set('wilaya', trimmed);
        } else {
            params.delete('wilaya');
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${basePath}?${queryString}` : basePath;

        router.push(newUrl, { scroll: false });
    };

    const handleClear = () => {
        setCurrentSearch('');
        setError('');
        setIsOpen(false);
        setFiltredWilayas(WILAYA_KEYS as any);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursorIndex((prev) => (prev > 1 ? prev - 1 : filtredWilayas.length));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCursorIndex((prev) => (prev < filtredWilayas.length ? prev + 1 : 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (isOpen && filtredWilayas.length > 0 && filtredWilayas[cursorIndex - 1]) {
                handleSearch(filtredWilayas[cursorIndex - 1]);
            } else {
                handleSearch(currentSearch);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        function handleCloseDrop(e: MouseEvent) {
            if (searchDropRef.current && !searchDropRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleCloseDrop);
        return () => document.removeEventListener('mousedown', handleCloseDrop);
    }, []);

    return (
        <div className="relative w-full" ref={searchDropRef}>
            <form
                className={`flex h-12 md:h-13 w-full items-center rounded-2xl border bg-white/95 px-2 backdrop-blur-md shadow-lg transition-all duration-200 ${
                    error
                        ? 'border-red-500 ring-4 ring-red-500/10'
                        : 'border-gray-200/80 hover:border-gray-300 focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/15'
                }`}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(currentSearch);
                }}
            >
                <div className="flex items-center justify-center pl-2 pr-1 text-teal-600">
                    <MapPin className="h-5 w-5 shrink-0" />
                </div>

                <input
                    id="search"
                    name="search"
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    value={currentSearch}
                    onChange={(e) => handleFiltredSearch(e.target.value)}
                    placeholder="Search by Wilaya (e.g., Batna, Algiers)..."
                    className="w-full bg-transparent px-2 text-sm md:text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (currentSearch.trim().length > 0) setIsOpen(true);
                    }}
                />

                {currentSearch && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="mr-1 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                )}

                <button
                    type="submit"
                    aria-label="Search"
                    className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95 cursor-pointer"
                >
                    <ArrowRight size={18} />
                </button>
            </form>

            {error && (
                <p className="absolute left-3 -bottom-6 text-xs font-medium text-red-400 drop-shadow-sm">
                    {error}
                </p>
            )}

            {isOpen && (
                <div className="absolute left-0 right-0 top-14 z-50 max-h-64 overflow-y-auto rounded-2xl border border-gray-100 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md">
                    <ul className="text-xs md:text-sm text-gray-700">
                        {filtredWilayas.map((wilaya, index) => {
                            const isSelected = cursorIndex === index + 1;
                            return (
                                <li
                                    key={wilaya}
                                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition-all ${
                                        isSelected
                                            ? 'bg-teal-50 text-teal-900 font-semibold'
                                            : 'hover:bg-gray-100/80 text-gray-700'
                                    }`}
                                    onClick={() => handleSearch(wilaya)}
                                    onMouseEnter={() => setCursorIndex(index + 1)}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <MapPin
                                            size={16}
                                            className={isSelected ? 'text-teal-600' : 'text-gray-400'}
                                        />
                                        <span>{wilaya}</span>
                                    </div>
                                    {isSelected && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 bg-teal-100/60 px-2 py-0.5 rounded-full">
                                            Select
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}