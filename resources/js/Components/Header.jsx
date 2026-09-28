import { memo, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaWifi, FaTimes, FaUserCircle } from "react-icons/fa";
import { MdRouter } from "react-icons/md";
import { IoMdArrowDropdown, IoMdNotifications } from "react-icons/io";
import { IoIosSettings, IoIosLogOut } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { usePage, router } from "@inertiajs/react";

const Header = memo(function Header({ onMenu }) {
    const { url, props } = usePage();
    const unreadCount = Number(props?.unreadNotifikasi || 0);
    const username = props?.auth?.username ?? "";
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
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const mobileWrapperRef = useRef(null);
    const profileRef = useRef(null);
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
            if (mobileWrapperRef.current && !mobileWrapperRef.current.contains(e.target)) {
                setMobileSearchOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        const escapeHandler = (e) => {
            if (e.key === "Escape") {
                setProfileOpen(false);
                setMobileSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        document.addEventListener('keydown', escapeHandler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
            document.removeEventListener('keydown', escapeHandler);
        };
    }, []);

    const handleResultClick = useCallback((item) => {
        if (!item?.href) return;
        setOpen(false);
        setMobileSearchOpen(false);
        setQuery("");
        const href = `${base}/${item.href}`.replace(/\/+/g, '/');
        router.get(href);
    }, [base]);

    return (
        <header className="sticky top-0 z-50 flex h-18 items-center justify-between bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-6 py-2 max-md:gap-2 max-md:px-3 max-md:h-[60px] max-md:min-h-[60px] max-md:max-h-[60px] max-md:py-0">

            {/* Logo */}

            <div className="flex items-center gap-5 max-md:gap-2">
                {onMenu && (
                    <button
                        type="button"
                        onClick={onMenu}
                        aria-label="Buka menu navigasi"
                        className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 max-md:flex"
                    >
                        <FiMenu size={20} />
                    </button>
                )}
                <div>
                    <img
                        src={`${base}/public/Assets/Logo.png`.replace(/\/+/g, '/')}
                        alt="Logo"
                        className="w-10 max-md:w-8"
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <h1 className="text-xl font-bold text-white max-md:text-base">
                    GIS Dashboard
                </h1>
            </div>

            {/* Pencarian */}

            <div ref={wrapperRef} className="absolute left-1/2 w-[400px] -translate-x-1/2 flex gap-3 max-md:hidden">
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

                    {/* Hasil Pencarian */}

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

            {/* Aksi Header */}

            <div className="flex items-center gap-2 max-md:gap-1">

                {/* Cari Mobile */}

                <div ref={mobileWrapperRef} className="relative hidden max-md:block md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        aria-label={mobileSearchOpen ? "Tutup pencarian" : "Buka pencarian"}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                    >
                        {mobileSearchOpen ? <FaTimes size={16} /> : <FaSearch size={16} />}
                    </button>

                    {mobileSearchOpen && (
                        <div className="absolute right-0 top-full z-[100] mt-2 w-[calc(100vw-6rem)] max-w-[320px] rounded-2xl border border-white/20 bg-[#6F2424] p-3 shadow-xl">
                            <div className="relative">
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
                                    className="w-full rounded-full bg-white px-4 py-2.5 pr-10 text-sm text-black outline-none"
                                />
                                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-black" />
                                {open && (
                                    <div className="absolute left-0 top-full z-[100] mt-2 max-h-[50vh] w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl">
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
                                                            onClick={() => handleResultClick(item)}
                                                        className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-0 hover:bg-gray-50 active:bg-gray-100"
                                                    >
                                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.type === 'tiang' ? 'bg-blue-100 text-blue-600' : 'bg-sky-100 text-sky-600'}`}>
                                                            <Icon size={14} />
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="flex items-center gap-2 truncate text-xs font-medium text-gray-800">
                                                                <span className="truncate">{isKode ? item.kode : item.label}</span>
                                                                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] text-white ${item.type === 'tiang' ? 'bg-blue-600' : 'bg-sky-500'}`}>{item.type.toUpperCase()}</span>
                                                                {!isKode && <span className="shrink-0 text-[10px] text-gray-400">→ Filter</span>}
                                                                {isKode && <span className="shrink-0 text-[10px] text-gray-400">→ Detail</span>}
                                                            </p>
                                                            <p className="truncate text-[11px] text-gray-500">
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
                            <div className="mt-2 flex items-center justify-between rounded-full bg-white px-3 py-1">
                                <select value={asetFilter === "tiang" ? "Tiang" : asetFilter === "ont" ? "ONT" : ""} onChange={handleSelectChange} className="w-full appearance-none bg-transparent px-1 py-1.5 text-xs outline-none">
                                    <option value="">Pilih Aset</option>
                                    <option value="Tiang">Tiang</option>
                                    <option value="ONT">ONT</option>
                                </select>
                                <IoMdArrowDropdown className="shrink-0" />
                            </div>
                        </div>
                    )}
                </div>

                <a href={`${base}/notifikasi`.replace(/\/+/g, '/')} className="relative hidden md:block max-md:shrink-0">
                    <IoMdNotifications size={50} className="px-3 text-white/65 hover:text-white transition-all duration-200 max-md:h-10 max-md:w-10 max-md:px-2 max-md:scale-100" />
                    {unreadCount > 0 && (
                        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white max-md:h-4 max-md:min-w-4 max-md:px-0.5 max-md:text-[8px] max-md:leading-none max-md:right-1 max-md:top-1">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </a>

                {/* Profil */}

                <div ref={profileRef} className="relative hidden md:block max-md:shrink-0">
                    <button
                        type="button"
                        onClick={() => setProfileOpen(!profileOpen)}
                        aria-label={profileOpen ? "Tutup menu profil" : "Buka menu profil"}
                        aria-expanded={profileOpen}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                    >
                        <FaUserCircle size={20} className="max-md:text-lg" />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full z-[100] mt-2 w-56 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-white/20 bg-[#6F2424] shadow-xl">
                            <div className="truncate px-4 py-3">
                                <p className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                                    Pengguna
                                </p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-white" title={username}>
                                    {username || "-"}
                                </p>
                            </div>
                            <div className="bg-white py-1">
                                <a
                                    href={`${base}/pengaturan`.replace(/\/+/g, '/')}
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#AB3C3C]"
                                >
                                    <IoIosSettings size={18} className="shrink-0 text-gray-400" />
                                    Pengaturan Profil
                                </a>
                                <a
                                    href={`${base}/logout`.replace(/\/+/g, '/')}
                                    onClick={(e) => {
                                        if (!confirm("Kembali ke Halaman Login?")) {
                                            e.preventDefault();
                                        } else {
                                            setProfileOpen(false);
                                        }
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#AB3C3C]"
                                >
                                    <IoIosLogOut size={18} className="shrink-0 text-gray-400" />
                                    Keluar
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
});

export default Header;
