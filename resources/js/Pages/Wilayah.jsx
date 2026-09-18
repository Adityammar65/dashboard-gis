{/* Import Main Layout */ }

import MainLayout from "../Layouts/MainLayout";
import { usePage, router } from "@inertiajs/react";
import { useState, useMemo, useCallback } from "react";

import { FaFilter, FaMap, FaPlus } from "react-icons/fa";
import { LuBox } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

export default function Tiang({
    dataWilayah = { data: [], total: 0, links: [] },
    wilayah = [],
    filter = {},
}) {
    const { settings } = usePage().props;

    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home','data-tiang','data-ont','wilayah','peta-sebaran-aset','pengaturan','logout','notifikasi','detail-tiang','detail-ont','detail-notifikasi','edit-tiang','edit-ont','tambah-tiang','tambah-ont','tambah-wilayah','hapus-tiang','hapus-ont','hapus-wilayah'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);
    const resolveHref = useCallback((href) => `${base}/${href}`.replace(/\/+/g, '/'), [base]);

    const [filterWilayah, setFilterWilayah] = useState(filter.wilayah ?? "");
    const [filterAset, setFilterAset] = useState(filter.aset ?? "");

    const listWilayah = useMemo(() => {
        if (Array.isArray(dataWilayah)) return dataWilayah;
        return dataWilayah?.data ?? [];
    }, [dataWilayah]);

    const totalWilayah = useMemo(() => {
        if (typeof dataWilayah?.total === "number") return dataWilayah.total;
        return listWilayah.length;
    }, [dataWilayah, listWilayah]);

    const totalAset = useMemo(() => {
        return listWilayah.reduce((sum, w) => {
            if (filterAset === "tiang") return sum + (w.total_tiang ?? 0);
            if (filterAset === "ont") return sum + (w.total_ont ?? 0);
            return sum + (w.total_aset ?? 0);
        }, 0);
    }, [listWilayah, filterAset]);

    const asetAktif = useMemo(() => {
        if (filterAset === "tiang" || filterAset === "ont") {
        }
        return listWilayah.reduce((sum, w) => sum + (w.aset_aktif ?? 0), 0);
    }, [listWilayah, filterAset]);

    const asetNonaktif = useMemo(() => {
        return listWilayah.reduce((sum, w) => sum + (w.aset_nonaktif ?? 0), 0);
    }, [listWilayah]);

    const namaAsetLabel = useMemo(() => {
        if (filterAset === "tiang") return "Tiang";
        if (filterAset === "ont") return "ONT";
        return "Semua Aset";
    }, [filterAset]);

    const handleFilter = useCallback((wilayahValue, asetValue) => {
        setFilterWilayah(wilayahValue);
        setFilterAset(asetValue);
        router.get(
            window.location.pathname,
            {
                wilayah: wilayahValue,
                aset: asetValue,
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
                    <div className="items-center flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] text-white px-4 py-3 shadow">
                        <span className="text-sm font-semibold">
                            Data Wilayah
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light capitalize">
                            {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>
                    </div>

                    {/* Form Wilayah */}

                    <a
                        href={resolveHref("tambah-wilayah")}
                        className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm text-white shadow hover:bg-green-600"
                    >
                        <FaPlus />
                        Form Wilayah
                    </a>

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
                                    {totalWilayah}
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

                                <p className="text-xs font-light my-1">{namaAsetLabel}</p>

                                <h2 className="mt-1 text-2xl font-semibold">
                                    {totalAset}
                                </h2>

                                <div className="flex items-center gap-2 text-xs font-light mt-1.5">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Aktif {asetAktif}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Nonaktif {asetNonaktif}
                                    </span>
                                </div>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-400 text-white">
                                <LuBox className="text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Filter */}

                    <div className="min-h-[136px] rounded-xl bg-white p-4 shadow capitalize">

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
                                onChange={(e) => handleFilter(e.target.value, filterAset)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-900"
                            >
                                <option value="">
                                    Semua Wilayah
                                </option>
                                {wilayah.map((item) => (
                                    <option key={item.id} value={item.id} className="capitalize">
                                        {item.nama_wilayah}
                                    </option>
                                ))}
                            </select>

                            {/* Aset */}

                            <select
                                value={filterAset}
                                onChange={(e) => handleFilter(filterWilayah, e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-900"
                            >
                                <option value="">
                                    Semua Aset
                                </option>
                                <option value="tiang">
                                    Tiang
                                </option>
                                <option value="ont">
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

                                    <th className="w-20 px-4 py-3">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-center capitalize">
                                {listWilayah.length > 0 ? (
                                    listWilayah.map((row, index) => (
                                        <tr key={row.id ?? row.nama_wilayah ?? index} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50 font-light">
                                            <td className="px-4 py-2">
                                                {String((dataWilayah?.from ? dataWilayah.from + index : index + 1)).padStart(2, "0")}
                                            </td>

                                            <td className="px-4 py-2">
                                                {row.nama_wilayah ?? <span className="text-gray-400">Belum ada data</span>}
                                            </td>

                                            <td className="px-4 py-2">
                                                {row.total_aset ?? 0}
                                            </td>

                                            <td className="px-4 py-2">
                                                {row.total_tiang ?? 0}
                                            </td>

                                            <td className="px-4 py-2">
                                                {row.total_ont ?? 0}
                                            </td>

                                            <td className="px-4 py-2">
                                                <span className="rounded-full bg-green-500 px-2 py-1 text-[10px] text-white">
                                                    {row.aset_aktif ?? 0}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2">
                                                <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] text-white">
                                                    {row.aset_nonaktif ?? 0}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Apakah kamu yakin ingin menghapus wilayah ${row.nama_wilayah}?`
                                                                )
                                                            ) {
                                                                window.location.href = `${base}/hapus-wilayah/${row.id}`.replace(/\/+/g, '/');
                                                            }
                                                        }}
                                                        className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-medium text-white transition hover:bg-red-600"
                                                        title="Hapus Wilayah"
                                                    >
                                                        <MdDelete className="text-xl" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                                    <FaMap className="text-xl text-gray-400" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-500">
                                                    Belum ada data
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Data wilayah belum tersedia atau filter tidak menghasilkan data.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                    {dataWilayah?.links && dataWilayah.links.length > 3 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-4 pb-3">
                            {dataWilayah.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                    className={`px-3 py-1 text-xs rounded ${link.active ? 'bg-[#AB3C3C] text-white' : 'bg-white border'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}
