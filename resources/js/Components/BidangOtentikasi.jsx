import { FiEye, FiEyeOff } from "react-icons/fi";

const KELAS_MASUKAN =
    "w-full rounded-xl border border-gray-300 dark:border-night-600 bg-white dark:bg-night-900 px-4 py-3 text-sm text-gray-900 dark:text-night-200 outline-none transition placeholder:text-gray-400 dark:placeholder:text-night-500 focus:border-[#ab3c3c] focus:ring-2 focus:ring-[#7F1D32]/10 max-md:rounded-xl max-md:py-3.5 max-md:text-base";

const KELAS_LABEL =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-night-200";

const KELAS_GALAT = "mt-1.5 text-xs text-red-600 dark:text-red-300";

const KELAS_TOMBOL_MATA =
    "absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-gray-400 dark:text-night-500 hover:text-gray-600";

export function MasukanOtentikasi({ id, label, error, className = "", ...sisa }) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={KELAS_LABEL}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`${KELAS_MASUKAN}${className ? ` ${className}` : ""}`}
                {...sisa}
            />
            {error && <p className={KELAS_GALAT}>{error}</p>}
        </div>
    );
}

export function KolomKataSandi({
    id,
    label,
    error,
    tampil = false,
    saatAlih,
    labelTampilAria = "Tampilkan kata sandi",
    labelSembunyiAria = "Sembunyikan kata sandi",
    className = "",
    ...props
}) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className={KELAS_LABEL}>
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={tampil ? "text" : "password"}
                    className={`${KELAS_MASUKAN} pr-12${className ? ` ${className}` : ""}`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={saatAlih}
                    aria-label={tampil ? labelSembunyiAria : labelTampilAria}
                    className={KELAS_TOMBOL_MATA}
                >
                    {tampil ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            </div>
            {error && <p className={KELAS_GALAT}>{error}</p>}
        </div>
    );
}
