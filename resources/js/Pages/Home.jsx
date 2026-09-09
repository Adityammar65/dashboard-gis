export default function Home() {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 text-center shadow-xl">
                <h1 className="text-3xl font-bold text-blue-400">
                    Laravel + Inertia + React
                </h1>

                <p className="mt-3 text-gray-400">
                    Test Sukses
                </p>

                <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500">
                    Test Button
                </button>
            </div>
        </div>
    );
}
