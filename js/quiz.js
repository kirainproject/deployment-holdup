const PERTANYAAN = [
    ['fomo', 'Aku jadi pengen beli barang setelah lihat teman atau influencer memakainya.'],
    ['urgency', 'Aku buru-buru checkout waktu lihat hitungan mundur flash sale.'],
    ['mood', 'Aku buka aplikasi belanja waktu lagi stres, sedih, atau bosan.'],
    ['fomo', 'Aku beli barang yang lagi viral supaya nggak ketinggalan.'],
    ['urgency', 'Aku beli barang yang nggak kurencanakan karena promonya cuma berlaku hari itu.'],
    ['mood', "Aku belanja sebagai 'hadiah' buat diri sendiri setelah hari yang berat."]
];

const SKALA = ['Tidak pernah', 'Jarang', 'Kadang-kadang', 'Sering', 'Hampir selalu'];
const MAKS_KATEGORI = 2 * (SKALA.length - 1);

const tingkat = (n) => n <= 2 ? 'Rendah' : n <= 5 ? 'Sedang' : 'Tinggi';

const KATEGORI = {
    fomo: {
        nama: 'FoMO dan tren',
        judul: 'Si Anti Ketinggalan',
        warna: '#DC1928',
        desc: 'Keputusan belanjamu paling sering dipicu apa yang dipakai dan dibicarakan orang lain. Wajar, manusia memang makhluk sosial. Masalahnya, konten yang kamu lihat sering sengaja dirancang biar kamu merasa ketinggalan.',
        tips: [
            'Sadari polanya: pesan seperti "500 orang baru saja membeli" adalah taktik pemasaran yang sudah diteliti dan ditemukan di ratusan situs belanja.',
            'Masukkan dulu ke keranjang atau wishlist, lalu tunggu satu hari. Kalau besok masih kepikiran, baru pertimbangkan lagi.',
            'Tanya ke diri sendiri: kalau nggak ada yang tahu aku beli ini, apa aku masih mau?'
        ]
    },
    urgency: {
        nama: 'Promo dikejar waktu',
        judul: 'Si Paling Gercep',
        warna: '#d36831',
        desc: 'Hitungan mundur, "sisa 3 stok", dan diskon yang berakhir tengah malam paling mudah menggerakkanmu. Itu bukan kelemahan, memang itu tujuan desainnya: membuat orang memutuskan secepat mungkin.',
        tips: [
            'Countdown timer adalah pola manipulasi urgensi yang paling sering dipakai situs belanja. Promo besar datang lagi hampir tiap bulan.',
            "Pakai satu pertanyaan penguji: 'Kalau harganya normal, aku tetap mau beli nggak?'",
            'Tulis dulu barang yang memang kamu butuhkan sebelum tanggal kembar, lalu belanja hanya dari daftar itu.'
        ]
    },
    mood: {
        nama: 'Suasana hati',
        judul: 'Si Pencari Pelipur',
        warna: '#5C7A8E',
        desc: 'Kamu sering belanja untuk meredakan stres, bosan, atau sedih. Kebutuhan itu valid, dan belanja memang bisa bikin lega sebentar. Yang perlu dijaga: jangan sampai belanja jadi satu-satunya cara kamu menenangkan diri.',
        tips: [
            'Beri nama perasaanmu dulu sebelum membuka aplikasi belanja: lagi capek, bosan, atau sedih?',
            'Siapkan satu alternatif yang nggak butuh uang: jalan kaki sebentar, dengar lagu, ngobrol sama teman, atau merawat tanaman.',
            'Kalau tetap ingin beli, tunda sampai perasaanmu lebih tenang. Keputusan yang sama akan terasa berbeda.'
        ]
    }
};

const hitung = (jawaban) => {
    const skor = { fomo: 0, urgency: 0, mood: 0 };
    jawaban.forEach((nilai, i) => { if (nilai !== null) skor[PERTANYAAN[i][0]] += nilai; });
    const maks = Math.max(...Object.values(skor));
    const teratas = maks <= 2 ? [] : Object.keys(skor).filter(k => skor[k] === maks);
    return { skor, teratas };
};

console.assert(hitung([4, 1, 0, 3, 1, 0]).teratas.join() === 'fomo', 'hitung(): kategori tertinggi harus menang');
console.assert(hitung([3, 3, 1, 3, 3, 1]).teratas.join() === 'fomo,urgency', 'hitung(): hasil seri harus menampilkan keduanya');
console.assert(hitung([1, 0, 1, 1, 0, 0]).teratas.length === 0, 'hitung(): skor rendah semua tidak boleh dipaksa jadi satu tipe');

const $ = (id) => document.getElementById(id);
const intro = $('intro'), kuis = $('kuis'), hasil = $('hasil'), form = $('form-kuis');
const jawaban = new Array(PERTANYAAN.length).fill(null);
let idx = 0;

const tampil = (el) => {
    [intro, kuis, hasil].forEach(s => { s.hidden = s !== el; });
    el.classList.remove('enter');
    void el.offsetWidth;
    el.classList.add('enter');
};

PERTANYAAN.forEach(([, teks], i) => {
    const fs = document.createElement('fieldset');
    fs.className = 'q';
    fs.id = 'q' + i;
    fs.hidden = true;
    fs.tabIndex = -1;

    const lg = document.createElement('legend');
    lg.className = 'sr-only'; // visually hidden for screen readers
    const lgText = 'Dalam 3 bulan terakhir, seberapa sering ' + teks;
    lg.textContent = lgText;
    fs.appendChild(lg);

    const grid = document.createElement('div');
    grid.className = 'md:grid md:grid-cols-2 md:gap-12 md:items-start';

    const leftCol = document.createElement('div');
    leftCol.className = 'mb-6 md:mb-0';
    const when = document.createElement('span');
    when.className = 'when';
    when.setAttribute('aria-hidden', 'true');
    when.textContent = 'Dalam 3 bulan terakhir, seberapa sering';
    const qText = document.createElement('h2');
    qText.className = 'q-text';
    qText.setAttribute('aria-hidden', 'true');
    qText.textContent = teks;
    leftCol.append(when, qText);
    grid.appendChild(leftCol);

    const rightCol = document.createElement('div');
    rightCol.className = 'flex flex-col gap-3'; // replaces .option margin-bottom

    SKALA.forEach((label, nilai) => {
        const wrap = document.createElement('div');
        wrap.className = 'option';

        const inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = 'q' + i;
        inp.id = `q${i}-${nilai}`;
        inp.value = nilai;
        inp.addEventListener('change', () => { jawaban[i] = nilai; $('hint').textContent = ''; });

        const lab = document.createElement('label');
        lab.htmlFor = inp.id;
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = nilai + 1;
        const txt = document.createElement('span');
        txt.textContent = label;
        lab.append(badge, txt);

        wrap.append(inp, lab);
        rightCol.appendChild(wrap);
    });

    grid.appendChild(rightCol);
    fs.appendChild(grid);
    $('daftar-soal').appendChild(fs);
});

const tampilPertanyaan = (i) => {
    idx = i;
    form.querySelectorAll('.q').forEach((fs, n) => { fs.hidden = n !== i; });
    const total = PERTANYAAN.length;
    $('progress-label').textContent = `Pertanyaan ${i + 1} dari ${total}`;
    $('progress-fill').style.width = `${((i + 1) / total) * 100}%`;
    $('kembali').hidden = i === 0;
    $('lanjut-label').textContent = i === total - 1 ? 'Lihat hasil' : 'Lanjut';
    $('hint').textContent = '';

    $('q' + i).focus();
};

const tampilHasil = () => {
    const { skor, teratas } = hitung(jawaban);

    if (teratas.length === 0) {
        $('hasil-title').textContent = 'Masih Terkendali';
        $('hasil-desc').textContent = 'Belum ada pemicu yang menonjol dari jawabanmu. Kebiasaan ini layak dipertahankan. Tips di bawah bisa jadi bekal waktu godaan belanja datang.';
    } else {
        $('hasil-title').textContent = teratas.length === 3
            ? 'Semua Pemicu Seimbang'
            : teratas.map(k => KATEGORI[k].judul).join(' + ');
        $('hasil-desc').textContent = teratas.length > 1
            ? 'Pemicumu seimbang di lebih dari satu kategori. Baca tips untuk keduanya, lalu pilih yang paling terasa cocok.'
            : KATEGORI[teratas[0]].desc;
    }

    const bars = $('bars');
    bars.replaceChildren();
    Object.keys(KATEGORI).forEach(k => {
        const li = document.createElement('li');
        const top = document.createElement('div');
        top.className = 'bar__top';
        const n = document.createElement('span');
        n.textContent = KATEGORI[k].nama;
        const v = document.createElement('span');
        v.className = 'bar__level';
        v.textContent = `${tingkat(skor[k])} (${skor[k]} dari ${MAKS_KATEGORI})`;
        top.append(n, v);

        const track = document.createElement('div');
        track.className = 'bar__track';
        track.setAttribute('aria-hidden', 'true');
        const fill = document.createElement('div');
        fill.className = 'bar__fill';
        fill.style.background = KATEGORI[k].warna;
        track.appendChild(fill);

        li.append(top, track);
        bars.appendChild(li);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            fill.style.width = `${(skor[k] / MAKS_KATEGORI) * 100}%`;
        }));
    });

    const tips = $('tips');
    tips.replaceChildren();

    const sumberTips = teratas.length ? teratas.flatMap(k => KATEGORI[k].tips) : Object.values(KATEGORI).map(c => c.tips[1]);
    sumberTips.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        tips.appendChild(li);
    });

    simpan(KUNCI.pemicu, { kategori: teratas[0] || null, teratas, skor, waktu: Date.now() });

    tampil(hasil);
    window.scrollTo({ top: 0 });
    $('hasil-title').focus();
};

$('mulai').addEventListener('click', () => { tampil(kuis); tampilPertanyaan(0); });

$('kembali').addEventListener('click', () => { if (idx > 0) tampilPertanyaan(idx - 1); });

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (jawaban[idx] === null) {
        $('hint').textContent = 'Pilih satu jawaban dulu, yang paling mendekati kebiasaanmu.';
        return;
    }
    if (idx < PERTANYAAN.length - 1) tampilPertanyaan(idx + 1);
    else tampilHasil();
});

$('ulang').addEventListener('click', () => {
    form.reset();
    jawaban.fill(null);
    tampil(kuis);
    tampilPertanyaan(0);
});
