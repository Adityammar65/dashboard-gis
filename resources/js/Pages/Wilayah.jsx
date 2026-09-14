{/* Import Main Layout */ }

import MainLayout from "../Layouts/MainLayout";

import { FaPlus, FaFilter, FaMap } from "react-icons/fa";
import { FaTowerBroadcast } from "react-icons/fa6";
import { LuBox } from "react-icons/lu";

export default function Tiang() {
    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center gap-4">
                    <div className="items-center flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] text-white px-4 py-3 shadow">
                        <span className="text-sm font-semibold">
                            Data Wilayah
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light">
                            Wilayah Saat Ini
                        </span>
                    </div>

                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Total Wilayah */}

                    <div className="hover:scale-102 transition-all duration-200 shadow flex min-h-[136px] flex-col justify-between rounded-xl border-t-4 border-yellow-400 bg-white p-4 shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    TOTAL WILAYAH
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold">
                                    999999
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-yellow-400 text-white">
                                <FaMap className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Total Aset Terpetakan */}

                    <div className="hover:scale-102 transition-all duration-200 shadow flex min-h-[136px] flex-col justify-between rounded-xl border-t-4 border-blue-400 bg-white p-4 shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    TOTAL ASET TERPETAKAN
                                </p>

                                <p className="text-xs font-light my-1">Nama Aset</p>

                                <h2 className="mt-1 text-2xl font-semibold">
                                    999999
                                </h2>

                                <div className="flex items-center gap-2 text-xs font-light mt-1.5">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Aktif 999
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Nonaktif 999
                                    </span>
                                </div>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-400 text-white">
                                <LuBox className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Filter */}

                    <div className="min-h-[136px] rounded-xl bg-white p-4 shadow">

                        <div className="mb-4 flex items-center gap-2">
                            <FaFilter className="text-gray-600" />

                            <span className="text-xs font-medium">
                                FILTER DATA
                            </span>
                        </div>

                        <div className="space-y-3">

                            {/* Wilayah */}

                            <select
                                defaultValue=""
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-900"
                            >
                                <option value="" disabled>
                                    Pilih Wilayah
                                </option>
                                <option value="aceh">
                                    Aceh
                                </option>
                                <option value="sumut">
                                    Sumatera Utara
                                </option>
                                <option value="sumbar">
                                    Sumatera Barat
                                </option>
                            </select>

                            {/* Status */}

                            <select
                                defaultValue=""
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-900"
                            >
                                <option value="" disabled>
                                    Pilih Aset
                                </option>
                                <option value="aktif">
                                    Tiang
                                </option>
                                <option value="nonaktif">
                                    ONT
                                </option>
                            </select>

                        </div>

                    </div>

                </div>

                {/* Tabel */}

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] border-collapse text-xs">

                            <thead>
                                <tr className="border-b border-gray-300 text-center font-medium">
                                    <th className="w-12 px-4 py-3">
                                        No
                                    </th>

                                    <th className="w-24 px-4 py-3">
                                        Wilayah
                                    </th>

                                    <th className="px-4 py-3">
                                        Total Aset
                                    </th>

                                    <th className="px-4 py-3">
                                        Total Tiang
                                    </th>

                                    <th className="px-4 py-3">
                                        Total ONT
                                    </th>

                                    <th className="px-4 py-3">
                                        Aset Aktif
                                    </th>

                                    <th className="w-20 px-4 py-3">
                                        Aset Nonaktif
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-b border-gray-300 text-center font-light">
                                    <td className="px-4 py-2">
                                        No
                                    </td>

                                    <td className="px-4 py-2">
                                        Wilayah
                                    </td>

                                    <td className="px-4 py-2">
                                        Total Aset
                                    </td>

                                    <td className="px-4 py23">
                                        Total Tiang
                                    </td>

                                    <td className="px-4 py-2">
                                        Total ONT
                                    </td>

                                    <td className="px-4 py-2">
                                        Aset Aktif
                                    </td>

                                    <td className="px-4 py-2">
                                        Aset Nonaktif
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
