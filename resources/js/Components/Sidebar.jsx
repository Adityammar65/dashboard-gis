import { FaWifi, FaMap } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { RiDashboardFill } from "react-icons/ri";
import { MdRouter } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";

export default function Sidebar({isOpen}) {
    return (
        <aside
            className={`fixed h-screen top-15 left-0 z-40 bg-slate-100
            transition-all duration-300
            ${isOpen ? "w-64" : "w-20"}`}
            >

            {/* Navigasi */}

            <nav className="space-y-1 px-3 py-5">
                <a href="Home" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <RiDashboardFill />
                    {isOpen && <span>Dashboard</span>}
                </a>

                <a href="DataTiang" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <FaWifi />
                    {isOpen && <span>Data Tiang</span>}
                </a>

                <a href="DataONT" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <MdRouter />
                    {isOpen && <span>Data ONT</span>}
                </a>

                <a href="Wilayah" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <FaMap />
                    {isOpen && <span>Data Wilayah</span>}
                </a>

                <a href="PetaSebaranAset" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <FaLocationCrosshairs />
                    {isOpen && <span>Peta Sebaran Aset</span>}
                </a>
                <hr className="text-[#ab3c3c] rounded full border-t-2 "/>
                <a href="Login" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e] hover:scale-105 transition">
                    <IoIosLogOut />
                    {isOpen && <span>keluar</span>}
                </a>
            </nav>
        </aside>
    );
}
