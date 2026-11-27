import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { demoONT, demoTiang } from "../data/demoData";

export default function AssetMap() {
    const markers = [...demoTiang.map(item => ({ ...item, code: item.kode_tiang, kind: "Tiang" })), ...demoONT.map(item => ({ ...item, code: item.kode_ont, kind: "ONT" }))];
    return <MapContainer center={[-7.7956, 110.3695]} zoom={13} className="h-[65vh] min-h-96 rounded-2xl shadow-sm"><TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{markers.map(item => <Marker key={item.code} position={[item.latitude, item.longitude]}><Popup>{item.code} · {item.kind} · {item.status}</Popup></Marker>)}</MapContainer>;
}