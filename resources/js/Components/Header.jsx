import { FaSearch } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdNotifications } from "react-icons/io";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-18 items-center justify-between bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-6 py-2">

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

            <div className="absolute left-1/2 w-[400px] -translate-x-1/2 flex gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari Aset..."
                        className="w-full rounded bg-white/65 px-5 py-2 pr-10 text-sm text-black outline-none focus:bg-white"
                    />

                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 transition hover:text-[#ab3c3c]" />
                </div>
                <div className="flex items-center bg-white/65 rounded gap-2">
                    <select defaultValue="" className="text-xs outline-none appearance-none px-3 py-2">
                        <option value="" disabled>Pilih Aset</option>
                        <option value="Tiang">Tiang</option>
                        <option value="ONT">ONT</option>
                    </select>

                    <IoMdArrowDropdown className="pr-3 w-8" />
                </div>
            </div>

            <a href="notifikasi">
                <IoMdNotifications size={50} className="px-3 text-white/65 hover:text-white transition-all duration-200" />
            </a>
        </header>
    );
}
