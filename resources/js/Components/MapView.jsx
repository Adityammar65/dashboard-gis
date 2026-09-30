import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { memo, useMemo, useEffect, useState } from "react";

const STATUS_BG = {
    aktif: "#22c55e",
    nonaktif: "#ef4444",
};

const ICON_SVG = {
    tiang: ``,
    ont: `<svg viewBox="0 0 640 512" width="11" height="11" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"/></svg>`,
};

const buildDivIcon = (type, status) => {
    const key = String(status || "").toLowerCase().trim();
    const bg = STATUS_BG[key] || "#9ca3af";
    const svg = ICON_SVG[type] ?? "";
    return L.divIcon({
        className: "gis-asset-marker",
        html: `<div style="width:20px;height:20px;border-radius:9999px;background:${bg};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.35);">${svg}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -8],
    });
};

const parseCoord = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const str = String(value).trim().replace(",", ".");
    const num = parseFloat(str);
    if (isNaN(num) || !isFinite(num)) return null;
    return num;
};

const isValidLatLng = (lat, lng) => {
    if (lat === null || lng === null) return false;
    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;
    return true;
};

function FitBounds({ points }) {
    const map = useMap();
    useEffect(() => {
        if (points.length > 1) {
            map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
        } else if (points.length === 1) {
            map.setView(points[0], Math.max(map.getZoom(), 13));
        }
    }, [map, points]);
    return null;
}

function RecenterWilayah({ wilayah, wilayahCenter }) {
    const map = useMap();
    useEffect(() => {
        if (wilayah && wilayah !== "Semua" && Array.isArray(wilayahCenter) && wilayahCenter.length === 2) {
            const lat = parseFloat(wilayahCenter[0]);
            const lng = parseFloat(wilayahCenter[1]);
            if (!isNaN(lat) && !isNaN(lng) && isValidLatLng(lat, lng)) {
                map.flyTo([lat, lng], 14, { duration: 1.0 });
            }
        }
    }, [wilayah, wilayahCenter, map]);
    return null;
}

// Koordinat

function LiveCoords() {
    const map = useMap();
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const onMouseMove = (e) => {
            setCoords([e.latlng.lat, e.latlng.lng]);
        };
        const onMove = () => {
            const c = map.getCenter();
            setCoords((prev) => prev ?? [c.lat, c.lng]);
        };
        map.on("mousemove", onMouseMove);
        map.on("move", onMove);
        const c = map.getCenter();
        setCoords([c.lat, c.lng]);
        return () => {
            map.off("mousemove", onMouseMove);
            map.off("move", onMove);
        };
    }, [map]);

    if (!coords) return null;
    return (
        <div className="leaflet-bottom leaflet-left" style={{ pointerEvents: "none" }}>
            <div className="leaflet-control leaflet-bar !m-0 !border-0 !bg-transparent !shadow-none" style={{ marginLeft: 12, marginBottom: 12 }}>
                <div className="rounded-md bg-white/90 px-3 py-1.5 text-[11px] font-medium text-gray-800 shadow backdrop-blur-sm border border-gray-200">
                    {coords[0].toFixed(6)} | {coords[1].toFixed(6)}
                </div>
            </div>
        </div>
    );
}

const MapView = memo(function MapView({ latitude, longitude, markers = null, wilayah = "Semua", wilayahCenter = null, type = null, status = null }) {
    const singlePosition = useMemo(() => {
        const lat = parseCoord(latitude);
        const lng = parseCoord(longitude);
        if (isValidLatLng(lat, lng)) return [lat, lng];
        return [-7.7956, 110.3695];
    }, [latitude, longitude]);

    const singleIcon = useMemo(() => {
        const t = String(type || "").toLowerCase() === "ont" ? "ont" : "tiang";
        const s = String(status || "").toLowerCase();
        return buildDivIcon(t, s);
    }, [type, status]);

    const validMarkers = useMemo(() => {
        if (!Array.isArray(markers)) return null;
        return markers
            .map((m) => {
                const lat = parseCoord(m.latitude);
                const lng = parseCoord(m.longitude);
                if (!isValidLatLng(lat, lng)) return null;
                const type = String(m.type || "").toLowerCase() === "ont" ? "ont" : "tiang";
                const status = String(m.status || "").toLowerCase();
                return { ...m, type, status, position: [lat, lng] };
            })
            .filter(Boolean);
    }, [markers]);

    const fitPoints = useMemo(
        () => (validMarkers || []).map((m) => m.position),
        [validMarkers]
    );

    const initialCenter = validMarkers
        ? (fitPoints.length > 0 ? fitPoints[0] : [-7.7956, 110.3695])
        : singlePosition;

    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);

    return (
        <MapContainer
            center={initialCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg"
            updateWhenIdle={true}
            keepBuffer={2}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
            />

            {validMarkers ? (
                <>
                    {wilayah && wilayah !== "Semua" && Array.isArray(wilayahCenter) && wilayahCenter.length === 2 ? (
                        <RecenterWilayah wilayah={wilayah} wilayahCenter={wilayahCenter} />
                    ) : (
                        <FitBounds points={fitPoints} />
                    )}
                    {validMarkers.map((m) => (
                        <Marker
                            key={`${m.type}-${m.id}`}
                            position={m.position}
                            icon={buildDivIcon(m.type, m.status)}
                        >
                            <Popup>
                                <div style={{ minWidth: 185 }}>
                                    <p style={{ fontWeight: 800, fontSize: 14, color: "#111827", letterSpacing: "0.02em", marginBottom: 4 }}>
                                        {m.kode || (m.type === "ont" ? "ONT" : "Tiang")}
                                    </p>
                                    <p style={{ fontSize: 12.5, color: "#1f2937", fontWeight: 600, textTransform: "capitalize", marginBottom: 3 }}>
                                        {m.type} &middot;{" "}
                                        <span style={{ color: m.status === "aktif" ? "#16a34a" : m.status === "nonaktif" ? "#dc2626" : "#1f2937", textTransform: "capitalize" }}>
                                            {m.status || "-"}
                                        </span>
                                    </p>
                                    <p style={{ fontSize: 12.5, color: "#1f2937", fontWeight: 500, textTransform: "capitalize", marginBottom: 3 }}>
                                        {m.wilayah ? m.wilayah : "-"}
                                        {m.kecamatan ? ` / ${m.kecamatan}` : (m.area ? ` / ${m.area}` : "")}
                                        {m.kelurahan ? ` / ${m.kelurahan}` : ""}
                                    </p>
                                    <p style={{ fontSize: 11.5, color: "#111827", fontWeight: 600, marginBottom: 6 }}>
                                        {m.position[0].toFixed(6)}, {m.position[1].toFixed(6)}
                                    </p>
                                    <a
                                        href={`${base}/detail-${m.type}/${m.id}`.replace(/\/+/g, "/")}
                                        style={{ fontSize: 12, color: "#ab3c3c", fontWeight: 700, textDecoration: "none" }}
                                    >
                                        Lihat detail →
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </>
            ) : (
                <Marker position={singlePosition} icon={singleIcon}>
                    <Popup>
                        Contoh lokasi aset GIS
                    </Popup>
                </Marker>
            )}
            <LiveCoords />
        </MapContainer>
    );
});

export default MapView;
