import MainLayout from "../Layouts/MainLayout";
import ThemeToggle from "../Components/ThemeToggle";
import { FaMapMarked, FaSave, FaUserCog, FaKey, FaMoon, FaCheck, FaTimes, FaUserShield } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Pengaturan({ wilayah, resetRequests = [], resetHistory = [] }) {
    const { props } = usePage();
    const { settings, auth, errors = {} } = props;
    const currentUsername = auth?.username ?? "";
    const [selectedWilayah, setSelectedWilayah] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSimpan = () => {
        if (!selectedWilayah) {
            return;
        }

        router.post("update-pengaturan", {
            wilayah: selectedWilayah,
        });
    };

    const handleSimpanUsername = () => {
        const value = newUsername.trim();
        if (!value || value === currentUsername) {
            return;
        }

        router.post("update-profil/username", {
            username: value,
        }, {
            onSuccess: () => setNewUsername(""),
        });
    };

    const handleSimpanPassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return;
        }

        router.post("update-profil/password", {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
        }, {
            onSuccess: () => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            },
        });
    };

    const handleApproveReset = (id, username) => {
        if (!window.confirm(`Setujui reset kata sandi untuk akun "${username}"?`)) {
            return;
        }

        router.post(`reset-requests/${id}/approve`);
    };

    const handleRejectReset = (id, username) => {
        if (!window.confirm(`Tolak permintaan reset kata sandi untuk akun "${username}"?`)) {
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
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="rounded-2xl bg-gradient-to-br from-[#6F2424] to-[#AB3C3C] px-4 py-3.5 text-white shadow-md border border-white/10 max-md:flex max-md:min-w-0 max-md:items-center max-md:rounded-xl max-md:px-3 max-md:py-2.5">
                    <span className="text-sm font-semibold tracking-wide max-md:shrink-0 max-md:text-[13px] max-md:whitespace-nowrap">
                        Pengaturan
                    </span>

                    <span className="mx-3 opacity-60 max-md:mx-1.5 max-md:shrink-0">
                        /
                    </span>

                    <span className="text-xs font-light capitalize opacity-90 max-md:truncate max-md:text-[11px]">
                        {settings?.nama_wilayah ?? "Wilayah belum ditentukan"}
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
                                Kelola username dan kata sandi akun yang sedang masuk
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* Ubah Username */}

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-5 shadow-sm">
                            <p className="mb-1 text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                Username Saat Ini
                            </p>

                            <p className="truncate text-base font-bold text-gray-800 dark:text-night-200" title={currentUsername}>
                                {currentUsername || "Belum diketahui"}
                            </p>

                            <label
                                htmlFor="username-baru"
                                className="mb-2 mt-5 block text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400"
                            >
                                Username Baru
                            </label>

                            <input
                                id="username-baru"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Masukkan username baru"
                                autoComplete="username"
                                className="w-full rounded-xl border border-gray-200 dark:border-night-700 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 bg-white dark:bg-night-900 dark:text-night-200 dark:placeholder:text-night-500 shadow-sm"
                            />

                            {errors.username && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{errors.username}</p>
                            )}

                            <button
                                type="button"
                                onClick={handleSimpanUsername}
                                disabled={!newUsername.trim() || newUsername.trim() === currentUsername}
                                className="mt-4 flex items-center gap-2 rounded-xl bg-[#AB3C3C] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#8f3030] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none max-md:w-full max-md:justify-center"
                            >
                                <FaSave />
                                Simpan Username
                            </button>
                        </div>

                        {/* Ubah Kata Sandi */}

                        <div className="rounded-2xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-gray-800 dark:text-night-200">
                                <FaKey className="text-xs text-gray-400 dark:text-night-500" />
                                <p className="text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                    Ubah Kata Sandi
                                </p>
                            </div>

                            <label
                                htmlFor="sandi-saat-ini"
                                className="mb-2 block text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400"
                            >
                                Kata Sandi Saat Ini
                            </label>

                            <div className="relative">
                                <input
                                    id="sandi-saat-ini"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi saat ini"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-gray-200 dark:border-night-700 px-4 py-2.5 pr-12 text-sm text-gray-700 outline-none transition focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 bg-white dark:bg-night-900 dark:text-night-200 dark:placeholder:text-night-500 shadow-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-night-300"
                                >
                                    {showCurrentPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )}
                                </button>
                            </div>

                            {errors.current_password && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{errors.current_password}</p>
                            )}

                            <label
                                htmlFor="sandi-baru"
                                className="mb-2 mt-4 block text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400"
                            >
                                Kata Sandi Baru (min. 8 karakter)
                            </label>

                            <div className="relative">
                                <input
                                    id="sandi-baru"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi baru"
                                    autoComplete="new-password"
                                    minLength={8}
                                    className="w-full rounded-xl border border-gray-200 dark:border-night-700 px-4 py-2.5 pr-12 text-sm text-gray-700 outline-none transition focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 bg-white dark:bg-night-900 dark:text-night-200 dark:placeholder:text-night-500 shadow-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-night-300"
                                >
                                    {showNewPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-300">{errors.password}</p>
                            )}

                            <label
                                htmlFor="sandi-konfirmasi"
                                className="mb-2 mt-4 block text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400"
                            >
                                Konfirmasi Kata Sandi Baru
                            </label>

                            <div className="relative">
                                <input
                                    id="sandi-konfirmasi"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    autoComplete="new-password"
                                    minLength={8}
                                    className="w-full rounded-xl border border-gray-200 dark:border-night-700 px-4 py-2.5 pr-12 text-sm text-gray-700 outline-none transition focus:border-[#AB3C3C] focus:ring-2 focus:ring-[#AB3C3C]/10 bg-white dark:bg-night-900 dark:text-night-200 dark:placeholder:text-night-500 shadow-sm"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-night-300"
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleSimpanPassword}
                                disabled={!currentPassword || !newPassword || !confirmPassword}
                                className="mt-4 flex items-center gap-2 rounded-xl bg-[#AB3C3C] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#8f3030] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none max-md:w-full max-md:justify-center"
                            >
                                <FaSave />
                                Simpan Kata Sandi
                            </button>
                        </div>

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
                            <ThemeToggle variant="switch" />
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
                                {settings?.nama_wilayah ?? "Belum ditentukan"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 dark:text-night-400">
                                Kode: <span className="font-mono font-medium">{settings?.kode_wilayah ?? "-"}</span>
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
                                value={selectedWilayah}
                                onChange={(e) =>
                                    setSelectedWilayah(e.target.value)
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
                            onClick={handleSimpan}
                            disabled={!selectedWilayah}
                            className="flex items-center gap-2 rounded-xl bg-[#AB3C3C] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#8f3030] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none max-md:w-full max-md:justify-center"
                        >
                            <FaSave />
                            Simpan
                        </button>
                    </div>

                </div>

                {/* Persetujuan Reset Kata Sandi */}

                <div className="rounded-2xl bg-white dark:bg-night-900 p-5 shadow-sm border border-gray-100 dark:border-night-700 max-md:p-4">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8EAEA] text-[#AB3C3C] dark:bg-night-800 dark:text-night-200">
                            <FaUserShield />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-night-200">
                                Persetujuan Reset Kata Sandi
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-night-400">
                                Setujui atau tolak permintaan reset dari pengguna lain ({resetRequests.length} menunggu)
                            </p>
                        </div>
                    </div>

                    {resetRequests.length > 0 ? (
                        <div className="space-y-3">
                            {resetRequests.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-night-700 bg-white dark:bg-night-900 px-4 py-3 shadow-sm max-md:flex-wrap"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-800 dark:text-night-200" title={item.username}>
                                            {item.username}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-night-400">
                                            Diminta {formatWaktu(item.created_at)}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 max-md:w-full">
                                        <button
                                            type="button"
                                            onClick={() => handleApproveReset(item.id, item.username)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] max-md:py-2.5"
                                        >
                                            <FaCheck size={12} />
                                            Setujui
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRejectReset(item.id, item.username)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-night-600 bg-white dark:bg-night-800 px-4 py-2 text-xs font-medium text-gray-600 dark:text-night-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-night-700 active:scale-[0.98] max-md:py-2.5"
                                        >
                                            <FaTimes size={12} />
                                            Tolak
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-gray-200 dark:border-night-700 bg-gray-50/60 dark:bg-night-800/60 py-8 text-center text-xs text-gray-400 dark:text-night-500">
                            Tidak ada permintaan reset yang menunggu.
                        </p>
                    )}

                    {resetHistory.length > 0 && (
                        <div className="mt-5">
                            <p className="mb-2 text-xs font-semibold tracking-widest text-gray-500 dark:text-night-400">
                                Riwayat Terakhir
                            </p>
                            <div className="space-y-2">
                                {resetHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs max-md:flex-wrap max-md:gap-1"
                                    >
                                        <span className="truncate font-medium text-gray-700 dark:text-night-200" title={item.username}>
                                            {item.username}
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
        </MainLayout>
    );
}
