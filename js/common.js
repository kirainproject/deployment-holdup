const KUNCI = { pemicu: 'holdup-pemicu', saku: 'holdup-saku', jurnal: 'holdup-jurnal', putaran: 'holdup-putaran' };

const simpan = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
const ambil = (k, bawaan) => { try { return JSON.parse(localStorage.getItem(k)) ?? bawaan; } catch (e) { return bawaan; } };

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

const keAngka = (teks) => { const b = String(teks).replace(/\D/g, ''); return b ? Number(b) : NaN; };
console.assert(keAngka('Rp1.250.000') === 1250000 && isNaN(keAngka('abc')), 'keAngka(): format rupiah harus terbaca');

const PEMBANDING = [
    { nama: 'kali makan di luar', harga: 25000 },
    { nama: 'paket data 10 GB', harga: 60000 },
    { nama: 'bulan langganan musik', harga: 55000 },
    { nama: 'tiket nonton bioskop', harga: 50000 }
];
