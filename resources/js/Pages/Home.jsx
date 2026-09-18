{/* Import Main Layout */ }

import MainLayout from "../Layouts/MainLayout";

import { usePage } from "@inertiajs/react";
import {
    FaPlus,
    FaArrowRight,
    FaSyncAlt,
    FaWifi,
    FaMapMarkedAlt,
} from "react-icons/fa";
import { MdRouter, MdStorage } from "react-icons/md";
import MapView from "../Components/MapView";
import { useState, useMemo, useCallback } from "react";

const formatRelative = (iso) => {
    if (!iso) return "-";
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "baru";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}j`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}h`;
    return new Date(iso).toLocaleDateString("id-ID");
};

export default function Dashboard() {
    const [openTambah, setOpenTambah] = useState(false);

    const { settings, tiang = [], ont = [], stats = {}, recentAssets = [] } = usePage().props;
    const hasWilayah = !!String(settings?.nama_wilayah ?? "").trim();
    const activeWilayah = hasWilayah ? String(settings.nama_wilayah) : "Semua";

    const base = useMemo(() => {
        const seg = window.location.pathname.split("/").filter(Boolean)[0];
        const knownRoutes = ["home","data-tiang","data-ont","wilayah","peta-sebaran-aset","pengaturan","logout","notifikasi","detail-tiang","detail-ont","detail-notifikasi","edit-tiang","edit-ont","tambah-tiang","tambah-ont","tambah-wilayah","hapus-tiang","hapus-ont","hapus-wilayah"];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return "";
    }, []);
    const resolveHref = useCallback((href) => `${base}/${href}`.replace(/\/+/g, "/"), [base]);

    const markers = useMemo(() => {
        if (!hasWilayah) return [];
        const tiangMarkers = tiang.map((t) => ({
            id: t.id,
            type: "tiang",
            kode: t.kode_tiang,
            status: t.status,
            wilayah: t.wilayah,
            area: t.area,
            latitude: t.latitude,
            longitude: t.longitude,
        }));
        const ontMarkers = ont.map((o) => ({
            id: o.id,
            type: "ont",
            kode: o.kode_ont,
            status: o.status,
            wilayah: o.wilayah,
            area: o.area,
            latitude: o.latitude,
            longitude: o.longitude,
        }));
        return [...tiangMarkers, ...ontMarkers];
    }, [tiang, ont, hasWilayah]);

    const wilayahCenter = useMemo(() => {
        if (!hasWilayah || markers.length === 0) {
            const all = hasWilayah ? [...tiang, ...ont] : [];
            const coords = all
                .map((it) => {
                    const latStr = String(it.latitude ?? "").trim().replace(",", ".");
                    const lngStr = String(it.longitude ?? "").trim().replace(",", ".");
                    const lat = parseFloat(latStr);
                    const lng = parseFloat(lngStr);
                    if (!isFinite(lat) || !isFinite(lng)) return null;
                    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
                    return [lat, lng];
                })
                .filter(Boolean);
            if (coords.length === 0) return null;
            let sLat = 0, sLng = 0;
            for (const [a, b] of coords) { sLat += a; sLng += b; }
            return [sLat / coords.length, sLng / coords.length];
        }

        const coords = markers
            .map((m) => {
                const lat = parseFloat(String(m.latitude ?? "").trim().replace(",", "."));
                const lng = parseFloat(String(m.longitude ?? "").trim().replace(",", "."));
                if (!isFinite(lat) || !isFinite(lng)) return null;
                return [lat, lng];
            })
            .filter(Boolean);
        if (coords.length === 0) return null;
        let sLat = 0, sLng = 0;
        for (const [a, b] of coords) { sLat += a; sLng += b; }
        return [sLat / coords.length, sLng / coords.length];
    }, [markers, tiang, ont, hasWilayah]);

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-800">
                        Selamat Datang di Dashboard GIS
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Pantau dan kelola data aset jaringan secara terintegrasi.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <div className="flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow text-white">
                        <span className="text-sm font-semibold">
                            Beranda
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light capitalize">
                            {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>
                    </div>

                    <div className="relative">

                        <button
                            onClick={() => setOpenTambah(!openTambah)}
                            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white transition hover:bg-green-600"
                        >
                            <FaPlus />
                            Tambah Aset
                        </button>

                        {openTambah && (
                            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">

                                <a
                                    href={resolveHref("tambah-tiang")}
                                    onClick={() => setOpenTambah(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                                >
                                    <FaWifi className="text-blue-700" />
                                    Tambah Tiang
                                </a>

                                <a
                                    href={resolveHref("tambah-ont")}
                                    onClick={() => setOpenTambah(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100"
                                >
                                    <MdRouter className="text-sky-500 text-lg" />
                                    Tambah ONT
                                </a>

                            </div>
                        )}

                    </div>

                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                    {/* Tiang */}

                    <div className="rounded-xl border-t-4 border-blue-900 bg-white p-4 shadow transition-all duration-200 hover:scale-102 hover:shadow-lg">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    TOTAL TIANG
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold">
                                    {stats?.tiang?.total ?? 0}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-900 text-white">
                                <FaWifi className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Aktif {stats?.tiang?.aktif ?? 0}
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Nonaktif {stats?.tiang?.nonaktif ?? 0}
                            </span>
                        </div>
                    </div>


                    {/* ONT */}

                    <div className="rounded-xl border-t-4 border-sky-500 bg-white p-4 shadow transition-all duration-200 hover:scale-102 hover:shadow-lg">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    TOTAL ONT
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold">
                                    {stats?.ont?.total ?? 0}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500 text-white">
                                <MdRouter className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Aktif {stats?.ont?.aktif ?? 0}
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Nonaktif {stats?.ont?.nonaktif ?? 0}
                            </span>
                        </div>
                    </div>

                    {/* Wilayah */}

                    <div className="rounded-xl border-t-4 border-yellow-400 bg-white p-4 shadow transition-all duration-200 hover:scale-102 hover:shadow-lg">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    WILAYAH COVERAGE
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold">
                                    {stats?.wilayah?.total ?? 0} Wilayah
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-400 text-white">
                                <FaMapMarkedAlt className="text-2xl" />
                            </div>
                        </div>

                        <a
                            href={resolveHref("wilayah")}
                            className="mt-5 flex items-center justify-end gap-2 text-xs text-gray-600 transition hover:text-yellow-600"
                        >
                            Lihat Sebaran Wilayah
                            <FaArrowRight />
                        </a>
                    </div>

                    {/* Data Berkoordinat */}

                    <div className="rounded-xl border-t-4 border-emerald-600 bg-white p-4 shadow transition-all duration-200 hover:scale-102 hover:shadow-lg">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    DATA BERKOORDINAT
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold">
                                    {stats?.koordinat?.persen ?? 0}%
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                <MdStorage className="text-2xl" />
                            </div>
                        </div>

                        <a
                            href={resolveHref("peta-sebaran-aset")}
                            className="mt-5 flex items-center justify-end gap-2 text-xs text-gray-600 transition hover:text-emerald-600"
                        >
                            Lihat Sebaran Data
                            <FaArrowRight />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

                    {/* Peta */}

                    <div className="xl:col-span-2 rounded-xl bg-white p-4 shadow">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    Peta Sebaran Aset GIS
                                </h3>

                                <div className="mt-2 flex gap-4 text-xs">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Aktif
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Nonaktif
                                    </span>
                                </div>
                            </div>

                            <a
                                href={resolveHref("peta-sebaran-aset")}
                                className="rounded-lg bg-blue-100 px-3 py-2 text-xs text-blue-800 hover:bg-blue-200">
                                Buka Peta Penuh
                            </a>
                        </div>

                        {hasWilayah ? (
                            <div className="h-85 overflow-hidden rounded-lg">
                                <MapView markers={markers} wilayah={activeWilayah} wilayahCenter={wilayahCenter} />
                            </div>
                        ) : (
                            <a
                                href={resolveHref("pengaturan")}
                                className="flex h-85 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-[#AB3C3C] hover:bg-red-50/50"
                            >
                                <FaMapMarkedAlt className="mb-2 text-3xl text-gray-400" />
                                <p className="text-sm font-semibold text-gray-700">Wilayah Belum Ditentukan</p>
                                <p className="mt-1 text-xs text-gray-500">Klik untuk mengatur wilayah</p>
                                <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-[#AB3C3C] px-3 py-1 text-xs font-medium text-white">
                                    Buka Pengaturan <FaArrowRight size={10} />
                                </span>
                            </a>
                        )}
                    </div>

                    {/* Pembaruan Aset */}

                    <div className="rounded-xl border-t-4 border-blue-600 bg-white p-4 shadow hover:scale-102 transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    PEMBARUAN ASET
                                </p>
                                <h3 className="text-sm font-medium">
                                    {recentAssets.length} Aset Diperbarui
                                </h3>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <FaSyncAlt className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            {recentAssets.length > 0 ? (
                                recentAssets.map((item) => (
                                    <div
                                        key={`${item.type}-${item.id}`}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.type === "tiang" ? (
                                                <FaWifi className="text-sm text-blue-900" />
                                            ) : (
                                                <MdRouter className="text-sm text-sky-500" />
                                            )}
                                            <div className="text-xs">
                                                <p className="font-medium">{item.kode}</p>
                                                <p className="text-gray-500 capitalize">
                                                    {item.wilayah}{item.area ? ` • ${item.area}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`rounded-full px-2 py-1 text-[10px] text-white capitalize ${String(item.status).toLowerCase() === "aktif" ? "bg-green-500" : "bg-red-500"}`}
                                            >
                                                {item.status}
                                            </span>
                                            <p className="mt-1 text-[10px] text-gray-500">
                                                {formatRelative(item.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-6 text-center text-xs text-gray-400">Belum ada pembaruan</p>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between mx-2 text-xs">
                            <a href={resolveHref("data-tiang")} className="flex items-center gap-2 text-black transition hover:text-blue-500">
                                Lihat Data Tiang
                                <FaArrowRight />
                            </a>

                            <a href={resolveHref("data-ont")} className="flex items-center gap-2 text-black transition hover:text-blue-500">
                                Lihat Data ONT
                                <FaArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
