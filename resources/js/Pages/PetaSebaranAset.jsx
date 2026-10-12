import { useState, useMemo } from "react";
import { FaChevronDown, FaWifi } from "react-icons/fa";
import { LuUtilityPole } from "react-icons/lu";
import { usePage } from "@inertiajs/react";

import TataLetakUtama from "../Layouts/TataLetakUtama";
import TampilanPeta from "../Components/TampilanPeta";

const normalisasiStatus = (saringStatus) => String(saringStatus || "").toLowerCase();

export default function PetaSebaranAset() {
    const { pengaturan, tiang = [], ont = [], wilayah: wilayahList = [] } = usePage().props;
    const [jenisAset, aturJenisAset] = useState("Semua");
    const [saringStatus, aturSaringStatus] = useState("Semua");
    const [wilayahTerpilih, aturWilayahTerpilih] = useState("Semua");
    const [saringSelulerBuka, aturSaringSelulerBuka] = useState(() => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return false;
        return true;
    });

    const opsiWilayah = useMemo(
        () => (Array.isArray(wilayahList) ? wilayahList.map((w) => w.nama_wilayah).filter(Boolean) : []),
        [wilayahList]
    );

    const cocokCakupan = (item) => {
        if (saringStatus !== "Semua" && normalisasiStatus(item.status) !== normalisasiStatus(saringStatus)) return false;
        if (wilayahTerpilih !== "Semua" && String(item.wilayah || "") !== wilayahTerpilih) return false;
        return true;
    };

    const totalTiang = useMemo(() => tiang.filter(cocokCakupan).length, [tiang, saringStatus, wilayahTerpilih]);
    const totalOnt = useMemo(() => ont.filter(cocokCakupan).length, [ont, saringStatus, wilayahTerpilih]);

    const penanda = useMemo(() => {
        const penandaTiang = (jenisAset === "Semua" || jenisAset === "Tiang")
            ? tiang.filter(cocokCakupan).map((t) => ({
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
            }))
            : [];
        const penandaOnt = (jenisAset === "Semua" || jenisAset === "ONT")
            ? ont.filter(cocokCakupan).map((o) => ({
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
            }))
            : [];
        return [...penandaTiang, ...penandaOnt];
    }, [tiang, ont, jenisAset, saringStatus, wilayahTerpilih]);

    // Pusat Wilayah

    const pusatWilayah = useMemo(() => {
        if (wilayahTerpilih === "Semua") return null;
        const all = [...tiang, ...ont].filter((it) => String(it.wilayah || "") === wilayahTerpilih);
        const koordinat = all
            .map((it) => {
                const latStr = String(it.latitude ?? "").trim().replace(",", ".");
                const lngStr = String(it.longitude ?? "").trim().replace(",", ".");
                const lat = parseFloat(latStr);
                const lng = parseFloat(lngStr);
                if (!isFinite(lat) || !isFinite(lng)) return null;
                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
                if (latStr === "" || lngStr === "") return null;
                return [lat, lng];
            })
            .filter(Boolean);
        if (koordinat.length === 0) return null;
        let sumLat = 0, sumLng = 0;
        for (const [lat, lng] of koordinat) { sumLat += lat; sumLng += lng; }
        return [sumLat / koordinat.length, sumLng / koordinat.length];
    }, [wilayahTerpilih, tiang, ont]);

    return (
        <TataLetakUtama>
            <div className="space-y-4">

                {/* Tajuk */}

                <div className="rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 text-white shadow-md border border-white/10 max-md:flex max-md:min-w-0 max-md:items-center max-md:rounded-xl max-md:px-3 max-md:py-2.5">
                    <span className="text-sm font-semibold tracking-wide max-md:shrink-0 max-md:text-[13px] max-md:whitespace-nowrap">
                        Peta Sebaran Aset
                    </span>

                    <span className="mx-3 opacity-60 max-md:mx-1.5 max-md:shrink-0">/</span>

                    <span className="text-xs font-light capitalize opacity-90 max-md:truncate max-md:text-[11px]">
                        {pengaturan?.nama_wilayah ?? "Wilayah belum ditentukan"}
                    </span>
                </div>

                <div className="gis-map-wrap relative h-[calc(100vh-180px)] min-h-[500px] overflow-hidden rounded-2xl bg-white dark:bg-night-900 shadow-sm border border-gray-100 dark:border-night-700 max-md:h-[68vh] max-md:min-h-[360px]">

                    {/* Peta */}

                    <div className="absolute inset-0 z-0">
                        <TampilanPeta penanda={penanda} wilayah={wilayahTerpilih} pusatWilayah={pusatWilayah} />
                    </div>

                    <div className="absolute left-4 top-4 z-10 max-md:left-2 max-md:top-2 max-md:max-w-[calc(100vw-6rem)]">
                        <div className="rounded-xl bg-white/90 dark:bg-night-900/90 px-4 py-3 shadow-lg backdrop-blur-md border border-white/60 dark:border-night-700">

                            <h2 className="text-sm font-semibold text-gray-800 dark:text-night-200">
                                Legenda
                            </h2>

                            {/* Legenda */}

                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-800 dark:text-night-200 max-md:flex-wrap max-md:gap-2 max-md:text-[11px]">

                                <span className="flex items-center gap-2">
                                    <span className="text-white p-2.5 rounded-full bg-blue-900" ></span>
                                    Tiang
                                </span>

                                <span className="flex items-center gap-2">
                                    <FaWifi size={20} className="text-white p-1 rounded-full bg-sky-500" />
                                    ONT
                                </span>

                                <span className="flex items-center gap-2">
                                    <span className="p-2.5 rounded-full bg-green-500" />
                                    Aktif
                                </span>

                                <span className="flex items-center gap-2">
                                    <span className="p-2.5 rounded-full bg-red-500" />
                                    Nonaktif
                                </span>

                            </div>
                        </div>
                    </div>

                    <div className="gis-mobile-penyaring absolute right-4 top-4 z-10 w-[280px] max-w-[calc(100vw-2rem)] space-y-3 max-md:right-2 max-md:top-auto max-md:bottom-2 max-md:w-[calc(100vw-5rem)] max-md:max-w-[260px]">

                        {/* Filter */}

                        <div className="rounded-xl bg-white/90 dark:bg-night-900/90 px-3.5 py-4 shadow-lg backdrop-blur-md border border-white/60 dark:border-night-700 max-md:px-3 max-md:py-3">

                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold tracking-wide text-gray-800 dark:text-night-200">
                                    FILTER
                                </h2>

                                {/* Alihan */}

                                <button
                                    type="button"
                                    onClick={() => aturSaringSelulerBuka(!saringSelulerBuka)}
                                    aria-label={saringSelulerBuka ? "Sembunyikan penyaring" : "Tampilkan penyaring"}
                                    className="hidden rounded-lg bg-gray-100 dark:bg-night-800 px-2 py-1 text-[11px] font-semibold text-gray-700 dark:text-night-200 max-md:flex max-md:items-center max-md:gap-1 md:hidden"
                                >
                                    {saringSelulerBuka ? "Tutup" : "Buka"}
                                    <FaChevronDown className={`text-[10px] transition-transform ${saringSelulerBuka ? "rotate-180" : ""}`} />
                                </button>
                            </div>

                            <div className={`${saringSelulerBuka ? "" : "max-md:hidden"} md:block`}>

                                <div className="grid grid-cols-3 gap-2">

                                    {[
                                        { label: "Semua", icon: null, active: "bg-gray-900 dark:bg-night-200 text-white dark:text-night-900 border-gray-900 dark:border-night-200 shadow", idle: "bg-white dark:bg-night-800 text-gray-700 dark:text-night-200 border-gray-300 dark:border-night-600 hover:bg-gray-50 dark:hover:bg-night-700" },
                                        { label: "Tiang", icon: LuUtilityPole, active: "bg-[#1e3a8a] text-white border-[#1e3a8a] shadow", idle: "bg-white dark:bg-night-800 text-[#1e3a8a] dark:text-blue-300 border-[#1e3a8a]/30 hover:bg-blue-50 dark:hover:bg-blue-500/15" },
                                        { label: "ONT", icon: FaWifi, active: "bg-sky-500 text-white border-sky-500 shadow", idle: "bg-white dark:bg-night-800 text-sky-600 dark:text-sky-300 border-sky-500/30 hover:bg-sky-50 dark:hover:bg-sky-500/15" },
                                    ].map(({ label, ikon: Ikon, active, idle }) => {
                                        const apakahAktif = jenisAset === label;
                                        return (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => aturJenisAset(label)}
                                                className={`h-8 rounded-md border px-2 text-[10px] font-semibold transition flex items-center justify-center gap-1 ${apakahAktif ? active : idle}`}
                                            >
                                                {Ikon && <Ikon size={11} />}
                                                {label}
                                            </button>
                                        );
                                    })}

                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-3">

                                    {/* Status */}

                                    <div className="relative">
                                        <select
                                            value={saringStatus}
                                            onChange={(kejadian) => aturSaringStatus(kejadian.target.value)}
                                            className={`capitalize h-8 w-full appearance-none rounded-md border bg-white dark:bg-night-900 pl-6 pr-7 text-[10px] font-medium text-gray-700 dark:text-night-200 outline-none transition ${saringStatus === "Aktif" ? "border-green-500 bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-300" : saringStatus === "Nonaktif" ? "border-red-500 bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300" : "border-gray-300 dark:border-night-600 hover:bg-gray-50 dark:hover:bg-night-800"}`}
                                        >
                                            <option>Semua</option>
                                            <option>Aktif</option>
                                            <option>Nonaktif</option>
                                        </select>
                                        <span className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${saringStatus === "Aktif" ? "bg-green-500" : saringStatus === "Nonaktif" ? "bg-red-500" : "bg-gray-400"}`} />
                                        <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px] opacity-60" />
                                    </div>

                                    {/* Wilayah */}

                                    <div className="relative">
                                        <select
                                            value={wilayahTerpilih}
                                            onChange={(kejadian) => aturWilayahTerpilih(kejadian.target.value)}
                                            className="capitalize h-8 w-full appearance-none rounded-md border border-gray-300 dark:border-night-600 bg-white dark:bg-night-900 px-2 pr-6 text-[10px] font-medium text-gray-700 dark:text-night-200 outline-none hover:bg-gray-50 dark:hover:bg-night-800"
                                        >
                                            <option value="Semua">Semua</option>
                                            {opsiWilayah.map((nama) => (
                                                <option key={nama} value={nama}>
                                                    {nama}
                                                </option>
                                            ))}
                                        </select>
                                        <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px] opacity-60" />
                                    </div>

                                </div>

                                {/* Statistik */}

                                <div className="mt-3 grid grid-cols-3 gap-2.5">

                                    <div className="flex h-[56px] flex-col items-center justify-center rounded-xl border border-[#1e3a8a]/20 bg-blue-50 dark:bg-blue-500/15 shadow-sm">
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#1e3a8a] dark:text-blue-300">
                                            <LuUtilityPole size={12} /> {totalTiang}
                                        </span>
                                        <span className="text-[10px] font-medium text-[#1e3a8a]/70 dark:text-blue-300/70">
                                            Tiang
                                        </span>
                                    </div>

                                    <div className="flex h-[56px] flex-col items-center justify-center rounded-xl border border-sky-500/20 bg-sky-50 dark:bg-sky-500/15 shadow-sm">
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-300">
                                            <FaWifi size={12} /> {totalOnt}
                                        </span>
                                        <span className="text-[10px] font-medium text-sky-600/70 dark:text-sky-300/70">
                                            ONT
                                        </span>
                                    </div>

                                    <div className="flex h-[56px] flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-night-700 bg-gray-50 dark:bg-night-800/60 shadow-sm">
                                        <span className="text-[11px] font-bold text-gray-800 dark:text-night-200">
                                            {penanda.length}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-500 dark:text-night-400">
                                            Tampil
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </TataLetakUtama>
    );
}

