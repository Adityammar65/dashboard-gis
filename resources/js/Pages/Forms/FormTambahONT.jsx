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
                                Form Tambah ONT
                            </h1>

                            <p className="text-sm text-gray-500">
                                Tambahkan data ont baru
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                >
                                    <option value="" disabled>
                                        {wilayah?.length === 0
                                            ? "Belum ada data wilayah"
                                            : "Pilih Wilayah"}
                                    </option>

                                    {wilayah?.map((item) => (
                                        <option
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
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
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
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
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                            />
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

