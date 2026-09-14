import MainLayout from "../Layouts/MainLayout";
import { Link } from "@inertiajs/react";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function FormEditTiang({ tiang }) {
    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header / Breadcrumb */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow text-white">
                        <span className="text-sm font-semibold">
                            Data Tiang
                        </span>

                        <span className="mx-3">/</span>

                        <span className="text-xs font-light">
                            Edit Tiang
                        </span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-xl bg-white shadow">

                    {/* Card Header */}
                    <div className="border-b px-6 py-4">
                        <h2 className="text-base font-semibold text-gray-800">
                            Edit Data Tiang
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Silakan ubah informasi data tiang yang diperlukan.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-5">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Kode Tiang */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Kode Tiang
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.kode_tiang ?? ""}
                                    placeholder="Masukkan kode tiang"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#992e2e] focus:ring-1 focus:ring-[#992e2e]"
                                />
                            </div>

                            {/* Nama Tiang */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nama Tiang
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.nama_tiang ?? ""}
                                    placeholder="Masukkan nama tiang"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#992e2e] focus:ring-1 focus:ring-[#992e2e]"
                                />
                            </div>

                            {/* Latitude */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.latitude ?? ""}
                                    placeholder="Contoh: -7.7956"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#992e2e] focus:ring-1 focus:ring-[#992e2e]"
                                />
                            </div>

                            {/* Longitude */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.longitude ?? ""}
                                    placeholder="Contoh: 110.3695"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#992e2e] focus:ring-1 focus:ring-[#992e2e]"
                                />
                            </div>

                            {/* Wilayah */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Wilayah
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.wilayah ?? ""}
                                    placeholder="Masukkan wilayah"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#992e2e] focus:ring-1 focus:ring-[#992e2e]"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <select
                                    defaultValue={tiang?.status ?? ""}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#992e2e] focus:ring-1 focus:ring-[#992e2e]"
                                >
                                    <option value="">
                                        Pilih Status
                                    </option>

                                    <option value="Aktif">
                                        Aktif
                                    </option>

                                    <option value="Tidak Aktif">
                                        Tidak Aktif
                                    </option>
                                </select>
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3 border-t pt-5">

                            <Link
                                href={route("gis.tiang.index")}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                            >
                                <FaArrowLeft />
                                Batal
                            </Link>

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg bg-[#992e2e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7f2525]"
                            >
                                <FaSave />
                                Simpan Perubahan
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}