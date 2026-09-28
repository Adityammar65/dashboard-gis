import { useState, useEffect } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { router, usePage } from "@inertiajs/react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const { errors } = usePage().props;

    const errorMessage = Object.values(errors || {})[0];

    useEffect(() => {
        const savedRemember = localStorage.getItem("gis_remember_me") === "true";
        const savedUsername = localStorage.getItem("gis_saved_username") || "";
        if (savedRemember && savedUsername) {
            setRememberMe(true);
            setUsername(savedUsername);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rememberMe) {
            localStorage.setItem("gis_remember_me", "true");
            localStorage.setItem("gis_saved_username", username);
        } else {
            localStorage.removeItem("gis_remember_me");
            localStorage.removeItem("gis_saved_username");
        }

        router.post("proses-login", {
            username,
            password,
            remember: rememberMe,
        });
    };

    return (
        <AuthLayout errorMessage={errorMessage}>
            <div className="flex p-6 max-md:w-full max-md:max-w-md max-md:rounded-3xl max-md:bg-white max-md:p-6 max-md:shadow-xl max-md:ring-1 max-md:ring-black/5">
                <form className="space-y-5 max-md:w-full" onSubmit={handleSubmit}>

                    {/* Judul seluler */}

                    <div className="hidden max-md:block">
                        <h2 className="text-lg font-bold text-gray-800">
                            Selamat Datang
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Masuk untuk mengelola aset GIS
                        </p>
                    </div>

                    {/* Nama Pengguna */}

                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>

                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            autoComplete="username"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10 max-md:rounded-xl max-md:py-3.5 max-md:text-base"
                        />
                    </div>

                    {/* Kata Sandi */}

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10 max-md:rounded-xl max-md:py-3.5 max-md:text-base"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

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
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-[#ab3c3c] accent-[#ab3c3c] focus:ring-1 focus:ring-[#ab3c3c]/20"
                            />
                            <span className="text-sm text-gray-600">
                                Ingat saya
                            </span>
                        </label>

                        <a
                            href="#"
                            className="text-sm text-gray-500 transition hover:text-[#ab3c3c]"
                        >
                            Lupa password?
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
        </AuthLayout>
    );
}
