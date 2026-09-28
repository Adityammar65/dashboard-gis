import { memo, useMemo } from "react";
import { FaWifi, FaMap } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdRouter } from "react-icons/md";
import { IoIosLogOut, IoMdHome, IoIosSettings } from "react-icons/io";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePage } from "@inertiajs/react";

const Sidebar = memo(function Sidebar({ isOpen, onToggle }) {
    const { url } = usePage();
    const currentPath = useMemo(() => url.split('?')[0], [url]);
    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);
    const resolveHref = (href) => `${base}/${href}`.replace(/\/+/g, '/');

    const menuItems = [
        {
            label: "Beranda",
            href: "home",
            icon: <IoMdHome size={20} />,
            activePaths: ["home"],
        },
        {
            label: "Data Tiang",
            href: "data-tiang",
            icon: <FaWifi size={20} />,
            activePaths: [
                "data-tiang",
                "tambah-tiang",
                "edit-tiang",
                "detail-tiang",
            ],
        },
        {
            label: "Data ONT",
            href: "data-ont",
            icon: <MdRouter size={20} />,
            activePaths: [
                "data-ont",
                "tambah-ont",
                "edit-ont",
                "detail-ont",
            ],
        },
        {
            label: "Data Wilayah",
            href: "wilayah",
            icon: <FaMap size={20} />,
            activePaths: ["wilayah"],
        },
        {
            label: "Peta Sebaran Aset",
            href: "peta-sebaran-aset",
            icon: <FaLocationCrosshairs size={20} />,
            activePaths: ["peta-sebaran-aset"],
        },
    ];

    return (
        <aside
            className={`
                gis-rail
                fixed h-screen top-15 left-0 z-40
                bg-slate-100
                transition-all duration-300
                max-md:top-0 max-md:h-[100vh] max-md:supports-[height:100dvh]:h-[100dvh] max-md:pt-[60px] max-md:w-16 max-md:min-w-16 max-md:shrink-0
                ${isOpen ? "w-64" : "w-20"}
            `}
        >
            {/* Navigasi */}

            <nav className="relative z-10 space-y-2 px-3 py-5 max-md:flex max-md:h-[calc(100vh-60px)] max-md:supports-[height:100dvh]:h-[calc(100dvh-60px)] max-md:flex-col max-md:justify-between max-md:gap-2 max-md:space-y-0 max-md:overflow-y-auto max-md:overscroll-contain max-md:px-2 max-md:py-4">

                {/* Atas */}
                <div className="contents max-md:flex max-md:flex-col max-md:gap-2">

                {menuItems.map((item) => {
                    const isActive = item.activePaths.some(
                        (path) =>
                            currentPath === `/${path}` ||
                            currentPath.endsWith(`/${path}`)
                    );

                    return (
                        <div
                            key={item.href}
                            className={`
                                group relative flex items-center gap-3
                                rounded-xl px-3 py-3
                                text-sm font-medium
                                cursor-pointer
                                transition-all duration-200
                                max-md:justify-center max-md:gap-0 max-md:px-2
                                ${isActive
                                    ? "bg-[#AB3C3C] text-white shadow-md shadow-[#AB3C3C]/20"
                                    : "text-[#992e2e] hover:bg-[#F3DADA] hover:text-[#AB3C3C]"
                                }
                                ${!isOpen ? "justify-center" : ""}
                            `}
                        >
                            {/* Penanda */}

                            {isActive && (
                                <span
                                    className="
                                        absolute left-0
                                        h-7 w-1
                                        rounded-r-full
                                        bg-white
                                    "
                                />
                            )}

                            <span
                                className="
                                    shrink-0
                                    transition-transform duration-200
                                    group-hover:scale-110
                                    max-md:hidden
                                "
                            >
                                {item.icon}
                            </span>

                            {/* Ikon Seluler */}
                            <a
                                href={resolveHref(item.href)}
                                title={item.label}
                                aria-label={item.label}
                                className="hidden max-md:flex max-md:items-center max-md:justify-center"
                            >
                                {item.icon}
                            </a>

                            {isOpen && (
                                <a
                                    href={resolveHref(item.href)}
                                    className="flex-1 whitespace-nowrap max-md:hidden"
                                >
                                    {item.label}
                                </a>
                            )}
                        </div>
                    );
                })}

                {/* Pemisah + Alihan (desktop, selalu sejajar) */}

                <div className="relative overflow-visible py-2 max-md:py-1">
                    <hr className="border-0 border-t-2 border-[#AB3C3C]/50 rounded-full" />
                    {onToggle && (
                        <button
                            type="button"
                            onClick={onToggle}
                            aria-label={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
                            aria-expanded={isOpen}
                            title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
                            className="
                                absolute left-full top-1/2 z-20
                                -ml-1 flex h-8 w-8 -translate-y-1/2
                                items-center justify-center
                                rounded-full bg-[#ab3c3c] text-white shadow-lg
                                transition-all duration-300
                                hover:scale-105 hover:bg-[#8f3030]
                                max-md:hidden
                            "
                        >
                            {isOpen ? (
                                <FiChevronLeft size={20} />
                            ) : (
                                <FiChevronRight size={20} />
                            )}
                        </button>
                    )}
                </div>

                </div>

                {/* Bawah */}
                <div className="contents max-md:flex max-md:flex-col max-md:gap-2 max-md:pb-[max(0.25rem,env(safe-area-inset-bottom))]">

                {/* Pengaturan */}

                <div
                    className={`
        group flex items-center gap-3
        rounded-xl px-3 py-3
        text-sm font-medium
        cursor-pointer
        transition-all duration-200
        max-md:justify-center max-md:gap-0 max-md:px-2
        ${currentPath === "/pengaturan" ||
                            currentPath.endsWith("/pengaturan")
                            ? "bg-[#AB3C3C] text-white shadow-md shadow-[#AB3C3C]/20"
                            : "text-[#992e2e] hover:bg-[#F3DADA] hover:text-[#AB3C3C]"
                        }
        ${!isOpen ? "justify-center" : ""}
    `}
                >
                    {(
                        currentPath === "/pengaturan" ||
                        currentPath.endsWith("/pengaturan")
                    ) && (
                            <span
                                className="
                absolute left-0
                h-7 w-1
                rounded-r-full
                bg-white
            "
                            />
                        )}

                    <IoIosSettings
                        size={20}
                        className="
            shrink-0
            transition-transform duration-200
            group-hover:rotate-45
            max-md:hidden
        "
                    />

                    {/* Ikon Seluler */}
                    <a
                        href={resolveHref("pengaturan")}
                        title="Pengaturan"
                        aria-label="Pengaturan"
                        className="hidden max-md:flex max-md:items-center max-md:justify-center"
                    >
                        <IoIosSettings size={20} />
                    </a>

                    {isOpen && (
                        <a
                            href={resolveHref("pengaturan")}
                            className="flex-1 whitespace-nowrap max-md:hidden"
                        >
                            Pengaturan
                        </a>
                    )}
                </div>

                {/* Keluar */}

                <div
                    className="
                        group flex items-center gap-3
                        rounded-xl px-3 py-3
                        text-sm font-medium
                        text-[#992e2e]
                        cursor-pointer
                        transition-all duration-200
                        hover:bg-[#F3DADA]
                        hover:text-[#AB3C3C]
                        max-md:justify-center max-md:gap-0 max-md:px-2
                    "
                >
                    <IoIosLogOut
                        size={20}
                        className="
                            shrink-0
                            transition-transform duration-200
                            group-hover:translate-x-1
                            max-md:hidden
                        "
                    />

                    {isOpen && (
                        <a
                            href={resolveHref("logout")}
                            className="flex-1 max-md:hidden"
                            onClick={(e) => {
                                if (!confirm("Kembali ke Halaman Login?")) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Keluar
                        </a>
                    )}
                    {/* Ikon Seluler */}
                    <a
                        href={resolveHref("logout")}
                        title="Keluar"
                        aria-label="Keluar"
                        onClick={(e) => {
                            if (!confirm("Kembali ke Halaman Login?")) {
                                e.preventDefault();
                            }
                        }}
                        className="hidden max-md:flex max-md:items-center max-md:justify-center"
                    >
                        <IoIosLogOut size={20} />
                    </a>
                </div>
                </div>
            </nav>

            <div
                className="
                    pointer-events-none
                    absolute bottom-0 left-0
                    h-72 w-full
                    overflow-hidden
                    max-md:hidden
                "
            >
                <div
                    className="
                        absolute -bottom-20 -left-24
                        h-52 w-80
                        rounded-[50%]
                        border-2 border-[#AB3C3C]/10
                        rotate-[-18deg]
                    "
                />

                <div
                    className="
                        absolute -bottom-16 -left-20
                        h-48 w-72
                        rounded-[50%]
                        border-2 border-[#AB3C3C]/10
                        rotate-[-18deg]
                    "
                />

                <div
                    className="
                        absolute -bottom-12 -left-16
                        h-44 w-64
                        rounded-[50%]
                        border-2 border-[#AB3C3C]/10
                        rotate-[-18deg]
                    "
                />

                <div
                    className="
                        absolute -bottom-8 -left-12
                        h-40 w-56
                        rounded-[50%]
                        border-2 border-[#AB3C3C]/10
                        rotate-[-18deg]
                    "
                />

                <div
                    className="
                        absolute bottom-0 -left-8
                        h-32 w-48
                        rounded-[50%]
                        border-2 border-[#AB3C3C]/10
                        rotate-[-18deg]
                    "
                />

                <div
                    className="
                        absolute bottom-8 left-10
                        h-20 w-32
                        rounded-[50%]
                        border-2 border-[#AB3C3C]/10
                        rotate-[-18deg]
                    "
                />
            </div>
        </aside>
    );
});

export default Sidebar;

