import MainLayout from "../Layouts/MainLayout";
import { FaMapMarked, FaSave } from "react-icons/fa";

export default function Pengaturan({ wilayah }) {
    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center gap-4">
                    <div className="items-center flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] text-white px-4 py-3 shadow">
                        <span className="text-sm font-semibold">
                            Pengaturan
                        </span>
                    </div>
                </div>

                {/* Wilayah Operasi */}

                <div className="rounded-xl bg-white p-5 shadow-sm">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8EAEA] text-[#AB3C3C]">
                            <FaMapMarked />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">
                                Wilayah Operasi
                            </h2>

                            <p className="text-xs text-gray-500">
                                Tentukan wilayah operasi yang digunakan pada dashboard GIS
                            </p>
                        </div>
                    </div>

                    <form
                        action="/pengaturan/wilayah"
                        method="POST"
                        className="space-y-4"
                    >

                        {/* CSRF */}

                        <input
                            type="hidden"
                            name="_token"
                            value={
                                document
                                    .querySelector('meta[name="csrf-token"]')
                                    ?.getAttribute("content")
                            }
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wilayah
                                </label>

                                <select
                                    name="wilayah"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                    defaultValue=""
                                    disabled={wilayah.length === 0}
                                >
                                    <option value="" disabled>
                                        {wilayah.length === 0
                                            ? "Belum ada data wilayah"
                                            : "Pilih Wilayah"}
                                    </option>

                                    {wilayah.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_wilayah}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* Button */}

                        {wilayah.length > 0 && (
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-lg bg-[#AB3C3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f3030]"
                                >
                                    <FaSave />
                                    Simpan
                                </button>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
