const angka = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 });

const waktuSetara = (harga, saku) => {
    const bulan = harga / saku;
    if (bulan >= 1) return `sekitar ${angka.format(Math.round(bulan * 10) / 10)} bulan uang sakumu`;
    return `sekitar ${Math.max(Math.round(bulan * 30), 1)} hari uang sakumu`;
};

const alternatif = (harga) => PEMBANDING
    .map(p => ({ ...p, n: Math.floor(harga / p.harga) }))
    .filter(p => p.n >= 1);

const kalimat = (alts) => {
    if (!alts.length) return 'Harganya masih di bawah semua pembanding kami. Tetap tanya ke diri sendiri: ini kebutuhan atau keinginan?';
    const bagian = alts.map(p => `${angka.format(p.n)} ${p.nama}`);
    const daftar = bagian.length > 1 ? bagian.slice(0, -1).join(', ') + ', atau ' + bagian.at(-1) : bagian[0];
    return `Kalau uang ini tidak dipakai sekarang, bisa untuk ${daftar}.`;
};

console.assert(waktuSetara(850000, 600000) === 'sekitar 1,4 bulan uang sakumu', 'waktuSetara(): bulan');
console.assert(waktuSetara(20000, 600000) === 'sekitar 1 hari uang sakumu', 'waktuSetara(): hari');
console.assert(waktuSetara(1000, 600000) === 'sekitar 1 hari uang sakumu', 'waktuSetara(): minimal 1 hari');
console.assert(alternatif(24000).length === 0, 'alternatif(): di bawah semua pembanding');
console.assert(kalimat(alternatif(60000)).includes('2 kali makan di luar'), 'kalimat(): menyebut alternatif');

const $ = (id) => document.getElementById(id);
const form = $('form-kalkulator'), hasil = $('hasil'), galat = $('galat');
const inHarga = $('harga'), inSaku = $('saku');

const rapikan = (inp) => {
    const n = keAngka(inp.value);
    if (!isNaN(n)) {
        inp.value = n.toLocaleString('id-ID');
    } else if (inp.value.replace(/\D/g, '') === '') {
        inp.value = '';
    }
};
[inHarga, inSaku].forEach(inp => inp.addEventListener('input', () => rapikan(inp)));

inSaku.value = ambil(KUNCI.saku, '');
if (inSaku.value) rapikan(inSaku);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const harga = keAngka(inHarga.value);
    const saku = keAngka(inSaku.value);

    if (isNaN(harga) || harga <= 0) {
        galat.textContent = 'Harga belum terisi. Tulis harganya pakai angka, misalnya 850000 atau 850.000.';
        inHarga.setAttribute('aria-invalid', 'true');
        inHarga.focus();
        hasil.hidden = true;
        return;
    }
    galat.textContent = '';
    inHarga.removeAttribute('aria-invalid');
    [inHarga, inSaku].forEach(rapikan);

    $('out-harga').textContent = rupiah.format(harga);

    const fill = $('out-fill');
    fill.style.width = '0';
    if (saku > 0) {
        simpan(KUNCI.saku, saku);
        const persen = Math.round((harga / saku) * 100);
        $('out-waktu').textContent = `Setara ${waktuSetara(harga, saku)}, atau ${angka.format(persen)}% dari uang saku sebulan.`;
        $('out-bar').hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = Math.min(persen, 100) + '%'; }));
    } else {
        $('out-waktu').textContent = 'Isi uang saku per bulan di atas kalau mau melihat harga ini diubah jadi satuan waktu.';
        $('out-bar').hidden = true;
    }

    const alts = alternatif(harga);
    $('out-kalimat').textContent = kalimat(alts);
    const ul = $('out-alts');
    ul.replaceChildren();
    alts.forEach(p => {
        const li = document.createElement('li');
        const b = document.createElement('strong');
        b.textContent = angka.format(p.n);
        li.append(b, `${p.nama} (±${rupiah.format(p.harga)})`);
        ul.appendChild(li);
    });

    hasil.hidden = false;
    hasil.classList.remove('enter');
    void hasil.offsetWidth;
    hasil.classList.add('enter');
    hasil.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('hasil-title').focus({ preventScroll: true });
});

$('ulang').addEventListener('click', () => {
    inHarga.value = '';
    hasil.hidden = true;
    inHarga.focus();
});
