import { FaSearch } from "react-icons/fa";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-18 items-center justify-between bg-[#ab3c3c] px-6 py-2">

            {/* Logo + Judul */}
            <div className="flex items-center gap-5">
                <div>
                    <img
                        src="public/Assets/Logo.png"
                        alt="Logo"
                        className="w-10"
                    />
                </div>

                <h1 className="text-xl font-bold text-white">
                    GIS Dashboard
                </h1>
            </div>

            {/* Search Bar */}
            <div className="absolute left-1/2 w-[400px] -translate-x-1/2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari..."
                        className="w-full rounded-full bg-white px-5 py-2 pr-10 text-sm text-gray-700 outline-none"
                    />

                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#ab3c3c]" />
                </div>
            </div>

        </header>
    );
}