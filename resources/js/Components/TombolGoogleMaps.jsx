import { useMemo } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function TombolGoogleMaps({
    lintang,
    bujur,
    label = "Buka di Google Maps",
    className = "",
}) {
    const urlGmaps = useMemo(() => {
        const urai = (nilai) => {
            if (nilai === null || nilai === undefined || nilai === "") return null;
            const angka = parseFloat(String(nilai).trim().replace(",", "."));
            if (isNaN(angka) || !isFinite(angka)) return null;
            return angka;
        };
        const lat = urai(lintang);
        const lng = urai(bujur);
        if (lat === null || lng === null) return null;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }, [lintang, bujur]);

    const kelasDasar =
        "flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium ring-1 transition active:scale-[0.98] max-sm:w-full max-sm:justify-center";

    if (!urlGmaps) {
        return (
            <button
                type="button"
                disabled
                title="Koordinat tidak tersedia"
                aria-disabled="true"
                className={`${kelasDasar} cursor-not-allowed bg-gray-50 dark:bg-night-800/60 text-gray-400 dark:text-night-500 ring-gray-200 dark:ring-night-700 opacity-60 ${className}`.trim()}
            >
                <FaExternalLinkAlt />
                {label}
            </button>
        );
    }

    return (
        <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className={`${kelasDasar} bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:shadow-sm ${className}`.trim()}
        >
            <FaExternalLinkAlt />
            {label}
        </a>
    );
}
