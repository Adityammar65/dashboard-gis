import MainLayout from "../../Layouts/MainLayout";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function FormTambahWilayah() {
    const [form, setForm] = useState({
        nama_wilayah: "",
        kode_wilayah: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post("simpan-wilayah", form, {
            onError: (errors) => {
                console.log(errors);
                const raw = errors?.error || Object.values(errors || {})[0];
                const msg = Array.isArray(raw) ? raw[0] : raw;
                const display = msg || "Gagal menyimpan wilayah. Periksa kembali isian form.";
                window.dispatchEvent(new CustomEvent("layout:error", { detail: display }));
            },
        });
    };

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Kepala */}

                <div className="flex items-center justify-between mb-5 max-md:flex-col max-md:items-start max-md:gap-3">
                    <div className="flex items-center gap-3 max-md:flex-wrap">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition"
                        >
                            <FaArrowLeft size={14} />
                            Kembali
                        </button>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight max-md:text-lg">
                                Form Tambah Wilayah
                            </h1>

                            <p className="text-sm text-gray-500">
                                Tambahkan data wilayah baru
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulir */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-7 max-md:p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Nama Wilayah */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Wilayah
                                </label>

                                <input
                                    name="nama_wilayah"
                                    type="text"
                                    value={form.nama_wilayah}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama wilayah"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 capitalize"
                                />
                            </div>

                            {/* Kode Wilayah */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Wilayah
                                </label>

                                <input
                                    name="kode_wilayah"
                                    type="text"
                                    value={form.kode_wilayah}
                                    onChange={handleChange}
                                    placeholder="Masukkan kode wilayah"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                        </div>

                        {/* Simpan */}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 max-md:flex-col-reverse max-md:items-stretch">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition max-md:w-full max-md:justify-center"
                            >
                                <FaSave size={14} />
                                Simpan Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
