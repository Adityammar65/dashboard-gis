import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { FaCrosshairs, FaMapMarkerAlt, FaSearch, FaSpinner } from "react-icons/fa";

const DEFAULT_CENTER = [-7.717, 110.355];

const parseCoord = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = parseFloat(String(v).trim().replace(",", "."));
    return Number.isFinite(n) ? n : null;
};

function ClickSetter({ onPick }) {
    const map = useMap();
    useEffect(() => {
        const handler = (e) => onPick(e.latlng.lat, e.latlng.lng);
        map.on("click", handler);
        return () => map.off("click", handler);
    }, [map, onPick]);
    return null;
}

function FlyTo({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 16, { duration: 0.8 });
    }, [map, center]);
    return null;
}

export default function LocationPicker({ latitude, longitude, onChange }) {
    const lat = parseCoord(latitude);
    const lng = parseCoord(longitude);
    const hasPos = lat !== null && lng !== null;
    const position = hasPos ? [lat, lng] : DEFAULT_CENTER;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [open, setOpen] = useState(false);
    const [locating, setLocating] = useState(false);
    const [searchNote, setSearchNote] = useState("");
    const timer = useRef(null);
    const cache = useRef(new Map());

    const emit = (la, ln) => {
        onChange?.(Number(la.toFixed(6)), Number(ln.toFixed(6)));
    };

    const doSearch = async (q) => {
        const key = q.trim().toLowerCase();
        if (!key || key.length < 3) {
            setResults([]);
            setSearchNote("");
            return;
        }
        if (cache.current.has(key)) {
            setResults(cache.current.get(key));
            setSearchNote("");
            setOpen(true);
            return;
        }
        setSearching(true);
        setSearchNote("");
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=id&q=${encodeURIComponent(q)}`,
                { headers: { Accept: "application/json" } }
            );
            if (res.status === 429) {
                setResults([]);
                setSearchNote("Lagi banyak yang mencari, coba lagi sebentar ya…");
                setOpen(true);
                return;
            }
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            if (cache.current.size > 50) cache.current.clear();
            cache.current.set(key, list);
            setResults(list);
            setSearchNote(list.length === 0 ? "Alamat tidak ketemu, coba kata kunci lain atau klik langsung di peta ya." : "");
            setOpen(true);
        } catch {
            setResults([]);
            setSearchNote("Koneksi pencarian lagi bermasalah, coba lagi sebentar ya.");
            setOpen(true);
        } finally {
            setSearching(false);
        }
    };

    const onQueryChange = (v) => {
        setQuery(v);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => doSearch(v), 500);
    };

    useEffect(() => () => timer.current && clearTimeout(timer.current), []);

    const useMyLocation = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (p) => {
                emit(p.coords.latitude, p.coords.longitude);
                setLocating(false);
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const flyTarget = useMemo(() => (hasPos ? position : null), [hasPos, lat, lng]);

    return (
        <div className="relative z-0 isolate space-y-2">
            <div className="relative z-20">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 200)}
                    placeholder="Cari alamat… cth: Malioboro, Sleman"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {searching ? <FaSpinner className="animate-spin" size={13} /> : null}
                </span>
                {open && (results.length > 0 || searchNote) && (
                    <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                        {searchNote && results.length === 0 && (
                            <li className="px-3 py-2 text-xs text-gray-500">{searchNote}</li>
                        )}
                        {results.map((r) => (
                            <li key={r.place_id}>
                                <button
                                    type="button"
                                    onMouseDown={() => {
                                        emit(parseFloat(r.lat), parseFloat(r.lon));
                                        setQuery(r.display_name.split(",").slice(0, 2).join(","));
                                        setOpen(false);
                                    }}
                                    className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-gray-50"
                                >
                                    <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#AB3C3C]" size={12} />
                                    <span className="line-clamp-2 text-gray-700">{r.display_name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="relative z-0 isolate overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <MapContainer center={position} zoom={hasPos ? 16 : 12} scrollWheelZoom={true} className="relative z-0 h-[300px] w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />
                    <ClickSetter onPick={emit} />
                    <FlyTo center={flyTarget} />
                    <Marker
                        position={position}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const p = e.target.getLatLng();
                                emit(p.lat, p.lng);
                            },
                        }}
                    />
                </MapContainer>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
                >
                    {locating ? <FaSpinner className="animate-spin" size={12} /> : <FaCrosshairs size={12} />}
                    {locating ? "Mencari…" : "Pakai lokasi saya"}
                </button>
                <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    {hasPos ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "Klik peta / cari alamat untuk tentukan titik"}
                </span>
            </div>
        </div>
    );
}
