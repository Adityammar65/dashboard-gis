import MainLayout from "../../Layouts/MainLayout";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function FormEditONT({ ont, wilayah }) {
    const getFotoUrl = (foto) => {
        if (!foto) return null;

        return `../public/storage/${foto}`;
    };

    const [form, setForm] = useState({
        kode_ont: ont?.kode_ont ?? "",
        wilayah: ont?.wilayah ?? "",
        area: ont?.area ?? "",
        deskripsi_ont: ont?.deskripsi_ont ?? "",
        foto_ont_1: null,
        foto_ont_2: null,
        foto_ont_3: null,
        latitude: ont?.latitude ?? "",
        longitude: ont?.longitude ?? "",
        nama_petugas: ont?.nama_petugas ?? "",
        status: ont?.status?.toLowerCase() ?? "",
    });

    const [preview, setPreview] = useState({
        foto_ont_1: getFotoUrl(ont?.foto_ont_1),
        foto_ont_2: getFotoUrl(ont?.foto_ont_2),
        foto_ont_3: getFotoUrl(ont?.foto_ont_3),
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files[0]) {
            setForm((prev) => ({
                ...prev,
                [name]: files[0],
            }));

            setPreview((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(files[0]),
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(
            `../update-ont/${ont.id}`,
            form,
            {
                forceFormData: true,

                onSuccess: () => {
                    console.log("Data ONT berhasil diperbarui.");
                },

                onError: (errors) => {
                    console.log(errors);
                    const raw = errors?.error || Object.values(errors || {})[0];
                    const msg = Array.isArray(raw) ? raw[0] : raw;
                    const display = msg || "Gagal memperbarui ONT. Periksa kembali isian form.";
                    window.dispatchEvent(new CustomEvent("layout:error", { detail: display }));
                },
            }
        );
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
                                Form Edit ONT
                            </h1>

                            <p className="text-sm text-gray-500">
                                Edit data ONT
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
                                    placeholder="Masukkan kode ONT"
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
                                        Pilih Wilayah
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
                                    placeholder="Masukkan area ONT"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Petugas */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Petugas Lapangan
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

                            {/* Latitude */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude
                                </label>

                                <input
                                    name="latitude"
                                    type="text"
                                    value={form.latitude}
                                    onChange={handleChange}
                                    placeholder="Contoh: -7.7956"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Longitude */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude
                                </label>

                                <input
                                    name="longitude"
                                    type="text"
                                    value={form.longitude}
                                    onChange={handleChange}
                                    placeholder="Contoh: 110.3695"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition"
                                />
                            </div>

                            {/* Foto ONT */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto ONT
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* Foto 1 */}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">
                                            Foto 1
                                        </label>

                                        <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                            {preview.foto_ont_1 ? (
                                                <img
                                                    src={preview.foto_ont_1}
                                                    alt="Foto ONT 1"
                                                    className="h-40 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-40 items-center justify-center">
                                                    <span className="text-xs text-gray-400">
                                                        Belum ada foto
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            name="foto_ont_1"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                    </div>

                                    {/* Foto 2 */}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">
                                            Foto 2
                                        </label>

                                        <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                            {preview.foto_ont_2 ? (
                                                <img
                                                    src={preview.foto_ont_2}
                                                    alt="Foto ONT 2"
                                                    className="h-40 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-40 items-center justify-center">
                                                    <span className="text-xs text-gray-400">
                                                        Belum ada foto
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            name="foto_ont_2"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                    </div>

                                    {/* Foto 3 */}

                                    <div>
                                        <label className="block text-xs text-gray-500 mb-2">
                                            Foto 3
                                        </label>

                                        <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                            {preview.foto_ont_3 ? (
                                                <img
                                                    src={preview.foto_ont_3}
                                                    alt="Foto ONT 3"
                                                    className="h-40 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-40 items-center justify-center">
                                                    <span className="text-xs text-gray-400">
                                                        Belum ada foto
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            name="foto_ont_3"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}

                        <div className="mt-5">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>

                            <textarea
                                name="deskripsi_ont"
                                value={form.deskripsi_ont}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Masukkan deskripsi..."
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
                                Simpan Perubahan
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
