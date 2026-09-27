import { useMemo, useState, useEffect } from "react";

export default function AuthLayout({ children, errorMessage }) {
    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home', 'data-tiang', 'data-ont', 'wilayah', 'peta-sebaran-aset', 'pengaturan', 'logout', 'notifikasi', 'detail-tiang', 'detail-ont', 'detail-notifikasi', 'edit-tiang', 'edit-ont', 'tambah-tiang', 'tambah-ont', 'login', 'hapus-tiang', 'hapus-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);

    const [visible, setVisible] = useState(!!errorMessage);
    useEffect(() => {
        setVisible(!!errorMessage);
        if (!errorMessage) return;
        const t = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(t);
    }, [errorMessage]);

    return (
        <div className="relative flex h-screen font-poppins max-md:h-auto max-md:min-h-screen max-md:flex-col">
            {visible && errorMessage && (
                <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2">
                    <div className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white shadow-lg">
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Ilustrasi */}

            <div
                className="flex w-1/2 items-center justify-center max-md:h-[30vh] max-md:min-h-[220px] max-md:w-full"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url('${`${base}/public/Assets/LoginBackground.jpg`.replace(/\/+/g, '/')}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex flex-row items-center gap-8 max-md:gap-4 max-md:px-4">
                    <img
                        src={`${base}/public/Assets/Logo.png`.replace(/\/+/g, '/')}
                        alt="Logo"
                        className="w-25 max-md:w-16"
                        width="100"
                        height="100"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="flex flex-col items-left gap-3">
                        <span className="text-2xl font-bold text-white max-md:text-lg">
                            GIS Dashboard
                        </span>

                        <span className="w-80 text-xs font-semibold text-white max-md:w-auto max-md:max-w-[260px]">
                            Sistem Dashboard GIS untuk memantau, mengelola, dan
                            memetakan aset jaringan Tiang dan ONT secara
                            terpusat.
                        </span>
                    </div>
                </div>
            </div>

            {/* Masuk */}

            <div className="flex w-1/2 items-center justify-center max-md:w-full max-md:flex-1 max-md:p-4">
                {children}
            </div>
        </div>
    );
}
