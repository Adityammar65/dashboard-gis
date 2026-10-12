import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { FaMapMarkerAlt, FaSearch, FaSpinner } from "react-icons/fa";
import { buildTypeIcon, parseCoord } from "./mapMarker";

const PUSAT_BAWAAN = [-7.717, 110.355];

function PenetapKlik({ saatPilih }) {
    const map = useMap();
    useEffect(() => {
        const penangan = (kejadian) => saatPilih(kejadian.latlng.lat, kejadian.latlng.lng);
        map.on("click", penangan);
        return () => map.off("click", penangan);
    }, [map, saatPilih]);
    return null;
}

function TerbangKe({ pusat }) {
    const map = useMap();
    useEffect(() => {
        if (pusat) map.flyTo(pusat, 16, { duration: 0.8 });
    }, [map, pusat]);
    return null;
}

export default function PemilihLokasi({ lintang, bujur, onChange, jenis = "tiang", status = null }) {
    const lat = parseCoord(lintang);
    const lng = parseCoord(bujur);
    const adaPosisi = lat !== null && lng !== null;
    const posisiAwal = adaPosisi ? [lat, lng] : PUSAT_BAWAAN;
    const [posisiTunda, aturPosisiTunda] = useState(posisiAwal);
    const [kueri, aturKueri] = useState("");
    const [hasil, aturHasil] = useState([]);
    const [mencari, aturMencari] = useState(false);
    const [buka, aturBuka] = useState(false);
    const [catatanCari, aturCatatanCari] = useState("");
    const pewaktu = useRef(null);
    const tembolok = useRef(new Map());

    useEffect(() => {
        if (adaPosisi) aturPosisiTunda([lat, lng]);
    }, [lat, lng]);

    const pancarkan = (lintangBaru, bujurBaru) => {
        onChange?.(Number(lintangBaru.toFixed(6)), Number(bujurBaru.toFixed(6)));
    };

    const cariAlamat = async (q) => {
        const kunci = q.trim().toLowerCase();
        if (!kunci || kunci.length < 3) {
            aturHasil([]);
            aturCatatanCari("");
            return;
        }
        if (tembolok.current.has(kunci)) {
            aturHasil(tembolok.current.get(kunci));
            aturCatatanCari("");
            aturBuka(true);
            return;
        }
        aturMencari(true);
        aturCatatanCari("");
        try {
            const tanggapan = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=id&q=${encodeURIComponent(q)}`,
                { headers: { Accept: "application/json" } }
            );
            if (tanggapan.status === 429) {
                aturHasil([]);
                aturCatatanCari("Lagi banyak yang mencari, coba lagi sebentar ya…");
                aturBuka(true);
                return;
            }
            const data = await tanggapan.json();
            const daftar = Array.isArray(data) ? data : [];
            if (tembolok.current.size > 50) tembolok.current.clear();
            tembolok.current.set(kunci, daftar);
            aturHasil(daftar);
            aturCatatanCari(daftar.length === 0 ? "Alamat tidak ketemu, coba kata kunci lain atau klik langsung di peta ya." : "");
            aturBuka(true);
        } catch {
            aturHasil([]);
            aturCatatanCari("Koneksi pencarian lagi bermasalah, coba lagi sebentar ya.");
            aturBuka(true);
        } finally {
            aturMencari(false);
        }
    };

    const saatKueriBerubah = (nilai) => {
        aturKueri(nilai);
        if (pewaktu.current) clearTimeout(pewaktu.current);
        pewaktu.current = setTimeout(() => cariAlamat(nilai), 500);
    };

    useEffect(() => () => pewaktu.current && clearTimeout(pewaktu.current), []);

    const targetTerbang = useMemo(() => posisiTunda, [posisiTunda]);

    const ikonPenanda = useMemo(() => buildTypeIcon(jenis), [jenis]);

    return (
        <div className="relative z-0 isolate space-y-2">
            <div className="relative z-20">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-night-500" size={13} />
                <input
                    type="text"
                    value={kueri}
                    onChange={(kejadian) => saatKueriBerubah(kejadian.target.value)}
                    onFocus={() => hasil.length > 0 && aturBuka(true)}
                    onBlur={() => setTimeout(() => aturBuka(false), 200)}
                    placeholder="Cari alamat… cth: Malioboro, Sleman"
                    className="w-full rounded-xl border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 py-2.5 pl-9 pr-9 text-sm text-gray-900 dark:text-night-200 outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-night-500">
                    {mencari ? <FaSpinner className="animate-spin" size={13} /> : null}
                </span>
                {buka && (hasil.length > 0 || catatanCari) && (
                    <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 shadow-lg">
                        {catatanCari && hasil.length === 0 && (
                            <li className="px-3 py-2 text-xs text-gray-500 dark:text-night-400">{catatanCari}</li>
                        )}
                        {hasil.map((baris) => (
                            <li key={baris.place_id}>
                                <button
                                    type="button"
                                    onMouseDown={() => {
                                        aturPosisiTunda([parseFloat(baris.lat), parseFloat(baris.lon)]);
                                        aturKueri(baris.display_name.split(",").slice(0, 2).join(","));
                                        aturBuka(false);
                                    }}
                                    className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-night-800"
                                >
                                    <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#AB3C3C]" size={12} />
                                    <span className="line-clamp-2 text-gray-700 dark:text-night-200">{baris.display_name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="relative z-0 isolate overflow-hidden rounded-xl border border-gray-200 dark:border-night-700 shadow-sm">
                <MapContainer center={posisiAwal} zoom={adaPosisi ? 16 : 12} scrollWheelZoom={true} className="relative z-0 h-[300px] w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />
                    <PenetapKlik saatPilih={(lintangBaru, bujurBaru) => aturPosisiTunda([lintangBaru, bujurBaru])} />
                    <TerbangKe pusat={targetTerbang} />
                    <Marker
                        position={posisiTunda}
                        icon={ikonPenanda}
                        draggable
                        eventHandlers={{
                            dragend: (kejadian) => {
                                const titik = kejadian.target.getLatLng();
                                aturPosisiTunda([titik.lat, titik.lng]);
                            },
                        }}
                    />
                </MapContainer>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => pancarkan(posisiTunda[0], posisiTunda[1])}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-night-600 bg-white dark:bg-night-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-night-200 shadow-sm hover:bg-gray-50 dark:hover:bg-night-700"
                >
                    <FaMapMarkerAlt size={12} />
                    Tentukan Lokasi
                </button>
                <span className="rounded-lg bg-gray-50 dark:bg-night-800/60 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-night-300 ring-1 ring-gray-200 dark:ring-night-700">
                    {`${posisiTunda[0].toFixed(6)}, ${posisiTunda[1].toFixed(6)}`}
                </span>
            </div>
            {catatanCari && (
                <p className="text-xs text-gray-500 dark:text-night-400">{catatanCari}</p>
            )}
        </div>
    );
}
