import { useState, useEffect } from "react";
import TataLetakOtentikasi from "../Layouts/TataLetakOtentikasi";
import PengalihTema from "../Components/PengalihTema";
import { MasukanOtentikasi, KolomKataSandi } from "../Components/BidangOtentikasi";
import { router, usePage } from "@inertiajs/react";

export default function Masuk() {
    const [tampilKataSandi, aturTampilKataSandi] = useState(false);
    const [user, aturUser] = useState("");
    const [kataSandi, aturKataSandi] = useState("");
    const [ingatSaya, aturIngatSaya] = useState(false);

    const { errors } = usePage().props;

    const errorMessage = Object.values(errors || {})[0];

    useEffect(() => {
        const ingatTersimpan = localStorage.getItem("gis_remember_me") === "true";
        const userTersimpan = localStorage.getItem("gis_saved_username") || "";
        if (ingatTersimpan && userTersimpan) {
            aturIngatSaya(true);
            aturUser(userTersimpan);
        }
    }, []);

    const tanganiKirim = (kejadian) => {
        kejadian.preventDefault();

        if (ingatSaya) {
            localStorage.setItem("gis_remember_me", "true");
            localStorage.setItem("gis_saved_username", user);
        } else {
            localStorage.removeItem("gis_remember_me");
            localStorage.removeItem("gis_saved_username");
        }

        router.post("proses-login", {
            username: user,
            password: kataSandi,
            remember: ingatSaya,
        });
    };

    return (
        <TataLetakOtentikasi errorMessage={errorMessage}>
            <div className="relative flex p-6 pt-14 max-md:w-full max-md:max-w-md max-md:rounded-3xl max-md:bg-white max-md:p-6 max-md:pt-14 max-md:shadow-xl max-md:ring-1 max-md:ring-black/5 dark:max-md:bg-night-900 dark:max-md:ring-white/10">
                <div className="absolute right-4 top-4">
                    <PengalihTema variant="login" />
                </div>
                <form className="space-y-5 max-md:w-full" onSubmit={tanganiKirim}>

                    {/* Judul mobile */}

                    <div className="hidden max-md:block">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-night-200">
                            Selamat Datang
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-night-400">
                            Masuk untuk mengelola aset GIS
                        </p>
                    </div>

                    {/* Nama Pengguna */}

                    <MasukanOtentikasi
                        id="username"
                        name="username"
                        type="text"
                        label="Nama Pengguna"
                        value={user}
                        onChange={(kejadian) => aturUser(kejadian.target.value)}
                        placeholder="Masukkan nama pengguna"
                        autoComplete="username"
                    />

                    {/* Kata Sandi */}

                    <KolomKataSandi
                        id="password"
                        name="password"
                        label="Kata Sandi"
                        value={kataSandi}
                        onChange={(kejadian) => aturKataSandi(kejadian.target.value)}
                        placeholder="Masukkan kata sandi"
                        autoComplete="current-password"
                        tampil={tampilKataSandi}
                        saatAlih={() => aturTampilKataSandi(!tampilKataSandi)}
                        labelTampilAria="Tampilkan kata sandi"
                        labelSembunyiAria="Sembunyikan kata sandi"
                    />

                    {/* Ingat Saya */}

                    <div className="flex items-center justify-between max-md:flex-wrap max-md:gap-2">
                        <label
                            htmlFor="remember"
                            className="flex cursor-pointer select-none items-center gap-2"
                        >
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={ingatSaya}
                                onChange={(kejadian) =>
                                    aturIngatSaya(kejadian.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 dark:border-night-600 text-[#ab3c3c] accent-[#ab3c3c] focus:ring-1 focus:ring-[#ab3c3c]/20"
                            />
                            <span className="text-sm text-gray-600 dark:text-night-300">
                                Ingat saya
                            </span>
                        </label>

                        <a
                            href="lupa-password"
                            className="text-sm text-gray-500 dark:text-night-400 transition hover:text-[#ab3c3c]"
                        >
                            Lupa kata sandi?
                        </a>
                    </div>

                    {/* Tombol */}

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#ab3c3c] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#68182A] active:scale-[0.99] max-md:min-h-[48px] max-md:py-3.5"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </TataLetakOtentikasi>
    );
}
