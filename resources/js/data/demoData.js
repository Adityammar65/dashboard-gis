export const demoSettings = { nama_wilayah: "Kabupaten Demo", kode_wilayah: "3201", latitude: -7.7956, longitude: 110.3695, zoom: 13 };
export const demoUser = { id_user: 1, username: "demo", nama: "Demo User", role: "admin" };

export const demoWilayah = [
    { kode_wilayah: "3201", nama_wilayah: "Kabupaten Demo", latitude: -7.7956, longitude: 110.3695, zoom: 13 },
    { kode_wilayah: "3202", nama_wilayah: "Kota Demo", latitude: -7.8, longitude: 110.37, zoom: 13 },
    { kode_wilayah: "3203", nama_wilayah: "Kabupaten Demo 2", latitude: -7.79, longitude: 110.36, zoom: 13 },
];

export const demoTiang = [
    { kode_tiang: "TNG-001", kode_wilayah: "3201", wilayah: "Kabupaten Demo", kecamatan: "Kecamatan Pusat", kelurahan: "Kelurahan Utama", nama_petugas: "Budi Santoso", status: "aktif", latitude: -7.7956, longitude: 110.3695, foto_tiang_1: null, created_at: "2024-01-15T08:30:00Z" },
    { kode_tiang: "TNG-002", kode_wilayah: "3201", wilayah: "Kabupaten Demo", kecamatan: "Kecamatan Utara", kelurahan: "Kelurahan Jaya", nama_petugas: "Siti Rahayu", status: "nonaktif", latitude: -7.79, longitude: 110.372, foto_tiang_1: null, created_at: "2024-01-16T09:00:00Z" },
    { kode_tiang: "TNG-003", kode_wilayah: "3201", wilayah: "Kabupaten Demo", kecamatan: "Kecamatan Selatan", kelurahan: "Kelurahan Makmur", nama_petugas: "Ahmad Wijaya", status: "aktif", latitude: -7.801, longitude: 110.365, foto_tiang_1: null, created_at: "2024-01-17T10:15:00Z" },
    { kode_tiang: "TNG-004", kode_wilayah: "3202", wilayah: "Kota Demo", kecamatan: "Kecamatan Barat", kelurahan: "Kelurahan Sejahtera", nama_petugas: "Dewi Lestari", status: "aktif", latitude: -7.8, longitude: 110.37, foto_tiang_1: null, created_at: "2024-01-18T11:00:00Z" },
    { kode_tiang: "TNG-005", kode_wilayah: "3202", wilayah: "Kota Demo", kecamatan: "Kecamatan Timur", kelurahan: "Kelurahan Berkah", nama_petugas: "Rudi Hartono", status: "nonaktif", latitude: -7.798, longitude: 110.374, foto_tiang_1: null, created_at: "2024-01-19T14:20:00Z" },
];

export const demoONT = [
    { kode_ont: "ONT-001", kode_wilayah: "3201", wilayah: "Kabupaten Demo", kecamatan: "Kecamatan Pusat", kelurahan: "Kelurahan Utama", nama_petugas: "Budi Santoso", status: "aktif", latitude: -7.795, longitude: 110.37, foto_ont_1: null, created_at: "2024-01-15T08:30:00Z" },
    { kode_ont: "ONT-002", kode_wilayah: "3201", wilayah: "Kabupaten Demo", kecamatan: "Kecamatan Utara", kelurahan: "Kelurahan Jaya", nama_petugas: "Siti Rahayu", status: "aktif", latitude: -7.791, longitude: 110.373, foto_ont_1: null, created_at: "2024-01-16T09:00:00Z" },
    { kode_ont: "ONT-003", kode_wilayah: "3202", wilayah: "Kota Demo", kecamatan: "Kecamatan Barat", kelurahan: "Kelurahan Sejahtera", nama_petugas: "Dewi Lestari", status: "nonaktif", latitude: -7.801, longitude: 110.369, foto_ont_1: null, created_at: "2024-01-17T10:15:00Z" },
    { kode_ont: "ONT-004", kode_wilayah: "3202", wilayah: "Kota Demo", kecamatan: "Kecamatan Timur", kelurahan: "Kelurahan Berkah", nama_petugas: "Rudi Hartono", status: "aktif", latitude: -7.799, longitude: 110.375, foto_ont_1: null, created_at: "2024-01-18T11:00:00Z" },
    { kode_ont: "ONT-005", kode_wilayah: "3203", wilayah: "Kabupaten Demo 2", kecamatan: "Kecamatan Tengah", kelurahan: "Kelurahan Pusat", nama_petugas: "Ahmad Wijaya", status: "aktif", latitude: -7.789, longitude: 110.359, foto_ont_1: null, created_at: "2024-01-19T14:20:00Z" },
];

export const demoNotifikasi = [
    { id: 1, tipe: "info", judul: "Selamat datang di GIS Dashboard Demo", pesan: "Mode live demo memakai data statis. Perubahan tidak disimpan.", status: "belum_dibaca", created_at: "2024-01-20T08:00:00Z", related_type: null, related_id: null, reset_request: null },
    { id: 2, tipe: "success", judul: "Data Tiang TNG-001 diperbarui", pesan: "Status tiang diubah menjadi aktif.", status: "belum_dibaca", created_at: "2024-01-19T15:30:00Z", related_type: "tiang", related_id: "TNG-001", reset_request: null },
    { id: 3, tipe: "warning", judul: "ONT-003 butuh perawatan", pesan: "Sinyal ONT melemah, segera cek lokasi.", status: "sudah_dibaca", created_at: "2024-01-18T12:00:00Z", related_type: "ont", related_id: "ONT-003", reset_request: null },
];

export const demoStats = {
    tiang: {
        total: demoTiang.length,
        aktif: demoTiang.filter(item => item.status === "aktif").length,
        nonaktif: demoTiang.filter(item => item.status === "nonaktif").length,
    },
    ont: {
        total: demoONT.length,
        aktif: demoONT.filter(item => item.status === "aktif").length,
        nonaktif: demoONT.filter(item => item.status === "nonaktif").length,
    },
    wilayah: { total: demoWilayah.length },
    koordinat: { persen: 100 },
};
export const demoRecentAssets = [...demoTiang.slice(0, 3).map(item => ({ ...item, type: "tiang" })), ...demoONT.slice(0, 2).map(item => ({ ...item, type: "ont" }))];
