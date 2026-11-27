import '../css/index.css';
import 'leaflet/dist/leaflet.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import DataTiang from './Pages/DataTiang';
import DataONT from './Pages/DataONT';
import Wilayah from './Pages/Wilayah';
import PetaSebaranAset from './Pages/PetaSebaranAset';
import Notifikasi from './Pages/Notifikasi';
import Pengaturan from './Pages/Pengaturan';
import Panduan from './Pages/Panduan';
import DetailTiang from './Pages/DetailTiang';
import DetailONT from './Pages/DetailONT';
import DetailNotifikasi from './Pages/DetailNotifikasi';
import Login from './Pages/Login';
import LupaPassword from './Pages/LupaPassword';
import FormTambahTiang from './Pages/Forms/FormTambahTiang';
import FormEditTiang from './Pages/Forms/FormEditTiang';
import FormTambahONT from './Pages/Forms/FormTambahONT';
import FormEditONT from './Pages/Forms/FormEditONT';
import FormTambahWilayah from './Pages/Forms/FormTambahWilayah';
import { useParams } from 'react-router-dom';
import { demoNotifikasi, demoONT, demoTiang, demoWilayah } from './data/demoData';
import { buildDemoProps } from './compat/inertia';

function DetailTiangRoute() {
    const { id } = useParams();
    const props = buildDemoProps();
    return <DetailTiang tiang={props.tiang.find(item => item.kode_tiang === id) || props.tiang[0]} />;
}

function DetailONTRoute() {
    const { id } = useParams();
    const props = buildDemoProps();
    return <DetailONT ont={props.ont.find(item => item.kode_ont === id) || props.ont[0]} />;
}

function DetailNotifikasiRoute() {
    const { id } = useParams();
    const props = buildDemoProps();
    return <DetailNotifikasi notifikasi={props.notifikasi.find(item => String(item.id) === id) || props.notifikasi[0]} />;
}

try {
    const isDark = window.localStorage.getItem('gis_theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
} catch {}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/home" element={<Home {...buildDemoProps()} />} />
                <Route path="/data-tiang" element={<DataTiang {...buildDemoProps()} />} />
                <Route path="/data-ont" element={<DataONT {...buildDemoProps()} />} />
                <Route path="/wilayah" element={<Wilayah {...buildDemoProps()} />} />
                <Route path="/peta-sebaran-aset" element={<PetaSebaranAset {...buildDemoProps()} />} />
                <Route path="/notifikasi" element={<Notifikasi {...buildDemoProps()} />} />
                <Route path="/pengaturan" element={<Pengaturan {...buildDemoProps()} />} />
                <Route path="/panduan" element={<Panduan {...buildDemoProps()} />} />
                <Route path="/detail-tiang/:id" element={<DetailTiangRoute />} />
                <Route path="/detail-ont/:id" element={<DetailONTRoute />} />
                <Route path="/detail-notifikasi/:id" element={<DetailNotifikasiRoute />} />
                <Route path="/tambah-tiang" element={<FormTambahTiang />} />
                <Route path="/edit-tiang/:id" element={<FormEditTiang />} />
                <Route path="/tambah-ont" element={<FormTambahONT />} />
                <Route path="/edit-ont/:id" element={<FormEditONT />} />
                <Route path="/tambah-wilayah" element={<FormTambahWilayah />} />
                <Route path="/login" element={<Login />} />
                <Route path="/lupa-password" element={<LupaPassword />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('app')).render(<App />);
