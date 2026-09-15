export default function AuthLayout({ children, errorMessage }) {
    return (
        <div className="relative flex h-screen font-poppins">

            {/* Popup Error */}
            
            {errorMessage && (
                <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2">
                    <div className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white shadow-lg">
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Ilustrasi */}

            <div
                className="flex w-1/2 items-center justify-center"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url('public/Assets/LoginBackground.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex flex-row items-center gap-8">
                    <img
                        src="public/Assets/Logo.png"
                        alt="Logo"
                        className="w-25"
                    />

                    <div className="flex flex-col items-left gap-3">
                        <span className="text-2xl font-bold text-white">
                            GIS Dashboard
                        </span>

                        <span className="w-80 text-xs font-semibold text-white">
                            Sistem Dashboard GIS untuk memantau, mengelola, dan
                            memetakan aset jaringan Tiang dan ONT secara
                            terpusat.
                        </span>
                    </div>
                </div>
            </div>

            {/* Login */}

            <div className="flex w-1/2 items-center justify-center">
                {children}
            </div>
        </div>
    );
}