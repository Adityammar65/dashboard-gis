export default function AuthLayout({ children }) {
    return (
        <div className="flex h-screen font-poppins">

            {/* Ilustrasi */}

            <div className="w-1/2 flex items-center justify-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url('public/Assets/LoginBackground.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="flex flex-row items-center gap-8">
                    <img src="public/Assets/Logo.png" alt="Logo" className="w-25" />
                    <div className="flex flex-col gap-3 items-left">
                        <span className="text-2xl font-bold text-white">GIS Dashboard</span>
                        <span className="text-xs font-semibold text-white w-80">
                            Sistem Dashboard GIS untuk memantau, mengelola, dan memetakan aset jaringan Tiang dan ONT secara terpusat.
                        </span>
                    </div>
                </div>
            </div>

            {/* Form Login */}

            <div className="bg- w-1/2 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
