
import MainLayout from "../Layouts/MainLayout";
import { FaWifi, FaChevronRight } from "react-icons/fa";
import { MdRouter } from "react-icons/md";
import { useMemo } from "react";
import { router } from "@inertiajs/react";

const getNotifikasiVisual = (item) => {
    const jenis = item.jenis || "";
    const kategori = (item.kategori || "").toLowerCase();

    if (jenis.includes("Ditambahkan")) {
        return {
            Icon: kategori === "ont" ? MdRouter : FaWifi,
            circle: "bg-green-100 text-green-600",
        };
    }
    if (jenis.includes("Diperbarui")) {
        return {
            Icon: kategori === "ont" ? MdRouter : FaWifi,
            circle: "bg-yellow-100 text-yellow-600",
        };
    }
    if (jenis.includes("Dihapus")) {
        return {
            Icon: kategori === "ont" ? MdRouter : FaWifi,
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
                className={`flex items-center gap-4 border-b px-5 py-4 ${isUnread ? "bg-red-50/40" : ""}`}
            >
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${circle || (isUnread
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
                    className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#992e2e] hover:underline"
                >
                    Lihat detail
                    <FaChevronRight size={12} />
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

                {/* Header */}

                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow text-white">
                        <span className="text-sm font-semibold">
                            Notifikasi
                        </span>
                    </div>
                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {/* Total */}

                    <div className="rounded-xl border-t-4 border-blue-600 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            TOTAL NOTIFIKASI
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            {totalNotifikasi}
                        </h2>
                    </div>

                    {/* Belum Dibaca */}

                    <div className="rounded-xl border-t-4 border-red-500 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            BELUM DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            {belumDibaca}
                        </h2>
                    </div>

                    {/* Sudah Dibaca */}

                    <div className="rounded-xl border-t-4 border-green-600 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            SUDAH DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            {sudahDibaca}
                        </h2>
                    </div>
                </div>

                {/* Daftar Notifikasi */}

                <div className="rounded-xl bg-white shadow">
                    <div className="flex items-center justify-between border-b-2 border-[#ab3c3c]/60 px-5 py-4">
                        <div>
                            <h3 className="font-semibold">
                                Notifikasi Terbaru
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Informasi terbaru dari sistem GIS
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={tandaiSemuaDibaca}
                                disabled={belumDibaca === 0}
                                className="text-xs text-[#992e2e] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
                            >
                                Tandai semua dibaca
                            </button>

                            <span className="h-4 w-px bg-gray-200" />

                            <button
                                onClick={hapusSudahDibaca}
                                disabled={sudahDibaca === 0}
                                className="text-xs text-[#992e2e] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
                            >
                                Hapus yang dibaca
                            </button>
                        </div>
                    </div>

                    {/* Data Notifikasi */}

                    {notifikasi.length > 0 ? (
                        <>
                            {notifikasi.filter((item) => item.status === "belum_dibaca").length > 0 && (
                                <>
                                    <div className="bg-orange-400/20 px-5 py-2">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
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
                                    <div className="bg-green-500/20 px-5 py-2">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
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
                        <div className="px-5 py-10 text-center">
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
