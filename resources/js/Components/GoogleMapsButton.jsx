import { useMemo } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function GoogleMapsButton({
    latitude,
    longitude,
    label = "Buka di Google Maps",
    className = "",
}) {
    const gmapsUrl = useMemo(() => {
        const parse = (v) => {
            if (v === null || v === undefined || v === "") return null;
            const n = parseFloat(String(v).trim().replace(",", "."));
            if (isNaN(n) || !isFinite(n)) return null;
            return n;
        };
        const lat = parse(latitude);
        const lng = parse(longitude);
        if (lat === null || lng === null) return null;
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }, [latitude, longitude]);

    const baseClass =
        "flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-white shadow-md transition active:scale-[0.98]";

    if (!gmapsUrl) {
        return (
            <button
                type="button"
                disabled
                title="Koordinat tidak tersedia"
                aria-disabled="true"
                className={`${baseClass} cursor-not-allowed bg-gradient-to-br from-gray-400 to-gray-500 opacity-50 ${className}`.trim()}
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
            className={`${baseClass} bg-gradient-to-br from-gray-600 to-gray-700 hover:shadow-lg hover:from-gray-700 hover:to-gray-800 ${className}`.trim()}
        >
            <FaExternalLinkAlt />
            {label}
        </a>
    );
}
