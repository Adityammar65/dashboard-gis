import MainLayout from "../../Layouts/MainLayout";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function FormEditTiang({ tiang }) {
    return (
        <MainLayout>
            <div className="p-6">

                {/* Header */}

                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 transition"
                        >
                            <FaArrowLeft size={14} />
                            Kembali
                        </button>

                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">
                                Form Edit ONT
                            </h1>

                            <p className="text-sm text-gray-500">
                                Ubah informasi data ONT
                            </p>
                        </div>

                    </div>
                </div>

                {/* Form */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    <form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Nomor ONT */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor ONT
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.kode_tiang ?? ""}
                                    placeholder="Masukkan nomor tiang"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Wilayah */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wilayah
                                </label>

                                <select
                                    defaultValue={tiang?.wilayah ?? ""}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                >
                                    <option value="" disabled>
                                        Pilih Wilayah
                                    </option>

                                    <option value="aceh">
                                        Aceh
                                    </option>

                                    <option value="sumatera-utara">
                                        Sumatera Utara
                                    </option>

                                    <option value="sumatera-barat">
                                        Sumatera Barat
                                    </option>

                                    <option value="riau">
                                        Riau
                                    </option>

                                    <option value="jawa-barat">
                                        Jawa Barat
                                    </option>

                                    <option value="jawa-tengah">
                                        Jawa Tengah
                                    </option>

                                    <option value="jawa-timur">
                                        Jawa Timur
                                    </option>
                                </select>
                            </div>

                            {/* Lokasi */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lokasi
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.lokasi ?? ""}
                                    placeholder="Masukkan lokasi tiang"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Petugas Lapangan */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Petugas Lapangan
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.petugas_lapangan ?? ""}
                                    placeholder="Masukkan nama petugas"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Status */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    defaultValue={tiang?.status ?? ""}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
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

                            {/* Foto */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto ONT
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                            </div>

                            {/* Latitude */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.latitude ?? ""}
                                    placeholder="Contoh: -7.7956"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Longitude */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude
                                </label>

                                <input
                                    type="text"
                                    defaultValue={tiang?.longitude ?? ""}
                                    placeholder="Contoh: 110.3695"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                        </div>

                        {/* Deskripsi */}

                        <div className="mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>

                            <textarea
                                rows="4"
                                defaultValue={tiang?.deskripsi ?? ""}
                                placeholder="Masukkan deskripsi..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                            ></textarea>
                        </div>

                        {/* Submit */}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00c853] text-white hover:bg-[#00b34a] transition"
                            >
                                <FaSave size={14} />
                                Simpan Perubahan
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
