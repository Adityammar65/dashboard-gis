{/* Import Main Layout */ }

import MainLayout from "../Layouts/MainLayout";

import {
    FaPlus,
    FaArrowRight,
    FaSyncAlt,
    FaMapMarkedAlt,
} from "react-icons/fa";
import { FaTowerBroadcast } from "react-icons/fa6";
import { MdRouter, MdStorage } from "react-icons/md";
import MapView from "../Components/MapView";
import { Link } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <MainLayout>
            <div className="space-y-4 ml-64 ">

                {/* Header Dashboard */}

                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl border border-gray-700 bg-white px-4 py-3 shadow">
                        <span className="text-sm font-medium">
                            Dashboard Overview
                        </span>
                        <span className="mx-3">/</span>
                        <span classname="text-xs font-light"> Wilayah </span>
                    </div>

                    <button className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600">
                        <FaPlus />
                        Tambah Aset
                    </button>
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
                                    9999
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-900 text-white">
                                <FaTowerBroadcast className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Aktif 9999
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Nonaktif 9999
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
                                    9999
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500 text-white">
                                <MdRouter className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 text-xs">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Aktif 9999
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Nonaktif 9999
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
                                    99 Wilayah
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-400 text-white">
                                <FaMapMarkedAlt className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-2 text-xs">
                            Lihat Sebaran Wilayah
                            <FaArrowRight />
                        </div>
                    </div>

                    {/* Data Berkoordinat */}

                    <div className="rounded-xl border-t-4 border-sky-500 bg-white p-4 shadow transition-all duration-200 hover:scale-102 hover:shadow-lg">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    DATA BERKOORDINAT
                                </p>
                                <h2 className="mt-1 text-2xl font-semibold">
                                    97%
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                <MdStorage className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-2 text-xs">
                            Lihat Sebaran Data
                            <FaArrowRight />
                        </div>
                    </div>
                </div>

                {/* Bagian bawah */}

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

                            <Link
                                href="/dashboard-gis/peta"
                                className="rounded-lg bg-blue-100 px-3 py-2 text-xs text-blue-800 hover:bg-blue-200"
                            >
                                Buka Peta Penuh ↗
                            </Link>
                        </div>

                        <div className="h-64 overflow-hidden rounded-lg">
                            <MapView />
                        </div>
                    </div>

                    {/* Pembaruan Aset */}

                    <div className="rounded-xl border-t-4 border-blue-600 bg-white p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    PEMBARUAN ASET
                                </p>
                                <h3 className="text-sm font-medium">
                                    6 Aset Diperbarui
                                </h3>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <FaSyncAlt className="text-2xl" />
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">

                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaTowerBroadcast className="text-sm" />

                                        <div className="text-xs">
                                            <p>Tiang</p>
                                            <p className="text-gray-500">
                                                Wilayah
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="rounded-full bg-blue-500 px-2 py-1 text-[10px] text-white">
                                            Aktif
                                        </span>
                                        <p className="mt-1 text-[10px] text-gray-500">
                                            5m
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MdRouter className="text-sm" />

                                    <div className="text-xs">
                                        <p>Tiang</p>
                                        <p className="text-gray-500">
                                            Wilayah
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] text-white">
                                        Nonaktif
                                    </span>
                                    <p className="mt-1 text-[10px] text-gray-500">
                                        5m
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2 text-xs">
                            Lihat Seluruh Aset
                            <FaArrowRight />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
