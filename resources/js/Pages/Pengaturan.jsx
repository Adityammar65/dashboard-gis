import MainLayout from "../Layouts/MainLayout";
import { FaMapMarked, FaSave, FaInfoCircle, FaTerminal } from "react-icons/fa";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Pengaturan({ wilayah }) {
    const { props } = usePage();
    const { settings } = props;
    const [selectedWilayah, setSelectedWilayah] = useState("");

    const handleSimpan = () => {
        if (!selectedWilayah) {
            return;
        }

        router.post("update-pengaturan", {
            wilayah: selectedWilayah,
        });
    };

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center gap-4">
                    <div className="flex flex-1 items-center rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 text-white shadow">
                        <span className="text-sm font-semibold">
                            Pengaturan
                        </span>
                    </div>
                </div>

                {/* Panduan Pengaturan Awal */}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                            <FaInfoCircle />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">
                                Panduan Pengaturan Wilayah – Pertama Kali
                            </h2>
                            <p className="text-xs text-gray-600">
                                Jalankan perintah berikut untuk mengatur wilayah operasi
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <FaTerminal className="text-amber-600" />
                            <h3 className="text-sm font-semibold text-gray-800">
                                Via CLI
                            </h3>
                        </div>
                        <p className="mb-2 text-xs text-gray-600">
                            Buat pengaturan default dengan perintah artisan:
                        </p>
                        <code className="block rounded-md bg-gray-900 px-3 py-2 text-xs font-mono text-green-400">
                            php artisan settings:generate
                        </code>
                        <p className="mt-2 text-[11px] text-gray-500">
                            Membuat <span className="font-mono">storage/app/settings.json</span> dengan wilayah default{" "}
                            <span className="font-semibold">yogyakarta (YOG)</span>. Jika file sudah ada akan muncul{" "}
                            <span className="font-mono">settings.json sudah ada.</span>
                        </p>
                        <p className="mt-2 text-[11px] text-gray-500">Langkah tambahan bagi pengguna linux:</p>
                        <code className="mt-2 block rounded-md bg-gray-900 px-3 py-2 text-xs font-mono text-green-400">
                            cd storage/app
                            <br />
                            chmod 775 settings.json
                            <br />
                            chown $USER:daemon settings.json
                        </code>
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

                    {/* Ubah Wilayah */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Wilayah Saat Ini */}

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="mb-1 text-sm text-gray-500">
                                Wilayah Saat Ini
                            </p>

                            <p className="text-base font-semibold capitalize text-gray-800">
                                {settings?.nama_wilayah ?? "Belum ditentukan"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Kode: {settings?.kode_wilayah ?? "-"}
                            </p>
                        </div>

                        {/* Pilih Wilayah Baru */}

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <label
                                htmlFor="wilayah"
                                className="mb-1 block text-sm text-gray-500"
                            >
                                Pilih Wilayah Baru
                            </label>

                            <select
                                id="wilayah"
                                value={selectedWilayah}
                                onChange={(e) =>
                                    setSelectedWilayah(e.target.value)
                                }
                                className="capitalize w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-red-700 focus:ring-1 focus:ring-red-700"
                                disabled={wilayah.length === 0}
                            >
                                {wilayah.length === 0 ? (
                                    <option value="">
                                        Belum ada data wilayah
                                    </option>
                                ) : (
                                    <>
                                        <option value="">
                                            Pilih wilayah
                                        </option>

                                        {wilayah.map((item) => (
                                            <option
                                                className="capitalize"
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.nama_wilayah}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                    </div>

                    {/* Tombol Simpan */}

                    <div className="mt-5 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSimpan}
                            disabled={!selectedWilayah}
                            className="flex items-center gap-2 rounded-lg bg-[#AB3C3C] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f3030] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FaSave />
                            Simpan
                        </button>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
