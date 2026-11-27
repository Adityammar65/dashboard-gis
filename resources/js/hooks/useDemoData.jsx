import { useState } from "react";
import {
    demoNotifikasi,
    demoONT,
    demoRecentAssets,
    demoSettings,
    demoStats,
    demoTiang,
    demoUser,
    demoWilayah,
} from "../data/demoData";

function paginate(items, page = 1, perPage = 15) {
    const start = (page - 1) * perPage;
    return {
        data: items.slice(start, start + perPage),
        current_page: page,
        last_page: Math.ceil(items.length / perPage),
        total: items.length,
        per_page: perPage,
    };
}

function filterTiang(tiang = [], filter = {}) {
    return tiang.filter(item => {
        if (filter.wilayah && String(item.kode_wilayah) !== String(filter.wilayah)) return false;
        if (filter.status && item.status !== filter.status) return false;
        if (filter.kecamatan && !String(item.kecamatan).toLowerCase().includes(filter.kecamatan.toLowerCase())) return false;
        if (filter.kelurahan && !String(item.kelurahan).toLowerCase().includes(filter.kelurahan.toLowerCase())) return false;
        if (filter.q) {
            const q = filter.q.toLowerCase();
            return String(item.kode_tiang).toLowerCase().includes(q)
                || String(item.wilayah).toLowerCase().includes(q)
                || String(item.kecamatan).toLowerCase().includes(q)
                || String(item.kelurahan).toLowerCase().includes(q)
                || String(item.nama_petugas).toLowerCase().includes(q);
        }
        return true;
    });
}

function filterONT(ont = [], filter = {}) {
    return ont.filter(item => {
        if (filter.wilayah && String(item.kode_wilayah) !== String(filter.wilayah)) return false;
        if (filter.status && item.status !== filter.status) return false;
        if (filter.kecamatan && !String(item.kecamatan).toLowerCase().includes(filter.kecamatan.toLowerCase())) return false;
        if (filter.kelurahan && !String(item.kelurahan).toLowerCase().includes(filter.kelurahan.toLowerCase())) return false;
        if (filter.q) {
            const q = filter.q.toLowerCase();
            return String(item.kode_ont).toLowerCase().includes(q)
                || String(item.wilayah).toLowerCase().includes(q)
                || String(item.kecamatan).toLowerCase().includes(q)
                || String(item.kelurahan).toLowerCase().includes(q)
                || String(item.nama_petugas).toLowerCase().includes(q);
        }
        return true;
    });
}

function getKecamatan(wilayahKode) {
    const w = demoWilayah.find(item => String(item.kode_wilayah) === String(wilayahKode));
    if (!w) return [];
    return [
        { kode_kecamatan: "KEC-01", nama_kecamatan: "Kecamatan Pusat", kode_wilayah: w.kode_wilayah },
        { kode_kecamatan: "KEC-02", nama_kecamatan: "Kecamatan Utara", kode_wilayah: w.kode_wilayah },
        { kode_kecamatan: "KEC-03", nama_kecamatan: "Kecamatan Selatan", kode_wilayah: w.kode_wilayah },
    ];
}

function getKelurahan(kecamatanKode) {
    return [
        { kode_kelurahan: "KEL-01", nama_kelurahan: "Kelurahan Utama", kode_kecamatan: kecamatanKode },
        { kode_kelurahan: "KEL-02", nama_kelurahan: "Kelurahan Jaya", kode_kecamatan: kecamatanKode },
        { kode_kelurahan: "KEL-03", nama_kelurahan: "Kelurahan Makmur", kode_kecamatan: kecamatanKode },
    ];
}

function searchAssets(q, type = "") {
    const query = String(q ?? "").trim().toLowerCase();
    if (query.length < 2) return [];
    const pool = type === "ont" ? demoONT : type === "tiang" ? demoTiang : [...demoTiang, ...demoONT];
    return pool.filter(item => {
        const kode = type === "ont" ? item.kode_ont : item.kode_tiang;
        return String(kode).toLowerCase().includes(query)
            || String(item.wilayah).toLowerCase().includes(query)
            || String(item.kecamatan).toLowerCase().includes(query)
            || String(item.kelurahan).toLowerCase().includes(query)
            || String(item.nama_petugas).toLowerCase().includes(query);
    }).map(item => ({
        id: type === "ont" ? item.kode_ont : item.kode_tiang,
        type: type === "ont" ? "ONT" : "Tiang",
        match: "kode",
        kode: type === "ont" ? item.kode_ont : item.kode_tiang,
        nama: item.nama_petugas,
        wilayah: item.wilayah,
        kecamatan: item.kecamatan,
        kelurahan: item.kelurahan,
        href: type === "ont" ? `detail-ont/${item.kode_ont}` : `detail-tiang/${item.kode_tiang}`,
    })).slice(0, 10);
}

function nextKode(kodeWilayah, type) {
    const prefix = type === "tiang" ? "TNG" : "ONT";
    const existing = type === "tiang" ? demoTiang : demoONT;
    const maxNum = existing
        .filter(item => String(item.kode_wilayah) === String(kodeWilayah))
        .reduce((m, item) => {
            const n = parseInt(String(item.kode_tiang || item.kode_ont).replace(/\D/g, ""), 10);
            return isNaN(n) ? m : Math.max(m, n);
        }, 0);
    const next = maxNum + 1;
    return `${prefix}-${String(next).padStart(3, "0")}`;
}

export default function useDemoData() {
    const [notifikasi, setNotifikasi] = useState(demoNotifikasi);
    const [settings, setSettings] = useState(demoSettings);
    const [user, setUser] = useState(demoUser);

    return {
        settings,
        tiang: demoTiang,
        ont: demoONT,
        wilayah: demoWilayah,
        notifikasi,
        unreadNotifikasi: notifikasi.filter(item => item.status === "belum_dibaca").length,
        stats: demoStats,
        recentAssets: demoRecentAssets,
        auth: { username: user.username },
        user,
        errors: {},
        flash: {},
        setNotifikasi,
        setSettings,
        setUser,
        // Helpers
        paginate,
        filterTiang,
        filterONT,
        getKecamatan,
        getKelurahan,
        searchAssets,
        nextKode,
    };
}
