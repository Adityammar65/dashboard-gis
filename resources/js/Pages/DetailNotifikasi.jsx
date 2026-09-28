import MainLayout from "../Layouts/MainLayout";
import { FaArrowLeft, FaWifi, FaMap } from "react-icons/fa";
import { MdRouter } from "react-icons/md";
import { useMemo } from "react";
import { usePage } from "@inertiajs/react";

const getIconByKategori = (kategori) => {
    const k = (kategori || "").toLowerCase();
    if (k === "ont") return MdRouter;
    if (k === "wilayah") return FaMap;
    return FaWifi;
};

const getNotifikasiVisual = (item) => {
    const jenis = item?.jenis || "";
    const kategori = (item?.kategori || "").toLowerCase();

    if (jenis.includes("Ditambahkan")) {
        return {
            Icon: getIconByKategori(kategori),
            circle: "bg-green-100 text-green-600",
        };
    }
    if (jenis.includes("Diperbarui")) {
        return {
            Icon: getIconByKategori(kategori),
            circle: "bg-yellow-100 text-yellow-600",
        };
    }
    if (jenis.includes("Dihapus")) {
        return {
            Icon: getIconByKategori(kategori),
            circle: "bg-red-100 text-red-600",
        };
    }
    return { Icon: null, circle: "" };
};

const parsePesan = (pesan = "") => {
    const lines = String(pesan || "").split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return { summary: "-", changes: [], details: [] };
    const summary = lines[0];
    const changes = [];
    const details = [];
    let mode = null;

    for (const line of lines.slice(1)) {
        if (/^perubahan/i.test(line)) { mode = "changes"; continue; }
        if (/^detail data/i.test(line) || /^data yang dihapus/i.test(line)) { mode = "details"; continue; }
        if (/^tidak ada perubahan/i.test(line)) { mode = null; continue; }
        if (!line.startsWith("-")) continue;
        const body = line.replace(/^-\s*/, "");
        const arrowIdx = body.indexOf("→");
        if (arrowIdx !== -1) {
            const field = body.slice(0, body.indexOf(":")).trim();
            const [oldVal, newVal] = body.split("→").map((s) => {
                const part = s.trim();
                return part.includes(":") ? part.slice(part.indexOf(":") + 1).trim() : part;
            });
            changes.push({ field, oldVal, newVal });
        } else if (body.includes(":")) {
            const idx = body.indexOf(":");
            details.push({ field: body.slice(0, idx).trim(), value: body.slice(idx + 1).trim() });
        } else if (mode === "changes") {
            changes.push({ field: body, oldVal: "-", newVal: "-" });
        } else {
            details.push({ field: "-", value: body });
        }
    }

    return { summary, changes, details };
};

export default function DetailNotifikasi({ notifikasi }) {
    const { settings } = usePage().props;
    const item = useMemo(() => (Array.isArray(notifikasi) ? notifikasi[0] : notifikasi) || null, [notifikasi]);
    const { Icon, circle } = getNotifikasiVisual(item || {});
    const { summary, changes, details } = useMemo(() => parsePesan(item?.pesan), [item]);
    const belumDibaca = item?.status === "belum_dibaca";

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-stretch justify-between gap-4 max-md:flex-row max-md:items-stretch max-md:gap-2">
                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 text-white shadow-md border border-white/10 max-md:flex max-md:min-w-0 max-md:items-center max-md:rounded-xl max-md:px-3 max-md:py-2.5">
                        <span className="text-sm font-semibold tracking-wide max-md:shrink-0 max-md:text-[13px] max-md:whitespace-nowrap">
                            Detail Notifikasi
                        </span>

                        <span className="mx-3 opacity-60 max-md:mx-1.5 max-md:shrink-0">
                            /
                        </span>

                        <span className="text-xs font-light capitalize opacity-90 max-md:truncate max-md:text-[11px]">
                            {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        title="Kembali"
                        aria-label="Kembali"
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 px-4 py-2.5 text-xs font-medium text-white shadow-md transition hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-[0.98] max-md:rounded-lg max-md:px-3 max-md:py-2"
                    >
                        <FaArrowLeft />
                        <span className="max-md:hidden">Kembali</span>
                    </button>
                </div>

                {!item ? (
                    <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">
                            Data notifikasi tidak ditemukan.
                        </p>
                    </div>
                ) : (
                    <>

                        {/* Ringkasan */}

                        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-5 shadow-sm border border-gray-100 max-md:flex-col max-md:items-start max-md:gap-3 max-md:px-4">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-full shadow-sm ring-1 ring-white/40 ${circle || (belumDibaca
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600")
                                    }`}
                            >
                                {Icon ? (
                                    <Icon size={20} />
                                ) : belumDibaca ? (
                                    "⚠"
                                ) : (
                                    "✓"
                                )}
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {item.jenis}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {item.kategori}
                                </p>
                                <p className="mt-1 text-xs text-gray-700">
                                    {summary}
                                </p>
                                <p className="mt-1 text-[10px] text-gray-400">
                                    {item.created_at
                                        ? new Date(item.created_at).toLocaleString("id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })
                                        : "-"}
                                </p>
                            </div>

                            {belumDibaca && (
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                            )}
                        </div>

                        {/* Perubahan */}

                        {changes.length > 0 && (
                            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 px-5 py-4">
                                    <h3 className="font-semibold text-gray-800">
                                        Perubahan ({changes.length})
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Daftar field yang berubah beserta nilai lama dan baru
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-gray-50/70 border-b border-gray-100 text-left text-gray-500">
                                                <th className="px-5 py-3 font-medium">Field</th>
                                                <th className="px-5 py-3 font-medium">Nilai Lama</th>
                                                <th className="px-5 py-3 font-medium">Nilai Baru</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {changes.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                                                    <td className="px-5 py-3 font-medium text-gray-800">
                                                        {row.field}
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-600">
                                                        {row.oldVal}
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-600">
                                                        {row.newVal}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Detail */}

                        {details.length > 0 && (
                            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                                <div className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 px-5 py-4">
                                    <h3 className="font-semibold text-gray-800">
                                        Detail Data
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Snapshot data pada notifikasi ini
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 py-5 text-xs sm:grid-cols-2">
                                    {details.map((row, idx) => (
                                        <div key={idx} className="rounded-xl bg-gray-50/70 px-3 py-2.5 border border-gray-100">
                                            <p className="font-semibold text-gray-800">
                                                {row.field}
                                            </p>
                                            <p className="mt-1 break-words text-gray-600">
                                                {row.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {changes.length === 0 && details.length === 0 && (
                            <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Tidak ada rincian perubahan pada notifikasi ini.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
