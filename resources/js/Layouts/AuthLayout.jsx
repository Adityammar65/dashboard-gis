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
        <div className="relative flex h-screen font-poppins max-md:h-auto max-md:min-h-screen max-md:flex-col max-md:bg-[#F6F4F4]">
            {visible && errorMessage && (
                <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2">
                    <div className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white shadow-lg">
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Ilustrasi */}

            <div
                className="gis-auth-hero relative flex w-1/2 items-center justify-center overflow-hidden max-md:h-auto max-md:min-h-0 max-md:w-full max-md:px-5 max-md:pb-12 max-md:pt-10"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url('${`${base}/public/Assets/LoginBackground.jpg`.replace(/\/+/g, '/')}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >

                {/* Tint merek mobile di atas foto */}

                <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-gradient-to-br from-[#6F2424]/95 via-[#6F2424]/70 to-[#AB3C3C]/75 max-md:block" />

                {/* Dekorasi mobile */}

                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 hidden h-48 w-48 rounded-full border-[10px] border-white/10 max-md:block" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-16 hidden h-56 w-56 rounded-full border-[12px] border-white/10 max-md:block" />

                <div className="relative flex flex-row items-center gap-8 max-md:flex-col max-md:gap-3 max-md:px-0 max-md:text-center">
                    <img
                        src={`${base}/public/Assets/Logo.png`.replace(/\/+/g, '/')}
                        alt="Logo"
                        className="w-25 max-md:w-16"
                        width="100"
                        height="100"
                        loading="lazy"
                        decoding="async"
                    />

                    <div className="flex flex-col items-left gap-3 max-md:items-center max-md:gap-1.5">
                        <span className="text-2xl font-bold text-white max-md:text-xl">
                            GIS Dashboard
                        </span>

                        <span className="w-80 text-xs font-semibold text-white max-md:hidden">
                            Sistem Dashboard GIS untuk memantau, mengelola, dan
                            memetakan aset jaringan Tiang dan ONT secara
                            terpusat.
                        </span>

                        <span className="hidden text-xs font-medium text-white/80 max-md:block">
                            Pantau dan kelola aset jaringan GIS
                        </span>
                    </div>
                </div>
            </div>

            {/* Masuk */}

            <div className="flex w-1/2 items-center justify-center max-md:relative max-md:z-10 max-md:-mt-6 max-md:w-full max-md:flex-1 max-md:items-start max-md:bg-transparent max-md:p-4 max-md:pb-8">
                {children}
            </div>
        </div>
    );
}
