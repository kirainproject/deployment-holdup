const DETIK = 20;
const jam = document.getElementById('promo-jam'), teks = document.getElementById('promo-teks');
const formatJam = (s) => '00:' + String(s).padStart(2, '0');
console.assert(formatJam(5) === '00:05' && formatJam(20) === '00:20', 'formatJam(): dua digit');

let ulang = 0, akhir = Date.now() + DETIK * 1000;
setInterval(() => {
    let sisa = Math.ceil((akhir - Date.now()) / 1000);
    if (sisa <= 0) {
        ulang++;
        akhir = Date.now() + DETIK * 1000;
        sisa = DETIK;
        teks.textContent = ulang === 1
            ? 'Hitungannya mulai lagi dari 00:20, stoknya tetap "Tersisa 3 barang". Tidak ada yang hampir habis.'
            : `Sudah mengulang ${ulang} kali. Angka yang mendesakmu ini tidak mengukur apa pun.`;
        teks.hidden = false;
    }
    jam.textContent = formatJam(sisa);
}, 250);

const toc = document.getElementById('toc');
const lebar = matchMedia('(min-width: 901px)');
const aturToc = () => { toc.open = lebar.matches; };
aturToc();
lebar.addEventListener('change', aturToc);
toc.querySelector('summary').addEventListener('click', (e) => { if (lebar.matches) e.preventDefault(); });

toc.addEventListener('click', (e) => { if (e.target.closest('a') && !lebar.matches) toc.open = false; });

const tautan = [...toc.querySelectorAll('a')];
const judul = tautan.map(a => document.getElementById(a.hash.slice(1)));
const tandai = () => {
    let aktif = judul[0];
    judul.forEach(h => { if (h.getBoundingClientRect().top < innerHeight / 3) aktif = h; });
    tautan.forEach(a => a.hash === '#' + aktif.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
};
console.assert(judul.every(Boolean), 'daftar isi: setiap tautan harus punya judul tujuan');
addEventListener('scroll', tandai, { passive: true });
tandai();
