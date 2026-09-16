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

            {/* Tombol Toggle Sidebar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                fixed top-83 z-50
                flex h-8 w-8 items-center justify-center
                rounded-full
                bg-[#ab3c3c]
                text-white
                shadow-lg
                transition-all duration-300
                hover:scale-105
                hover:bg-[#8f3030]
                ${isOpen ? "left-[15rem]" : "left-[4rem]"}`}
                title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}>

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
