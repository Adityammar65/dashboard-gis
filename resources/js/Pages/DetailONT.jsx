import MainLayout from "../Layouts/MainLayout";
import MapView from "../Components/MapView";
import { FaArrowLeft, FaPen, FaExternalLinkAlt } from "react-icons/fa";
import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";

export default function DetailONT({ ont }) {
    const base = useMemo(() => {
        const seg = window.location.pathname.split('/').filter(Boolean)[0];
        const knownRoutes = ['home','data-tiang','data-ont','wilayah','peta-sebaran-aset','pengaturan','logout','notifikasi','detail-tiang','detail-ont','edit-tiang','edit-ont','tambah-tiang','tambah-ont'];
        if (seg && !knownRoutes.includes(seg)) return `/${seg}`;
        return '';
    }, []);

    const getFotoUrl = (foto) => {
        if (!foto) return null;
        return `${base}/public/storage/${foto}`.replace(/\/+/g, '/');
    };

    const images = [
        ont?.foto_ont_1,
        ont?.foto_ont_2,
        ont?.foto_ont_3,
    ].filter(Boolean);

    const [activeImage, setActiveImage] = useState(
        images.length > 0 ? getFotoUrl(images[0]) : null
    );

    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}

                <div className="flex items-center justify-between">
                    <div className="w-full rounded-xl bg-gradient-to-r text-white from-[#6F2424] to-[#AB3C3C] px-4 py-3 shadow-sm">
                        <h1 className="text-sm font-semibold">
                            Detail ONT
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="ml-3 flex shrink-0 items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-600"
                    >
                        <FaArrowLeft />
                        Kembali
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 shadow-md">

                        {/* Foto utama */}

                        <div className="mb-3">
                            <p className="mb-2 text-xs font-semibold text-gray-800">
                                Foto Utama
                            </p>
                            <div className="overflow-hidden rounded-md">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={`Foto ${ont?.kode_ont ?? "ONT"}`}
                                        className="h-[330px] w-full object-cover transition duration-300"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="flex h-[330px] w-full items-center justify-center bg-gray-100">
                                        <span className="text-xs text-gray-400">
                                            Belum ada foto ONT
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Foto 1, 2, 3 */}

                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {images.length > 0 ? (
                                images.map((image, index) => {
                                    const imageUrl = getFotoUrl(image);
                                    return (
                                        <div key={image}>
                                            <p className="mb-1 text-center text-[10px] font-semibold text-gray-700">
                                                Foto {index + 1}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setActiveImage(imageUrl)}
                                                className={`w-full overflow-hidden rounded-md border-2 transition ${activeImage === imageUrl
                                                    ? "border-blue-500"
                                                    : "border-transparent hover:border-gray-300"
                                                    }`}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`Foto ${index + 1}`}
                                                    className="h-24 w-full object-cover"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-3 flex h-24 items-center justify-center rounded-md bg-gray-100">
                                    <span className="text-[10px] text-gray-400">
                                        Belum ada foto
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="rounded-lg bg-white p-4 shadow-md">

                        {/* Judul + badge */}

                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {ont?.kode_ont ?? "Data ONT"}
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
                                    {ont?.wilayah || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Koordinat
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Latitude: {ont?.latitude || "-"}
                                </p>
                                <p className="text-gray-600">
                                    Longitude: {ont?.longitude || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Deskripsi ONT
                                </p>
                                <p className="mt-1 text-gray-600">
                                    {ont?.deskripsi_ont || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Status
                                </p>
                                <div className="mt-1 flex items-center gap-1 text-gray-600">
                                    <span className={`h-2 w-2 rounded-full ${ont?.status?.toLowerCase() === "aktif" ? "bg-green-500" : "bg-red-500"}`} />
                                    {ont?.status || "-"}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Petugas
                                </p>
                                <p className="mt-1 text-gray-600">
                                    {ont?.nama_petugas || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Area
                                </p>
                                <p className="mt-1 text-gray-600">
                                    {ont?.area || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Kode ONT
                                </p>
                                <p className="mt-1 text-gray-600">
                                    {ont?.kode_ont || "-"}
                                </p>
                            </div>

                        </div>

                        {/* Edit */}

                        <button
                            type="button"
                            onClick={() => router.get(`${base}/edit-ont/${ont?.id}`.replace(/\/+/g, '/'))}
                            className="mt-5 flex w-fit items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                            <FaPen />
                            Edit Data
                        </button>

                        {/* Map */}

                        <div className="relative mt-4 h-[210px] overflow-hidden rounded-lg bg-gray-200">

                            <MapView
                                latitude={ont?.latitude}
                                longitude={ont?.longitude}
                            />

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
