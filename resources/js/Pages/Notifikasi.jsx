
import MainLayout from "../Layouts/MainLayout";

export default function Notifikasi({ notifikasi = [] }) {
    // Statistik
    const totalNotifikasi = notifikasi.length;

    const belumDibaca = notifikasi.filter(
        (item) => item.status === "belum_dibaca"
    ).length;

    const sudahDibaca = notifikasi.filter(
        (item) => item.status === "dibaca"
    ).length;

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
                            {totalNotifikasi}
                        </h2>
                    </div>

                    {/* Belum Dibaca */}
                    <div className="rounded-xl border-t-4 border-red-500 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            BELUM DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            {belumDibaca}
                        </h2>
                    </div>

                    {/* Sudah Dibaca */}
                    <div className="rounded-xl border-t-4 border-green-600 bg-white p-4 shadow">
                        <p className="text-xs font-medium text-gray-500">
                            SUDAH DIBACA
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            {sudahDibaca}
                        </h2>
                    </div>
                </div>

                {/* Daftar Notifikasi */}
                <div className="rounded-xl bg-white shadow">

                    {/* Header Daftar */}
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

                    {/* Data Notifikasi */}
                    {notifikasi.length > 0 ? (
                        notifikasi.map((item) => {

                            const belumDibaca =
                                item.status === "belum_dibaca";

                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-4 border-b px-5 py-4 ${
                                        belumDibaca
                                            ? "bg-red-50/40"
                                            : ""
                                    }`}
                                >

                                    {/* Icon */}
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-full ${
                                            belumDibaca
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                    >
                                        {belumDibaca ? "⚠" : "✓"}
                                    </div>

                                    {/* Isi */}
                                    <div className="flex-1">

                                        <p className="text-sm font-medium">
                                            {item.jenis}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.kategori}
                                        </p>

                                        <p className="mt-1 text-[10px] text-gray-400">
                                            {item.created_at
                                                ? new Date(
                                                      item.created_at
                                                  ).toLocaleString(
                                                      "id-ID",
                                                      {
                                                          dateStyle: "medium",
                                                          timeStyle: "short",
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* Status belum dibaca */}
                                    {belumDibaca && (
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <p className="text-sm text-gray-500">
                                Belum ada notifikasi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
