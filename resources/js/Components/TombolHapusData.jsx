import { FaTrash } from "react-icons/fa";

export default function TombolHapusData({
    jenis = "tiang",
    id,
    kode = "",
    dasar = "",
    label = "Hapus Data",
    className = "",
}) {
    const tanganiHapus = () => {
        const namaJenis = jenis === "ont" ? "ont" : "tiang";
        const target = `${dasar}/hapus-${namaJenis}/${id}`.replace(/\/+/g, "/");
        if (window.confirm(`Apakah kamu yakin ingin menghapus data ${namaJenis} ${kode || ""}?`.trim())) {
            window.location.href = target;
        }
    };

    return (
        <button
            type="button"
            onClick={tanganiHapus}
            title={label}
            className={`flex w-fit items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/15 px-4 py-2.5 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-500/30 transition hover:bg-red-100 dark:hover:bg-red-500/20 hover:shadow-sm active:scale-[0.98] max-sm:w-full max-sm:justify-center ${className}`.trim()}
        >
            <FaTrash />
            {label}
        </button>
    );
}
