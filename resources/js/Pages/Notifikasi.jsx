import MainLayout from "../Layouts/MainLayout";

export default function Notifikasi() {
    return (
        <MainLayout>

            <div className="space-y-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow text-white">
                        <span className="text-sm font-semibold">
                            Notifikasi
                        </span>
                    </div>
                </div>


                {/* Statistik */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                    {/* Total */}
                    <div className="rounded-xl border-t-4 border-blue-600 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            TOTAL NOTIFIKASI
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            12
                        </h2>
                    </div>


                    {/* Belum Dibaca */}
                    <div className="rounded-xl border-t-4 border-red-500 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            BELUM DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            3
                        </h2>
                    </div>


                    {/* Sudah Dibaca */}
                    <div className="rounded-xl border-t-4 border-green-600 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            SUDAH DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            9
                        </h2>
                    </div>

                </div>


                {/* Daftar Notifikasi */}
                <div className="rounded-xl bg-white shadow">

                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold">
                                Notifikasi Terbaru
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Informasi terbaru dari sistem GIS
                            </p>
                        </div>

                        <button className="text-xs text-[#992e2e] hover:underline">
                            Tandai semua dibaca
                        </button>
                    </div>


                    {/* Notifikasi 1 */}
                    <div className="flex items-center gap-4 border-b px-5 py-4 bg-red-50/40">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
                            ⚠
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                Data Tiang Perlu Diperiksa
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Terdapat data tiang yang perlu diperiksa.
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                                5 menit yang lalu
                            </p>
                        </div>

                        <span className="h-2 w-2 rounded-full bg-red-500" />

                    </div>


                    {/* Notifikasi 2 */}
                    <div className="flex items-center gap-4 border-b px-5 py-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            ℹ
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                Data ONT Baru
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Data ONT baru telah ditambahkan ke sistem.
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                                30 menit yang lalu
                            </p>
                        </div>

                    </div>


                    {/* Notifikasi 3 */}
                    <div className="flex items-center gap-4 px-5 py-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                            ✓
                        </div>

                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                Data Berhasil Diperbarui
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Data wilayah berhasil diperbarui.
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                                1 jam yang lalu
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}