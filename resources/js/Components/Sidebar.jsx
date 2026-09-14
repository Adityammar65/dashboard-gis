import { FaWifi, FaMap } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdRouter } from "react-icons/md";
import { IoIosLogOut, IoMdHome } from "react-icons/io";

export default function Sidebar({ isOpen }) {
    const currentPath = window.location.pathname;

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
                fixed h-screen top-15 left-0 z-40
                bg-slate-100
                transition-all duration-300
                ${isOpen ? "w-64" : "w-20"}
            `}
        >
            {/* Navigasi */}

            <nav className="relative z-10 space-y-2 px-3 py-5">

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
                                ${
                                    isActive
                                        ? "bg-[#AB3C3C] text-white shadow-md shadow-[#AB3C3C]/20"
                                        : "text-[#992e2e] hover:bg-[#F3DADA] hover:text-[#AB3C3C]"
                                }
                                ${!isOpen ? "justify-center" : ""}
                            `}
                        >
                            {/* Indicator Active */}
                            
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
                                "
                            >
                                {item.icon}
                            </span>

                            {isOpen && (
                                <a
                                    href={item.href}
                                    className="flex-1 whitespace-nowrap"
                                >
                                    {item.label}
                                </a>
                            )}
                        </div>
                    );
                })}

                {/* Separator */}

                <div className="py-2">
                    <hr className="border-0 border-t-2 border-[#AB3C3C]/20 rounded-full" />
                </div>

                {/* Logout */}

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
                    "
                >
                    <IoIosLogOut
                        size={20}
                        className="
                            shrink-0
                            transition-transform duration-200
                            group-hover:translate-x-1
                        "
                    />

                    {isOpen && (
                        <a
                            href="login"
                            className="flex-1"
                            onClick={(e) => {
                                if (!confirm("Kembali ke Halaman Login?")) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Keluar
                        </a>
                    )}
                </div>
            </nav>

            <div
                className="
                    pointer-events-none
                    absolute bottom-0 left-0
                    h-72 w-full
                    overflow-hidden
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
}

