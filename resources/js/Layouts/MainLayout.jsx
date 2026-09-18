import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Header, Sidebar } from "../Components";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { usePage } from "@inertiajs/react";

// Context so any child inside MainLayout can trigger the error popup
export const LayoutErrorContext = createContext(null);

export function useLayoutError() {
    const ctx = useContext(LayoutErrorContext);
    if (!ctx) {
        throw new Error("useLayoutError must be used within <MainLayout>");
    }
    return ctx;
}

export default function MainLayout({ children, errorMessage }) {
    const [isOpen, setIsOpen] = useState(true);
    const [localError, setLocalError] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    const { errors, flash } = usePage().props;

    // Imperative API for children: showError("msg") / clearError()
    const showError = useCallback((msg) => {
        if (!msg) return;
        // normalize: if object/array passed, pick first string
        if (Array.isArray(msg)) msg = msg[0];
        else if (typeof msg === "object") {
            const vals = Object.values(msg);
            msg = vals[0];
            if (Array.isArray(msg)) msg = msg[0];
        }
        setDismissed(false);
        setLocalError(String(msg));
    }, []);

    const clearError = useCallback(() => {
        setLocalError(null);
        setDismissed(true);
    }, []);

    // Reset dismissed when new errors arrive
    useEffect(() => {
        if (errors || flash?.error || flash?.message || flash?.success || errorMessage) {
            setDismissed(false);
        }
    }, [errors, flash, errorMessage]);

    // Allow children that don't use context to dispatch a window event:
    // window.dispatchEvent(new CustomEvent("layout:error", { detail: "msg" }))
    useEffect(() => {
        const handler = (e) => showError(e.detail);
        window.addEventListener("layout:error", handler);
        return () => window.removeEventListener("layout:error", handler);
    }, [showError]);

    // Auto-dismiss local (imperative) errors after 4s
    useEffect(() => {
        if (!localError) return;
        const t = setTimeout(() => setLocalError(null), 4000);
        return () => clearTimeout(t);
    }, [localError]);

    // Resolve error from 4 sources (priority order):
    // 1. explicit prop 2. imperative localError (via context/event) 3. Inertia validation errors 4. flash
    const inertiaError = Object.values(errors || {})?.[0];
    const flashError = flash?.error || flash?.message || null;
    const flashSuccess = flash?.success || null;

    const resolvedError = dismissed
        ? localError
        : errorMessage || localError || inertiaError || flashError || null;

    const displayError = Array.isArray(resolvedError)
        ? resolvedError[0]
        : resolvedError;

    // Auto-dismiss also for inertia/flash errors? keep visible until navigation; but allow manual close
    // If error came from props/inertia, clearing should also clear local; for inertia it will disappear on next visit

    return (
        <LayoutErrorContext.Provider value={{ error: displayError, showError, setError: showError, clearError }}>
            <div className="relative min-h-screen font-poppins">
                {/* Popup Error - copied from AuthLayout.jsx */}

                {displayError && (
                    <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2">
                        <div className="flex items-center gap-3 rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white shadow-lg">
                            <span>{displayError}</span>
                            <button
                                type="button"
                                onClick={clearError}
                                className="rounded p-0.5 hover:bg-white/20"
                                aria-label="Close error"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {!displayError && !dismissed && flashSuccess && (
                    <div className="fixed left-1/2 top-5 z-[99999] -translate-x-1/2">
                        <div className="flex items-center gap-3 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white shadow-lg">
                            <span>{flashSuccess}</span>
                            <button
                                type="button"
                                onClick={clearError}
                                className="rounded p-0.5 hover:bg-white/20"
                                aria-label="Close success"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>
                )}

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
                    title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
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
        </LayoutErrorContext.Provider>
    );
}
