import MainLayout from "../Layouts/MainLayout";

import { usePage, router } from "@inertiajs/react";
import { useState, useMemo, useCallback, useEffect } from "react";
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

    const selectedWilayahLabel = useMemo(() => {
        if (!filterWilayah) return "Semua Wilayah";
        const found = wilayah.find((item) => String(item.id) === String(filterWilayah));
        return found ? found.nama_wilayah : "Semua Wilayah";
    }, [filterWilayah, wilayah]);

    useEffect(() => {
        if ((filter.wilayah ?? "") !== filterWilayah) {
            setFilterWilayah(filter.wilayah ?? "");
        }
    }, [filter.wilayah]);

    useEffect(() => {
        if ((filter.status ?? "") !== filterStatus) {
            setFilterStatus(filter.status ?? "");
        }
    }, [filter.status]);

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

                    <div className="items-center flex-1 rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 shadow-md border border-white/10 text-white">

                        <span className="text-sm font-semibold tracking-wide">
                            Data ONT
                        </span>

                        <span className="mx-3 opacity-60">
                            /
                        </span>

                        <span className="text-xs font-light capitalize opacity-90">
                            {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>

                    </div>

                    {/* Form ONT */}

                    <a
                        href={resolveHref("tambah-ont")}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:shadow-lg hover:from-green-600 hover:to-emerald-700 active:scale-[0.98]"
                    >
                        <FaPlus />
                        Form ONT
                    </a>

                </div>

                {/* Statistik */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Total ONT */}

                    <div className="hover:scale-[1.02] transition-all duration-200 flex min-h-[136px] flex-col justify-between rounded-2xl border border-gray-100 border-t-[3px] border-t-sky-500 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 will-change-transform">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-xs font-medium">
                                    TOTAL ONT
                                </p>

                                <p className="text-sm font-light capitalize text-gray-500 mt-1 truncate">
                                    {selectedWilayahLabel}
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

                        <div className="hover:scale-[1.02] transition-all shadow-sm duration-200 flex flex-1 items-center rounded-2xl border border-gray-100 border-t-[3px] border-t-emerald-600 bg-white px-5 hover:shadow-md hover:-translate-y-0.5 will-change-transform">

                            <div>

                                <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                                    ONT AKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-gray-800">
                                    {ONTAktif}
                                </h2>

                            </div>

                        </div>


                        {/* Nonaktif */}

                        <div className="hover:scale-[1.02] duration-200 transition-all shadow-sm flex flex-1 items-center rounded-2xl border border-gray-100 border-t-[3px] border-t-red-500 bg-white px-5 hover:shadow-md hover:-translate-y-0.5 will-change-transform">

                            <div>

                                <p className="text-[11px] font-semibold tracking-widest text-gray-500">
                                    ONT NONAKTIF
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-gray-800">
                                    {ONTNonaktif}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* Filter */}

                    <div className="min-h-[136px] rounded-2xl bg-white p-5 shadow-sm border border-gray-100">

                        <div className="mb-4 flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 ring-1 ring-gray-200"><FaFilter className="text-gray-600 text-xs" /></span>

                            <span className="text-[11px] font-semibold tracking-widest text-gray-600">
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
                                className="capitalize w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium outline-none focus:border-[#6F2424] focus:ring-2 focus:ring-[#AB3C3C]/10 transition"
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
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium outline-none focus:border-[#6F2424] focus:ring-2 focus:ring-[#AB3C3C]/10 transition"
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

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[700px] border-collapse text-xs">

                            {/* Header Tabel */}

                            <thead>

                                <tr className="bg-gray-50/70 border-b border-gray-200 text-center">

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

                            <tbody className="text-center capitalize divide-y divide-gray-100">

                                {listONT.length > 0 ? (

                                    listONT.map((ont, index) => (

                                        <tr
                                            key={ont.id}
                                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors"
                                        >

                                            {/* No */}

                                            <td className="px-4 py-2">
                                                {String(index + 1).padStart(2, "0")}
                                            </td>


                                            {/* Foto */}

                                            <td className="px-4 py-2.5">

                                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200 shadow-sm">

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

                                            <td className="px-4 py-2.5">

                                                {ont.status ? (

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/20 ${ont.status.toLowerCase() ===
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

                                            <td className="px-4 py-2.5">

                                                <div className="flex items-center gap-1.5">

                                                    {/* Detail */}

                                                    <a
                                                        href={resolveHref(`detail-ont/${ont.id}`)}
                                                        className="rounded-lg bg-blue-500 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-blue-600 hover:shadow"
                                                    >
                                                        <FaEye className="text-[16px]" />
                                                    </a>


                                                    {/* Edit */}

                                                    <a
                                                        href={resolveHref(`edit-ont/${ont.id}`)}
                                                        className="rounded-lg bg-amber-400 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-amber-500 hover:shadow"
                                                    >
                                                        <FaEdit className="text-[16px]" />
                                                    </a>


                                                    {/* Hapus */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Apakah kamu yakin ingin menghapus data ont ${ont.kode_ont}?`
                                                                )
                                                            ) {
                                                                window.location.href = `${base}/hapus-ont/${ont.id}`.replace(/\/+/g, '/');
                                                            }
                                                        }}
                                                        className="rounded-lg bg-red-500 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-red-600 hover:shadow"
                                                        title="Hapus Data"
                                                    >
                                                        <MdDelete className="text-[16px]" />
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
                        <div className="flex flex-wrap gap-1.5 justify-center mt-4 pb-3">
                            {dataONT.links.map((link, i) => (
                                <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })} className={`px-3 py-1.5 text-xs font-medium rounded-full shadow-sm ring-1 transition ${link.active ? 'bg-[#AB3C3C] text-white ring-[#AB3C3C]' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}
