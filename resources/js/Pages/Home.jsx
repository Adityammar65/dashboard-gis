{/* Import Main Layout */ }

import MainLayout from "../Layouts/MainLayout";

import { usePage } from "@inertiajs/react";
import {
    FaPlus,
    FaArrowRight,
    FaSyncAlt,
    FaUser,
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
        const knownRoutes = ["home", "data-tiang", "data-ont", "wilayah", "peta-sebaran-aset", "pengaturan", "logout", "notifikasi", "detail-tiang", "detail-ont", "detail-notifikasi", "edit-tiang", "edit-ont", "tambah-tiang", "tambah-ont", "tambah-wilayah", "hapus-tiang", "hapus-ont", "hapus-wilayah"];
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
            kecamatan: t.kecamatan ?? t.area,
            kelurahan: t.kelurahan,
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
            kecamatan: o.kecamatan ?? o.area,
            kelurahan: o.kelurahan,
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

                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 shadow-md border border-white/10 text-white">
                        <span className="text-sm font-semibold tracking-wide">
                            Beranda
                        </span>

                        <span className="mx-3 opacity-60">/</span>

                        <span className="text-xs font-light capitalize opacity-90">
                            {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>
                    </div>

                    <div className="relative">

                        <button
                            onClick={() => setOpenTambah(!openTambah)}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:shadow-lg hover:from-green-600 hover:to-emerald-700 active:scale-[0.98]"
                        >
                            <FaPlus />
                            Tambah Aset
                        </button>

                        {openTambah && (
                            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">

                                <a
                                    href={resolveHref("tambah-tiang")}
                                    onClick={() => setOpenTambah(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-800"
                                >
                                    <FaWifi className="text-blue-700" />
                                    Tambah Tiang
                                </a>

                                <a
                                    href={resolveHref("tambah-ont")}
                                    onClick={() => setOpenTambah(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-sky-50 hover:text-sky-700"
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

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-blue-900 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 will-change-transform">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                                    TOTAL TIANG
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                                    {stats?.tiang?.total ?? 0}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-900 text-white shadow-md ring-1 ring-white/10">
                                <FaWifi className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs">
                            <span className="flex items-center gap-2 rounded-full bg-green-50 px-2 py-1 ring-1 ring-green-200">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Aktif {stats?.tiang?.aktif ?? 0}
                            </span>

                            <span className="flex items-center gap-2 rounded-full bg-red-50 px-2 py-1 ring-1 ring-red-200">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Nonaktif {stats?.tiang?.nonaktif ?? 0}
                            </span>
                        </div>
                    </div>

                    {/* ONT */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-sky-500 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 will-change-transform">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                                    TOTAL ONT
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                                    {stats?.ont?.total ?? 0}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md ring-1 ring-white/10">
                                <MdRouter className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs">
                            <span className="flex items-center gap-2 rounded-full bg-green-50 px-2 py-1 ring-1 ring-green-200">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Aktif {stats?.ont?.aktif ?? 0}
                            </span>

                            <span className="flex items-center gap-2 rounded-full bg-red-50 px-2 py-1 ring-1 ring-red-200">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Nonaktif {stats?.ont?.nonaktif ?? 0}
                            </span>
                        </div>
                    </div>

                    {/* Wilayah */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-yellow-400 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 will-change-transform">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[10px] font-semibold tracking-widest text-gray-500">
                                    WILAYAH COVERAGE
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-gray-800">
                                    {stats?.wilayah?.total ?? 0} Wilayah
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-400 text-white shadow-md ring-1 ring-white/10">
                                <FaMapMarkedAlt className="text-2xl" />
                            </div>
                        </div>

                        <a
                            href={resolveHref("wilayah")}
                            className="mt-5 flex items-center justify-end gap-2 text-xs font-medium text-gray-500 transition hover:text-yellow-600 hover:gap-3"
                        >
                            Lihat Sebaran Wilayah
                            <FaArrowRight />
                        </a>
                    </div>

                    {/* Data Berkoordinat */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-emerald-600 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:-translate-y-0.5 will-change-transform">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                                    DATA BERKOORDINAT
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-800">
                                    {stats?.koordinat?.persen ?? 0}%
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md ring-1 ring-white/10">
                                <MdStorage className="text-2xl" />
                            </div>
                        </div>

                        <a
                            href={resolveHref("peta-sebaran-aset")}
                            className="mt-5 flex items-center justify-end gap-2 text-xs font-medium text-gray-500 transition hover:text-emerald-600 hover:gap-3"
                        >
                            Lihat Sebaran Data
                            <FaArrowRight />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

                    {/* Peta */}

                    <div className="xl:col-span-2 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Peta Sebaran Aset GIS
                                </h3>

                                <div className="mt-2 flex gap-4 text-xs">
                                    <span className="flex items-center gap-2 rounded-full bg-green-50 px-2 py-0.5 ring-1 ring-green-200">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Aktif
                                    </span>

                                    <span className="flex items-center gap-2 rounded-full bg-red-50 px-2 py-0.5 ring-1 ring-red-200">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Nonaktif
                                    </span>
                                </div>
                            </div>

                            <a
                                href={resolveHref("peta-sebaran-aset")}
                                className="rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition hover:bg-blue-100 hover:shadow-sm">
                                Buka Peta Penuh
                            </a>
                        </div>

                        {hasWilayah ? (
                            <div className="h-[450px] overflow-hidden rounded-xl border border-gray-100 shadow-inner">
                                <MapView markers={markers} wilayah={activeWilayah} wilayahCenter={wilayahCenter} />
                            </div>
                        ) : (
                            <a
                                href={resolveHref("pengaturan")}
                                className="flex h-[340px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white text-center transition hover:border-[#AB3C3C]/50 hover:bg-red-50/30 hover:shadow-sm"
                            >
                                <FaMapMarkedAlt className="mb-2 text-3xl text-gray-400" />
                                <p className="text-sm font-semibold text-gray-700">Wilayah Belum Ditentukan</p>
                                <p className="mt-1 text-xs text-gray-500">Klik untuk mengatur wilayah</p>
                                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#AB3C3C] px-3.5 py-1.5 text-xs font-medium text-white shadow-md">
                                    Buka Pengaturan <FaArrowRight size={10} />
                                </span>
                            </a>
                        )}
                    </div>

                    {/* Pembaruan Aset */}

                    <div className="rounded-2xl border border-gray-100 border-t-[3px] border-t-blue-600 bg-white p-5 shadow-sm hover:scale-[1.02] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 will-change-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                                    PEMBARUAN ASET
                                </p>
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {recentAssets.length} Aset Diperbarui
                                </h3>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md ring-1 ring-white/10">
                                <FaSyncAlt className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            {recentAssets.length > 0 ? (
                                recentAssets.map((item) => {
                                    const isBaru = item.created_at && item.updated_at
                                        ? Math.abs(new Date(item.updated_at).getTime() - new Date(item.created_at).getTime()) < 60000
                                        : false;
                                    return (
                                        <div
                                            key={`${item.type}-${item.id}`}
                                            className="flex items-center justify-between rounded-xl px-2 py-2 -mx-2 hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {item.type === "tiang" ? (
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800 ring-1 ring-blue-200"><FaWifi className="text-sm" /></span>
                                                ) : (
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-200"><MdRouter className="text-sm" /></span>
                                                )}
                                                <div className="text-xs min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{item.kode}</p>
                                                    <p className="text-gray-500 capitalize truncate">
                                                        {item.wilayah}{(item.kecamatan || item.area) ? ` • ${item.kecamatan || item.area}` : ""}{item.kelurahan ? ` • ${item.kelurahan}` : ""}
                                                    </p>
                                                    <p className="mt-0.5 flex items-center gap-1 truncate text-gray-500">
                                                        <FaUser size={9} className="shrink-0 text-gray-400" />
                                                        <span className="truncate">{item.nama_petugas || "—"}</span>
                                                        <span className={`ml-1 shrink-0 text-[9px] font-semibold ${isBaru ? "text-emerald-600" : "text-amber-600"}`}>
                                                            {isBaru ? "Ditambahkan" : "Diperbarui"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium text-white capitalize shadow-sm ring-1 ring-white/20 ${String(item.status).toLowerCase() === "aktif" ? "bg-green-500" : "bg-red-500"}`}
                                                >
                                                    {item.status}
                                                </span>
                                                <p className="mt-1 text-[10px] text-gray-500">
                                                    {formatRelative(item.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="py-8 text-center text-xs text-gray-400 rounded-xl border border-dashed border-gray-200 bg-gray-50/60">Belum ada pembaruan</p>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between mx-1 text-xs font-medium">
                            <a href={resolveHref("data-tiang")} className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-gray-700 ring-1 ring-gray-200 transition hover:bg-blue-50 hover:text-blue-600 hover:ring-blue-200">
                                Lihat Data Tiang
                                <FaArrowRight />
                            </a>

                            <a href={resolveHref("data-ont")} className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 text-gray-700 ring-1 ring-gray-200 transition hover:bg-sky-50 hover:text-sky-600 hover:ring-sky-200">
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
