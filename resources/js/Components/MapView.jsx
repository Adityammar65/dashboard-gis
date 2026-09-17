import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import { memo, useMemo } from "react";

// leaflet.css already imported globally in app.jsx - removed duplicate

const MapView = memo(function MapView({ latitude, longitude }) {
    const position = useMemo(() => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
        return [-7.7956, 110.3695]; // Yogyakarta fallback
    }, [latitude, longitude]);

    return (
        <MapContainer
            center={position}
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

            <Marker position={position}>
                <Popup>
                    Contoh lokasi aset GIS
                </Popup>
            </Marker>
        </MapContainer>
    );
});

export default MapView;