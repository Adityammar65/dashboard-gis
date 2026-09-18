import MainLayout from "../Layouts/MainLayout";

import { usePage, router } from "@inertiajs/react";
import { useState, useMemo, useCallback } from "react";
import { FaPlus, FaFilter, FaEye, FaEdit } from "react-icons/fa";
import { MdDelete, MdRouter } from "react-icons/md";

export default function DataONT({
    dataONT = [],
    wilayah = [],
    filter = {},
}) {
    const { settings } = usePage().props;

    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont', 'hapus-tiang', 'hapus-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);
    const resolveHref = useCallback((href) => `${base}/${href}`.replace(/\/+/g, '/'), [base]);

    const [filterWilayah, setFilterWilayah] = useState(
        filter.wilayah ?? ""
    );

    const [filterStatus, setFilterStatus] = useState(
        filter.status ?? ""
    );

    const listONT = useMemo(() => (Array.isArray(dataONT) ? dataONT : (dataONT?.data ?? [])), [dataONT]);
    const totalONT = useMemo(() => dataONT?.total ?? listONT.length, [dataONT, listONT]);
    const ONTAktif = useMemo(() => listONT.filter((ont) => ont.status?.toLowerCase() === "aktif").length, [listONT]);
    const ONTNonaktif = useMemo(() => listONT.filter((ont) => ont.status?.toLowerCase() === "nonaktif").length, [listONT]);

    const handleFilter = useCallback((wilayahValue, statusValue) => {
        setFilterWilayah(wilayahValue);
        setFilterStatus(statusValue);
        router.get(
            window.location.pathname,
            {
                wilayah: wilayahValue,
                status: statusValue,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }, []);

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center gap-4">

                    <div className="items-center flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow text-white">

                        <span className="text-sm font-semibold">
                            Data ONT
                        </span>

                        <span className="mx-3">
                            /
                        </span>

                        <span className="text-xs font-light capitalize">
                            {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>

                    </div>

                    {/* Form ONT */}

                    <a
                        href={resolveHref("tambah-ont")}
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white shadow hover:bg-green-600"
                    >
                        <FaPlus />
                        Form ONT
                    </a>

                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Total ONT */}

                    <div className="hover:scale-102 transition-all duration-200 flex min-h-[136px] flex-col justify-between rounded-xl border-t-4 border-sky-500 bg-white p-4 shadow">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium">
                                    TOTAL ONT
                                </p>

                                <h2 className="mt-1 text-2xl font-semibold">
                                    {totalONT}
                                </h2>

                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-sky-500 text-white">
                                <MdRouter className="text-2xl" />
                            </div>

                        </div>

                    </div>


                    {/* Aktif & Nonaktif */}

                    <div className="flex min-h-[136px] flex-col gap-4">

                        {/* Aktif */}

                        <div className="hover:scale-102 transition-all shadow duration-200 flex flex-1 items-center rounded-xl border-t-4 border-emerald-600 bg-white px-4">

                            <div>

                                <p className="text-xs font-medium">
                                    ONT AKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    {ONTAktif}
                                </h2>

                            </div>

                        </div>


                        {/* Nonaktif */}

                        <div className="hover:scale-102 duration-200 transition-all shadow flex flex-1 items-center rounded-xl border-t-4 border-red-500 bg-white px-4">

                            <div>

                                <p className="text-xs font-medium">
                                    ONT NONAKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-semibold">
                                    {ONTNonaktif}
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
                                value={filterWilayah}
                                onChange={(e) =>
                                    handleFilter(
                                        e.target.value,
                                        filterStatus
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-900"
                            >

                                <option value="">
                                    Semua Wilayah
                                </option>

                                {wilayah.map((item) => (
                                    <option
                                        className="capitalize"
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nama_wilayah}
                                    </option>
                                ))}

                            </select>


                            {/* Status */}

                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    handleFilter(
                                        filterWilayah,
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-900"
                            >

                                <option value="">
                                    Semua Status
                                </option>

                                <option value="Aktif">
                                    Aktif
                                </option>

                                <option value="Nonaktif">
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

                            {/* Header Tabel */}

                            <thead>

                                <tr className="border-b border-gray-300 text-center">

                                    <th className="w-12 px-4 py-3 font-medium">
                                        No
                                    </th>

                                    <th className="w-24 px-4 py-3 font-medium">
                                        Foto
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Kode ONT
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Area
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


                            {/* Body Tabel */}

                            <tbody className="text-center capitalize">

                                {listONT.length > 0 ? (

                                    listONT.map((ont, index) => (

                                        <tr
                                            key={ont.id}
                                            className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50"
                                        >

                                            {/* No */}

                                            <td className="px-4 py-2">
                                                {String(index + 1).padStart(2, "0")}
                                            </td>


                                            {/* Foto */}

                                            <td className="px-4 py-2">

                                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                                                    {ont.foto_ont_1 ? (

                                                        <img
                                                            src={`${base}/public/storage/${ont.foto_ont_1}`.replace(/\/+/g, '/')}
                                                            alt={`Foto ${ont.kode_ont}`}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                            decoding="async"
                                                            width="64"
                                                            height="64"
                                                        />

                                                    ) : (

                                                        <span className="text-[10px] text-gray-400">
                                                            Belum ada foto
                                                        </span>

                                                    )}

                                                </div>

                                            </td>


                                            {/* Kode ONT */}

                                            <td className="px-4 py-2">

                                                {ont.kode_ont || (

                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>

                                                )}

                                            </td>


                                            {/* Area */}

                                            <td className="px-4 py-2">

                                                {ont.wilayah || ont.area ? (

                                                    <>
                                                        {ont.wilayah}

                                                        {ont.area &&
                                                            ` - ${ont.area}`}
                                                    </>

                                                ) : (

                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>

                                                )}

                                            </td>

                                            {/* Petugas */}

                                            <td className="px-4 py-2">

                                                {ont.nama_petugas || (

                                                    <span className="text-gray-400">
                                                        Belum ada data
                                                    </span>

                                                )}

                                            </td>


                                            {/* Status */}

                                            <td className="px-4 py-2">

                                                {ont.status ? (

                                                    <span
                                                        className={`rounded-full px-2 py-1 text-[10px] text-white ${ont.status.toLowerCase() ===
                                                            "aktif"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                            }`}
                                                    >
                                                        {ont.status}
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
                                                        href={resolveHref(`detail-ont/${ont.id}`)}
                                                        className="rounded-md bg-blue-500 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-blue-600"
                                                    >
                                                        <FaEye className="text-xl" />
                                                    </a>


                                                    {/* Edit */}

                                                    <a
                                                        href={resolveHref(`edit-ont/${ont.id}`)}
                                                        className="rounded-md bg-yellow-400 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-yellow-500"
                                                    >
                                                        <FaEdit className="text-xl" />
                                                    </a>


                                                    {/* Hapus - modular, base-aware, uses DELETE like Notifikasi */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Apakah kamu yakin ingin menghapus data ont ${ont.kode_ont}?`
                                                                )
                                                            ) {
                                                                router.delete(`${base}/hapus-ont/${ont.id}`.replace(/\/+/g, '/'));
                                                            }
                                                        }}
                                                        className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-red-600"
                                                        title="Hapus Data"
                                                    >
                                                        <MdDelete className="text-xl" />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    /* Placeholder ketika tidak ada data */

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="px-4 py-12 text-center"
                                        >

                                            <div className="flex flex-col items-center justify-center gap-2">

                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                                    <MdRouter className="text-xl text-gray-400" />
                                                </div>

                                                <p className="text-sm font-medium text-gray-500">
                                                    Belum ada data
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    Data ont belum tersedia.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>
                    {dataONT?.links && dataONT.links.length > 3 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-4">
                            {dataONT.links.map((link, i) => (
                                <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })} className={`px-3 py-1 text-xs rounded ${link.active ? 'bg-[#AB3C3C] text-white' : 'bg-white border'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}
