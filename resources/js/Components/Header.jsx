export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-18 items-center justify-start gap-5 bg-[#ab3c3c] px-6 py-2">

            {/* Logo */}

            <div>
                <img src="public/Assets/Logo.png" alt="Logo" className="w-10" />
            </div>

            <h1 className="text-white font-bold text-xl">GIS Dashboard</h1>
        </header>
    );
}
