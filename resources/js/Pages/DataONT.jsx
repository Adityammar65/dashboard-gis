{/* Import Main Layout */ }

import MainLayout from "../Layouts/MainLayout";

import { FaPlus, FaFilter, FaEye, FaEdit } from "react-icons/fa";
import { FaTowerBroadcast } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export default function ONT() {
    const dataONT = [
        {
            no: "01",
            foto: "/images/empty.png",
            kode: "ONT-001",
            lokasi: "Aceh",
            petugas: "Lorem Ipsum Dolor",
            status: "Aktif",
        },
        {
            no: "02",
            foto: "/images/empty.png",
            kode: "ONT-002",
            lokasi: "Aceh",
            petugas: "Lorem Ipsum Dolor",
            status: "Nonaktif",
        },
        {
            no: "03",
            foto: "/images/empty.png",
            kode: "ONT-003",
            lokasi: "Aceh",
            petugas: "Lorem Ipsum Dolor",
            status: "Aktif",
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-4 ">

                {/* Header */}

                <div className="flex items-center gap-4">
                    <div className="items-center flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow text-white">
                        <span className="text-sm font-semibold">
                            Data ONT
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light">
                            Wilayah
                        </span>
                    </div>

                    {/* Form ONT */}

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white shadow hover:bg-green-600"
                    >
                        <FaPlus />
                        Form ONT
                    </button>

                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Total ONT */}

                    <div className="hover:scale-102 transition-all duration-200 shadow flex min-h-[136px] flex-col justify-between rounded-xl border-t-4 border-blue-900 bg-white p-4 shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    TOTAL ONT
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold">
                                    999999
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-900 text-white">
                                <FaTowerBroadcast className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Aktif & Nonaktif */}

                    <div className="flex min-h-[136px] flex-col gap-4">
                        <div className="hover:scale-102 transition-all shadow duration-200 flex flex-1 items-center rounded-xl border-t-4 border-emerald-600 bg-white px-4 shadow">
                            <div>
                                <p className="text-xs font-medium">
                                    ONT AKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    999999
                                </h2>
                            </div>
                        </div>

                        <div className="hover:scale-102 duration-200 transition-all shadow flex flex-1 items-center rounded-xl border-t-4 border-red-500 bg-white px-4 shadow">
                            <div>
                                <p className="text-xs font-medium">
                                    ONT NONAKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    999999
                                </h2>
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
                                    Pilih Status
                                </option>
                                <option value="aktif">
                                    Aktif
                                </option>
                                <option value="nonaktif">
                                    Nonaktif
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
                                <tr className="border-b border-gray-300 text-center">
                                    <th className="w-12 px-4 py-3 font-medium">
                                        No
                                    </th>

                                    <th className="w-24 px-4 py-3 font-medium">
                                        Foto
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Nomor ONT
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Lokasi
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Petugas Lapangan
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>

                                    <th className="w-20 px-4 py-3 font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-center">
                                {dataONT.map((ONT) => (
                                    <tr
                                        key={ONT.no}
                                        className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-2">
                                            {ONT.no}
                                        </td>

                                        <td className="px-4 py-2">
                                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={ONT.foto}
                                                    alt="Foto"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </td>

                                        <td className="px-4 py-2">
                                            {ONT.kode}
                                        </td>

                                        <td className="px-4 py-2">
                                            {ONT.lokasi}
                                        </td>

                                        <td className="px-4 py-2">
                                            {ONT.petugas}
                                        </td>

                                        <td className="px-4 py-2">
                                            <span
                                                className={`rounded-full px-2 py-1 text-[10px] text-white ${ONT.status === "Aktif"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                            >
                                                {ONT.status}
                                            </span>
                                        </td>

                                        {/* Aksi */}

                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-1">

                                                {/* Detail */}

                                                <a
                                                    href="detail-ont"
                                                    className="rounded-md bg-blue-500 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-blue-600"
                                                >
                                                    <FaEye className="text-xl" />
                                                </a>

                                                {/* Edit */}

                                                <button
                                                    type="button"
                                                    className="rounded-md bg-yellow-400 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-yellow-500"
                                                >
                                                    <FaEdit className="text-xl" />
                                                </button>

                                                {/* Hapus */}

                                                <button
                                                    type="button"
                                                    className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-red-600"
                                                >
                                                    <MdDelete className="text-xl" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
