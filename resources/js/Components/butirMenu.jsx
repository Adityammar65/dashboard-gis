import { FaWifi, FaMap } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { LuUtilityPole } from "react-icons/lu";
import { IoMdHome } from "react-icons/io";

export const KONFIRMASI_KELUAR = "Kembali ke Halaman Login?";

export const butirMenu = [
    {
        label: "Beranda",
        tautan: "home",
        icon: <IoMdHome size={20} />,
        jalurAktif: ["home"],
    },
    {
        label: "Data Tiang",
        tautan: "data-tiang",
        icon: <LuUtilityPole size={20} />,
        jalurAktif: ["data-tiang", "tambah-tiang", "edit-tiang", "detail-tiang"],
    },
    {
        label: "Data ONT",
        tautan: "data-ont",
        icon: <FaWifi size={20} />,
        jalurAktif: ["data-ont", "tambah-ont", "edit-ont", "detail-ont"],
    },
    {
        label: "Data Wilayah",
        tautan: "wilayah",
        icon: <FaMap size={20} />,
        jalurAktif: ["wilayah"],
    },
    {
        label: "Peta Sebaran Aset",
        tautan: "peta-sebaran-aset",
        icon: <FaLocationCrosshairs size={20} />,
        jalurAktif: ["peta-sebaran-aset"],
    },
];

export const apakahJalurAktif = (jalurSaatIni, daftarJalur) =>
    (daftarJalur || []).some((jalur) => jalurSaatIni === `/${jalur}` || jalurSaatIni.endsWith(`/${jalur}`));

export const apakahJalurPengaturan = (jalurSaatIni) =>
    jalurSaatIni === "/pengaturan" || jalurSaatIni.endsWith("/pengaturan");

export const apakahJalurNotifikasi = (jalurSaatIni) =>
    jalurSaatIni === "/notifikasi" ||
    jalurSaatIni.endsWith("/notifikasi") ||
    jalurSaatIni.endsWith("/detail-notifikasi");
