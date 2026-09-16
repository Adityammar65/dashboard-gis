import MainLayout from "../Layouts/MainLayout";

import { FaPlus, FaFilter, FaEye, FaEdit, FaWifi } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function Tiang({ dataTiang = [] }) {
    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center gap-4">
                    <div className="items-center flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] text-white px-4 py-3 shadow">
                        <span className="text-sm font-semibold">
                            Data Tiang
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light">
                            Wilayah
                        </span>
                    </div>

                    <a
                        href="tambah-tiang"
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white shadow hover:bg-green-600"
                    >
                        <FaPlus />
                        Form Tiang
                    </a>
                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Total Tiang */}

                    <div className="hover:scale-102 transition-all duration-200 flex min-h-[136px] flex-col justify-between rounded-xl border-t-4 border-blue-900 bg-white p-4 shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium">
                                    TOTAL TIANG
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold">
                                    {dataTiang.length}
                                </h2>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-900 text-white">
                                <FaWifi className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Aktif & Nonaktif */}

                    <div className="flex min-h-[136px] flex-col gap-4">
                        <div className="hover:scale-102 transition-all shadow duration-200 flex flex-1 items-center rounded-xl border-t-4 border-emerald-600 bg-white px-4">
                            <div>
                                <p className="text-xs font-medium">
                                    TIANG AKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    {
                                        dataTiang.filter(
                                            (tiang) =>
                                                tiang.status?.toLowerCase() ===
                                                "aktif"
                                        ).length
                                    }
                                </h2>
                            </div>
                        </div>

                        <div className="hover:scale-102 duration-200 transition-all shadow flex flex-1 items-center rounded-xl border-t-4 border-red-500 bg-white px-4">
                            <div>
                                <p className="text-xs font-medium">
                                    TIANG NONAKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    {
                                        dataTiang.filter(
                                            (tiang) =>
                                                tiang.status?.toLowerCase() ===
                                                "nonaktif"
                                        ).length
                                    }
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
                                        Nomor Tiang
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

                                {dataTiang.length > 0 ? (

                                    dataTiang.map((tiang, index) => (

                                        <tr
                                            key={tiang.id}
                                            className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50"
                                        >

                                            {/* No */}

                                            <td className="px-4 py-2">
                                                {String(index + 1).padStart(2, "0")}
                                            </td>

                                            {/* Foto */}

                                            <td className="px-4 py-2">
                                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                                                    {tiang.foto_tiang_1 ? (
                                                        <img
                                                            src={`/storage/${tiang.foto_tiang_1}`}
                                                            alt={`Foto ${tiang.kode_tiang}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400">
                                                            Belum ada foto
                                                        </span>
                                                    )}

                                                </div>
                                            </td>

                                            {/* Nomor Tiang */}

                                            <td className="px-4 py-2">
                                                {tiang.kode_tiang || (
                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>
                                                )}
                                            </td>

                                            {/* Lokasi */}

                                            <td className="px-4 py-2">
                                                {tiang.wilayah || tiang.area ? (
                                                    <>
                                                        {tiang.wilayah}
                                                        {tiang.area && ` - ${tiang.area}`}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>
                                                )}
                                            </td>

                                            {/* Petugas */}

                                            <td className="px-4 py-2">
                                                {tiang.petugas || (
                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}

                                            <td className="px-4 py-2">

                                                {tiang.status ? (
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-[10px] text-white ${tiang.status.toLowerCase() ===
                                                                "aktif"
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                            }`}
                                                    >
                                                        {tiang.status}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>
                                                )}

                                            </td>

                                            {/* Aksi */}

                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-1">

                                                    {/* Detail */}

                                                    <a
                                                        href={`detail-tiang/${tiang.id}`}
                                                        className="rounded-md bg-blue-500 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-blue-600"
                                                    >
                                                        <FaEye className="text-xl" />
                                                    </a>

                                                    {/* Edit */}

                                                    <a
                                                        href={`edit-tiang/${tiang.id}`}
                                                        className="rounded-md bg-yellow-400 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-yellow-500"
                                                    >
                                                        <FaEdit className="text-xl" />
                                                    </a>

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

                                    ))

                                ) : (

                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                                    <FaWifi className="text-xl text-gray-400" />
                                                </div>

                                                <p className="text-sm font-medium text-gray-500">
                                                    Belum ada data
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    Data tiang belum tersedia.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
