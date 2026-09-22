import { memo, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaWifi } from "react-icons/fa";
import { MdRouter } from "react-icons/md";
import { IoMdArrowDropdown, IoMdNotifications } from "react-icons/io";
import { usePage, router } from "@inertiajs/react";

const Header = memo(function Header() {
    const { url, props } = usePage();
    const unreadCount = Number(props?.unreadNotifikasi || 0);
    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont', 'api'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);

    const [query, setQuery] = useState("");
    const [asetFilter, setAsetFilter] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const wrapperRef = useRef(null);
    const abortRef = useRef(null);

    const handleSelectChange = useCallback((e) => {
        const v = e.target.value;
        if (v === "Tiang" || v === "tiang") setAsetFilter("tiang");
        else if (v === "ONT" || v === "ont") setAsetFilter("ont");
        else setAsetFilter("");
    }, []);

    useEffect(() => {
        if (abortRef.current) abortRef.current.abort();
        const q = query.trim();
        if (q.length < 2) {
            setResults([]);
            setOpen(false);
            setLoading(false);
            return;
        }
        const t = setTimeout(async () => {
            const controller = new AbortController();
            abortRef.current = controller;
            setLoading(true);
            try {
                const typeParam = asetFilter ? `&type=${encodeURIComponent(asetFilter)}` : "";
                const searchUrl = `${base}/api/search`.replace(/\/+/g, '/') + `?q=${encodeURIComponent(q)}${typeParam}`;
                const res = await fetch(searchUrl, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
                    signal: controller.signal,
                    credentials: 'same-origin',
                });
                if (!res.ok) throw new Error('search failed');
                const data = await res.json();
                const list = Array.isArray(data.results) ? data.results : [];
                setResults(list);
                setOpen(focused && list.length > 0);
            } catch (e) {
                if (e.name !== 'AbortError') {
                    setResults([]);
                    setOpen(false);
                }
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(t);
    }, [query, asetFilter, base, focused]);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleResultClick = useCallback((item) => {
        setOpen(false);
        setQuery("");
        const href = `${base}/${item.href}`.replace(/\/+/g, '/');
        router.get(href);
    }, [base]);

    return (
        <header className="sticky top-0 z-50 flex h-18 items-center justify-between bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-6 py-2">

            {/* Logo + Judul */}

            <div className="flex items-center gap-5">
                <div>
                    <img
                        src={`${base}/public/Assets/Logo.png`.replace(/\/+/g, '/')}
                        alt="Logo"
                        className="w-10"
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <h1 className="text-xl font-bold text-white">
                    GIS Dashboard
                </h1>
            </div>

            {/* Search Bar */}

            <div ref={wrapperRef} className="absolute left-1/2 w-[400px] -translate-x-1/2 flex gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            setFocused(true);
                            if (results.length > 0 && query.trim().length >= 2) setOpen(true);
                        }}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                        placeholder="Cari Aset..."
                        className="w-full rounded-full bg-white px-5 py-2 pr-10 text-sm text-black outline-none focus:bg-white"
                    />

                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition hover:text-[#ab3c3c]" />

                    {/* Popover Data yang Dicari */}

                    {open && (
                        <div className="absolute left-0 top-full mt-2 w-full max-h-[320px] overflow-auto rounded-xl bg-white shadow-xl border border-gray-200 z-[100]">
                            {loading ? (
                                <div className="px-4 py-3 text-xs text-gray-500">Mencari...</div>
                            ) : results.length > 0 ? (
                                results.map((item) => {
                                    const isKode = item.match === 'kode';
                                    const Icon = item.type === 'tiang' ? FaWifi : MdRouter;
                                    return (
                                        <button
                                            key={`${item.type}-${item.id}-${item.match}-${item.href}`}
                                            type="button"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleResultClick(item)}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition"
                                        >
                                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${item.type === 'tiang' ? 'bg-blue-100 text-blue-600' : 'bg-sky-100 text-sky-600'}`}>
                                                <Icon size={14} />
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-800 truncate flex items-center gap-2">
                                                    <span className="truncate">{isKode ? item.kode : item.label}</span>
                                                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] text-white ${item.type === 'tiang' ? 'bg-blue-600' : 'bg-sky-500'}`}>{item.type.toUpperCase()}</span>
                                                    {!isKode && <span className="shrink-0 text-[10px] text-gray-400">→ Filter</span>}
                                                    {isKode && <span className="shrink-0 text-[10px] text-gray-400">→ Detail</span>}
                                                </p>
                                                <p className="text-[11px] text-gray-500 truncate">
                                                    {isKode ? `${item.match}: ${item.matchedValue} • ${item.label}` : `${item.match}: ${item.matchedValue}`}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : null}
                        </div>
                    )}
                </div>
                <div className="flex items-center bg-white rounded-full gap-2">
                    <select value={asetFilter === "tiang" ? "Tiang" : asetFilter === "ont" ? "ONT" : ""} onChange={handleSelectChange} className="text-xs outline-none appearance-none px-3 py-2 bg-transparent">
                        <option value="">Pilih Aset</option>
                        <option value="Tiang">Tiang</option>
                        <option value="ONT">ONT</option>
                    </select>

                    <IoMdArrowDropdown className="pr-3 w-8" />
                </div>
            </div>

            <a href={`${base}/notifikasi`.replace(/\/+/g, '/')} className="relative">
                <IoMdNotifications size={50} className="px-3 text-white/65 hover:text-white transition-all duration-200" />
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </a>
        </header>
    );
});

export default Header;
