import { useState } from "react";
import TataLetakOtentikasi from "../Layouts/TataLetakOtentikasi";
import PengalihTema from "../Components/PengalihTema";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaKey } from "react-icons/fa";
import { router, usePage } from "@inertiajs/react";

export default function LupaPassword() {
    const [tampilKataSandi, aturTampilKataSandi] = useState(false);
    const [tampilKonfirmasi, aturTampilKonfirmasi] = useState(false);
    const [user, aturUser] = useState("");
    const [kataSandi, aturKataSandi] = useState("");
    const [konfirmasiKataSandi, aturKonfirmasiKataSandi] = useState("");

    const { errors, flash } = usePage().props;

    const errorMessage = Object.values(errors || {})[0];
    const pesanKeberhasilan = flash?.success;

    const tanganiKirim = (kejadian) => {
        kejadian.preventDefault();

        router.post("reset-request", {
            username: user.trim(),
            password: kataSandi,
            password_confirmation: konfirmasiKataSandi,
        }, {
            onSuccess: () => {
                aturKataSandi("");
                aturKonfirmasiKataSandi("");
            },
        });
    };

    return (
        <TataLetakOtentikasi errorMessage={errorMessage}>
            <div className="relative flex p-6 pt-14 max-md:w-full max-md:max-w-md max-md:rounded-3xl max-md:bg-white max-md:p-6 max-md:pt-14 max-md:shadow-xl max-md:ring-1 max-md:ring-black/5 dark:max-md:bg-night-900 dark:max-md:ring-white/10">
                <div className="absolute right-4 top-4">
                    <PengalihTema variant="login" />
                </div>
                <form className="space-y-5 max-md:w-full" onSubmit={tanganiKirim}>

                    {/* Judul */}

                    <div>
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8EAEA] text-[#AB3C3C] dark:bg-night-800 dark:text-night-200">
                            <FaKey />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-night-200">
                            Lupa Password
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-night-400">
                            Ajukan reset kata sandi. Permintaan menunggu persetujuan admin sebelum berlaku.
                        </p>
                    </div>

                    {pesanKeberhasilan && (
                        <p className="rounded-xl border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/15 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                            {pesanKeberhasilan}
                        </p>
                    )}

                    {/* Nama Pengguna */}

                    <div>
                        <label
                            htmlFor="reset-username"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-night-200"
                        >
                            Username
                        </label>

                        <input
                            type="text"
                            id="reset-username"
                            name="username"
                            value={user}
                            onChange={(kejadian) => aturUser(kejadian.target.value)}
                            placeholder="Masukkan username akun"
                            autoComplete="username"
                            className="w-full rounded-xl border border-gray-300 dark:border-night-600 bg-white dark:bg-night-900 px-4 py-3 text-sm text-gray-900 dark:text-night-200 outline-none transition placeholder:text-gray-400 dark:placeholder:text-night-500 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10 max-md:rounded-xl max-md:py-3.5 max-md:text-base"
                        />
                    </div>

                    {/* Kata Sandi Baru */}

                    <div>
                        <label
                            htmlFor="reset-password"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-night-200"
                        >
                            Kata Sandi Baru (min. 8 karakter)
                        </label>

                        <div className="relative">
                            <input
                                type={tampilKataSandi ? "text" : "password"}
                                id="reset-password"
                                name="password"
                                value={kataSandi}
                                onChange={(kejadian) => aturKataSandi(kejadian.target.value)}
                                placeholder="Masukkan kata sandi baru"
                                autoComplete="new-password"
                                minLength={8}
                                className="w-full rounded-xl border border-gray-300 dark:border-night-600 bg-white dark:bg-night-900 px-4 py-3 pr-12 text-sm text-gray-900 dark:text-night-200 outline-none transition placeholder:text-gray-400 dark:placeholder:text-night-500 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10 max-md:rounded-xl max-md:py-3.5 max-md:text-base"
                            />

                            <button
                                type="button"
                                onClick={() => aturTampilKataSandi(!tampilKataSandi)}
                                aria-label={tampilKataSandi ? "Sembunyikan password" : "Tampilkan password"}
                                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-400 dark:text-night-500 hover:text-gray-600"
                            >
                                {tampilKataSandi ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Konfirmasi */}

                    <div>
                        <label
                            htmlFor="reset-password-confirmation"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-night-200"
                        >
                            Konfirmasi Kata Sandi Baru
                        </label>

                        <div className="relative">
                            <input
                                type={tampilKonfirmasi ? "text" : "password"}
                                id="reset-password-confirmation"
                                name="password_confirmation"
                                value={konfirmasiKataSandi}
                                onChange={(kejadian) => aturKonfirmasiKataSandi(kejadian.target.value)}
                                placeholder="Ulangi kata sandi baru"
                                autoComplete="new-password"
                                minLength={8}
                                className="w-full rounded-xl border border-gray-300 dark:border-night-600 bg-white dark:bg-night-900 px-4 py-3 pr-12 text-sm text-gray-900 dark:text-night-200 outline-none transition placeholder:text-gray-400 dark:placeholder:text-night-500 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10 max-md:rounded-xl max-md:py-3.5 max-md:text-base"
                            />

                            <button
                                type="button"
                                onClick={() => aturTampilKonfirmasi(!tampilKonfirmasi)}
                                aria-label={tampilKonfirmasi ? "Sembunyikan password" : "Tampilkan password"}
                                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-400 dark:text-night-500 hover:text-gray-600"
                            >
                                {tampilKonfirmasi ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tombol */}

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#ab3c3c] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#68182A] active:scale-[0.99] max-md:min-h-[48px] max-md:py-3.5"
                    >
                        Kirim Permintaan Reset
                    </button>

                    <a
                        href="login"
                        className="block text-center text-sm text-gray-500 dark:text-night-400 transition hover:text-[#ab3c3c]"
                    >
                        Kembali ke Masuk
                    </a>
                </form>
            </div>
        </TataLetakOtentikasi>
    );
}
