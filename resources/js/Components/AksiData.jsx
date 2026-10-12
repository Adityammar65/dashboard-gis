import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const tautanHapus = (dasar, jenis, id) => `${dasar}/hapus-${jenis}/${id}`.replace(/\/+/g, "/");

export function konfirmasiHapus(nama, label) {
    return window.confirm(`Apakah kamu yakin ingin menghapus ${nama} ${label || ""}?`.trim());
}

// Table Actions

export function AksiTabel({ jenis = "tiang", id, kode = "", dasar = "", tautanRinci = "#", tautanUbah = "#" }) {
    const namaJenis = jenis === "ont" ? "ont" : "tiang";
    return (
        <div className="flex items-center gap-1.5">
            <a
                href={tautanRinci}
                className="rounded-lg bg-blue-500 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-blue-600 hover:shadow"
            >
                <FaEye className="text-[16px]" />
            </a>

            <a
                href={tautanUbah}
                className="rounded-lg bg-amber-400 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-amber-500 hover:shadow"
            >
                <FaEdit className="text-[16px]" />
            </a>

            <button
                type="button"
                onClick={() => {
                    if (konfirmasiHapus(`data ${namaJenis}`, kode)) {
                        window.location.href = tautanHapus(dasar, namaJenis, id);
                    }
                }}
                className="rounded-lg bg-red-500 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-red-600 hover:shadow"
                title="Hapus Data"
            >
                <MdDelete className="text-[16px]" />
            </button>
        </div>
    );
}

// Mobile Card Action

export function AksiKartu({ jenis = "tiang", id, kode = "", dasar = "", tautanRinci = "#", tautanUbah = "#" }) {
    const namaJenis = jenis === "ont" ? "ont" : "tiang";
    return (
        <>
            <a
                href={tautanRinci}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-500 px-2 py-2 text-xs font-medium text-white"
            >
                <FaEye className="text-[14px]" /> Detail
            </a>
            <a
                href={tautanUbah}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-400 px-2 py-2 text-xs font-medium text-white"
            >
                <FaEdit className="text-[14px]" /> Edit
            </a>
            <button
                type="button"
                onClick={() => {
                    if (konfirmasiHapus(`data ${namaJenis}`, kode)) {
                        window.location.href = tautanHapus(dasar, namaJenis, id);
                    }
                }}
                title="Hapus Data"
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500 px-2 py-2 text-xs font-medium text-white"
            >
                <MdDelete className="text-[14px]" /> Hapus
            </button>
        </>
    );
}

// Tombol hapus

export function HapusTabel({ jenis = "wilayah", id, nama = "", dasar = "", judul = "Hapus Data", teksKonfirmasi = null }) {
    return (
        <button
            type="button"
            onClick={() => {
                if (window.confirm(teksKonfirmasi ?? `Apakah kamu yakin ingin menghapus ${jenis} ${nama}?`.trim())) {
                    window.location.href = tautanHapus(dasar, jenis, id);
                }
            }}
            className="rounded-lg bg-red-500 px-2 py-1.5 text-[10px] font-medium text-white shadow-sm ring-1 ring-white/10 transition hover:bg-red-600 hover:shadow"
            title={judul}
        >
            <MdDelete className="text-[16px]" />
        </button>
    );
}

// Tombol hapus mobile

export function HapusKartu({ jenis = "wilayah", id, nama = "", dasar = "", teksKonfirmasi = null }) {
    return (
        <button
            type="button"
            onClick={() => {
                if (window.confirm(teksKonfirmasi ?? `Apakah kamu yakin ingin menghapus ${jenis} ${nama}?`.trim())) {
                    window.location.href = tautanHapus(dasar, jenis, id);
                }
            }}
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-red-500 px-2 py-2 text-xs font-medium text-white"
        >
            <MdDelete className="text-[14px]" /> Hapus
        </button>
    );
}

// Keadaan kosong tabel desktop

export function TabelKosong({ rentangKolom = 9, ikon: Ikon, judul = "Belum ada data", petunjuk = "" }) {
    return (
        <tr>
            <td colSpan={rentangKolom} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-night-800">
                        {Ikon ? <Ikon className="text-xl text-gray-400 dark:text-night-500" /> : null}
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-night-400">{judul}</p>
                    {petunjuk ? <p className="text-xs text-gray-400 dark:text-night-500">{petunjuk}</p> : null}
                </div>
            </td>
        </tr>
    );
}

// Keadaan card kosong mobile

export function KartuKosong({ judul = "Belum ada data" }) {
    return (
        <p className="rounded-xl border border-dashed border-gray-200 dark:border-night-700 bg-gray-50/60 dark:bg-night-800/60 py-8 text-center text-xs text-gray-400 dark:text-night-500">
            {judul}
        </p>
    );
}
