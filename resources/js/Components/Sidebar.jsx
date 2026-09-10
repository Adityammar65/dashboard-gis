import { FaWifi, FaMap } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { RiDashboardFill } from "react-icons/ri";
import { MdRouter } from "react-icons/md";
import { Link } from "@inertiajs/react";

export default function Sidebar() {
    return (
        <aside className="fixed inset-y-5 left-0 z-40 w-64 bg-slate-100">

            {/* Navigasi */}

            <nav className="space-y-1 px-3 py-5">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e]">
                    <RiDashboardFill />
                    <span>Dashboard</span>
                </Link>

                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e]">
                    <FaWifi />
                    <span>Data Tiang</span>
                </a>

                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e]">
                    <MdRouter />
                    <span>Data ONT</span>
                </a>

                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e]">
                    <FaMap />
                    <span>Wilayah</span>
                </a>

                <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#992e2e]">
                    <FaLocationCrosshairs />
                    <span>Peta Sebaran Aset</span>
                </a>
            </nav>
        </aside>
    );
}
