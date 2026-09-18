import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { memo, useMemo, useEffect } from "react";

// leaflet.css already imported globally in app.jsx - removed duplicate

const TYPE_BG = {
    tiang: "#1e3a8a", // blue-900, matches legend
    ont: "#0ea5e9", // sky-500, matches legend
};

const STATUS_RING = {
    aktif: "#22c55e", // green-500, matches legend
    nonaktif: "#ef4444", // red-500, matches legend
};

const GLYPH = {
    tiang: "&#128246;",
    ont: "&#128421;",
};

const buildDivIcon = (type, status) => {
    const bg = TYPE_BG[type] || "#1e3a8a";
    const ring = STATUS_RING[String(status || "").toLowerCase()] || "#9ca3af";
    const glyph = GLYPH[type] || "&#9679;";
    return L.divIcon({
        className: "gis-asset-marker",
        html: `<div style="width:30px;height:30px;border-radius:9999px;background:${bg};border:3px solid ${ring};display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,.35);">${glyph}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -14],
    });
};

const parseCoord = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
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

const MapView = memo(function MapView({ latitude, longitude, markers = null }) {
    const singlePosition = useMemo(() => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
        return [-7.7956, 110.3695]; // Yogyakarta fallback
    }, [latitude, longitude]);

    const validMarkers = useMemo(() => {
        if (!Array.isArray(markers)) return null;
        return markers
            .map((m) => {
                const lat = parseCoord(m.latitude);
                const lng = parseCoord(m.longitude);
                if (lat === null || lng === null) return null;
                const type = String(m.type || "").toLowerCase() === "ont" ? "ont" : "tiang";
                return { ...m, type, position: [lat, lng] };
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
                    <FitBounds points={fitPoints} />
                    {validMarkers.map((m) => (
                        <Marker
                            key={`${m.type}-${m.id}`}
                            position={m.position}
                            icon={buildDivIcon(m.type, m.status)}
                        >
                            <Popup>
                                <div style={{ minWidth: 160 }}>
                                    <p style={{ fontWeight: 700, fontSize: 13 }}>
                                        {m.kode || (m.type === "ont" ? "ONT" : "Tiang")}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#4b5563", textTransform: "capitalize" }}>
                                        {m.type} &middot; {m.status || "-"}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#4b5563" }}>
                                        {m.wilayah || "-"}
                                        {m.area ? ` / ${m.area}` : ""}
                                    </p>
                                    <p style={{ fontSize: 10, color: "#9ca3af" }}>
                                        {m.position[0]}, {m.position[1]}
                                    </p>
                                    <a
                                        href={`${base}/detail-${m.type}/${m.id}`.replace(/\/+/g, '/')}
                                        style={{ fontSize: 11, color: "#ab3c3c", fontWeight: 600 }}
                                    >
                                        Lihat detail
                                    </a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </>
            ) : (
                <Marker position={singlePosition}>
                    <Popup>
                        Contoh lokasi aset GIS
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
});

export default MapView;
