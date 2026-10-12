import TataLetakUtama from "../../Layouts/TataLetakUtama";
import PemilihLokasi from "../../Components/PemilihLokasi";
import { FaArrowLeft, FaSave, FaTrash, FaUndo } from "react-icons/fa";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import useBase from "../../hooks/useBase";

export default function FormulirUbahONT({ ont, wilayah }) {
    const ambilUrlFoto = (foto) => {
        if (!foto) return null;

        return `../public/storage/${foto}`;
    };

    const [formulir, aturFormulir] = useState({
        kode_ont: ont?.kode_ont ?? "",
        wilayah: ont?.wilayah ?? ont?.kabupaten ?? "",
        kecamatan: ont?.kecamatan ?? ont?.area ?? "",
        kelurahan: ont?.kelurahan ?? "",
        deskripsi_ont: ont?.deskripsi_ont ?? "",
        foto_ont_1: null,
        foto_ont_2: null,
        foto_ont_3: null,
        foto_ont_4: null,
        foto_ont_5: null,
        latitude: ont?.latitude ?? "",
        longitude: ont?.longitude ?? "",
        nama_petugas: ont?.nama_petugas ?? "",
        status: ont?.status?.toLowerCase() ?? "",
    });
    const [kodeDiubah, aturKodeDiubah] = useState(false);
    const { pengaturan } = usePage().props;
    const [opsiKecamatan, aturOpsiKecamatan] = useState([]);
    const [opsiKelurahan, aturOpsiKelurahan] = useState([]);
    const [kecamatanMemuat, aturKecamatanMemuat] = useState(false);
    const [kelurahanMemuat, aturKelurahanMemuat] = useState(false);
    const [kelurahanManual, aturKelurahanManual] = useState(false);
    const [kecFokus, aturKecFokus] = useState(false);
    const [kelFokus, aturKelFokus] = useState(false);
    const base = useBase();
    const resolveHref = (path) => `${base}/${path}`.replace(/\/+/g, '/');
    useEffect(() => {
        let dibatalkan = false;
        aturKecamatanMemuat(true);
        fetch(resolveHref(`api/regions/kabupaten/${(wilayah?.find((w) => w.nama_wilayah === (formulir.wilayah || ont?.wilayah || ont?.kabupaten || pengaturan?.nama_wilayah))?.kode_wilayah || formulir.wilayah || ont?.wilayah || pengaturan?.nama_wilayah || '')}/kecamatan`))
            .then((r) => r.json())
            .then((j) => {
                if (dibatalkan) return;
                const data = Array.isArray(j?.data) ? j.data : [];
                aturOpsiKecamatan(data);
                const currentKec = formulir.kecamatan || ont?.kecamatan || ont?.area;
                if (currentKec) {
                    const opsi = data.find((o) => o.name === currentKec);
                    const code = opsi?.code;
                    if (!code) { aturKelurahanManual(true); }
                    else {
                        aturKelurahanMemuat(true);
                        fetch(resolveHref(`api/regions/kecamatan/${code}/kelurahan`))
                            .then((r2) => r2.json())
                            .then((j2) => {
                                const d2 = Array.isArray(j2?.data) ? j2.data : [];
                                if (d2.length === 0) { aturKelurahanManual(true); aturOpsiKelurahan([]); }
                                else { aturKelurahanManual(false); aturOpsiKelurahan(d2); }
                            })
                            .catch(() => { aturKelurahanManual(true); })
                            .finally(() => aturKelurahanMemuat(false));
                    }
                }
            })
            .catch(() => { if (!dibatalkan) aturOpsiKecamatan([]); })
            .finally(() => { if (!dibatalkan) aturKecamatanMemuat(false); });
        return () => { dibatalkan = true; };
    }, [formulir.wilayah, pengaturan?.nama_wilayah, wilayah, base]);
    const tanganiUbahKecamatan = (nilai) => {
        aturFormulir((sebelumnya) => ({ ...sebelumnya, kecamatan: nilai, kelurahan: "" }));
        aturOpsiKelurahan([]);
        aturKelurahanManual(false);
        if (!nilai) return;
        const opsi = opsiKecamatan.find((o) => o.name === nilai);
        const code = opsi?.code;
        if (!code) { aturKelurahanManual(true); return; }
        aturKelurahanMemuat(true);
        fetch(resolveHref(`api/regions/kecamatan/${code}/kelurahan`))
            .then((r) => r.json())
            .then((j) => {
                const data = Array.isArray(j?.data) ? j.data : [];
                if (data.length === 0) { aturKelurahanManual(true); aturOpsiKelurahan([]); }
                else { aturKelurahanManual(false); aturOpsiKelurahan(data); }
            })
            .catch(() => { aturKelurahanManual(true); aturOpsiKelurahan([]); })
            .finally(() => aturKelurahanMemuat(false));
    };
    useEffect(() => {
        if (!formulir.kecamatan || opsiKecamatan.length === 0) return;
        const tepat = opsiKecamatan.find((o) => o.name.toLowerCase() === formulir.kecamatan.toLowerCase().trim());
        if (tepat && opsiKelurahan.length === 0 && !kelurahanMemuat && !kelurahanManual) {
            const code = tepat.code;
            aturKelurahanMemuat(true);
            fetch(resolveHref(`api/regions/kecamatan/${code}/kelurahan`))
                .then((r) => r.json())
                .then((j) => {
                    const d = Array.isArray(j?.data) ? j.data : [];
                    if (d.length === 0) { aturKelurahanManual(true); aturOpsiKelurahan([]); }
                    else { aturKelurahanManual(false); aturOpsiKelurahan(d); }
                })
                .catch(() => { aturKelurahanManual(true); })
                .finally(() => aturKelurahanMemuat(false));
        }
    }, [formulir.kecamatan]);
    const [pratampil, aturPratampil] = useState({
        foto_ont_1: ambilUrlFoto(ont?.foto_ont_1),
        foto_ont_2: ambilUrlFoto(ont?.foto_ont_2),
        foto_ont_3: ambilUrlFoto(ont?.foto_ont_3),
        foto_ont_4: ambilUrlFoto(ont?.foto_ont_4),
        foto_ont_5: ambilUrlFoto(ont?.foto_ont_5),
    });

    const [hapusFoto, setHapusFoto] = useState({
        foto_ont_1: false,
        foto_ont_2: false,
        foto_ont_3: false,
        foto_ont_4: false,
        foto_ont_5: false,
    });

    const alihkanHapusFoto = (nama) => {
        const akanHapus = !hapusFoto[nama];
        setHapusFoto((sebelumnya) => ({ ...sebelumnya, [nama]: akanHapus }));
        if (akanHapus) {
            aturFormulir((sebelumnya) => ({ ...sebelumnya, [nama]: null }));
            aturPratampil((sebelumnya) => ({ ...sebelumnya, [nama]: null }));
        } else {
            aturPratampil((sebelumnya) => ({ ...sebelumnya, [nama]: ambilUrlFoto(ont?.[nama]) }));
        }
    };

    const tanganiUbah = (kejadian) => {
        const { name: nama, value: nilai, files: berkas } = kejadian.target;

        if (nama === "wilayah") {
            aturFormulir((sebelumnya) => ({ ...sebelumnya, wilayah: nilai, kecamatan: "", kelurahan: "" }));
            aturOpsiKelurahan([]);
            aturKelurahanManual(false);
            aturKecFokus(false);
            aturKelFokus(false);
        }
        if (nama === "kecamatan") {
            aturFormulir((sebelumnya) => ({ ...sebelumnya, kecamatan: nilai, kelurahan: "" }));
            aturOpsiKelurahan([]);
            aturKelurahanManual(false);
            return;
        }
        if (nama === "kelurahan") {
            aturFormulir((sebelumnya) => ({ ...sebelumnya, kelurahan: nilai }));
            return;
        }
        if (nama === "kode_ont") aturKodeDiubah(true);
        if (nama === "wilayah" && !kodeDiubah) {
            const wilayahDitemukan = wilayah?.find((w) => w.nama_wilayah === nilai);
            const kodeWil = wilayahDitemukan?.kode_wilayah;
            if (kodeWil) {
                fetch(resolveHref(`api/next-kode?kode_wilayah=${kodeWil}&type=ont`))
                    .then((r) => r.json())
                    .then((d) => {
                        if (d?.kode && !kodeDiubah) aturFormulir((sebelumnya) => ({ ...sebelumnya, wilayah: nilai, kode_ont: d.kode }));
                    })
                    .catch(() => { });
            }
        }

        if (berkas && berkas[0]) {
            aturFormulir((sebelumnya) => ({
                ...sebelumnya,
                [nama]: berkas[0],
            }));

            aturPratampil((sebelumnya) => ({
                ...sebelumnya,
                [nama]: URL.createObjectURL(berkas[0]),
            }));

            if (nama in hapusFoto) {
                setHapusFoto((sebelumnya) => ({ ...sebelumnya, [nama]: false }));
            }

            return;
        }

        aturFormulir((sebelumnya) => ({
            ...sebelumnya,
            [nama]: nilai,
        }));
    };

    const aturKoordinat = (lintang, bujur) => {
        aturFormulir((sebelumnya) => ({ ...sebelumnya, latitude: lintang, longitude: bujur }));
    };

    const tanganiKirim = (kejadian) => {
        kejadian.preventDefault();

        router.post(
            resolveHref(`update-ont/${ont.id}`),
            {
                ...formulir,
                hapus_foto_1: hapusFoto.foto_ont_1 ? 1 : 0,
                hapus_foto_2: hapusFoto.foto_ont_2 ? 1 : 0,
                hapus_foto_3: hapusFoto.foto_ont_3 ? 1 : 0,
                hapus_foto_4: hapusFoto.foto_ont_4 ? 1 : 0,
                hapus_foto_5: hapusFoto.foto_ont_5 ? 1 : 0,
            },
            {
                forceFormData: true,

                onSuccess: () => {
                    console.log("Data ONT berhasil diperbarui.");
                },

                onError: (galat) => {
                    console.log(galat);
                    const mentah = galat?.error || Object.values(galat || {})[0];
                    const pesan = Array.isArray(mentah) ? mentah[0] : mentah;
                    const pesanTampil = pesan || "Gagal memperbarui ONT. Periksa kembali isian formulir.";
                    window.dispatchEvent(new CustomEvent("layout:error", { detail: pesanTampil }));
                },
            }
        );
    };

    return (
        <TataLetakUtama>
            <div className="space-y-4">

                {/* Tajuk */}

                {/* Tajuk */}

                <div className="flex items-stretch justify-between gap-4 max-md:flex-row max-md:items-stretch max-md:gap-2">
                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 text-white shadow-md border border-white/10 max-md:flex max-md:min-w-0 max-md:items-center max-md:rounded-xl max-md:px-3 max-md:py-2.5">
                        <span className="text-sm font-semibold tracking-wide max-md:shrink-0 max-md:text-[13px] max-md:whitespace-nowrap">
                            Form Edit ONT
                        </span>

                        <span className="mx-3 opacity-60 max-md:mx-1.5 max-md:shrink-0">
                            /
                        </span>

                        <span className="text-xs font-light capitalize opacity-90 max-md:truncate max-md:text-[11px]">
                            {pengaturan?.nama_wilayah ?? "Wilayah belum ditentukan"}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        title="Kembali"
                        aria-label="Kembali"
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 px-4 py-2.5 text-xs font-medium text-white shadow-md transition hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-[0.98] max-md:rounded-lg max-md:px-4 max-md:py-4"
                    >
                        <FaArrowLeft size={14} />
                        <span className="max-md:hidden">Kembali</span>
                    </button>
                </div>

                {/* Formulir */}

                <div className="bg-white dark:bg-night-900 rounded-2xl shadow-sm border border-gray-100 dark:border-night-700 p-6 md:p-7 max-md:p-4">

                    <form onSubmit={tanganiKirim}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Kode ONT */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Kode ONT
                                </label>

                                <input
                                    name="kode_ont"
                                    type="text"
                                    value={formulir.kode_ont}
                                    onChange={tanganiUbah}
                                    placeholder="Masukkan kode ONT"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                                />
                            </div>

                            {/* Wilayah */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Wilayah
                                </label>

                                <select
                                    name="wilayah"
                                    value={formulir.wilayah}
                                    onChange={tanganiUbah}
                                    required
                                    className="capitalize w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Kecamatan
                                </label>

                                <input
                                    name="kecamatan"
                                    type="text"
                                    value={formulir.kecamatan}
                                    onChange={tanganiUbah}
                                    onFocus={() => aturKecFokus(true)}
                                    onBlur={() => setTimeout(() => aturKecFokus(false), 180)}
                                    placeholder={kecamatanMemuat ? "Memuat kecamatan..." : "Ketik kecamatan"}
                                    required
                                    autoComplete="off"
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                                />
                                {kecFokus && (() => {
                                    const masukan = (formulir.kecamatan || "").trim().toLowerCase();
                                    if (masukan.length < 1) return null;
                                    const filtered = opsiKecamatan.filter((opsi) => opsi.name.toLowerCase().includes(masukan)).slice(0, 6);
                                    if (filtered.length === 0 || filtered.some((o) => o.name.toLowerCase() === masukan)) return null;
                                    return (
                                        <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 shadow-lg">
                                            {filtered.map((opsi) => (
                                                <button
                                                    key={opsi.code}
                                                    type="button"
                                                    onMouseDown={(kejadian) => kejadian.preventDefault()}
                                                    onClick={() => {
                                                        aturFormulir((sebelumnya) => ({ ...sebelumnya, kecamatan: opsi.name, kelurahan: "" }));
                                                        aturKecFokus(false);
                                                        const code = opsi.code;
                                                        aturKelurahanMemuat(true);
                                                        fetch(resolveHref(`api/regions/kecamatan/${code}/kelurahan`))
                                                            .then((r) => r.json())
                                                            .then((j) => {
                                                                const d = Array.isArray(j?.data) ? j.data : [];
                                                                if (d.length === 0) { aturKelurahanManual(true); aturOpsiKelurahan([]); }
                                                                else { aturKelurahanManual(false); aturOpsiKelurahan(d); }
                                                            })
                                                            .catch(() => { aturKelurahanManual(true); })
                                                            .finally(() => aturKelurahanMemuat(false));
                                                    }}
                                                    className="w-full px-4 py-2.5 text-left capitalize text-sm hover:bg-[#AB3C3C]/10 hover:text-[#AB3C3C] transition"
                                                >
                                                    <span className="font-medium">{opsi.name}</span>

                                                </button>
                                            ))}
                                        </div>
                                    );
                                })()}
                                {kecamatanMemuat && <p className="mt-1 text-[11px] text-gray-400 dark:text-night-500">Memuat kecamatan...</p>}
                            </div>

                            {/* Kelurahan */}

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Kelurahan
                                </label>

                                <input
                                    name="kelurahan"
                                    type="text"
                                    value={formulir.kelurahan}
                                    onChange={tanganiUbah}
                                    onFocus={() => aturKelFokus(true)}
                                    onBlur={() => setTimeout(() => aturKelFokus(false), 180)}
                                    placeholder={kelurahanMemuat ? "Memuat..." : kelurahanManual && opsiKelurahan.length === 0 ? "Kelurahan tidak terdeteksi – isi manual" : "Ketik kelurahan"}
                                    required
                                    autoComplete="off"
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500 disabled:bg-gray-50"
                                />
                                {kelFokus && (() => {
                                    const masukan = (formulir.kelurahan || "").trim().toLowerCase();
                                    if (masukan.length < 1 || opsiKelurahan.length === 0 || kelurahanManual) return null;
                                    const filtered = opsiKelurahan.filter((opsi) => opsi.name.toLowerCase().includes(masukan)).slice(0, 6);
                                    if (filtered.length === 0 || filtered.some((o) => o.name.toLowerCase() === masukan)) return null;
                                    return (
                                        <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-auto rounded-xl border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 shadow-lg">
                                            {filtered.map((opsi) => (
                                                <button
                                                    key={opsi.code}
                                                    type="button"
                                                    onMouseDown={(kejadian) => kejadian.preventDefault()}
                                                    onClick={() => {
                                                        aturFormulir((sebelumnya) => ({ ...sebelumnya, kelurahan: opsi.name }));
                                                        aturKelFokus(false);
                                                    }}
                                                    className="w-full px-4 py-2.5 text-left capitalize text-sm hover:bg-[#AB3C3C]/10 hover:text-[#AB3C3C] transition"
                                                >
                                                    <span className="font-medium">{opsi.name}</span>

                                                </button>
                                            ))}
                                        </div>
                                    );
                                })()}
                                {kelurahanManual && (
                                    <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-300">Kelurahan tidak terdeteksi – silakan isi manual.</p>
                                )}
                                {kelurahanMemuat && <p className="mt-1 text-[11px] text-gray-400 dark:text-night-500">Memuat kelurahan...</p>}
                            </div>

                            {/* Petugas */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Petugas Lapangan
                                </label>

                                <input
                                    name="nama_petugas"
                                    type="text"
                                    value={formulir.nama_petugas}
                                    onChange={tanganiUbah}
                                    placeholder="Masukkan nama petugas"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                                />
                            </div>

                            {/* Status */}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formulir.status}
                                    onChange={tanganiUbah}
                                    required
                                    className="capitalize w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Titik Lokasi <span className="font-normal text-gray-400 dark:text-night-500">(klik peta / cari alamat)</span>
                                </label>

                                <PemilihLokasi
                                    lintang={formulir.latitude}
                                    bujur={formulir.longitude}
                                    jenis="ont"
                                    status={formulir.status}
                                    onChange={aturKoordinat}
                                />
                            </div>

                            {/* Koordinat */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Latitude
                                </label>

                                <input
                                    name="latitude"
                                    type="text"
                                    value={formulir.latitude}
                                    onChange={tanganiUbah}
                                    placeholder="Contoh: -7.7956"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Longitude
                                </label>

                                <input
                                    name="longitude"
                                    type="text"
                                    value={formulir.longitude}
                                    onChange={tanganiUbah}
                                    placeholder="Contoh: 110.3695"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                                />
                            </div>

                            {/* Foto */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                    Foto ONT
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* Foto 1 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500 dark:text-night-400">
                                                Foto 1
                                            </label>

                                            {(pratampil.foto_ont_1 || ont?.foto_ont_1) && (
                                                <button
                                                    type="button"
                                                    onClick={() => alihkanHapusFoto("foto_ont_1")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_ont_1 ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20" : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20"}`}
                                                >
                                                    {hapusFoto.foto_ont_1 ? (<><FaUndo size={10} /> Batal</>) : (<><FaTrash size={10} /> Hapus</>)}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_ont_1 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15">
                                                <span className="px-3 text-center text-xs text-amber-700 dark:text-amber-300">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-night-700 bg-gray-100 dark:bg-night-800">
                                                {pratampil.foto_ont_1 ? (
                                                    <img
                                                        src={pratampil.foto_ont_1}
                                                        alt="Foto ONT 1"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400 dark:text-night-500">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_ont_1"
                                            type="file"
                                            accept="image/*"
                                            onChange={tanganiUbah}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-night-700 rounded-xl text-sm text-gray-600 dark:text-night-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 2 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500 dark:text-night-400">
                                                Foto 2
                                            </label>

                                            {(pratampil.foto_ont_2 || ont?.foto_ont_2) && (
                                                <button
                                                    type="button"
                                                    onClick={() => alihkanHapusFoto("foto_ont_2")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_ont_2 ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20" : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20"}`}
                                                >
                                                    {hapusFoto.foto_ont_2 ? (<><FaUndo size={10} /> Batal</>) : (<><FaTrash size={10} /> Hapus</>)}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_ont_2 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15">
                                                <span className="px-3 text-center text-xs text-amber-700 dark:text-amber-300">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-night-700 bg-gray-100 dark:bg-night-800">
                                                {pratampil.foto_ont_2 ? (
                                                    <img
                                                        src={pratampil.foto_ont_2}
                                                        alt="Foto ONT 2"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400 dark:text-night-500">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_ont_2"
                                            type="file"
                                            accept="image/*"
                                            onChange={tanganiUbah}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-night-700 rounded-xl text-sm text-gray-600 dark:text-night-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 3 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500 dark:text-night-400">
                                                Foto 3
                                            </label>

                                            {(pratampil.foto_ont_3 || ont?.foto_ont_3) && (
                                                <button
                                                    type="button"
                                                    onClick={() => alihkanHapusFoto("foto_ont_3")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_ont_3 ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20" : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20"}`}
                                                >
                                                    {hapusFoto.foto_ont_3 ? (<><FaUndo size={10} /> Batal</>) : (<><FaTrash size={10} /> Hapus</>)}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_ont_3 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15">
                                                <span className="px-3 text-center text-xs text-amber-700 dark:text-amber-300">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-night-700 bg-gray-100 dark:bg-night-800">
                                                {pratampil.foto_ont_3 ? (
                                                    <img
                                                        src={pratampil.foto_ont_3}
                                                        alt="Foto ONT 3"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400 dark:text-night-500">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_ont_3"
                                            type="file"
                                            accept="image/*"
                                            onChange={tanganiUbah}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-night-700 rounded-xl text-sm text-gray-600 dark:text-night-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 4 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500 dark:text-night-400">
                                                Foto 4
                                            </label>

                                            {(pratampil.foto_ont_4 || ont?.foto_ont_4) && (
                                                <button
                                                    type="button"
                                                    onClick={() => alihkanHapusFoto("foto_ont_4")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_ont_4 ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20" : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20"}`}
                                                >
                                                    {hapusFoto.foto_ont_4 ? (<><FaUndo size={10} /> Batal</>) : (<><FaTrash size={10} /> Hapus</>)}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_ont_4 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15">
                                                <span className="px-3 text-center text-xs text-amber-700 dark:text-amber-300">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-night-700 bg-gray-100 dark:bg-night-800">
                                                {pratampil.foto_ont_4 ? (
                                                    <img
                                                        src={pratampil.foto_ont_4}
                                                        alt="Foto ONT 4"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400 dark:text-night-500">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_ont_4"
                                            type="file"
                                            accept="image/*"
                                            onChange={tanganiUbah}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-night-700 rounded-xl text-sm text-gray-600 dark:text-night-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                    {/* Foto 5 */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-xs text-gray-500 dark:text-night-400">
                                                Foto 5
                                            </label>

                                            {(pratampil.foto_ont_5 || ont?.foto_ont_5) && (
                                                <button
                                                    type="button"
                                                    onClick={() => alihkanHapusFoto("foto_ont_5")}
                                                    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition ${hapusFoto.foto_ont_5 ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20" : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20"}`}
                                                >
                                                    {hapusFoto.foto_ont_5 ? (<><FaUndo size={10} /> Batal</>) : (<><FaTrash size={10} /> Hapus</>)}
                                                </button>
                                            )}
                                        </div>

                                        {hapusFoto.foto_ont_5 ? (
                                            <div className="mb-2 flex h-40 items-center justify-center rounded-lg border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/15">
                                                <span className="px-3 text-center text-xs text-amber-700 dark:text-amber-300">
                                                    Akan dihapus saat disimpan
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mb-2 overflow-hidden rounded-lg border border-gray-200 dark:border-night-700 bg-gray-100 dark:bg-night-800">
                                                {pratampil.foto_ont_5 ? (
                                                    <img
                                                        src={pratampil.foto_ont_5}
                                                        alt="Foto ONT 5"
                                                        className="h-40 w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-40 items-center justify-center">
                                                        <span className="text-xs text-gray-400 dark:text-night-500">
                                                            Belum ada foto
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            name="foto_ont_5"
                                            type="file"
                                            accept="image/*"
                                            onChange={tanganiUbah}
                                            className="w-full px-4 py-2 border border-gray-200 dark:border-night-700 rounded-xl text-sm text-gray-600 dark:text-night-300 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 shadow-sm"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}

                        <div className="mt-5">

                            <label className="block text-sm font-medium text-gray-700 dark:text-night-200 mb-2">
                                Deskripsi
                            </label>

                            <textarea
                                name="deskripsi_ont"
                                value={formulir.deskripsi_ont}
                                onChange={tanganiUbah}
                                rows="4"
                                placeholder="Masukkan deskripsi..."
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-night-700 bg-white dark:bg-night-900 rounded-xl outline-none resize-none focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 transition shadow-sm placeholder:text-gray-400 dark:placeholder:text-night-500"
                            />

                        </div>

                        {/* Simpan */}

                        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-night-700 max-md:flex-col-reverse max-md:items-stretch">

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
        </TataLetakUtama>
    );
}
