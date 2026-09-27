import MainLayout from "../../Layouts/MainLayout";
import LocationPicker from "../../Components/LocationPicker";
import { FaArrowLeft, FaSave, FaTrash, FaUndo } from "react-icons/fa";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";

export default function FormEditTiang({ tiang, wilayah }) {
    const getFotoUrl = (foto) => {
        if (!foto) return null;

        return `../public/storage/${foto}`;
    };

    const [form, setForm] = useState({
        kode_tiang: tiang?.kode_tiang ?? "",
        wilayah: tiang?.wilayah ?? tiang?.kabupaten ?? "",
        kecamatan: tiang?.kecamatan ?? tiang?.area ?? "",
        kelurahan: tiang?.kelurahan ?? "",
        deskripsi_tiang: tiang?.deskripsi_tiang ?? "",
        foto_tiang_1: null,
        foto_tiang_2: null,
        foto_tiang_3: null,
        foto_tiang_4: null,
        foto_tiang_5: null,
        latitude: tiang?.latitude ?? "",
        longitude: tiang?.longitude ?? "",
        nama_petugas: tiang?.nama_petugas ?? "",
        status: tiang?.status?.toLowerCase() ?? "",
    });
    const [kodeEdited, setKodeEdited] = useState(false);
    const { settings } = usePage().props;
    const [kecamatanOptions, setKecamatanOptions] = useState([]);
    const [kelurahanOptions, setKelurahanOptions] = useState([]);
    const [kecamatanLoading, setKecamatanLoading] = useState(false);
    const [kelurahanLoading, setKelurahanLoading] = useState(false);
    const [kelurahanManual, setKelurahanManual] = useState(false);
    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont', 'hapus-tiang', 'hapus-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);
    const resolveUrl = (path) => `${base}/${path}`.replace(/\/+/g, '/');

    // Kecamatan Kelurahan

    useEffect(() => {
        const targetWilayah = form.wilayah || tiang?.wilayah || tiang?.kabupaten || settings?.nama_wilayah;
        if (!targetWilayah) { setKecamatanOptions([]); return; }
        const wil = wilayah?.find((w) => w.nama_wilayah === targetWilayah);
        const kode = wil?.kode_wilayah || targetWilayah;
        if (!kode) { setKecamatanOptions([]); return; }
        let cancelled = false;
        setKecamatanLoading(true);
        fetch(resolveUrl(`api/regions/kabupaten/${kode}/kecamatan`))
            .then((r) => r.json())
            .then((j) => {
                if (cancelled) return;
                const data = Array.isArray(j?.data) ? j.data : [];
                setKecamatanOptions(data);
                const currentKec = form.kecamatan || tiang?.kecamatan || tiang?.area;
                if (currentKec) {
                    const opt = data.find((o) => o.name === currentKec);
                    const code = opt?.code;
                    if (!code) { setKelurahanManual(true); }
                    else {
                        setKelurahanLoading(true);
                        fetch(resolveUrl(`api/regions/kecamatan/${code}/kelurahan`))
                            .then((r2) => r2.json())
                            .then((j2) => {
                                const d2 = Array.isArray(j2?.data) ? j2.data : [];
                                if (d2.length === 0) { setKelurahanManual(true); setKelurahanOptions([]); }
                                else { setKelurahanManual(false); setKelurahanOptions(d2); }
                            })
                            .catch(() => { setKelurahanManual(true); })
                            .finally(() => setKelurahanLoading(false));
                    }
                }
            })
            .catch(() => { if (!cancelled) setKecamatanOptions([]); })
            .finally(() => { if (!cancelled) setKecamatanLoading(false); });
        return () => { cancelled = true; };
    }, [form.wilayah, base, settings?.nama_wilayah]);

    const handleKecamatanChange = (val) => {
        setForm((prev) => ({ ...prev, kecamatan: val, kelurahan: "" }));
        setKelurahanOptions([]);
        setKelurahanManual(false);
        if (!val) return;
        const opt = kecamatanOptions.find((o) => o.name === val);
        const code = opt?.code;
        if (!code) { setKelurahanManual(true); return; }
        setKelurahanLoading(true);
        fetch(resolveUrl(`api/regions/kecamatan/${code}/kelurahan`))
            .then((r) => r.json())
            .then((j) => {
                const data = Array.isArray(j?.data) ? j.data : [];
                if (data.length === 0) { setKelurahanManual(true); setKelurahanOptions([]); }
                else { setKelurahanManual(false); setKelurahanOptions(data); }
            })
            .catch(() => { setKelurahanManual(true); setKelurahanOptions([]); })
            .finally(() => setKelurahanLoading(false));
    };
    const [kecFocused, setKecFocused] = useState(false);
    const [kelFocused, setKelFocused] = useState(false);
    const levenshtein = (a, b) => {
        const m = a.length, n = b.length;
        if (m === 0) return n;
        if (n === 0) return m;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
        return dp[m][n];
    };
    const similarity = (a, b) => {
        const al = a.toLowerCase().trim(), bl = b.toLowerCase().trim();
        if (!al || !bl) return 0;
        if (bl.includes(al) && al.length >= 2) {
            const ratio = al.length / bl.length;
            if (ratio >= 0.7) return 1;
            if (ratio >= 0.4) return 0.85;
        }
        const dist = levenshtein(al, bl);
        return 1 - dist / Math.max(al.length, bl.length);
    };
    const fetchKelurahanForKecamatanName = (kecName) => {
        const opt = kecamatanOptions.find((o) => o.name.toLowerCase() === kecName.toLowerCase().trim());
        const code = opt?.code;
        if (!code) { setKelurahanManual(true); setKelurahanOptions([]); return; }
        setKelurahanLoading(true);
        fetch(resolveUrl(`api/regions/kecamatan/${code}/kelurahan`))
            .then((r) => r.json())
            .then((j) => {
                const data = Array.isArray(j?.data) ? j.data : [];
                if (data.length === 0) { setKelurahanManual(true); setKelurahanOptions([]); }
                else { setKelurahanManual(false); setKelurahanOptions(data); }
            })
            .catch(() => { setKelurahanManual(true); setKelurahanOptions([]); })
            .finally(() => setKelurahanLoading(false));
    };
    const filteredKecamatan = useMemo(() => {
        const input = (form.kecamatan || "").trim();
        if (input.length < 2 || kecamatanOptions.length === 0) return [];
        if (kecamatanOptions.some((o) => o.name.toLowerCase() === input.toLowerCase())) return [];
        return kecamatanOptions.filter((opt) => similarity(input, opt.name) >= 0.7).slice(0, 6);
    }, [form.kecamatan, kecamatanOptions]);
    const filteredKelurahan = useMemo(() => {
        const input = (form.kelurahan || "").trim();
        if (input.length < 2 || kelurahanOptions.length === 0 || kelurahanManual) return [];
        if (kelurahanOptions.some((o) => o.name.toLowerCase() === input.toLowerCase())) return [];
        return kelurahanOptions.filter((opt) => similarity(input, opt.name) >= 0.7).slice(0, 6);
    }, [form.kelurahan, kelurahanOptions, kelurahanManual]);
    useEffect(() => {
        if (!form.kecamatan || kecamatanOptions.length === 0) return;
        const exact = kecamatanOptions.find((o) => o.name.toLowerCase() === form.kecamatan.toLowerCase().trim());
        if (exact && kelurahanOptions.length === 0 && !kelurahanLoading && !kelurahanManual) {
            fetchKelurahanForKecamatanName(form.kecamatan);
        }
    }, [form.kecamatan]);

    const [preview, setPreview] = useState({
        foto_tiang_1: getFotoUrl(tiang?.foto_tiang_1),
        foto_tiang_2: getFotoUrl(tiang?.foto_tiang_2),
        foto_tiang_3: getFotoUrl(tiang?.foto_tiang_3),
        foto_tiang_4: getFotoUrl(tiang?.foto_tiang_4),
        foto_tiang_5: getFotoUrl(tiang?.foto_tiang_5),
    });

    const [hapusFoto, setHapusFoto] = useState({
        foto_tiang_1: false,
        foto_tiang_2: false,
        foto_tiang_3: false,
        foto_tiang_4: false,
        foto_tiang_5: false,
    });

    const toggleHapusFoto = (name) => {
        const willDelete = !hapusFoto[name];
        setHapusFoto((prev) => ({ ...prev, [name]: willDelete }));
        if (willDelete) {
            setForm((prev) => ({ ...prev, [name]: null }));
            setPreview((prev) => ({ ...prev, [name]: null }));
        } else {
            setPreview((prev) => ({ ...prev, [name]: getFotoUrl(tiang?.[name]) }));
        }
    };

    const slotFoto = (name) => (name === "foto_tiang_1" ? 1 : name === "foto_tiang_2" ? 2 : name === "foto_tiang_3" ? 3 : name === "foto_tiang_4" ? 4 : 5);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "wilayah") {
            setForm((prev) => ({ ...prev, wilayah: value, kecamatan: "", kelurahan: "" }));
            setKelurahanOptions([]);
            setKelurahanManual(false);
            setKecFocused(false);
            setKelFocused(false);
        }
        if (name === "kecamatan") {
            setForm((prev) => ({ ...prev, kecamatan: value, kelurahan: "" }));
            setKelurahanOptions([]);
            setKelurahanManual(false);
            return;
        }
        if (name === "kelurahan") {
            setForm((prev) => ({ ...prev, kelurahan: value }));
            return;
        }
        if (name === "kode_tiang") setKodeEdited(true);
        if (name === "wilayah" && !kodeEdited) {
            const wil = wilayah?.find((w) => w.nama_wilayah === value);
            const kodeWil = wil?.kode_wilayah;
            const prefix = kodeWil ? `SIMS-${kodeWil}-` : "";
            if (kodeWil) {
                fetch(`${window.location.pathname.split('/').filter(Boolean)[0] ? '/' + window.location.pathname.split('/').filter(Boolean)[0] : ''}/api/next-kode?kode_wilayah=${kodeWil}&type=tiang`.replace(/\/+/g, '/'))
                    .then((r) => r.json())
                    .then((d) => {
                        if (d?.kode && !kodeEdited) setForm((prev) => ({ ...prev, wilayah: value, kode_tiang: d.kode }));
                    })
                    .catch(() => { });
            }
        }

        if (files && files[0]) {
            setForm((prev) => ({
                ...prev,
                [name]: files[0],
            }));

            setPreview((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(files[0]),
            }));

            if (name in hapusFoto) {
                setHapusFoto((prev) => ({ ...prev, [name]: false }));
            }

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const setCoords = (lat, lng) => {
        setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(
            `../update-tiang/${tiang.id}`,
            {
                ...form,
                hapus_foto_1: hapusFoto.foto_tiang_1 ? 1 : 0,
                hapus_foto_2: hapusFoto.foto_tiang_2 ? 1 : 0,
                hapus_foto_3: hapusFoto.foto_tiang_3 ? 1 : 0,
                hapus_foto_4: hapusFoto.foto_tiang_4 ? 1 : 0,
                hapus_foto_5: hapusFoto.foto_tiang_5 ? 1 : 0,
            },
            {
                forceFormData: true,

                onSuccess: () => {
                    console.log("Data tiang berhasil diperbarui.");
                },

                onError: (errors) => {
                    console.log(errors);
                    const raw = errors?.error || Object.values(errors || {})[0];
                    const msg = Array.isArray(raw) ? raw[0] : raw;
                    const display = msg || "Gagal memperbarui tiang. Periksa kembali isian form.";
                    window.dispatchEvent(new CustomEvent("layout:error", { detail: display }));
                },
            }
        );
    };

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Kepala */}

                <div className="flex items-center justify-between mb-5 max-md:flex-col max-md:items-start max-md:gap-3">
                    <div className="flex items-center gap-3 max-md:flex-wrap">

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition"
                        >
                            <FaArrowLeft size={14} />
                            Kembali
                        </button>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight max-md:text-lg">
                                Form Edit Tiang
                            </h1>

                            <p className="text-sm text-gray-500">
                                Edit data tiang
                            </p>
                        </div>

                    </div>
                </div>

                {/* Formulir */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-7 max-md:p-4">

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Kode Tiang */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Tiang
                                </label>

                                <input
                                    name="kode_tiang"
                                    type="text"
                                    value={form.kode_tiang}
                                    onChange={handleChange}
                                    placeholder="Masukkan kode tiang"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            {/* Wilayah */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Wilayah
                                </label>

                                <select
                                    name="wilayah"
                                    value={form.wilayah}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                >
                                    <option value="" disabled>
                                        Pilih Wilayah
                                    </option>

                                    {wilayah?.map((item) => (
                                        <option
                                            className="capitalize"
                                            key={item.id}
                                            value={item.nama_wilayah}
                                        >
                                            {item.nama_wilayah}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kecamatan */}

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kecamatan
                                </label>

                                <input
                                    name="kecamatan"
                                    type="text"
                                    value={form.kecamatan}
                                    onChange={handleChange}
                                    onFocus={() => setKecFocused(true)}
                                    onBlur={() => setTimeout(() => setKecFocused(false), 180)}
                                    placeholder={kecamatanLoading ? "Memuat kecamatan..." : "Ketik kecamatan"}
                                    required
                                    autoComplete="off"
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                                {kecFocused && filteredKecamatan.length > 0 && (
                                    <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                                        {filteredKecamatan.map((opt) => (
                                            <button
                                                key={opt.code}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                    setForm((prev) => ({ ...prev, kecamatan: opt.name, kelurahan: "" }));
                                                    setKecFocused(false);
                                                    setKelurahanOptions([]);
                                                    setKelurahanManual(false);
                                                    setKelurahanLoading(true);
                                                    fetch(resolveUrl(`api/regions/kecamatan/${opt.code}/kelurahan`))
                                                        .then((r) => r.json())
                                                        .then((j) => {
                                                            const data = Array.isArray(j?.data) ? j.data : [];
                                                            if (data.length === 0) { setKelurahanManual(true); setKelurahanOptions([]); }
                                                            else { setKelurahanManual(false); setKelurahanOptions(data); }
                                                        })
                                                        .catch(() => { setKelurahanManual(true); setKelurahanOptions([]); })
                                                        .finally(() => setKelurahanLoading(false));
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#AB3C3C]/10 hover:text-[#AB3C3C] transition"
                                            >
                                                <span className="font-medium">{opt.name}</span>

                                            </button>
                                        ))}
                                    </div>
                                )}
                                {kecamatanLoading && <p className="mt-1 text-[11px] text-gray-400">Memuat kecamatan...</p>}
                            </div>

                            {/* Kelurahan */}

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kelurahan
                                </label>

                                <input
                                    name="kelurahan"
                                    type="text"
                                    value={form.kelurahan}
                                    onChange={handleChange}
                                    onFocus={() => setKelFocused(true)}
                                    onBlur={() => setTimeout(() => setKelFocused(false), 180)}
                                    placeholder={kelurahanLoading ? "Memuat..." : kelurahanManual && kelurahanOptions.length === 0 ? "Kelurahan tidak terdeteksi – isi manual" : "Ketik kelurahan"}
                                    required
                                    autoComplete="off"
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 disabled:bg-gray-50"
                                />
                                {kelFocused && filteredKelurahan.length > 0 && (
                                    <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                                        {filteredKelurahan.map((opt) => (
                                            <button
                                                key={opt.code}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                    setForm((prev) => ({ ...prev, kelurahan: opt.name }));
                                                    setKelFocused(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#AB3C3C]/10 hover:text-[#AB3C3C] transition"
                                            >
                                                <span className="font-medium">{opt.name}</span>

                                            </button>
                                        ))}
                                    </div>
                                )}
                                {kelurahanManual && (
                                    <p className="mt-1 text-[11px] text-amber-600">Kelurahan tidak terdeteksi – silakan isi manual.</p>
                                )}
                                {kelurahanLoading && <p className="mt-1 text-[11px] text-gray-400">Memuat kelurahan...</p>}
                            </div>

                            {/* Petugas */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Petugas Lapangan
                                </label>

                                <input
                                    name="nama_petugas"
                                    type="text"
                                    value={form.nama_petugas}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama petugas"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            {/* Status */}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                >
                                    <option value="" disabled>
                                        Pilih Status
                                    </option>

                                    <option value="aktif">
                                        Aktif
                                    </option>

                                    <option value="nonaktif">
                                        Nonaktif
                                    </option>
                                </select>
                            </div>

                            {/* Lokasi */}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titik Lokasi <span className="font-normal text-gray-400">(klik peta / cari alamat)</span>
                                </label>

                                <LocationPicker
                                    latitude={form.latitude}
                                    longitude={form.longitude}
                                    onChange={setCoords}
                                />
                            </div>

                            {/* Koordinat */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitude
                                </label>

                                <input
                                    name="latitude"
                                    type="text"
                                    value={form.latitude}
                                    onChange={handleChange}
                                    placeholder="Contoh: -7.7956"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitude
                                </label>

                                <input
                                    name="longitude"
                                    type="text"
                                    value={form.longitude}
                                    onChange={handleChange}
                                    placeholder="Contoh: 110.3695"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                                />
                            </div>

                            {/* Foto */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto Tiang
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* Foto 1 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500">
                                                Foto 1
                                            </label>

                                            {(preview.foto_tiang_1 || tiang?.foto_tiang_1) && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHapusFoto("foto_tiang_1")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_tiang_1 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100" : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"}`}
                                                >
                                                    {hapusFoto.foto_tiang_1 ? <><FaUndo size={10} /> Batal</> : <><FaTrash size={10} /> Hapus</>}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_tiang_1 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50">
                                                <span className="px-3 text-center text-xs text-amber-700">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                {preview.foto_tiang_1 ? (
                                                    <img
                                                        src={preview.foto_tiang_1}
                                                        alt="Foto Tiang 1"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_tiang_1"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 2 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500">
                                                Foto 2
                                            </label>

                                            {(preview.foto_tiang_2 || tiang?.foto_tiang_2) && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHapusFoto("foto_tiang_2")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_tiang_2 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100" : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"}`}
                                                >
                                                    {hapusFoto.foto_tiang_2 ? <><FaUndo size={10} /> Batal</> : <><FaTrash size={10} /> Hapus</>}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_tiang_2 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50">
                                                <span className="px-3 text-center text-xs text-amber-700">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                {preview.foto_tiang_2 ? (
                                                    <img
                                                        src={preview.foto_tiang_2}
                                                        alt="Foto Tiang 2"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_tiang_2"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 3 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500">
                                                Foto 3
                                            </label>

                                            {(preview.foto_tiang_3 || tiang?.foto_tiang_3) && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHapusFoto("foto_tiang_3")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_tiang_3 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100" : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"}`}
                                                >
                                                    {hapusFoto.foto_tiang_3 ? <><FaUndo size={10} /> Batal</> : <><FaTrash size={10} /> Hapus</>}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_tiang_3 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50">
                                                <span className="px-3 text-center text-xs text-amber-700">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                {preview.foto_tiang_3 ? (
                                                    <img
                                                        src={preview.foto_tiang_3}
                                                        alt="Foto Tiang 3"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_tiang_3"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 4 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500">
                                                Foto 4
                                            </label>

                                            {(preview.foto_tiang_4 || tiang?.foto_tiang_4) && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHapusFoto("foto_tiang_4")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_tiang_4 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100" : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"}`}
                                                >
                                                    {hapusFoto.foto_tiang_4 ? <><FaUndo size={10} /> Batal</> : <><FaTrash size={10} /> Hapus</>}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_tiang_4 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50">
                                                <span className="px-3 text-center text-xs text-amber-700">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                {preview.foto_tiang_4 ? (
                                                    <img
                                                        src={preview.foto_tiang_4}
                                                        alt="Foto Tiang 4"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_tiang_4"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 5 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500">
                                                Foto 5
                                            </label>

                                            {(preview.foto_tiang_5 || tiang?.foto_tiang_5) && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleHapusFoto("foto_tiang_5")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_tiang_5 ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100" : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"}`}
                                                >
                                                    {hapusFoto.foto_tiang_5 ? <><FaUndo size={10} /> Batal</> : <><FaTrash size={10} /> Hapus</>}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_tiang_5 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50">
                                                <span className="px-3 text-center text-xs text-amber-700">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                                {preview.foto_tiang_5 ? (
                                                    <img
                                                        src={preview.foto_tiang_5}
                                                        alt="Foto Tiang 5"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_tiang_5"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}

                        <div className="mt-5">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>

                            <textarea
                                name="deskripsi_tiang"
                                value={form.deskripsi_tiang}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Masukkan deskripsi..."
                                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl outline-none resize-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400"
                            />

                        </div>

                        {/* Simpan */}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 max-md:flex-col-reverse max-md:items-stretch">

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition max-md:w-full max-md:justify-center"
                            >
                                <FaSave size={14} />
                                Simpan Perubahan
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
