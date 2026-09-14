import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import MainLayout from "../Layouts/MainLayout";
import MapView from "../Components/MapView";

export default function Peta() {
    const [assetType, setAssetType] = useState("Semua");
    const [status, setStatus] = useState("Aktif");
    const [wilayah, setWilayah] = useState("Aceh Tamiang");

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 text-white shadow">
                        <span className="text-sm font-semibold">
                            Peta Sebaran Aset
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light">
                            Wilayah saat ini
                        </span>
                    </div>
                </div>

                <div className="relative h-[calc(100vh-180px)] min-h-[500px] overflow-hidden rounded-xl bg-white shadow-md">

                    {/* Map */}

                    <div className="absolute inset-0 z-0">
                        <MapView />
                    </div>

                    <div className="absolute left-4 top-4 z-10">
                        <div className="rounded-lg bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm">

                            <h2 className="text-sm font-semibold text-gray-800">
                                Peta Sebaran Aset GIS
                            </h2>

                            {/* Legenda */}

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
                    </div>

                    {/* Koordinat */}

                    <div className="absolute bottom-4 left-4 z-10 rounded-md bg-white/90 px-3 py-2 text-[10px] text-gray-600 shadow backdrop-blur-sm">
                        Koordinat
                    </div>

                    <button
                        type="button"
                        className="absolute bottom-4 right-4 z-10 rounded-md bg-white/95 px-3 py-2 text-[10px] font-medium text-gray-700 shadow-md backdrop-blur-sm transition hover:bg-white"
                    >
                        Buka Peta Penuh ↗
                    </button>

                    <div className="absolute right-4 top-4 z-10 w-[250px] space-y-3">

                        {/* Panel Aset */}

                        <div className="rounded-lg bg-white/95 px-3.5 py-4 shadow-md backdrop-blur-sm">

                            <h2 className="mb-3 text-[11px] font-bold text-gray-800">
                                INSPEKSI ASET
                            </h2>

                            <div className="grid grid-cols-3 gap-3">

                                {["Semua", "ONT", "Tiang"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setAssetType(type)}
                                        className={`h-7 rounded-md border border-gray-800 px-2 text-[10px] font-semibold transition ${assetType === type
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

                                {/* Status */}

                                <div className="relative">

                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="h-8 w-full appearance-none rounded-md border border-gray-800 bg-white px-3 pr-7 text-[10px] font-medium outline-none hover:bg-gray-50"
                                    >
                                        <option>Aktif</option>
                                        <option>Nonaktif</option>
                                        <option>Semua</option>
                                    </select>

                                    <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" />

                                </div>

                                {/* Wilayah */}

                                <div className="relative">

                                    <select
                                        value={wilayah}
                                        onChange={(e) =>
                                            setWilayah(e.target.value)
                                        }
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

                        <div className="rounded-lg bg-white/95 px-4 py-4 shadow-md backdrop-blur-sm">

                            <h2 className="text-[11px] font-bold text-gray-800">
                                Layer Peta
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

                </div>
            </div>
        </MainLayout>
    );
}

