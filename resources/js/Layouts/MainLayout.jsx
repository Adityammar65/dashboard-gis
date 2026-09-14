import { useState } from "react";
import { Header, Sidebar } from "../Components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function MainLayout({ children }) {

    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="relative min-h-screen font-poppins">

            {/* Sidebar */}
            <Sidebar isOpen={isOpen} />

            {/* Header */}
            <Header />

            {/* Tombol panah */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-20 z-50
                -translate-x-1/2
                bg-white p-2 rounded-full shadow-md
                text-[#992e2e]
                hover:bg-gray-100
                transition-all duration-300
                ${isOpen ? "left-64" : "left-20"}`}
            >
                {isOpen ? (
                    <FiChevronLeft size={20} />
                ) : (
                    <FiChevronRight size={20} />
                )}
            </button>

            {/* Isi halaman */}
            <main
                className={`min-h-[calc(100vh-72px)] p-6
                transition-all duration-300
                ${isOpen ? "ml-64" : "ml-20"}`}
            >
                {children}
            </main>

        </div>
    );
}