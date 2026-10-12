import { memo } from "react";
import { FaTable, FaChartBar } from "react-icons/fa";
import useTampilanGrafik from "../hooks/useTampilanGrafik";

/**
 * Sakelar mode tampilan data Simple/Detail.
 * variant="switch" -> kontrol segmented untuk halaman Pengaturan (mirip PengalihTema).
 * variant="compact" -> pil kecil untuk header halaman (override lokal).
 */
const PengalihTampilanGrafik = memo(function PengalihTampilanGrafik({ variant = "switch", className = "", value, onChange }) {
    const global = useTampilanGrafik();
    const tampilan = value ?? global.tampilan;
    const aturTampilan = onChange ?? global.aturTampilan;
    const apakahGrafik = tampilan === "chart";

    if (variant === "compact") {
        return (
            <div
                role="radiogroup"
                aria-label="Pilih mode tampilan data"
                className={`inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-night-800 ${className}`}
            >
                <button
                    type="button"
                    role="radio"
                    aria-checked={tampilan === "table"}
                    onClick={() => aturTampilan("table")}
                    title="Tampilan simple"
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        tampilan === "table"
                            ? "bg-white text-gray-800 shadow-sm dark:bg-night-900 dark:text-night-200"
                            : "text-gray-500 hover:text-gray-700 dark:text-night-400 dark:hover:text-night-200"
                    }`}
                >
                    <FaTable size={12} />
                    <span className="max-sm:hidden">Simple</span>
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={tampilan === "chart"}
                    onClick={() => aturTampilan("chart")}
                    title="Tampilan detail"
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        tampilan === "chart"
                            ? "bg-white text-gray-800 shadow-sm dark:bg-night-900 dark:text-night-200"
                            : "text-gray-500 hover:text-gray-700 dark:text-night-400 dark:hover:text-night-200"
                    }`}
                >
                    <FaChartBar size={12} />
                    <span className="max-sm:hidden">Detail</span>
                </button>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            <div
                role="radiogroup"
                aria-label="Pilih mode tampilan data"
                className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1.5 dark:bg-night-800"
            >
                <button
                    type="button"
                    role="radio"
                    aria-checked={tampilan === "table"}
                    onClick={() => aturTampilan("table")}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        tampilan === "table"
                            ? "bg-white text-gray-800 shadow-md dark:bg-night-900 dark:text-night-200"
                            : "text-gray-500 hover:text-gray-700 dark:text-night-400 dark:hover:text-night-200"
                    }`}
                >
                    <FaTable size={14} />
                    Simple
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={tampilan === "chart"}
                    onClick={() => aturTampilan("chart")}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        tampilan === "chart"
                            ? "bg-white text-gray-800 shadow-md dark:bg-night-900 dark:text-night-200"
                            : "text-gray-500 hover:text-gray-700 dark:text-night-400 dark:hover:text-night-200"
                    }`}
                >
                    <FaChartBar size={14} />
                    Detail
                </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-night-400">
                {apakahGrafik
                    ? "Mode detail aktif. Pilihan tersimpan di perangkat ini."
                    : "Mode simple aktif. Pilihan tersimpan di perangkat ini."}
            </p>
        </div>
    );
});

export default PengalihTampilanGrafik;
