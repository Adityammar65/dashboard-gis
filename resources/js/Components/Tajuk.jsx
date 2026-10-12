import { memo, useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaWifi, FaTimes, FaUserCircle } from "react-icons/fa";
import { LuUtilityPole } from "react-icons/lu";
import { IoMdArrowDropdown, IoMdNotifications } from "react-icons/io";
import { IoIosSettings, IoIosLogOut } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { usePage, router } from "@inertiajs/react";
import useDasar, { aset } from "../hooks/useDasar";

const Tajuk = memo(function Tajuk({ saatMenu }) {
    const { url, props } = usePage();
    const jumlahBelumDibaca = Number(props?.notifikasiBelumDibaca || 0);
    const user = props?.auth?.username ?? "";
    const dasar = useDasar();

    const [kueri, aturKueri] = useState("");
    const [saringAset, aturSaringAset] = useState("");
    const [hasil, aturHasil] = useState([]);
    const [buka, aturBuka] = useState(false);
    const [memuat, aturMemuat] = useState(false);
    const [cariSelulerBuka, aturCariSelulerBuka] = useState(false);
    const [selulerSibuk, aturSelulerSibuk] = useState(false);
    const [pemberitahuanSeluler, aturPemberitahuanSeluler] = useState("");
    const [profilBuka, aturProfilBuka] = useState(false);
    const rujukanPembungkusSeluler = useRef(null);
    const rujukanProfil = useRef(null);
    const rujukanPembungkus = useRef(null);
    const rujukanBatal = useRef(null);

    const tanganiUbahPilihan = useCallback((kejadian) => {
        const nilai = kejadian.target.value;
        if (v === "Tiang" || v === "tiang") aturSaringAset("tiang");
        else if (v === "ONT" || v === "ont") aturSaringAset("ont");
        else aturSaringAset("");
    }, []);

    const ambilHasilCari = useCallback(async (q, jenis, signal) => {
        const paramJenis = type ? `&type=${encodeURIComponent(jenis)}` : "";
        const urlCari = `${dasar}/api/search`.replace(/\/+/g, '/') + `?q=${encodeURIComponent(q)}${paramJenis}`;
        const tanggapan = await fetch(urlCari, {
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
            signal,
            credentials: 'same-origin',
        });
        if (!tanggapan.ok) throw new Error('search failed');
        const data = await tanggapan.json();
        return Array.isArray(data.hasil) ? data.hasil : [];
    }, [dasar]);

    useEffect(() => {
        if (rujukanBatal.current) rujukanBatal.current.abort();
        const q = kueri.trim();
        if (q.length < 2) {
            aturHasil([]);
            aturBuka(false);
            aturMemuat(false);
            return;
        }
        const pewaktu = setTimeout(async () => {
            const pengendali = new AbortController();
            rujukanBatal.current = controller;
            aturMemuat(true);
            try {
                const daftar = await ambilHasilCari(q, saringAset, pengendali.signal);
                aturHasil(daftar);
                aturBuka(daftar.length > 0);
            } catch (kejadian) {
                if (e.name !== 'AbortError') {
                    aturHasil([]);
                    aturBuka(false);
                }
            } finally {
                aturMemuat(false);
            }
        }, 300);
        return () => clearTimeout(pewaktu);
    }, [kueri, saringAset, dasar, ambilHasilCari]);

    useEffect(() => {
        const penangan = (kejadian) => {
            if (rujukanPembungkus.current && !rujukanPembungkus.current.contains(kejadian.tujuan)) {
                aturBuka(false);
            }
            if (rujukanPembungkusSeluler.current && !rujukanPembungkusSeluler.current.contains(kejadian.tujuan)) {
                aturCariSelulerBuka(false);
            }
            if (rujukanProfil.current && !rujukanProfil.current.contains(kejadian.tujuan)) {
                aturProfilBuka(false);
            }
        };
        const penanganLepas = (kejadian) => {
            if (kejadian.key === "Escape") {
                aturProfilBuka(false);
                aturCariSelulerBuka(false);
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        document.addEventListener('keydown', escapeHandler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
            document.removeEventListener('keydown', escapeHandler);
        };
    }, []);

    const tanganiKlikHasil = useCallback((item) => {
        if (!item?.href) return;
        aturBuka(false);
        aturCariSelulerBuka(false);
        aturKueri("");
        const tautan = `${dasar}/${item.href}`.replace(/\/+/g, '/');
        router.get(href);
    }, [dasar]);

    const selesaikanAlihan = useCallback((item, asetDitentukan) => {
        if (!item) return null;
        if (item.match === 'kode' || item.match === 'petugas' || asetDitentukan || !item.wilayahId) {
            return item.href || null;
        }
        return `wilayah?wilayah=${item.wilayahId}`;
    }, []);

    const tanganiKirimSeluler = useCallback(async (kejadian) => {
        e?.preventDefault();
        const q = kueri.trim();
        if (q.length < 2) {
            aturPemberitahuanSeluler("Masukkan minimal 2 karakter");
            return;
        }
        if (selulerSibuk) return;
        aturPemberitahuanSeluler("");
        aturSelulerSibuk(true);
        try {
            const pengendali = new AbortController();
            const daftar = await ambilHasilCari(q, saringAset, pengendali.signal);
            const teratas = daftar[0];
            if (!top) {
                aturPemberitahuanSeluler("Tidak ditemukan, coba kata kunci lain");
                return;
            }
            const tujuan = selesaikanAlihan(teratas, !!saringAset);
            if (!tujuan) {
                aturPemberitahuanSeluler("Tidak ditemukan, coba kata kunci lain");
                return;
            }
            aturCariSelulerBuka(false);
            aturPemberitahuanSeluler("");
            aturKueri("");
            router.get(`${dasar}/${target}`.replace(/\/+/g, '/'));
        } catch (err) {
            if (err?.name !== 'AbortError') {
                aturPemberitahuanSeluler("Pencarian gagal, coba lagi");
            }
        } finally {
            aturSelulerSibuk(false);
        }
    }, [kueri, saringAset, dasar, selulerSibuk, ambilHasilCari, selesaikanAlihan]);

    return (
        <header className="sticky top-0 z-50 flex h-18 items-center justify-between bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-6 py-2 max-md:gap-2 max-md:px-3 max-md:h-[60px] max-md:min-h-[60px] max-md:max-h-[60px] max-md:py-0">

            {/* Logo */}

            <div className="flex items-center gap-5 max-md:gap-2">
                {saatMenu && (
                    <button
                        type="button"
                        onClick={saatMenu}
                        aria-label="Buka menu navigasi"
                        className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 max-md:flex"
                    >
                        <FiMenu size={20} />
                    </button>
                )}
                <div>
                    <img
                        src={aset("public/Assets/Logo.png")}
                        alt="Logo"
                        className="w-10 max-md:w-8"
                        width="40"
                        height="40"
                        memuat="lazy"
                        decoding="async"
                    />
                </div>

                <h1 className="text-xl font-bold text-white max-md:text-base">
                    GIS Dashboard
                </h1>
            </div>

            {/* Pencarian */}

            <div ref={rujukanPembungkus} className="absolute left-1/2 w-[400px] -translate-x-1/2 flex gap-3 max-md:hidden">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={kueri}
                        onChange={(kejadian) => aturKueri(kejadian.target.value)}
                        onFocus={() => {
                            if (hasil.length > 0 && kueri.trim().length >= 2) aturBuka(true);
                        }}
                        placeholder="Cari Aset..."
                        className="w-full rounded-full bg-white px-5 py-2 pr-10 text-sm text-black outline-none focus:bg-white"
                    />

                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-black transition hover:text-[#ab3c3c]" />

                    {/* Hasil Pencarian */}

                    {buka && (
                        <div className="absolute left-0 top-full mt-2 w-full max-h-[320px] overflow-auto rounded-xl bg-white shadow-xl border border-gray-200 z-[100] dark:bg-night-900 dark:border-night-700">
                            {memuat ? (
                                <div className="px-4 py-3 text-xs text-gray-500 dark:text-night-400">Mencari...</div>
                            ) : hasil.length > 0 ? (
                                hasil.map((item) => {
                                    const apakahKode = item.match === 'kode';
                                    const Ikon = item.type === 'tiang' ? LuUtilityPole : FaWifi;
                                    return (
                                        <button
                                            key={`${item.type}-${item.id}-${item.match}-${item.href}`}
                                            type="button"
                                            onMouseDown={(kejadian) => e.preventDefault()}
                                            onClick={() => tanganiKlikHasil(item)}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition dark:hover:bg-night-800 dark:border-night-700"
                                        >
                                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${item.type === 'tiang' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300' : 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300'}`}>
                                                <Ikon size={14} />
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-800 truncate flex items-center gap-2 dark:text-night-200">
                                                    <span className="truncate">{apakahKode ? item.kode : item.label}</span>
                                                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] text-white ${item.type === 'tiang' ? 'bg-blue-600' : 'bg-sky-500'}`}>{item.type.toUpperCase()}</span>
                                                    {!apakahKode && <span className="shrink-0 text-[10px] text-gray-400 dark:text-night-500">→ Filter</span>}
                                                    {apakahKode && <span className="shrink-0 text-[10px] text-gray-400 dark:text-night-500">→ Detail</span>}
                                                </p>
                                                <p className="text-[11px] text-gray-500 truncate dark:text-night-400">
                                                    {apakahKode ? `${item.match}: ${item.matchedValue} • ${item.label}` : `${item.match}: ${item.matchedValue}`}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : null}
                        </div>
                    )}
                </div>
                <div className="flex items-center bg-white rounded-full gap-2">
                    <select value={saringAset === "tiang" ? "Tiang" : saringAset === "ont" ? "ONT" : ""} onChange={tanganiUbahPilihan} className="capitalize text-xs text-gray-800 outline-none appearance-none px-3 py-2 bg-transparent">
                        <option value="">Pilih Aset</option>
                        <option value="Tiang">Tiang</option>
                        <option value="ONT">ONT</option>
                    </select>

                    <IoMdArrowDropdown className="pr-3 w-8 text-gray-600" />
                </div>
            </div>

            {/* Aksi Tajuk */}

            <div className="flex items-center gap-2 max-md:gap-1">

                {/* Cari Mobile */}

                <div ref={rujukanPembungkusSeluler} className="relative hidden max-md:block md:hidden">
                    <button
                        type="button"
                        onClick={() => {
                            aturCariSelulerBuka(!cariSelulerBuka);
                            aturPemberitahuanSeluler("");
                        }}
                        aria-label={cariSelulerBuka ? "Tutup pencarian" : "Buka pencarian"}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                    >
                        {cariSelulerBuka ? <FaTimes size={16} /> : <FaSearch size={16} />}
                    </button>

                    {cariSelulerBuka && (
                        <div className="absolute right-0 top-full z-[100] mt-2 max-h-[70vh] w-[calc(100vw-6rem)] max-w-[320px] overflow-auto rounded-2xl border border-white/20 dark:border-night-700 bg-[#6F2424] dark:bg-night-900 p-3 shadow-xl">
                            <form onSubmit={tanganiKirimSeluler}>
                                <div className="relative">
                                    <input
                                        type="search"
                                        enterKeyHint="search"
                                        value={kueri}
                                        disabled={selulerSibuk}
                                        onChange={(kejadian) => {
                                            aturKueri(kejadian.target.value);
                                            aturPemberitahuanSeluler("");
                                        }}
                                        placeholder="Cari Aset..."
                                        className="w-full rounded-full bg-white px-4 py-2.5 pr-10 text-sm text-black outline-none disabled:opacity-70"
                                    />
                                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-black" />
                                </div>
                            </form>
                            {selulerSibuk && (
                                <p className="mt-2 px-1 text-xs text-white/80">Mencari...</p>
                            )}
                            {!selulerSibuk && pemberitahuanSeluler && (
                                <p className="mt-2 px-1 text-xs text-white/90">{pemberitahuanSeluler}</p>
                            )}
                            {!selulerSibuk && !pemberitahuanSeluler && (
                                <p className="mt-2 px-1 text-[11px] text-white/60">Tekan cari pada keyboard untuk menemukan aset</p>
                            )}
                            <div className="mt-2 flex items-center justify-between rounded-full bg-white px-3 py-1">
                                <select value={saringAset === "tiang" ? "Tiang" : saringAset === "ont" ? "ONT" : ""} onChange={tanganiUbahPilihan} className="capitalize w-full appearance-none bg-transparent px-1 py-1.5 text-xs text-gray-800 outline-none">
                                    <option value="">Pilih Aset</option>
                                    <option value="Tiang">Tiang</option>
                                    <option value="ONT">ONT</option>
                                </select>
                                <IoMdArrowDropdown className="shrink-0 text-gray-600" />
                            </div>
                        </div>
                    )}
                </div>

                <a href={`${dasar}/notifikasi`.replace(/\/+/g, '/')} className="relative hidden md:block max-md:shrink-0">
                    <IoMdNotifications size={50} className="px-3 text-white/65 hover:text-white transition-all duration-200 max-md:h-10 max-md:w-10 max-md:px-2 max-md:scale-100" />
                    {jumlahBelumDibaca > 0 && (
                        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white max-md:h-4 max-md:min-w-4 max-md:px-0.5 max-md:text-[8px] max-md:leading-none max-md:right-1 max-md:top-1">
                            {jumlahBelumDibaca > 99 ? "99+" : jumlahBelumDibaca}
                        </span>
                    )}
                </a>

                {/* Profil */}

                <div ref={rujukanProfil} className="relative hidden md:block max-md:shrink-0">
                    <button
                        type="button"
                        onClick={() => aturProfilBuka(!profilBuka)}
                        aria-label={profilBuka ? "Tutup menu profil" : "Buka menu profil"}
                        aria-expanded={profilBuka}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                    >
                        <FaUserCircle size={20} className="max-md:text-lg" />
                    </button>

                    {profilBuka && (
                        <div className="absolute right-0 top-full z-[100] mt-2 w-56 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-white/20 bg-[#6F2424] shadow-xl">
                            <div className="truncate px-4 py-3">
                                <p className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                                    Pengguna
                                </p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-white" title={user}>
                                    {user || "-"}
                                </p>
                            </div>
                            <div className="bg-white py-1 dark:bg-night-900">
                                <a
                                    href={`${dasar}/pengaturan`.replace(/\/+/g, '/')}
                                    onClick={() => aturProfilBuka(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#AB3C3C] dark:text-night-200 dark:hover:bg-night-800"
                                >
                                    <IoIosSettings size={18} className="shrink-0 text-gray-400 dark:text-night-500" />
                                    Pengaturan Profil
                                </a>
                                <a
                                    href={`${dasar}/logout`.replace(/\/+/g, '/')}
                                    onClick={(kejadian) => {
                                        if (!confirm("Kembali ke Halaman Login?")) {
                                            e.preventDefault();
                                        } else {
                                            aturProfilBuka(false);
                                        }
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-[#AB3C3C] dark:text-night-200 dark:hover:bg-night-800"
                                >
                                    <IoIosLogOut size={18} className="shrink-0 text-gray-400 dark:text-night-500" />
                                    Keluar
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
});

export default Tajuk;
