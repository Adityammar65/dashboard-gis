import { useLocation, useNavigate } from "react-router-dom";
import { demoONT, demoNotifikasi, demoRecentAssets, demoSettings, demoStats, demoTiang, demoUser, demoWilayah } from "../data/demoData";

export function buildDemoProps() {
    const stats = {
        ...demoStats,
        total_tiang: demoTiang.length,
        total_ont: demoONT.length,
        tiang_aktif: demoStats.tiang.aktif,
        tiang_nonaktif: demoStats.tiang.nonaktif,
        ont_aktif: demoStats.ont.aktif,
        ont_nonaktif: demoStats.ont.nonaktif,
    };
    const params = new URLSearchParams(window.location.search);
    const filters = Object.fromEntries(params.entries());
    const tiang = demoTiang.filter(item => {
        if (filters.wilayah && item.kode_wilayah !== filters.wilayah) return false;
        if (filters.status && item.status !== filters.status) return false;
        if (filters.q && !Object.values(item).some(value => String(value ?? "").toLowerCase().includes(filters.q.toLowerCase()))) return false;
        return true;
    });
    const ont = demoONT.filter(item => {
        if (filters.wilayah && item.kode_wilayah !== filters.wilayah) return false;
        if (filters.status && item.status !== filters.status) return false;
        if (filters.q && !Object.values(item).some(value => String(value ?? "").toLowerCase().includes(filters.q.toLowerCase()))) return false;
        return true;
    });
    const dataWilayah = demoWilayah.map(wilayah => ({
        ...wilayah,
        total_tiang: demoTiang.filter(item => item.kode_wilayah === wilayah.kode_wilayah).length,
        total_ont: demoONT.filter(item => item.kode_wilayah === wilayah.kode_wilayah).length,
        total_aset: demoTiang.filter(item => item.kode_wilayah === wilayah.kode_wilayah).length + demoONT.filter(item => item.kode_wilayah === wilayah.kode_wilayah).length,
        aset_aktif: [...demoTiang, ...demoONT].filter(item => item.kode_wilayah === wilayah.kode_wilayah && item.status === "aktif").length,
        aset_nonaktif: [...demoTiang, ...demoONT].filter(item => item.kode_wilayah === wilayah.kode_wilayah && item.status === "nonaktif").length,
    }));
    return {
        settings: demoSettings,
        auth: { username: demoUser.username },
        errors: {},
        flash: {},
        tiang: demoTiang,
        ont: demoONT,
        wilayah: demoWilayah,
        notifikasi: demoNotifikasi,
        unreadNotifikasi: demoNotifikasi.filter(item => item.status === "belum_dibaca").length,
        stats,
        recentAssets: demoRecentAssets,
        dataTiang: { data: tiang, links: [], current_page: 1, last_page: 1, total: tiang.length },
        dataONT: { data: ont, links: [], current_page: 1, last_page: 1, total: ont.length },
        dataWilayah: { data: dataWilayah, links: [], current_page: 1, last_page: 1, total: dataWilayah.length },
        filter: {
            wilayah: filters.wilayah || "",
            status: filters.status || "",
            kecamatan: filters.kecamatan || "",
            kelurahan: filters.kelurahan || "",
            q: filters.q || "",
            aset: filters.aset || "",
        },
        user: demoUser,
    };
}

export function usePage() {
    const location = useLocation();
    return { url: `${location.pathname}${location.search}`, props: buildDemoProps() };
}

export const router = {
    get(path) {
        window.history.pushState({}, "", path.startsWith("/") ? path : `/${path}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
    },
    post(path) {
        window.dispatchEvent(new CustomEvent("layout:error", { detail: "Aksi nonaktif di live demo." }));
    },
    delete(path) {
        window.dispatchEvent(new CustomEvent("layout:error", { detail: "Aksi nonaktif di live demo." }));
    },
    reload() {
        window.dispatchEvent(new PopStateEvent("popstate"));
    },
};

export function Link({ href, children, ...props }) {
    return <a href={href} {...props}>{children}</a>;
}
