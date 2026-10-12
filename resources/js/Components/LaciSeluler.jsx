import { memo, useMemo, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosLogOut, IoIosSettings, IoMdNotifications } from "react-icons/io";
import { FiX } from "react-icons/fi";
import { usePage } from "@inertiajs/react";
import { butirMenu, apakahJalurAktif, apakahJalurPengaturan, apakahJalurNotifikasi, KONFIRMASI_KELUAR } from "./butirMenu";
import { useSelesaikanTautan } from "../hooks/useDasar";

const LaciSeluler = memo(function LaciSeluler({ buka, saatTutup }) {
    const { url, props } = usePage();
    const jalurSaatIni = useMemo(() => url.split("?")[0], [url]);
    const user = props?.auth?.username ?? "";
    const jumlahBelumDibaca = Number(props?.notifikasiBelumDibaca || 0);
    const selesaikanTautan = useSelesaikanTautan();

    const isPengaturan = apakahJalurPengaturan(jalurSaatIni);
    const isNotifikasi = apakahJalurNotifikasi(jalurSaatIni);

    useEffect(() => {
        if (!buka) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => {
            if (e.key === "Escape") saatTutup?.();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [buka, saatTutup]);

    return (
        <div className="md:hidden" aria-hidden={!buka}>

            {/* Latar */}

            <div
                onClick={saatTutup}
                className={`
                    fixed inset-0 z-[60] bg-black/50
                    transition-opacity duration-300
                    ${buka ? "opacity-100" : "pointer-events-none opacity-0"}
                `}
            />

            {/* Panel */}

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Menu navigasi"
                className={`
                    fixed left-0 top-0 z-[61] flex h-[100vh] w-[280px] max-w-[85vw] flex-col
                    bg-slate-100 shadow-2xl dark:bg-night-900 dark:border-r dark:border-night-700
                    transition-transform duration-300 ease-out
                    ${buka ? "translate-x-0" : "-translate-x-full"}
                `}
            >

                {/* Profil */}

                <div className="relative shrink-0 bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 pb-5 pt-4">
                    <button
                        type="button"
                        onClick={saatTutup}
                        aria-label="Tutup menu"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                    >
                        <FiX size={18} />
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                            <FaUserCircle size={28} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                                Pengguna
                            </p>
                            <p className="truncate text-base font-semibold text-white" title={user}>
                                {user || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigasi */}

                <nav className="gis-drawer-nav flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-4">
                    {butirMenu.map((item) => {
                        const apakahAktif = apakahJalurAktif(jalurSaatIni, item.jalurAktif);
                        return (
                            <a
                                key={item.tautan}
                                href={selesaikanTautan(item.tautan)}
                                onClick={saatTutup}
                                aria-current={apakahAktif ? "page" : undefined}
                                className={`
                                    relative flex items-center gap-3
                                    rounded-xl px-3 py-3
                                    text-sm font-medium
                                    transition-all duration-200
                                    ${isActive
                                        ? "bg-[#AB3C3C] text-white shadow-md shadow-[#AB3C3C]/20"
                                        : "text-[#992e2e] hover:bg-[#F3DADA] hover:text-[#AB3C3C] dark:text-night-300 dark:hover:bg-night-800 dark:hover:text-white"
                                    }
                                `}
                            >
                                {apakahAktif && (
                                    <span className="absolute left-0 h-7 w-1 rounded-r-full bg-white" />
                                )}
                                <span className="shrink-0">{item.icon}</span>
                                <span className="flex-1 whitespace-nowrap">{item.label}</span>
                            </a>
                        );
                    })}

                    {/* Notifikasi */}

                    <a
                        href={selesaikanTautan("notifikasi")}
                        onClick={saatTutup}
                        aria-current={isNotifikasi ? "page" : undefined}
                        className={`
                            relative flex items-center gap-3
                            rounded-xl px-3 py-3
                            text-sm font-medium
                            transition-all duration-200
                            ${isNotifikasi
                                ? "bg-[#AB3C3C] text-white shadow-md shadow-[#AB3C3C]/20"
                                : "text-[#992e2e] hover:bg-[#F3DADA] hover:text-[#AB3C3C] dark:text-night-300 dark:hover:bg-night-800 dark:hover:text-white"
                            }
                        `}
                    >
                        {isNotifikasi && (
                            <span className="absolute left-0 h-7 w-1 rounded-r-full bg-white" />
                        )}
                        <span className="relative shrink-0">
                            <IoMdNotifications size={20} />
                            {jumlahBelumDibaca > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] font-bold leading-none text-white">
                                    {jumlahBelumDibaca > 99 ? "99+" : jumlahBelumDibaca}
                                </span>
                            )}
                        </span>
                        <span className="flex-1 whitespace-nowrap">Notifikasi</span>
                    </a>

                    {/* Pemisah */}

                    <div className="py-2">
                        <hr className="rounded-full border-0 border-t-2 border-[#AB3C3C]/50 dark:border-night-700" />
                    </div>

                    {/* Pengaturan */}

                    <a
                        href={selesaikanTautan("pengaturan")}
                        onClick={saatTutup}
                        aria-current={isPengaturan ? "page" : undefined}
                        className={`
                            relative flex items-center gap-3
                            rounded-xl px-3 py-3
                            text-sm font-medium
                            transition-all duration-200
                            ${isPengaturan
                                ? "bg-[#AB3C3C] text-white shadow-md shadow-[#AB3C3C]/20"
                                : "text-[#992e2e] hover:bg-[#F3DADA] hover:text-[#AB3C3C] dark:text-night-300 dark:hover:bg-night-800 dark:hover:text-white"
                            }
                        `}
                    >
                        {isPengaturan && (
                            <span className="absolute left-0 h-7 w-1 rounded-r-full bg-white" />
                        )}
                        <span className="shrink-0">
                            <IoIosSettings size={20} />
                        </span>
                        <span className="flex-1 whitespace-nowrap">Pengaturan</span>
                    </a>

                    {/* Keluar */}

                    <a
                        href={selesaikanTautan("logout")}
                        onClick={(e) => {
                            if (!confirm(KONFIRMASI_KELUAR)) {
                                e.preventDefault();
                            } else {
                                saatTutup?.();
                            }
                        }}
                        className="
                            flex items-center gap-3
                            rounded-xl px-3 py-3
                            text-sm font-medium text-[#992e2e] dark:text-night-300
                            transition-all duration-200
                            hover:bg-[#F3DADA] hover:text-[#AB3C3C] dark:hover:bg-night-800 dark:hover:text-white
                        "
                    >
                        <span className="shrink-0">
                            <IoIosLogOut size={20} />
                        </span>
                        <span className="flex-1 whitespace-nowrap">Keluar</span>
                    </a>
                </nav>
            </aside>
        </div>
    );
});

export default LaciSeluler;
