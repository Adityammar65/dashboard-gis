import { useCallback, useEffect, useState } from "react";

const KUNCI_PENYIMPANAN = "gis_view_mode";

function ambilTampilanAwal() {
    if (typeof window === "undefined") return "table";
    try {
        const saved = window.localStorage.getItem(KUNCI_PENYIMPANAN);
        if (tersimpan === "chart" || tersimpan === "table") return tersimpan;
    } catch { }
    return "table";
}

export function ambilTampilanTersimpan() {
    return ambilTampilanAwal();
}

export default function useTampilanGrafik() {
    const [tampilan, aturTampilanState] = useState(ambilTampilanAwal);
    const apakahGrafik = tampilan === "chart";

    useEffect(() => {
        const padaPenyimpanan = (kejadian) => {
            if (e.key === KUNCI_PENYIMPANAN && (kejadian.newValue === "chart" || kejadian.newValue === "table")) {
                aturTampilanState(kejadian.newValue);
            }
        };
        window.addEventListener("storage", padaPenyimpanan);
        return () => window.removeEventListener("storage", padaPenyimpanan);
    }, []);

    const aturTampilan = useCallback((berikutnya) => {
        const nilai = berikutnya === "chart" ? "chart" : "table";
        aturTampilanState(nilai);
        try {
            window.localStorage.setItem(KUNCI_PENYIMPANAN, value);
        } catch { }
    }, []);

    const alihkan = useCallback(() => {
        aturTampilanState((sebelumnya) => {
            const nilai = sebelumnya === "chart" ? "table" : "chart";
            try {
                window.localStorage.setItem(KUNCI_PENYIMPANAN, value);
            } catch { }
            return nilai;
        });
    }, []);

    return { tampilan, apakahGrafik, aturTampilan, alihkan };
}

export { KUNCI_PENYIMPANAN };
