import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { memo, useMemo, useEffect, useState } from "react";
import { buildDivIcon, parseCoord, isValidLatLng } from "./mapMarker";
import useTheme from "../hooks/useTheme";
import useBase from "../hooks/useBase";

function SesuaikanBatas({ titik }) {
    const map = useMap();
    useEffect(() => {
        if (titik.length > 1) {
            map.fitBounds(L.latLngBounds(titik), { padding: [40, 40] });
        } else if (titik.length === 1) {
            map.setView(titik[0], Math.max(map.getZoom(), 13));
        }
    }, [map, titik]);
    return null;
}

function PusatkanWilayah({ wilayah, pusatWilayah }) {
    const map = useMap();
    useEffect(() => {
        if (wilayah && wilayah !== "Semua" && Array.isArray(pusatWilayah) && pusatWilayah.length === 2) {
            const lat = parseFloat(pusatWilayah[0]);
            const lng = parseFloat(pusatWilayah[1]);
            if (!isNaN(lat) && !isNaN(lng) && isValidLatLng(lat, lng)) {
                map.flyTo([lat, lng], 14, { duration: 1.0 });
            }
        }
    }, [wilayah, pusatWilayah, map]);
    return null;
}

// Koordinat

function KoordinatLangsung() {
    const map = useMap();
    const [koordinat, aturKoordinat] = useState(null);

    useEffect(() => {
        const saatGerakTetikus = (kejadian) => {
            aturKoordinat([kejadian.latlng.lat, kejadian.latlng.lng]);
        };
        const saatPindah = () => {
            const pusat = map.getCenter();
            aturKoordinat((sebelumnya) => sebelumnya ?? [pusat.lat, pusat.lng]);
        };
        map.on("mousemove", saatGerakTetikus);
        map.on("move", saatPindah);
        const pusat = map.getCenter();
        aturKoordinat([pusat.lat, pusat.lng]);
        return () => {
            map.off("mousemove", saatGerakTetikus);
            map.off("move", saatPindah);
        };
    }, [map]);

    if (!koordinat) return null;
    return (
        <div className="leaflet-bottom leaflet-left" style={{ pointerEvents: "none" }}>
            <div className="leaflet-control leaflet-bar !m-0 !border-0 !bg-transparent !shadow-none" style={{ marginLeft: 12, marginBottom: 12 }}>
                <div className="rounded-md bg-white/90 px-3 py-1.5 text-[11px] font-medium text-gray-800 shadow backdrop-blur-sm border border-gray-200 dark:bg-night-900/90 dark:text-night-200 dark:border-night-700">
                    {koordinat[0].toFixed(6)} | {koordinat[1].toFixed(6)}
                </div>
            </div>
        </div>
    );
}

const TampilanPeta = memo(function TampilanPeta({ lintang, bujur, penanda = null, wilayah = "Semua", pusatWilayah = null, jenis = null, status = null }) {
    const { isDark } = useTheme();
    const posisiTunggal = useMemo(() => {
        const lat = parseCoord(lintang);
        const lng = parseCoord(bujur);
        if (isValidLatLng(lat, lng)) return [lat, lng];
        return [-7.7956, 110.3695];
    }, [lintang, bujur]);

    const ikonTunggal = useMemo(() => {
        const j = String(jenis || "").toLowerCase() === "ont" ? "ont" : "tiang";
        const s = String(status || "").toLowerCase();
        return buildDivIcon(j, s);
    }, [jenis, status]);

    const penandaValid = useMemo(() => {
        if (!Array.isArray(penanda)) return null;
        return penanda
            .map((m) => {
                const lat = parseCoord(m.lintang ?? m.latitude);
                const lng = parseCoord(m.bujur ?? m.longitude);
                if (!isValidLatLng(lat, lng)) return null;
                const jenisAset = String(m.type || "").toLowerCase() === "ont" ? "ont" : "tiang";
                const statusAset = String(m.status || "").toLowerCase();
                return { ...m, type: jenisAset, status: statusAset, position: [lat, lng] };
            })
            .filter(Boolean);
    }, [penanda]);

    const titikSesuai = useMemo(
        () => (penandaValid || []).map((m) => m.position),
        [penandaValid]
    );

    const pusatAwal = penandaValid
        ? (titikSesuai.length > 0 ? titikSesuai[0] : [-7.7956, 110.3695])
        : posisiTunggal;

    const base = useBase();

    const fokusPin = (kejadian) => {
        document.querySelectorAll(".gis-pin-active").forEach((elemen) => elemen.classList.remove("gis-pin-active"));
        kejadian.target.getElement()?.classList.add("gis-pin-active");
    };

    const hilangFokusPin = (kejadian) => {
        kejadian.target.getElement()?.classList.remove("gis-pin-active");
    };

    return (
        <MapContainer
            center={pusatAwal}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg"
            updateWhenIdle={true}
            keepBuffer={2}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
            />

            {penandaValid ? (
                <>
                    {wilayah && wilayah !== "Semua" && Array.isArray(pusatWilayah) && pusatWilayah.length === 2 ? (
                        <PusatkanWilayah wilayah={wilayah} pusatWilayah={pusatWilayah} />
                    ) : (
                        <SesuaikanBatas titik={titikSesuai} />
                    )}
                    {penandaValid.map((m) => (
                        <Marker
                            key={`${m.type}-${m.id}`}
                            position={m.position}
                            icon={buildDivIcon(m.type, m.status)}
                            eventHandlers={{
                                click: fokusPin,
                                popupclose: hilangFokusPin,
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: 185 }}>
                                    <p style={{ fontWeight: 800, fontSize: 14, color: isDark ? "#e9d5d5" : "#111827", letterSpacing: "0.02em", marginBottom: 4 }}>
                                        {m.kode || (m.type === "ont" ? "ONT" : "Tiang")}
                                    </p>
                                    <p style={{ fontSize: 12.5, color: isDark ? "#c9a9a9" : "#1f2937", fontWeight: 600, textTransform: "capitalize", marginBottom: 3 }}>
                                        {m.type} &middot;{" "}
                                        <span style={{ color: m.status === "aktif" ? "#4ade80" : m.status === "nonaktif" ? "#f87171" : (isDark ? "#c9a9a9" : "#1f2937"), textTransform: "capitalize" }}>
                                            {m.status || "-"}
                                        </span>
                                    </p>
                                    <p style={{ fontSize: 12.5, color: isDark ? "#c9a9a9" : "#1f2937", fontWeight: 500, textTransform: "capitalize", marginBottom: 3 }}>
                                        {m.wilayah ? m.wilayah : "-"}
                                        {m.kecamatan ? ` / ${m.kecamatan}` : (m.area ? ` / ${m.area}` : "")}
                                        {m.kelurahan ? ` / ${m.kelurahan}` : ""}
                                    </p>
                                    <p style={{ fontSize: 11.5, color: isDark ? "#e9d5d5" : "#111827", fontWeight: 600, marginBottom: 6 }}>
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
                <Marker
                    position={posisiTunggal}
                    icon={ikonTunggal}
                    eventHandlers={{
                        click: fokusPin,
                        popupclose: hilangFokusPin,
                    }}
                />
            )}
            <KoordinatLangsung />
        </MapContainer>
    );
});

export default TampilanPeta;
