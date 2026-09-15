import { useState } from "react";
import AuthLayout from "../Layouts/AuthLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { router, usePage } from "@inertiajs/react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { errors } = usePage().props;

    const errorMessage = Object.values(errors || {})[0];

    return (
        <AuthLayout errorMessage={errorMessage}>
            <div className="flex p-6">
                <form
                    className="space-y-5"
                    onSubmit={(e) => {
                        e.preventDefault();

                        const form = e.currentTarget;

                        router.post("proses-login", {
                            username: form.username.value,
                            password: form.password.value,
                        });
                    }}
                >
                    {/* Username */}

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
                            placeholder="Masukkan username"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10"
                        />
                    </div>

                    {/* Password */}

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
                                placeholder="Masukkan password"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}

                    <div className="text-right">
                        <a
                            href="#"
                            className="text-sm text-gray-500 transition hover:text-[#ab3c3c]"
                        >
                            Lupa password?
                        </a>
                    </div>

                    {/* Button */}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#ab3c3c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#68182A]"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
