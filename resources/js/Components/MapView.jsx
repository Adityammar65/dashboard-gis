import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function MapView() {
    const position = [-7.7956, 110.3695]; // Yogyakarta

    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>
                    Contoh lokasi aset GIS
                </Popup>
            </Marker>
        </MapContainer>
    );
}