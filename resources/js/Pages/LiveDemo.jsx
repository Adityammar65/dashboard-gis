import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiBell, FiHome, FiMap, FiMapPin, FiSearch, FiSettings, FiWifi } from "react-icons/fi";
import { demoNotifikasi, demoONT, demoSettings, demoStats, demoTiang, demoWilayah } from "../data/demoData";
import AssetMap from "./AssetMap";

const routes = [["/home", "Beranda", FiHome], ["/data-tiang", "Data Tiang", FiMapPin], ["/data-ont", "Data ONT", FiWifi], ["/wilayah", "Wilayah", FiMap], ["/peta-sebaran-aset", "Peta Sebaran", FiMap], ["/notifikasi", "Notifikasi", FiBell], ["/pengaturan", "Pengaturan", FiSettings]];

export default function LiveDemo() {
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");
    const title = routes.find(([path]) => path === pathname)?.[1] || "Beranda";
    const assets = useMemo(() => [...demoTiang, ...demoONT].filter(item => Object.values(item).some(value => String(value ?? "").toLowerCase().includes(query.toLowerCase()))), [query]);
    const showMessage = () => window.alert("Live demo: perubahan tidak disimpan.");

    return <div className="min-h-screen bg-[#F6F4F4] font-poppins dark:bg-night-950 dark:text-night-200">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-gradient-to-r from-[#6F2424] to-[#AB3C3C] px-5 text-white"><strong>GIS Dashboard · LIVE DEMO</strong><span>Data statis · perubahan tidak disimpan</span><button aria-label="Info" onClick={showMessage}><FiBell /></button></header>
        <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 bg-white p-3 dark:bg-night-900 md:block"><nav>{routes.map(([path, label, Icon]) => <Link key={path} to={path} className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${pathname === path ? "bg-[#AB3C3C] text-white" : "text-[#992e2e] dark:text-night-300"}`}><Icon />{label}</Link>)}</nav><p className="absolute bottom-4 text-xs">Tanpa backend atau database.</p></aside>
        <main className="p-4 md:ml-64 md:p-6"><h1 className="mb-5 text-2xl font-bold">{title} · {demoSettings.nama_wilayah}</h1>
            {pathname === "/home" && <><div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">{[["Total Tiang", demoStats.total_tiang], ["Total ONT", demoStats.total_ont], ["Tiang Aktif", demoStats.tiang_aktif], ["ONT Aktif", demoStats.ont_aktif]].map(([label, value]) => <article key={label} className="rounded-xl bg-white p-5 shadow dark:bg-night-900">{label}<strong className="block text-3xl">{value}</strong></article>)}</div><AssetMap /></>}
            {(pathname === "/data-tiang" || pathname === "/data-ont") && <section className="rounded-xl bg-white p-4 shadow dark:bg-night-900"><label className="mb-4 flex gap-2 rounded border p-2"><FiSearch /><input className="w-full bg-transparent" placeholder="Cari aset" value={query} onChange={event => setQuery(event.target.value)} /></label><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr>{["Kode", "Jenis", "Wilayah", "Kecamatan", "Petugas", "Status"].map(item => <th className="p-3" key={item}>{item}</th>)}</tr></thead><tbody>{assets.map(item => <tr key={item.kode_tiang || item.kode_ont} className="border-t"><td className="p-3">{item.kode_tiang || item.kode_ont}</td><td className="p-3">{item.kode_tiang ? "Tiang" : "ONT"}</td><td className="p-3">{item.wilayah}</td><td className="p-3">{item.kecamatan}</td><td className="p-3">{item.nama_petugas}</td><td className="p-3">{item.status}</td></tr>)}</tbody></table></div><button className="mt-4 rounded bg-[#AB3C3C] px-3 py-2 text-white" onClick={showMessage}>Tambah data (demo)</button></section>}
            {pathname === "/wilayah" && <div className="grid gap-3 sm:grid-cols-2">{demoWilayah.map(item => <article key={item.kode_wilayah} className="rounded-xl bg-white p-5 shadow dark:bg-night-900"><strong>{item.nama_wilayah}</strong><p>Kode: {item.kode_wilayah}</p></article>)}</div>}
            {pathname === "/peta-sebaran-aset" && <AssetMap />}
            {pathname === "/notifikasi" && <div className="space-y-3">{demoNotifikasi.map(item => <article key={item.id} className="rounded-xl bg-white p-4 shadow dark:bg-night-900"><strong>{item.judul}</strong><p>{item.pesan}</p></article>)}</div>}
            {pathname === "/pengaturan" && <article className="rounded-xl bg-white p-5 shadow dark:bg-night-900">Live demo menampilkan pengaturan contoh. Perubahan tidak disimpan.</article>}
            {!routes.some(([path]) => path === pathname) && <article className="rounded-xl bg-white p-6 shadow dark:bg-night-900">Halaman demo statis. <Link to="/home">Kembali ke beranda</Link></article>}
        </main>
    </div>;
}
