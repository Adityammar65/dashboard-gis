import MainLayout from "../Layouts/MainLayout";
import { FaMapMarked } from "react-icons/fa";

export default function Pengaturan() {
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Dropdown Wilayah */}

                        <div>
                            <select
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#AB3C3C] focus:ring-1 focus:ring-[#AB3C3C]"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Pilih Wilayah
                                </option>
                                <option value="jawa-tengah">
                                    Yogyakarta
                                </option>
                                <option value="jawa-barat">
                                    Sleman
                                </option>
                                <option value="jawa-timur">
                                    Bantul
                                </option>
                                <option value="">
                                    Gunungkidul
                                </option>
                                <option value="">
                                    Kulon Progo
                                </option>
                                <option value="">
                                    Jepara
                                </option>
                                <option value="">
                                    Sukoharjo
                                </option>
                                <option value="">
                                    Magelang
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
