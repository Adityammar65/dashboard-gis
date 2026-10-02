import L from "leaflet";

export const STATUS_BG = {
    aktif: "#22c55e",
    nonaktif: "#ef4444",
};

export const ICON_SVG = {
    tiang: ``,
    ont: `<svg viewBox="0 0 640 512" width="14" height="14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"/></svg>`,
};

export const TYPE_BG = {
    tiang: "#1e3a8a",
    ont: "#0ea5e9",
};

export const buildDivIcon = (type, status) => {
    const key = String(status || "").toLowerCase().trim();
    const bg = STATUS_BG[key] || "#9ca3af";
    const t = String(type || "").toLowerCase() === "ont" ? "ont" : "tiang";
    const svg = ICON_SVG[t] ?? "";
    return L.divIcon({
        className: "gis-asset-marker",
        html: `<div style="width:26px;height:26px;border-radius:9999px;background:${bg};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.35);">${svg}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -10],
    });
};

export const buildTypeIcon = (type) => {
    const t = String(type || "").toLowerCase() === "ont" ? "ont" : "tiang";
    const bg = TYPE_BG[t] || "#9ca3af";
    const svg = ICON_SVG[t] ?? "";
    return L.divIcon({
        className: "gis-asset-marker",
        html: `<div style="width:26px;height:26px;border-radius:9999px;background:${bg};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.35);">${svg}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -10],
    });
};

export const parseCoord = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const str = String(value).trim().replace(",", ".");
    const num = parseFloat(str);
    if (isNaN(num) || !isFinite(num)) return null;
    return num;
};

export const isValidLatLng = (lat, lng) => {
    if (lat === null || lng === null) return false;
    if (lat < -90 || lat > 90) return false;
    if (lng < -180 || lng > 180) return false;
    return true;
};
