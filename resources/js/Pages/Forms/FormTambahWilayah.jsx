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
                                Form Tambah Wilayah
                            </h1>

                            <p className="text-sm text-gray-500">
                                Tambahkan data wilayah baru
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition capitalize"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                        </div>

                        {/* Submit */}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00c853] text-white hover:bg-[#00b34a] transition"
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
