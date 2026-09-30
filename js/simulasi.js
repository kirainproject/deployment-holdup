const DETIK_JEDA = 15;
const TUJUH_HARI = 7 * 24 * 60 * 60 * 1000;

const PERTANYAAN = [
    'Coba sebut satu alasan untuk tidak membeli barang ini hari ini.',
    'Apa yang sedang kamu tabung atau tuju bulan ini? Barang ini mendekatkan atau menjauhkan?',
    'Kalau barang ini tidak muncul di layar sekarang, apa kamu akan mencarinya sendiri?',
    'Apa yang kamu rasakan barusan, sebelum membuka aplikasi belanjanya?',
    'Barang serupa yang sudah kamu punya, kapan terakhir kamu pakai?'
];

const NAMA_PEMICU = { fomo: 'FoMO dan tren', urgency: 'Promo dikejar waktu', mood: 'Suasana hati' };

const CONTOH = {
    fashion: ['Sepatu sneakers putih', '450.000'],
    gadget: ['Earphone nirkabel', '350.000'],
    skincare: ['Paket serum wajah', '180.000'],
    lainnya: ['Figur koleksi', '250.000']
};

const tanggal = (ms) => new Date(ms).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const ringkas = (jurnal) => ({
    tertahan: jurnal.filter(e => e.hasil === null).reduce((a, e) => a + e.harga, 0),
    batal: jurnal.filter(e => e.hasil === 'batal').length,
    total: jurnal.length
});

const pemicuTeratas = (jurnal) => {
    const n = { fomo: 0, urgency: 0, mood: 0 };
    jurnal.forEach(e => { if (e.kategori in n) n[e.kategori]++; });
    return jurnal.length ? Object.keys(n).reduce((a, b) => n[b] > n[a] ? b : a) : null;
};

const contoh = [{ harga: 1000, hasil: null, kategori: 'mood' }, { harga: 500, hasil: 'batal', kategori: 'mood' }, { harga: 700, hasil: 'jadi', kategori: 'fomo' }];
console.assert(ringkas(contoh).tertahan === 1000, 'ringkas(): entri yang sudah selesai tidak boleh ikut dihitung sebagai tertahan');
console.assert(ringkas(contoh).batal === 1, 'ringkas(): hanya entri berhasil "batal" yang dihitung batal');
console.assert(pemicuTeratas(contoh) === 'mood' && pemicuTeratas([]) === null, 'pemicuTeratas(): terbanyak, atau null kalau kosong');

const $ = (id) => document.getElementById(id);
const awal = $('tahap-awal'), jeda = $('tahap-jeda'), form = $('form-simulasi');
const inNama = $('nama-barang'), inHarga = $('harga-barang'), galat = $('galat');
const jawaban = $('jawaban'), tombolLanjut = $('tombol-lanjut'), status = $('status-jeda');
let entri = null, jam = null, jedaSelesai = false;

PERTANYAAN.forEach(t => { const li = document.createElement('li'); li.textContent = t; $('daftar-pertanyaan').appendChild(li); });

const hasilKuis = ambil(KUNCI.pemicu, null);
if (hasilKuis && hasilKuis.kategori in NAMA_PEMICU) {
    $('pm-' + hasilKuis.kategori).checked = true;
    $('pemicu-note').hidden = false;
}

form.skenario.forEach(r => r.addEventListener('change', () => {
    [inNama.placeholder, inHarga.placeholder] = CONTOH[r.value];
}));
form.pemicu.forEach(r => r.addEventListener('change', () => {
    $('wrap-lainnya').hidden = form.pemicu.value !== 'lainnya';
}));
inHarga.addEventListener('input', (e) => { 
    const cursor = e.target.selectionStart;
    const oldLen = e.target.value.length;
    const n = keAngka(inHarga.value); 
    if (!isNaN(n)) {
        inHarga.value = n.toLocaleString('id-ID'); 
        const newLen = inHarga.value.length;
        e.target.setSelectionRange(cursor + (newLen - oldLen), cursor + (newLen - oldLen));
    } else if (inHarga.value.replace(/\D/g, '') === '') {
        inHarga.value = '';
    }
});

const tampil = (tahap) => {
    [awal, jeda].forEach(t => { t.hidden = t !== tahap; });
    tahap.classList.remove('enter');
    void tahap.offsetWidth;
    tahap.classList.add('enter');
    tahap.scrollIntoView({ block: 'start' });
    tahap.querySelector('h1, h2').focus({ preventScroll: true });
};

const cekTombol = () => { tombolLanjut.disabled = !(jedaSelesai && jawaban.value.trim()); };
jawaban.addEventListener('input', cekTombol);

const mulaiJeda = () => {
    const putaran = ambil(KUNCI.putaran, 0);
    simpan(KUNCI.putaran, putaran + 1);
    $('teks-refleksi').textContent = PERTANYAAN[putaran % PERTANYAAN.length];
    jawaban.value = '';
    jedaSelesai = false;
    status.textContent = '';
    $('pilihan').hidden = true;
    cekTombol();
    tampil(jeda);

    const akhir = Date.now() + DETIK_JEDA * 1000;
    const detak = () => {
        const sisaMs = akhir - Date.now();
        $('angka-jeda').textContent = Math.max(Math.ceil(sisaMs / 1000), 0);
        $('isi-jeda').style.width = Math.min(100, (1 - sisaMs / (DETIK_JEDA * 1000)) * 100) + '%';
        if (sisaMs > 0) return;
        clearInterval(jam);
        jedaSelesai = true;
        cekTombol();
        $('pilihan').hidden = false;
        status.textContent = jawaban.value.trim()
            ? 'Jeda selesai. Sekarang keputusannya kamu yang pegang.'
            : 'Jeda selesai. Tulis jawabanmu dulu kalau mau lanjut beli, atau pilih tunda dulu.';
    };
    clearInterval(jam);
    detak();
    jam = setInterval(detak, 250);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = inNama.value.trim(), harga = keAngka(inHarga.value);
    [inNama, inHarga, $('pemicu-lainnya')].forEach(i => { if (i) i.removeAttribute('aria-invalid'); });
    if (!nama) {
        galat.textContent = 'Tulis dulu barang yang kamu incar, supaya bisa dicatat kalau kamu menundanya.';
        inNama.setAttribute('aria-invalid', 'true');
        return inNama.focus();
    }
    if (isNaN(harga) || harga <= 0) {
        galat.textContent = 'Harga belum terisi. Tulis pakai angka, misalnya 450000 atau 450.000.';
        inHarga.setAttribute('aria-invalid', 'true');
        return inHarga.focus();
    }
    
    let pemicuValue = form.pemicu.value;
    if (pemicuValue === 'lainnya') {
        const text = $('pemicu-lainnya').value.trim();
        if (!text) {
            galat.textContent = 'Tuliskan alasan lainnya sebelum melanjutkan.';
            $('pemicu-lainnya').setAttribute('aria-invalid', 'true');
            return $('pemicu-lainnya').focus();
        }
        pemicuValue = text;
    }

    galat.textContent = '';
    $('pesan-akhir').textContent = '';
    entri = { nama, harga, kategori: pemicuValue, skenario: form.skenario.value };
    $('ringkas-barang').textContent = `${nama} (${rupiah.format(harga)})`;
    mulaiJeda();
});

const selesai = (pesan) => {
    entri = null;
    form.reset();
    $('wrap-lainnya').hidden = true;
    if (hasilKuis && hasilKuis.kategori in NAMA_PEMICU) $('pm-' + hasilKuis.kategori).checked = true;
    $('pesan-akhir').textContent = pesan;
    tampil(awal);
};

tombolLanjut.addEventListener('click', () => {
    selesai('Tidak apa-apa. Kamu sudah memberi jeda pada keputusanmu, dan itu yang dilatih di sini.');
});

$('tombol-tunda').addEventListener('click', () => {
    if (!entri) return;
    clearInterval(jam);
    const sekarang = Date.now();
    const jurnal = ambil(KUNCI.jurnal, []);
    jurnal.push({ ...entri, ditunda: sekarang, tinjau: sekarang + TUJUH_HARI, hasil: null });
    const tersimpan = simpan(KUNCI.jurnal, jurnal);
    gambarJurnal();
    selesai(tersimpan
        ? `Ditunda. Sudah masuk Jurnal Tunda di bawah, ditinjau lagi ${tanggal(sekarang + TUJUH_HARI)}.`
        : 'Ditunda. Browser ini memblokir penyimpanan jadi entrinya tidak tercatat, tapi jedanya tetap berlaku.');
});

const gambarJurnal = () => {
    const jurnal = ambil(KUNCI.jurnal, []);
    const r = ringkas(jurnal);
    const teratas = pemicuTeratas(jurnal);
    $('angka-tertahan').textContent = rupiah.format(r.tertahan);
    $('angka-batal').textContent = r.total ? `${r.batal} dari ${r.total}` : 'belum ada';
    $('angka-kategori').textContent = teratas ? NAMA_PEMICU[teratas] : 'belum ada';
    $('jurnal-kosong').hidden = r.total > 0;

    const ul = $('daftar-jurnal');
    ul.textContent = '';

    jurnal.map((e, i) => [e, i]).reverse().forEach(([e, i]) => {
        const li = document.createElement('li');
        const baris = document.createElement('div');
        baris.className = 'row';
        const judul = document.createElement('span');
        judul.textContent = `${e.nama} · ${rupiah.format(e.harga)}`;
        const tag = document.createElement('span');
        tag.className = 'tag' + (e.hasil === 'batal' ? ' tag--batal' : '');
        tag.textContent = e.hasil === 'batal' ? 'batal dibeli' : e.hasil === 'jadi' ? 'akhirnya dibeli' : 'sedang ditunda';
        baris.append(judul, tag);

        const meta = document.createElement('p');
        meta.className = 'meta';
        meta.textContent = `Pemicu: ${NAMA_PEMICU[e.kategori] || e.kategori}. Ditunda ${tanggal(e.ditunda)}, ditinjau ${tanggal(e.tinjau)}.`;
        li.append(baris, meta);

        if (e.hasil === null && Date.now() >= e.tinjau) {
            const tanya = document.createElement('p');
            tanya.className = 'ask';
            tanya.textContent = 'Tujuh hari sudah lewat. Jadi kamu beli, atau tidak?';
            const aksi = document.createElement('div');
            aksi.className = 'ask-actions';
            [['batal', 'Tidak jadi beli'], ['jadi', 'Akhirnya beli']].forEach(([nilai, teks]) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'pill pill--small';
                b.textContent = teks;
                b.addEventListener('click', () => {
                    const isi = ambil(KUNCI.jurnal, []);
                    if (!isi[i]) return;
                    isi[i].hasil = nilai;
                    simpan(KUNCI.jurnal, isi);
                    gambarJurnal();
                    $('jurnal-title').setAttribute('tabindex', '-1');
                    $('jurnal-title').focus();
                });
                aksi.appendChild(b);
            });
            li.append(tanya, aksi);
        }
        ul.appendChild(li);
    });
};

$('hapus-jurnal').addEventListener('click', () => {
    if (!confirm('Hapus seluruh isi Jurnal Tunda? Tindakan ini tidak bisa dibatalkan.')) return;
    simpan(KUNCI.jurnal, []);
    gambarJurnal();
});

gambarJurnal();
