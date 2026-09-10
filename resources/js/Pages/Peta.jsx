import MainLayout from "../Layouts/MainLayout";
import MapView from "../Components/MapView";
import { Link } from "@inertiajs/react";

export default function Peta() {
    return (
        <MainLayout>
            <div className="space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Peta Sebaran Aset GIS
                        </h1>

                        <p className="text-sm text-gray-500">
                            Menampilkan lokasi aset berdasarkan koordinat.
                        </p>
                    </div>

                    <Link
                        href="/dashboard-gis/Home"
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        ← Kembali
                    </Link>
                </div>

                {/* Map */}
                <div className="h-[calc(100vh-100px)] overflow-hidden rounded-xl bg-white shadow">
                    <MapView />
                </div>

            </div>
        </MainLayout>
    );
}