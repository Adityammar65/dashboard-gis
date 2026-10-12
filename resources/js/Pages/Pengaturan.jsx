import TataLetakUtama from "../Layouts/TataLetakUtama";
import PengalihTema from "../Components/PengalihTema";
import { MasukanOtentikasi, KolomKataSandi } from "../Components/BidangOtentikasi";
import { FaMapMarked, FaSave, FaUserCog, FaKey, FaMoon, FaCheck, FaTimes, FaUserShield } from "react-icons/fa";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Pengaturan({ wilayah, permintaanSetelUlang = [], riwayatSetelUlang = [] }) {
    const { props } = usePage();
    const { pengaturan, auth, errors = {} } = props;
    const userSaatIni = auth?.username ?? "";
    const [wilayahTerpilih, aturWilayahTerpilih] = useState("");
    const [userBaru, aturUserBaru] = useState("");
    const [kataSandiSaatIni, aturKataSandiSaatIni] = useState("");
    const [kataSandiBaru, aturKataSandiBaru] = useState("");
    const [konfirmasiKataSandi, aturKonfirmasiKataSandi] = useState("");
    const [tampilKataSandiSaatIni, aturTampilKataSandiSaatIni] = useState(false);
    const [tampilKataSandiBaru, aturTampilKataSandiBaru] = useState(false);
    const [tampilKonfirmasiKataSandi, aturTampilKonfirmasiKataSandi] = useState(false);

    const menungguSaya = permintaanSetelUlang.filter(
        (r) => r.username === userSaatIni || r.requested_by === userSaatIni
    );
    const menungguUserSaya = menungguSaya.find((r) => (r.request_type ?? "password_reset") === "username_change");
    const menungguKataSandiSaya = menungguSaya.find((r) => {
        const t = r.request_type ?? "password_reset";
        return t === "password_change" || t === "password_reset";
    });

    const ambilLabelPermintaan = (item) => {
        const t = item?.request_type ?? "password_reset";
        if (t === "username_change") return "Ubah Username";
        if (t === "password_change") return "Ubah Kata Sandi";
        return "Reset Kata Sandi";
    };

    const ambilRincianPermintaan = (item) => {
        const t = item?.request_type ?? "password_reset";
        if (t === "username_change" && item?.new_username) {
            return `${item.username} → ${item.new_username}`;
        }
        if (t === "password_change") {
            return `Ubah kata sandi akun ${item.username}`;
        }
        return `Reset kata sandi akun ${item.username}`;
    };

    const apakahPermintaanSendiri = (item) =>
        item?.username === userSaatIni || item?.requested_by === userSaatIni;

    const tanganiSimpan = () => {
        if (!wilayahTerpilih) {
            return;
        }

        router.post("update-pengaturan", {
            wilayah: wilayahTerpilih,
        });
    };

    const nilaiUser = userBaru.trim();
    const inginUbahUser =
        nilaiUser !== "" && nilaiUser !== userSaatIni && !menungguUserSaya;
    const kataSandiTerisi =
        kataSandiSaatIni !== "" || kataSandiBaru !== "" || konfirmasiKataSandi !== "";
    const inginUbahKataSandi =
        kataSandiSaatIni !== "" && kataSandiBaru !== "" && konfirmasiKataSandi !== "" && !menungguKataSandiSaya;
    const dapatMengajukan = inginUbahUser || inginUbahKataSandi;

    const tanganiAjukanPermintaan = () => {
        const muatan = {};
        const bersihkanUser = inginUbahUser;
        const bersihkanKataSandi = inginUbahKataSandi || (kataSandiTerisi && !menungguKataSandiSaya && !inginUbahUser);

        if (inginUbahUser) {
            muatan.username = nilaiUser;
        }

        if (kataSandiTerisi && !menungguKataSandiSaya) {
            muatan.current_password = kataSandiSaatIni;
            muatan.password = kataSandiBaru;
            muatan.password_confirmation = konfirmasiKataSandi;
        }

        if (Object.keys(muatan).length === 0) {
            return;
        }

        router.post("update-profil", muatan, {
            onSuccess: () => {
                if (bersihkanUser) aturUserBaru("");
                if (bersihkanKataSandi) {
                    aturKataSandiSaatIni("");
                    aturKataSandiBaru("");
                    aturKonfirmasiKataSandi("");
                }
            },
        });
    };

    const tanganiSetujuiReset = (item) => {
        const id = typeof item === "object" ? item.id : item;
        const label = typeof item === "object" ? ambilRincianPermintaan(item) : `akun "${item}"`;
        if (!window.confirm(`Setujui ${ambilLabelPermintaan(typeof item === "object" ? item : null)} untuk ${label}?`)) {
            return;
        }

        router.post(`reset-requests/${id}/approve`);
    };

    const tanganiTolakReset = (item) => {
        const id = typeof item === "object" ? item.id : item;
        const label = typeof item === "object" ? ambilRincianPermintaan(item) : `akun "${item}"`;
        if (!window.confirm(`Tolak ${ambilLabelPermintaan(typeof item === "object" ? item : null)} untuk ${label}?`)) {
            return;
        }

        router.post(`reset-requests/${id}/reject`);
    };

    const formatWaktu = (value) => {
        if (!value) return "-";
        try {
            return new Date(value).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
            });
        } catch {
            return String(value);
        }
    };

    return (
        <TataLetakUtama>
            <div className="space-y-4">

                {/* Tajuk */}

                <div className="rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 text-white shadow-md border border-white/10 max-md:flex max-md:min-w-0 max-md:items-center max-md:rounded-xl max-md:px-3 max-md:py-2.5">
                    <span className="text-sm font-semibold tracking-wide max-md:shrink-0 max-md:text-[13px] max-md:whitespace-nowrap">
                        Pengaturan
                    </span>

                    <span className="mx-3 opacity-60 max-md:mx-1.5 max-md:shrink-0">
                        /
                    </span>

                    <span className="text-xs font-light capitalize opacity-90 max-md:truncate max-md:text-[11px]">
                        {pengaturan?.nama_wilayah ?? "Wilayah belum ditentukan"}
                    </span>
                </div>

                {/* Profil Pengguna */}

                <div className="rounded-2xl bg-white dark:bg-night-900 p-5 shadow-sm border border-gray-100 dark:border-night-700 max-md:p-4">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8EAEA] text-[#AB3C3C] dark:bg-night-800 dark:text-night-200">
                            <FaUserCog />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-night-200">
                                Profil Pengguna
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-night-400">
                                Ajukan perubahan username dan kata sandi — berlaku setelah disetujui admin lain
                            </p>
                        </div>
                    </div>

                    {menungguSaya.length > 0 && (
                        <div className="mb-4 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-xs text-amber-800 dark:text-amber-200">
                            Permintaanmu masih menunggu persetujuan ({menungguSaya.length}):{" "}
                            {menungguSaya.map(ambilRincianPermintaan).join(" • ")}. Kamu tidak dapat menyetujui permintaan sendiri.
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Ubah Username */}

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-5 shadow-sm">
                            <p className="mb-2 block text-sm font-medium text-gray-700 dark:text-night-200">
                                Username Saat Ini
                            </p>

                            <p className="truncate text-base font-bold text-gray-800 dark:text-night-200" title={userSaatIni}>
                                {userSaatIni || "Belum diketahui"}
                            </p>

                            <div className="mt-5">
                                <MasukanOtentikasi
                                    id="username-baru"
                                    type="text"
                                    label="Username Baru"
                                    value={userBaru}
                                    onChange={(kejadian) => aturUserBaru(kejadian.target.value)}
                                    placeholder="Masukkan username baru"
                                    autoComplete="username"
                                    error={errors.username}
                                    disabled={!!menungguUserSaya}
                                />
                            </div>

                            {menungguUserSaya && (
                                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                                    Pengajuan {menungguUserSaya.username} → {menungguUserSaya.new_username} menunggu persetujuan.
                                </p>
                            )}
                        </div>

                        {/* Ubah Kata Sandi */}

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-gray-800 dark:text-night-200">
                                <FaKey className="text-xs text-gray-400 dark:text-night-500" />
                                <p className="text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                    Ubah Kata Sandi
                                </p>
                            </div>

                            <KolomKataSandi
                                id="sandi-saat-ini"
                                label="Kata Sandi Saat Ini"
                                value={kataSandiSaatIni}
                                onChange={(kejadian) => aturKataSandiSaatIni(kejadian.target.value)}
                                placeholder="Masukkan kata sandi saat ini"
                                autoComplete="current-password"
                                tampil={tampilKataSandiSaatIni}
                                saatAlih={() => aturTampilKataSandiSaatIni(!tampilKataSandiSaatIni)}
                                error={errors.current_password}
                                disabled={!!menungguKataSandiSaya}
                            />

                            <div className="mt-5">
                                <KolomKataSandi
                                    id="sandi-baru"
                                    label="Kata Sandi Baru (min. 8 karakter)"
                                    value={kataSandiBaru}
                                    onChange={(kejadian) => aturKataSandiBaru(kejadian.target.value)}
                                    placeholder="Masukkan kata sandi baru"
                                    autoComplete="new-password"
                                    minLength={8}
                                    tampil={tampilKataSandiBaru}
                                    saatAlih={() => aturTampilKataSandiBaru(!tampilKataSandiBaru)}
                                    error={errors.password}
                                    disabled={!!menungguKataSandiSaya}
                                />
                            </div>

                            <div className="mt-5">
                                <KolomKataSandi
                                    id="sandi-konfirmasi"
                                    label="Konfirmasi Kata Sandi Baru"
                                    value={konfirmasiKataSandi}
                                    onChange={(kejadian) => aturKonfirmasiKataSandi(kejadian.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    autoComplete="new-password"
                                    minLength={8}
                                    tampil={tampilKonfirmasiKataSandi}
                                    saatAlih={() => aturTampilKonfirmasiKataSandi(!tampilKonfirmasiKataSandi)}
                                    disabled={!!menungguKataSandiSaya}
                                />
                            </div>

                            {menungguKataSandiSaya && (
                                <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                                    Pengajuan ubah kata sandi untuk {menungguKataSandiSaya.username} menunggu persetujuan.
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Satu tombol pengajuan */}

                    <div className="mt-6 flex justify-end max-md:justify-stretch">
                        <button
                            type="button"
                            onClick={tanganiAjukanPermintaan}
                            disabled={!dapatMengajukan}
                            className="flex items-center gap-2 rounded-xl bg-[#ab3c3c] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#68182A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none max-md:w-full max-md:justify-center"
                        >
                            <FaSave />
                            Ajukan Permintaan
                        </button>
                    </div>

                </div>

                {/* Tampilan */}

                <div className="rounded-2xl bg-white dark:bg-night-900 p-5 shadow-sm border border-gray-100 dark:border-night-700 max-md:p-4 dark:bg-night-900 dark:border-night-700">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8EAEA] text-[#AB3C3C] dark:bg-night-800 dark:text-amber-300">
                            <FaMoon />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-night-200">
                                Tampilan
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-night-400">
                                Pilih tema terang atau gelap untuk dashboard GIS
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-5 shadow-sm dark:bg-night-900 dark:border-night-700">
                            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                Tema Aktif
                            </p>
                            <PengalihTema variant="switch" />
                        </div>

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-gradient-to-b from-gray-50 to-white dark:from-night-800/60 dark:to-night-900 p-5 shadow-sm dark:from-night-800/60 dark:to-night-900 dark:border-night-700">
                            <p className="mb-1 text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                Catatan
                            </p>
                            <p className="text-sm text-gray-600 dark:text-night-300">
                                Pilihan tema tersimpan otomatis di perangkat ini dan berlaku untuk semua halaman termasuk peta.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Wilayah Operasi */}

                <div className="rounded-2xl bg-white dark:bg-night-900 p-5 shadow-sm border border-gray-100 dark:border-night-700 max-md:p-4 dark:bg-night-900 dark:border-night-700">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8EAEA] text-[#AB3C3C] dark:bg-night-800 dark:text-night-200">
                            <FaMapMarked />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-night-200">
                                Wilayah Operasi
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-night-400">
                                Tentukan wilayah operasi yang digunakan pada dashboard GIS
                            </p>
                        </div>
                    </div>

                    {/* Ubah Wilayah */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Wilayah Aktif */}

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-gradient-to-b from-gray-50 to-white dark:from-night-800/60 dark:to-night-900 p-5 shadow-sm">
                            <p className="mb-1 text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                Wilayah Saat Ini
                            </p>

                            <p className="text-base font-bold capitalize text-gray-800 dark:text-night-200">
                                {pengaturan?.nama_wilayah ?? "Belum ditentukan"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-night-400">
                                Kode: <span className="font-mono font-medium">{pengaturan?.kode_wilayah ?? "-"}</span>
                            </p>
                        </div>

                        {/* Pilih Wilayah */}

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-5 shadow-sm">
                            <label
                                htmlFor="wilayah"
                                className="mb-2 block text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400"
                            >
                                Pilih Wilayah Baru
                            </label>

                            <select
                                id="wilayah"
                                value={wilayahTerpilih}
                                onChange={(kejadian) =>
                                    aturWilayahTerpilih(kejadian.target.value)
                                }
                                className="capitalize w-full rounded-xl border border-gray-200 dark:border-night-700 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 bg-white dark:bg-night-900 dark:text-night-200 dark:placeholder:text-night-500 shadow-sm"
                                disabled={wilayah.length === 0}
                            >
                                {wilayah.length === 0 ? (
                                    <option value="">
                                        Belum ada data wilayah
                                    </option>
                                ) : (
                                    <>
                                        <option value="">
                                            Pilih wilayah
                                        </option>

                                        {wilayah.map((item) => (
                                            <option
                                                className="capitalize"
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.nama_wilayah}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>

                    </div>

                    {/* Simpan */}

                    <div className="mt-6 flex justify-end max-md:justify-stretch">
                        <button
                            type="button"
                            onClick={tanganiSimpan}
                            disabled={!wilayahTerpilih}
                            className="flex items-center gap-2 rounded-xl bg-[#AB3C3C] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#8f3030] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none max-md:w-full max-md:justify-center"
                        >
                            <FaSave />
                            Simpan
                        </button>
                    </div>

                </div>

                {/* Persetujuan Permintaan Akun */}

                <div className="rounded-2xl bg-white dark:bg-night-900 p-5 shadow-sm border border-gray-100 dark:border-night-700 max-md:p-4">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8EAEA] text-[#AB3C3C] dark:bg-night-800 dark:text-night-200">
                            <FaUserShield />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-night-200">
                                Persetujuan Permintaan Akun
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-night-400">
                                Setujui atau tolak permintaan ubah username / kata sandi dari pengguna lain ({permintaanSetelUlang.length} menunggu)
                            </p>
                        </div>
                    </div>

                    {permintaanSetelUlang.length > 0 ? (
                        <div className="space-y-3">
                            {permintaanSetelUlang.map((item) => {
                                const own = apakahPermintaanSendiri(item);
                                return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 px-4 py-3 shadow-sm max-md:flex-wrap"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-gray-800 dark:text-night-200" title={ambilRincianPermintaan(item)}>
                                                {ambilRincianPermintaan(item)}
                                            </p>
                                            <span className="rounded-full bg-gray-100 dark:bg-night-800 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-night-300">
                                                {ambilLabelPermintaan(item)}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-night-400">
                                            Diminta {formatWaktu(item.created_at)}{item.requested_by ? ` oleh ${item.requested_by}` : ""}
                                        </p>
                                        {own && (
                                            <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300">
                                                Permintaan sendiri — menunggu admin lain.
                                            </p>
                                        )}
                                    </div>

                                    {!own ? (
                                    <div className="flex shrink-0 items-center gap-2 max-md:w-full">
                                        <button
                                            type="button"
                                            onClick={() => tanganiSetujuiReset(item)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] max-md:py-2.5"
                                        >
                                            <FaCheck size={12} />
                                            Setujui
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => tanganiTolakReset(item)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-night-600 bg-white dark:bg-night-800 px-4 py-2 text-xs font-medium text-gray-600 dark:text-night-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-night-700 active:scale-[0.98] max-md:py-2.5"
                                        >
                                            <FaTimes size={12} />
                                            Tolak
                                        </button>
                                    </div>
                                    ) : null}
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-gray-200 dark:border-night-700 bg-gray-50/60 dark:bg-night-800/60 py-8 text-center text-xs text-gray-400 dark:text-night-500">
                            Tidak ada permintaan yang menunggu.
                        </p>
                    )}

                    {riwayatSetelUlang.length > 0 && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                Riwayat Terakhir
                            </p>
                            <div className="space-y-2">
                                {riwayatSetelUlang.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs max-md:flex-wrap max-md:gap-1"
                                    >
                                        <span className="truncate font-medium text-gray-700 dark:text-night-200" title={ambilRincianPermintaan(item)}>
                                            {ambilRincianPermintaan(item)}{" "}
                                            <span className="font-normal text-gray-400">({ambilLabelPermintaan(item)})</span>
                                        </span>
                                        <span className="flex shrink-0 items-center gap-2 text-gray-500 dark:text-night-400">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.status === "approved" ? "bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300"}`}>
                                                {item.status === "approved" ? "Disetujui" : "Ditolak"}
                                            </span>
                                            <span className="max-md:hidden">
                                                {item.handled_by ? `oleh ${item.handled_by}` : ""}{item.handled_at ? ` • ${formatWaktu(item.handled_at)}` : ""}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </TataLetakUtama>
    );
}
