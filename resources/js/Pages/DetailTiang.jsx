import MainLayout from "../Layouts/MainLayout";
import MapView from "../Components/MapView";
import { FaArrowLeft, FaPen, FaExternalLinkAlt } from "react-icons/fa";
import { useState } from "react";

export default function DetailTiang() {
    const [activeImage, setActiveImage] = useState(
        "/Assets/Tiang/tiang-1.jpg"
    );

    const images = [
        "/Assets/Tiang/tiang-1.jpg",
        "/Assets/Tiang/tiang-2.jpg",
        "/Assets/Tiang/tiang-3.jpg",
    ];

    return (
        <MainLayout>
            <div className="space-y-4 ml-64">

                {/* Header */}

                <div className="flex items-center justify-between">
                    <div className="w-full rounded-xl bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] text-white px-4 py-3 shadow-sm">
                        <h1 className="text-sm font-semibold">
                            Detail Tiang
                        </h1>
                    </div>

                    <a
                        href="DataTiang"
                        className="ml-3 flex shrink-0 items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600"
                    >
                        <FaArrowLeft />
                        Kembali
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                    <div className="rounded-lg bg-white p-4 shadow-md">

                        {/* Foto utama */}

                        <div className="overflow-hidden rounded-md">
                            <img
                                src={activeImage}
                                alt="Foto Tiang"
                                className="h-[330px] w-full object-cover transition duration-300"
                            />
                        </div>

                        {/* Thumbnail */}

                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {images.map((image, index) => (
                                <button
                                    key={image}
                                    type="button"
                                    onClick={() => setActiveImage(image)}
                                    className={`overflow-hidden rounded-md border-2 transition ${activeImage === image
                                        ? "border-blue-500"
                                        : "border-transparent hover:border-gray-300"
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Foto ${index + 1}`}
                                        className="h-24 w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-md">

                        {/* Judul + badge */}

                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Nomor Tiang
                                </h2>
                            </div>


                        </div>

                        {/* Informasi */}

                        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5 text-xs">

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Wilayah
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Jl. Lorem No 9
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Koordinat
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Latitude: xxxxx
                                </p>
                                <p className="text-gray-600">
                                    Longitude: xxxx
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Deskripsi Tiang
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Lorem Ipsum
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Status
                                </p>

                                <div className="mt-1 flex items-center gap-1 text-gray-600">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    Aktif
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Petugas
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Ahmad Fauzi
                                </p>
                            </div>

                        </div>

                        {/* Edit */}

                        <button
                            type="button"
                            className="mt-5 flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                            <FaPen />
                            Edit Data
                        </button>

                        {/* Map */}

                        <div className="relative mt-4 h-[210px] overflow-hidden rounded-lg bg-gray-200">

                            <MapView />

                            <button
                                type="button"
                                className="absolute right-3 top-3 z-[1000] flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-md transition hover:bg-gray-100"
                            >
                                <FaExternalLinkAlt className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
