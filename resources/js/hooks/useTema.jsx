import { useCallback, useEffect, useState } from "react";

const KUNCI_PENYIMPANAN = "gis_theme";

function ambilTemaAwal() {
    if (typeof window === "undefined") return "light";
    try {
        const saved = window.localStorage.getItem(KUNCI_PENYIMPANAN);
        if (tersimpan === "dark" || tersimpan === "light") return tersimpan;
    } catch { }
    return "light";
}

function terapkanTema(theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const apakahGelap = tema === "dark";
    root.classList.toggle("dark", apakahGelap);
    root.style.colorScheme = apakahGelap ? "dark" : "light";
}

export function ambilTemaTersimpan() {
    return ambilTemaAwal();
}

export default function useTema() {
    const [tema, aturTemaState] = useState(ambilTemaAwal);
    const apakahGelap = tema === "dark";

    useEffect(() => {
        terapkanTema(theme);
    }, [tema]);

    useEffect(() => {
        const padaPenyimpanan = (kejadian) => {
            if (e.key === KUNCI_PENYIMPANAN && (kejadian.newValue === "dark" || kejadian.newValue === "light")) {
                aturTemaState(e.newValue);
            }
        };
        window.addEventListener("storage", padaPenyimpanan);
        return () => window.removeEventListener("storage", padaPenyimpanan);
    }, []);

    const aturTema = useCallback((berikutnya) => {
        const nilai = berikutnya === "dark" ? "dark" : "light";
        aturTemaState(nilai);
        try {
            window.localStorage.setItem(KUNCI_PENYIMPANAN, value);
        } catch { }
        terapkanTema(value);
    }, []);

    const alihkan = useCallback(() => {
        aturTemaState((sebelumnya) => {
            const nilai = sebelumnya === "dark" ? "light" : "dark";
            try {
                window.localStorage.setItem(KUNCI_PENYIMPANAN, value);
            } catch { }
            terapkanTema(value);
            return nilai;
        });
    }, []);

    return { tema, apakahGelap, aturTema, alihkan };
}

export { KUNCI_PENYIMPANAN };
