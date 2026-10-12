/* Kartu Mobile */

export default function KartuDataSeluler({
    judul,
    subjudul,
    sumberGambar,
    teksAltGambar = "Foto aset",
    labelCadangan = "Belum ada foto",
    status,
    rincian = [],
    aksi = null,
}) {
    const statusKecil = String(status || "").toLowerCase();
    const warnaStatus =
        statusKecil === "aktif"
            ? "bg-green-500"
            : statusKecil === "nonaktif"
                ? "bg-red-500"
                : "bg-gray-400";

    return (
        <div className="gis-mobile-card rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-night-800 ring-1 ring-gray-200 dark:ring-night-700">
                    {sumberGambar ? (
                        <img
                            src={sumberGambar}
                            alt={teksAltGambar}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <span className="px-1 text-center text-[10px] text-gray-400 dark:text-night-500">
                            {labelCadangan}
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold capitalize text-gray-800 dark:text-night-200">
                        {judul || "Belum ada data"}
                    </p>
                    {subjudul && (
                        <p className="mt-0.5 truncate text-xs capitalize text-gray-500 dark:text-night-400">
                            {subjudul}
                        </p>
                    )}
                    {status ? (
                        <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium capitalize text-white shadow-sm ring-1 ring-white/20 ${warnaStatus}`}
                        >
                            {status}
                        </span>
                    ) : null}
                </div>
            </div>

            {rincian.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-night-700 pt-3 text-xs">
                    {rincian.map((m, i) => (
                        <div key={i} className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-night-500">
                                {m.label}
                            </p>
                            <p className="mt-0.5 truncate capitalize text-gray-700 dark:text-night-200">
                                {m.value || "-"}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {aksi && (
                <div className="mt-3 flex items-center gap-2 border-t border-gray-100 dark:border-night-700 pt-3">
                    {aksi}
                </div>
            )}
        </div>
    );
}
