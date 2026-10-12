import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Tajuk, BilahSamping, LaciSeluler } from "../Components";
import { FiX } from "react-icons/fi";
import { usePage } from "@inertiajs/react";

export const KonteksGalatTataLetak = createContext(null);

export function useGalatTataLetak() {
    const ctx = useContext(KonteksGalatTataLetak);
    if (!ctx) {
        throw new Error("useGalatTataLetak must be used within <TataLetakUtama>");
    }
    return ctx;
}

export default function TataLetakUtama({ children, pesanGalat }) {
    const [apakahBuka, aturApakahBuka] = useState(() => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return false;
        return true;
    });
    const [laciBuka, aturLaciBuka] = useState(false);
    const [galatLokal, aturGalatLokal] = useState(null);
    const [diabaikan, aturDiabaikan] = useState(false);

    const { url } = usePage();
    const { errors, flash } = usePage().props;

    const tampilkanGalat = useCallback((pesan) => {
        if (!pesan) return;

        if (Array.isArray(pesan)) pesan = pesan[0];
        else if (typeof pesan === "object") {
            const daftarNilai = Object.values(pesan);
            pesan = daftarNilai[0];
            if (Array.isArray(pesan)) pesan = pesan[0];
        }
        aturDiabaikan(false);
        aturGalatLokal(String(pesan));
    }, []);

    const bersihkanGalat = useCallback(() => {
        aturGalatLokal(null);
        aturDiabaikan(true);
    }, []);

    useEffect(() => {
        if (errors || flash?.error || flash?.message || flash?.success || pesanGalat) {
            aturDiabaikan(false);
        }
    }, [errors, flash, pesanGalat]);

    useEffect(() => {
        aturLaciBuka(false);
    }, [url]);

    useEffect(() => {
        const handler = (e) => tampilkanGalat(e.detail);
        window.addEventListener("tata-letak:galat", penangan);
        return () => window.removeEventListener("tata-letak:galat", penangan);
    }, [tampilkanGalat]);

    useEffect(() => {
        if (!galatLokal) return;
        const pewaktu = setTimeout(() => aturGalatLokal(null), 3000);
        return () => clearTimeout(pewaktu);
    }, [galatLokal]);

    const galatInersia = Object.values(errors || {})?.[0];
    const galatKilas = flash?.error || flash?.message || null;
    const suksesKilas = flash?.success || null;

    const galatTerpilih = diabaikan
        ? galatLokal
        : pesanGalat || galatLokal || inertiaError || flashError || null;

    const galatTampil = Array.isArray(galatTerpilih)
        ? galatTerpilih[0]
        : galatTerpilih;

    useEffect(() => {
        if (!galatTampil) return;
        const t = setTimeout(() => {
            bersihkanGalat();
        }, 3000);
        return () => clearTimeout(pewaktu);
    }, [galatTampil, bersihkanGalat]);

    useEffect(() => {
        if (!flashSuccess || diabaikan || galatTampil) return;
        const t = setTimeout(() => setDismissed(true), 3000);
        return () => clearTimeout(pewaktu);
    }, [flashSuccess, diabaikan, galatTampil]);

    return (
        <KonteksGalatTataLetak.Provider value={{ error: galatTampil, tampilkanGalat, setError: tampilkanGalat, bersihkanGalat }}>
            <div className="relative min-h-screen bg-[#F6F4F4] font-poppins text-gray-900 transition-colors duration-200 max-md:overflow-x-clip dark:bg-night-950 dark:text-night-200">
                {galatTampil && (
                    <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2 max-md:w-[calc(100vw-2rem)] max-md:max-w-md">
                        <div className="flex items-center gap-3 rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white shadow-lg">
                            <span>{galatTampil}</span>
                            <button
                                type="button"
                                onClick={bersihkanGalat}
                                className="rounded p-0.5 hover:bg-white/20"
                                aria-label="Tutup galat"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {!galatTampil && !diabaikan && flashSuccess && (
                    <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2 max-md:w-[calc(100vw-2rem)] max-md:max-w-md">
                        <div className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white shadow-lg">
                            <span>{flashSuccess}</span>
                            <button
                                type="button"
                                onClick={bersihkanGalat}
                                className="rounded p-0.5 hover:bg-white/20"
                                aria-label="Tutup keberhasilan"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* BilahSamping */}

                <div className="max-md:hidden">
                    <BilahSamping apakahBuka={apakahBuka} saatAlih={() => aturApakahBuka(!apakahBuka)} />
                </div>

                {/* Mobile Drawer */}

                <LaciSeluler buka={laciBuka} saatTutup={() => aturLaciBuka(false)} />

                {/* Tajuk */}

                <Tajuk saatMenu={() => aturLaciBuka(true)} />

                {/* Isi */}

                <main
                    className={`min-h-[calc(100vh-72px)] bg-[#F6F4F4] p-6
                    transition-all duration-300 dark:bg-night-950
                    max-md:p-4 max-md:min-w-0 max-md:ml-0 max-md:min-h-[calc(100vh-60px)]
                    ${apakahBuka ? "ml-64" : "ml-20"}`}
                >
                    {children}
                </main>
            </div>
        </KonteksGalatTataLetak.Provider>
    );
}
