import MainLayout from "../../Layouts/MainLayout";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function FormTambahONT({ wilayah }) {
    const [form, setForm] = useState({
        kode_ont: "",
        wilayah: "",
        area: "",
        deskripsi_ont: "",
        foto_ont_1: null,
        foto_ont_2: null,
        foto_ont_3: null,
        latitude: "",
        longitude: "",
        nama_petugas: "",
        status: "",
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post("simpan-ont", form, {
            forceFormData: true,

            onError: (errors) => {
                console.log(errors);
                const raw = errors?.error || Object.values(errors || {})[0];
                const msg = Array.isArray(raw) ? raw[0] : raw;
                const display = msg || "Gagal menyimpan ONT. Periksa kembali isian form.";
                window.dispatchEvent(new CustomEvent("layout:error", { detail: display }));
            },
        });
    };

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition"
                        >
                            <FaArrowLeft size={14} />
                            Kembali
                        </button>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                                Form Tambah ONT
                            </h1>

                            <p className="text-sm text-gray-500">
                                Tambahkan data ont baru
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-7">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Kode ONT */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode ONT
                                </label>

                                <input
                                    name="kode_ont"
                                    type="text"
                                    value={form.kode_ont}
                                    onChange={handleChange}
                                    placeholder="Masukkan kode ont"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            {/* Wilayah */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wilayah
                                </label>

                                <select
                                    name="wilayah"
                                    value={form.wilayah}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                >
                                    <option value="" disabled>
                                        {wilayah?.length === 0
                                            ? "Belum ada data wilayah"
                                            : "Pilih Wilayah"}
                                    </option>

                                    {wilayah?.map((item) => (
                                        <option
                                            className="capitalize"
                                            key={item.id}
                                            value={item.nama_wilayah}
                                        >
                                            {item.nama_wilayah}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Area */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Area
                                </label>

                                <input
                                    name="area"
                                    type="text"
                                    value={form.area}
                                    onChange={handleChange}
                                    placeholder="Masukkan area ont"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            {/* Nama Petugas */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Petugas
                                </label>

                                <input
                                    name="nama_petugas"
                                    type="text"
                                    value={form.nama_petugas}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama petugas"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            {/* Status */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
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

                            {/* Koordinat */}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Latitude
                                    </label>

                                    <input
                                        type="text"
                                        name="latitude"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="Masukkan latitude"
                                        required
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Longitude
                                    </label>

                                    <input
                                        type="text"
                                        name="longitude"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="Masukkan longitude"
                                        required
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Foto ONT */}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto ONT
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* Foto 1 */}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Foto 1
                                        </label>

                                        <input
                                            name="foto_ont_1"
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 2 */}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Foto 2
                                        </label>

                                        <input
                                            name="foto_ont_2"
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 3 */}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                            Foto 3
                                        </label>

                                        <input
                                            name="foto_ont_3"
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}

                        <div className="mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi ONT
                            </label>

                            <textarea
                                name="deskripsi_ont"
                                value={form.deskripsi_ont}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Masukkan deskripsi ont..."
                                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none resize-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                            />
                        </div>

                        {/* Submit */}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition"
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

