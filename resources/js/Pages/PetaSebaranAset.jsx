import { useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import MainLayout from "../Layouts/MainLayout";
import MapView from "../Components/MapView";

export default function Peta() {
    const [assetType, setAssetType] = useState("Semua");
    const [status, setStatus] = useState("Aktif");
    const [wilayah, setWilayah] = useState("Aceh Tamiang");

    return (
        <MainLayout>
            <div className="space-y-4 ml-64">

                {/* Judul */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl border border-gray-700 bg-white px-4 py-3 shadow">
                        <span className="text-sm font-medium">
                            Peta Sebaran Aset
                        </span>
                        <span className="mx-3">/</span>
                        <span classname="text-xs font-light"> Wilayah saat ini  </span>
                    </div>

                   
                </div>

                {/* Area utama */}
                <div className="grid grid-cols-[250px_minmax(0,1fr)] gap-3">

                    {/* ================= PANEL KIRI ================= */}
                    <div className="space-y-3">

                        {/* Inspeksi Aset */}
                        <div className="bg-white px-3.5 py-4 shadow-md">

                            <h2 className="mb-3 text-[11px] font-bold text-gray-800">
                                INSPEKSI ASET
                            </h2>

                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-700" />

                                <input
                                    type="text"
                                    placeholder="Cari nomor aset....."
                                    className="h-8 w-full rounded-md bg-gray-200 pl-9 pr-3 text-[10px] text-gray-700 outline-none transition focus:bg-white focus:ring-1 focus:ring-gray-400"
                                />
                            </div>

                            {/* Jenis aset */}
                            <div className="mt-3 grid grid-cols-3 gap-3">
                                {["Semua", "ONT", "Tiang"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setAssetType(type)}
                                        className={`h-7 rounded-md border border-gray-800 px-2 text-[10px] font-semibold transition ${
                                            assetType === type
                                                ? "bg-black text-white"
                                                : "bg-white text-gray-800 hover:bg-gray-100"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Filter */}
                            <div className="mt-2 grid grid-cols-2 gap-3">

                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="h-8 w-full appearance-none rounded-md border border-gray-800 bg-white px-3 pr-7 text-[10px] font-medium outline-none hover:bg-gray-50"
                                    >
                                        <option>Aktif</option>
                                        <option>Nonaktif</option>
                                        <option>Semua</option>
                                    </select>

                                    <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" />
                                </div>

                                <div className="relative">
                                    <select
                                        value={wilayah}
                                        onChange={(e) => setWilayah(e.target.value)}
                                        className="h-8 w-full appearance-none rounded-md border border-gray-800 bg-white px-2 pr-6 text-[10px] font-medium outline-none hover:bg-gray-50"
                                    >
                                        <option>Aceh Tamiang</option>
                                        <option>Banda Aceh</option>
                                        <option>Langsa</option>
                                        <option>Medan</option>
                                    </select>

                                    <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" />
                                </div>

                            </div>

                            {/* Statistik */}
                            <div className="mt-3 grid grid-cols-3 gap-4">

                                <div className="flex h-11 flex-col items-center justify-center rounded-md border border-gray-800">
                                    <span className="text-[11px] font-bold">
                                        74
                                    </span>
                                    <span className="text-[10px]">
                                        Tiang
                                    </span>
                                </div>

                                <div className="flex h-11 flex-col items-center justify-center rounded-md border border-gray-800">
                                    <span className="text-[11px] font-bold">
                                        49
                                    </span>
                                    <span className="text-[10px]">
                                        ONT
                                    </span>
                                </div>

                                <div className="flex h-11 flex-col items-center justify-center rounded-md border border-gray-800">
                                    <span className="text-[11px] font-bold">
                                        123
                                    </span>
                                    <span className="text-[10px]">
                                        Tampil
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Layer Peta */}
                        <div className="bg-white px-4 py-4 shadow-md">

                            <h2 className="text-[11px] font-bold text-gray-800">
                                Layer peta
                            </h2>

                            <div className="mt-3 flex flex-col gap-3">

                                <label className="flex cursor-pointer items-center gap-2 text-[10px] font-medium">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-3 w-3 accent-black"
                                    />
                                    Jalur fiber trunk
                                </label>

                                <label className="flex cursor-pointer items-center gap-2 text-[10px] font-medium">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-3 w-3 accent-black"
                                    />
                                    Batas wilayah
                                </label>

                            </div>
                        </div>

                    </div>

                    {/* ================= MAP ================= */}
                    <div className="relative z-0 bg-white p-4">

                        {/* Header Map */}
                        <div className="flex items-start justify-between">

                            <div>
                                <h2 className="text-sm font-semibold text-gray-800">
                                    Peta Sebaran Aset GIS
                                </h2>

                                <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-600">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-blue-900" />
                                        Tiang
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-sky-500" />
                                        ONT
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        Nonaktif
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="rounded-md bg-blue-100 px-3 py-2 text-[10px] font-medium text-gray-700 transition hover:bg-blue-200"
                            >
                                Buka Peta Penuh ↗
                            </button>
                        </div>

                        {/* Label koordinat */}
                        <div className="mt-2 text-[10px] text-gray-600">
                            Koordinat
                        </div>

                        {/* Map */}
                        <div className="relative z-0 h-[520px] overflow-hidden rounded-b-sm">
                            <MapView />
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}