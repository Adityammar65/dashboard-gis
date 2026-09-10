import { Header, Sidebar } from "../Components"

export default function MainLayout({ children }) {
    return (
        <div className="relative min-h-screen font-poppins">
            <Sidebar />
            <div className="">
                <Header />

                <main className="min-h-[calc(100vh-72px)] p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
