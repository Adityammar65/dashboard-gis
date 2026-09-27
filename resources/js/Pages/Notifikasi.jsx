
import MainLayout from "../Layouts/MainLayout";
import { FaWifi, FaChevronRight, FaMap } from "react-icons/fa";
import { MdRouter } from "react-icons/md";
import { useMemo } from "react";
import { router } from "@inertiajs/react";

const getIconByKategori = (kategori) => {
    const k = (kategori || "").toLowerCase();
    if (k === "ont") return MdRouter;
    if (k === "wilayah") return FaMap;
    return FaWifi;
};

const getNotifikasiVisual = (item) => {
    const jenis = item.jenis || "";
    const kategori = (item.kategori || "").toLowerCase();

    if (jenis.includes("Ditambahkan")) {
        return {
            Icon: getIconByKategori(kategori),
            circle: "bg-green-100 text-green-600",
        };
    }
    if (jenis.includes("Diperbarui")) {
        return {
            Icon: getIconByKategori(kategori),
            circle: "bg-yellow-100 text-yellow-600",
        };
    }
    if (jenis.includes("Dihapus")) {
        return {
            Icon: getIconByKategori(kategori),
            circle: "bg-red-100 text-red-600",
        };
    }
    return { Icon: null, circle: "" };
};

export default function Notifikasi({ notifikasi = [] }) {
    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);

    const goDetail = (id) => {
        router.get(`${base}/detail-notifikasi/${id}`.replace(/\/+/g, '/'));
    };

    const tandaiSemuaDibaca = () => {
        router.post(`${base}/notifikasi/baca-semua`.replace(/\/+/g, '/'));
    };

    const hapusSudahDibaca = () => {
        if (
            window.confirm(
                "Apakah kamu yakin ingin menghapus semua notifikasi yang sudah dibaca? Tindakan ini tidak dapat dibatalkan."
            )
        ) {
            router.delete(`${base}/notifikasi/hapus-dibaca`.replace(/\/+/g, '/'));
        }
    };

    const renderRow = (item) => {
        const isUnread = item.status === "belum_dibaca";
        const { Icon, circle } = getNotifikasiVisual(item);

        return (
                <div
                    key={item.id}
                    className={`flex items-center gap-4 border-b border-gray-100 px-5 py-4 transition hover:bg-gray-50/60 max-md:flex-wrap max-md:gap-3 max-md:px-4 ${isUnread ? "bg-red-50/50 border-l-4 border-l-red-500" : ""}`}
                >
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm ring-1 ring-white/40 ${circle || (isUnread
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600")
                        }`}
                >
                    {Icon ? (
                        <Icon size={20} />
                    ) : isUnread ? (
                        "⚠"
                    ) : (
                        "✓"
                    )}
                </div>

                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {item.jenis}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {item.kategori}
                    </p>

                    {item.pesan && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-700">
                            {String(item.pesan).split("\n")[0]}
                        </p>
                    )}

                    <p className="mt-1 text-[10px] text-gray-400">
                        {item.created_at
                            ? new Date(item.created_at).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })
                            : "-"}
                    </p>
                </div>

                {isUnread && (
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                )}

                <button
                    type="button"
                    onClick={() => goDetail(item.id)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#992e2e] ring-1 ring-[#AB3C3C]/20 shadow-sm transition hover:bg-[#AB3C3C] hover:text-white hover:ring-[#AB3C3C]"
                >
                    Lihat detail
                    <FaChevronRight size={10} />
                </button>
            </div>
        );
    };

    // Statistik

    const totalNotifikasi = notifikasi.length;

    const belumDibaca = notifikasi.filter(
        (item) => item.status === "belum_dibaca"
    ).length;

    const sudahDibaca = notifikasi.filter(
        (item) => item.status === "dibaca"
    ).length;

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Kepala */}

                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 shadow-md border border-white/10 text-white">
                        <span className="text-sm font-semibold tracking-wide">
                            Notifikasi
                        </span>
                    </div>
                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {/* Total */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-blue-600 bg-white p-5 shadow-sm hover:shadow-md transition">
                        <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                            TOTAL NOTIFIKASI
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            {totalNotifikasi}
                        </h2>
                    </div>

                    {/* Belum Dibaca */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-red-500 bg-white p-5 shadow-sm hover:shadow-md transition">
                        <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                            BELUM DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            {belumDibaca}
                        </h2>
                    </div>

                    {/* Sudah Dibaca */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-green-600 bg-white p-5 shadow-sm hover:shadow-md transition">
                        <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                            SUDAH DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-bold text-gray-800">
                            {sudahDibaca}
                        </h2>
                    </div>
                </div>

                {/* Daftar */}

                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 px-5 py-4 max-md:flex-col max-md:items-stretch max-md:gap-3 max-md:px-4">
                        <div>
                            <h3 className="font-semibold">
                                Notifikasi Terbaru
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Informasi terbaru dari sistem GIS
                            </p>
                        </div>

                        <div className="flex items-center gap-2 max-md:flex-wrap">
                            <button
                                onClick={tandaiSemuaDibaca}
                                disabled={belumDibaca === 0}
                                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#992e2e] ring-1 ring-[#AB3C3C]/20 shadow-sm transition hover:bg-[#AB3C3C] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Tandai semua dibaca
                            </button>

                            <span className="h-4 w-px bg-gray-200" />

                            <button
                                onClick={hapusSudahDibaca}
                                disabled={sudahDibaca === 0}
                                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#992e2e] ring-1 ring-[#AB3C3C]/20 shadow-sm transition hover:bg-[#AB3C3C] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Hapus yang dibaca
                            </button>
                        </div>
                    </div>

                    {/* Data */}

                    {notifikasi.length > 0 ? (
                        <>
                            {notifikasi.filter((item) => item.status === "belum_dibaca").length > 0 && (
                                <>
                                    <div className="bg-gradient-to-r from-orange-50 to-transparent px-5 py-2.5 border-y border-orange-100">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-700">
                                            Belum dibaca
                                        </p>
                                    </div>
                                    {notifikasi
                                        .filter((item) => item.status === "belum_dibaca")
                                        .map((item) => renderRow(item))}
                                </>
                            )}

                            {notifikasi.filter((item) => item.status !== "belum_dibaca").length > 0 && (
                                <>
                                    <div className="bg-gradient-to-r from-emerald-50 to-transparent px-5 py-2.5 border-y border-emerald-100">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                                            Sudah dibaca
                                        </p>
                                    </div>
                                    {notifikasi
                                        .filter((item) => item.status !== "belum_dibaca")
                                        .map((item) => renderRow(item))}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="px-5 py-12 text-center border border-dashed border-gray-200 rounded-xl m-4 bg-gray-50/50">
                            <p className="text-sm text-gray-500">
                                Belum ada notifikasi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
