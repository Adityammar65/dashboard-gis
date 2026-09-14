import { FaWifi, FaMap } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdRouter } from "react-icons/md";
import { IoIosLogOut, IoMdHome } from "react-icons/io";

export default function Sidebar({ isOpen }) {
    return (
        <aside
            className={`fixed h-screen top-15 left-0 z-40 bg-slate-100
            transition-all duration-300
            ${isOpen ? "w-64" : "w-20"}`}
        >

            {/* Navigasi */}

            <nav className="space-y-2 px-3 py-5">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <IoMdHome size={20} />
                    {isOpen && <a href="home">Beranda</a>}
                </div>

                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <FaWifi size={20} />
                    {isOpen && <a href="data-tiang">Data Tiang</a>}
                </div>

                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <MdRouter size={20} />
                    {isOpen && <a href="data-ont">Data ONT</a>}
                </div>

                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <FaMap size={20} />
                    {isOpen && <a href="wilayah">Data Wilayah</a>}
                </div>

                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <FaLocationCrosshairs size={20} />
                    {isOpen && <a href="peta-sebaran-aset">Peta Sebaran Aset</a>}
                </div>

                <hr className="text-[#ab3c3c] rounded full border-t-2 " />

                {/* Logout */}

                <div className="flex rounded items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition-all hover:bg-red-500 hover:text-white">
                    <IoIosLogOut size={20} />
                    {isOpen && <a href="login" onClick={() => confirm("Kembali ke Halaman Login?")}>Keluar</a>}
                </div>
            </nav>
        </aside>
    );
}
