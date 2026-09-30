const KATEGORI = { fomo: 'FoMO dan tren', urgency: 'promo dikejar waktu', mood: 'suasana hati' };

const MULAI = [
    ['Mau checkout sesuatu', 'barang'],
    ['Udah terlanjur beli', 'sesal'],
    ['Cuma lagi scroll', 'scroll'],
    ['Tanya soal paylater', 'paylater']
];
const ULANG = [['Mulai dari awal', 'mulai']];
const MASIH = [['Masih mau', 'harga'], ['Kayaknya nggak', 'bukan-barang']];

const ALUR = {
    mulai: {
        bot: (k) => [
            'Hai, aku <strong>Teman Jeda</strong>. Aku nemenin kamu mikir sebentar sebelum checkout. Aku simulasi, jadi semua jawabanku ditulis tim HoldUp dan aku cuma paham soal belanja impulsif.',
            ...(k.pemicu ? [`Dari Kuis Pemicu, pemicu terbesarmu <strong>${KATEGORI[k.pemicu]}</strong>. Aku ingat itu, jadi kamu nggak perlu cerita ulang.`] : []),
            'Lagi ada apa?'
        ],
        pilihan: MULAI
    },
    barang: {
        bot: (k) => [
            'Oke, ada yang lagi pengen kamu beli. Apa yang paling bikin kamu pengen beli <em>sekarang</em>?',
            ...(k.pemicu ? [`Kalau dari kuis, biasanya ${KATEGORI[k.pemicu]}. Kali ini sama?`] : [])
        ],
        pilihan: [
            ['Lagi diskon atau flash sale', 'urgency'],
            ['Teman atau influencer punya', 'fomo'],
            ['Lagi bad mood atau bosan', 'mood'],
            ['Memang lagi butuh', 'butuh']
        ]
    },
    urgency: {
        bot: [
            'Hitungan mundur dan "stok tinggal 2" memang dirancang supaya kamu buru-buru. Di Eropa, regulator menemukan 42 toko daring yang memasang hitungan mundur palsu.',
            'Coba jawab jujur: kalau diskonnya habis dan harganya balik normal, kamu masih mau beli?'
        ],
        pilihan: MASIH
    },
    fomo: {
        bot: [
            'Pengen ikut punya itu wajar, kita memang makhluk sosial. Tapi yang kamu lihat di media sosial cuma potongan terbaik dari hidup orang lain.',
            'Satu pertanyaan: kalau nggak ada yang tahu kamu beli ini, kamu masih mau?'
        ],
        pilihan: MASIH
    },
    mood: {
        bot: [
            'Makasih udah jujur. Belanja memang bisa bikin lega sebentar, jadi wajar kalau kepikiran.',
            'Kalau boleh tahu, lagi ngerasa apa?'
        ],
        pilihan: [['Capek', 'capek'], ['Bosan', 'bosan'], ['Sedih atau kesal', 'sedih']]
    },
    capek: {
        bot: [
            'Capek biasanya minta istirahat, bukan barang baru. Coba lima menit tanpa layar: minum air, rebahan, atau tarik napas pelan.',
            'Habis itu, masih pengen beli?'
        ],
        pilihan: MASIH
    },
    bosan: {
        bot: [
            'Waktu bosan, aplikasi belanja gampang terasa seperti hiburan. Coba ganti dulu dengan hal yang nggak butuh uang: dengar satu lagu, jalan sebentar, atau chat teman.',
            'Habis itu, masih pengen beli?'
        ],
        pilihan: MASIH
    },
    sedih: {
        bot: [
            'Perasaan itu valid. Belanja bisa meredakan sebentar, tapi perasaannya sering balik lagi, kali ini ditambah tagihan.',
            'Coba cerita ke orang yang kamu percaya, atau tulis apa yang bikin kamu kesal. Kalau perasaannya berat dan nggak kunjung hilang, konselor di <a href="https://healing119.id">healing119.id</a> bisa diajak ngobrol, gratis.',
            'Habis itu, masih pengen beli?'
        ],
        pilihan: MASIH
    },
    butuh: {
        bot: [
            'Bagus kalau memang butuh. Dua cek cepat sebelum bayar:',
            'Kamu bakal pakai barang ini minggu ini? Dan harganya sudah kamu bandingkan di toko lain?'
        ],
        pilihan: [['Udah, dua-duanya', 'harga'], ['Belum', 'cek-dulu']]
    },
    'cek-dulu': {
        bot: ['Nggak apa-apa, justru ini saatnya. Simpan dulu barangnya di wishlist, bandingkan harganya, lalu balik lagi kalau sudah yakin.'],
        pilihan: [['Oke, aku cek dulu', 'tunda'], ...ULANG]
    },
    harga: {
        bot: ['Oke. Berapa harganya? Ketik saja di kolom bawah, misalnya <strong>150rb</strong>, <strong>1,2jt</strong>, atau <strong>250000</strong>.'],
        pilihan: [['Lewati', 'putuskan']],
        minta: 'harga'
    },
    biaya: {
        bot: (k) => [
            `${rupiah.format(k.harga)} itu setara ${setara(k.harga)}.`,
            'Ini bukan buat bikin kamu merasa bersalah. Cuma supaya kamu tahu apa yang kamu tukar.',
            'Jadi, gimana?'
        ],
        pilihan: [['Tunda 24 jam', 'tunda'], ['Tetap beli', 'beli']]
    },
    putuskan: {
        bot: ['Oke, tanpa angka juga bisa. Jadi, gimana?'],
        pilihan: [['Tunda 24 jam', 'tunda'], ['Tetap beli', 'beli']]
    },
    'bukan-barang': {
        bot: [
            'Berarti yang bikin kamu tertarik mungkin momennya, bukan barangnya. Itu temuan penting.',
            'Coba tutup dulu aplikasinya. Kalau besok barangnya masih kepikiran, kamu bisa balik lagi dengan kepala lebih dingin.'
        ],
        pilihan: [['Oke, aku tunda', 'tunda'], ...ULANG]
    },
    tunda: {
        bot: [
            'Keputusan yang keren. Masukkan ke wishlist, lalu cek lagi besok di jam yang sama.',
            'Mau latihan yang lebih lengkap? Coba <a href="simulasi.html">Simulasi Jeda</a>. Barang yang kamu tunda di sana dicatat di Jurnal Tunda.'
        ],
        pilihan: ULANG
    },
    beli: {
        bot: [
            'Oke, itu keputusanmu, dan kamu mengambilnya setelah berpikir. Itu yang penting.',
            'Satu cek terakhir: lihat total di halaman pembayaran, termasuk ongkir dan biaya lain. Di Eropa, 70 toko daring ketahuan menyembunyikan informasi penting seperti biaya kirim.'
        ],
        pilihan: ULANG
    },
    sesal: {
        bot: [
            'Itu terjadi ke banyak orang, jadi jangan terlalu keras ke diri sendiri.',
            'Cek dulu apakah pesanannya masih bisa dibatalkan atau dikembalikan. Setelah itu, coba ingat: apa yang bikin kamu checkout waktu itu?'
        ],
        pilihan: [
            ['Diskon atau flash sale', 'sesal-pemicu'],
            ['Ikut-ikutan', 'sesal-pemicu'],
            ['Lagi bad mood', 'sesal-pemicu']
        ]
    },
    'sesal-pemicu': {
        bot: [
            'Nah, itu pemicumu kali ini. Mengenali pemicu adalah langkah pertama supaya lain kali kamu lebih cepat sadar.',
            'Mau tahu polamu lebih lengkap? Coba <a href="quiz.html">Kuis Pemicu</a>.'
        ],
        pilihan: ULANG
    },
    scroll: {
        bot: [
            'Scroll nggak masalah. Tapi makin lama di aplikasi belanja, makin banyak dorongan yang kamu lihat.',
            'Coba pasang batas: timer 10 menit, atau hapus kartu dan paylater dari opsi bayar cepat supaya checkout butuh usaha sedikit lebih banyak.'
        ],
        pilihan: [['Oke, siap', 'mulai'], ['Sebenarnya ada yang pengen dibeli', 'barang']]
    },
    paylater: {
        bot: [
            'Paylater bikin harga terasa ringan karena uangmu nggak langsung berkurang. Menurut OJK, per Juli 2026 total utang paylater di bank sudah Rp31,56 triliun.',
            'Sejak 1 Juli 2026, paylater dari perusahaan pembiayaan cuma untuk yang minimal 18 tahun atau sudah menikah, dan berpenghasilan minimal Rp3 juta per bulan.',
            'Coba tanya ke diri sendiri: kalau harus bayar lunas hari ini, kamu masih mau beli?'
        ],
        pilihan: MASIH
    },
    tentang: {
        bot: [
            'Aku Teman Jeda versi simulasi. Semua jawabanku ditulis tim HoldUp berdasarkan riset, bukan dihasilkan AI. Yang kamu ketik tidak dikirim ke mana pun.',
            'Aku cuma paham soal belanja impulsif. Mau mulai dari mana?'
        ],
        pilihan: MULAI
    },
    krisis: {
        penting: true,
        bot: [
            'Makasih sudah cerita. Yang kamu rasakan penting, dan kamu nggak harus menanggungnya sendirian.',
            'Aku cuma simulasi, jadi aku nggak bisa membantu sebaik manusia. Tolong hubungi <strong>119 ekstensi 8</strong> atau buka <a href="https://healing119.id">healing119.id</a>, layanan konseling gratis dari Kementerian Kesehatan.',
            'Kalau kamu dalam bahaya sekarang, segera hubungi orang dewasa yang kamu percaya atau layanan darurat terdekat.'
        ],
        pilihan: [['Kembali ke obrolan', 'mulai']]
    }
};

const KATA_KUNCI = [
    [/bunuh diri|pengen mati|ingin mati|mau mati|mati aja|akhiri hidup|mengakhiri hidup|nyakitin diri|menyakiti diri|melukai diri|self.?harm|gak kuat hidup|nggak kuat hidup|ga kuat hidup/, 'krisis'],
    [/\b(kamu|lu|lo|kau) (siapa|ai|robot|bot)\b|\bai\b|chatgpt|robot|\bbot\b/, 'tentang'],
    [/nyesel|menyesal|terlanjur|telanjur|udah beli|sudah beli|kebeli/, 'sesal'],
    [/paylater|pay later|cicil|utang|hutang|kredit|spaylater|gopaylater/, 'paylater'],
    [/diskon|promo|flash|sale|countdown|hitung mundur|stok|voucher|cashback|tanggal kembar|harbolnas/, 'urgency'],
    [/teman|temen|influencer|viral|tren|trend|fomo|live|ketinggalan|review/, 'fomo'],
    [/capek|cape|lelah/, 'capek'],
    [/bosan|bosen|gabut/, 'bosan'],
    [/sedih|kesal|kesel|galau|bete|marah|stres|stress|cemas|bad ?mood|nangis/, 'sedih'],
    [/butuh|perlu|keperluan/, 'butuh'],
    [/scroll|iseng|lihat.lihat|liat.liat|window/, 'scroll'],
    [/beli|checkout|check out|keranjang|pengen|pingin|mau/, 'barang'],
    [/^(hai|halo|hi|hello|hei|hey|p|permisi|pagi|siang|sore|malam)\b/, 'mulai']
];

const cariLangkah = (teks) => {
    const t = teks.toLowerCase();
    const cocok = KATA_KUNCI.find(([pola]) => pola.test(t));
    return cocok ? cocok[1] : null;
};

const keHarga = (teks) => {
    const m = String(teks).toLowerCase().replace(/rp\.?\s*/g, '').match(/(\d+(?:[.,]\d+)*)\s*(jt|juta|rb|ribu|k)?\b/);
    if (!m) return NaN;
    const kali = { jt: 1e6, juta: 1e6, rb: 1e3, ribu: 1e3, k: 1e3 }[m[2]];
    const n = kali ? parseFloat(m[1].replace(',', '.')) * kali : Number(m[1].replace(/\D/g, ''));
    return n >= 1000 ? Math.round(n) : NaN;
};

const setara = (harga) => {
    const bagian = PEMBANDING.filter(p => harga >= p.harga).map(p => `${Math.floor(harga / p.harga)} ${p.nama}`);
    if (!bagian.length) return `hampir ${Math.round(harga / PEMBANDING[0].harga * 100)}% dari sekali makan di luar`;
    return bagian.length === 1 ? bagian[0] : bagian.slice(0, -1).join(', ') + ', atau ' + bagian.at(-1);
};

console.assert(keHarga('150rb') === 150000 && keHarga('1,2jt') === 1200000, 'keHarga(): singkatan rb dan jt');
console.assert(keHarga('Rp250.000') === 250000 && keHarga('75k') === 75000, 'keHarga(): format rupiah dan k');
console.assert(isNaN(keHarga('mahal')) && isNaN(keHarga('5')), 'keHarga(): bukan harga harus NaN');
console.assert(setara(60000) === '2 kali makan di luar, 1 paket data 10 GB, 1 bulan langganan musik, atau 1 tiket nonton bioskop', 'setara(): daftar pembanding');
console.assert(setara(20000) === 'hampir 80% dari sekali makan di luar', 'setara(): di bawah pembanding termurah');
console.assert(cariLangkah('aku pengen mati aja') === 'krisis', 'cariLangkah(): arahan bantuan didahulukan');
console.assert(cariLangkah('lagi ada flash sale nih') === 'urgency' && cariLangkah('kamu ai ya?') === 'tentang', 'cariLangkah(): kata kunci');
console.assert(cariLangkah('harga iphone berapa') === null, 'cariLangkah(): di luar topik harus null');

const $ = (id) => document.getElementById(id);
const log = $('log'), pilihan = $('pilihan'), form = $('form-chat'), ketik = $('ketik'), status = $('chat-status');
const hemat = matchMedia('(prefers-reduced-motion: reduce)');
const konteks = { pemicu: null, harga: null };
let sekarang = 'mulai', sibuk = false, lewatKetik = false, pertama = true;

konteks.pemicu = ambil(KUNCI.pemicu, null)?.kategori ?? null;
if (!KATEGORI[konteks.pemicu]) konteks.pemicu = null;

const tunggu = (ms) => new Promise(r => setTimeout(r, ms));
const gulir = () => { log.scrollTop = log.scrollHeight; };

const tambah = (siapa, isi, penting) => {
    const p = document.createElement('p');
    p.className = `msg msg--${siapa}` + (penting ? ' msg--penting' : '');
    const label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = siapa === 'bot' ? 'Teman Jeda: ' : 'Kamu: ';
    const teks = document.createElement('span');
    if (siapa === 'bot') teks.innerHTML = isi; else teks.textContent = isi;
    p.append(label, teks);
    log.appendChild(p);
    gulir();
};

const tampilPilihan = (daftar) => {
    pilihan.replaceChildren();
    daftar.forEach(([label, ke]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pill';
        b.textContent = label;
        b.addEventListener('click', () => { lewatKetik = false; jawab(label, ke); });
        pilihan.appendChild(b);
    });
};

const bicara = async (langkah, pesanAwal = []) => {
    sibuk = true;
    sekarang = langkah;
    pilihan.replaceChildren();
    const node = ALUR[langkah];
    const pesan = [...pesanAwal, ...(typeof node.bot === 'function' ? node.bot(konteks) : node.bot)];
    status.textContent = 'Sedang mengetik…';
    for (const isi of pesan) {
        const titik = document.createElement('div');
        titik.className = 'typing';
        titik.setAttribute('aria-hidden', 'true');
        titik.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(titik);
        gulir();
        await tunggu(hemat.matches ? 150 : Math.min(400 + isi.replace(/<[^>]+>/g, '').length * 12, 1600));
        titik.remove();
        tambah('bot', isi, node.penting);
    }
    status.textContent = 'Siap nemenin';
    tampilPilihan(node.pilihan);
    ketik.placeholder = node.minta === 'harga' ? 'Contoh: 150rb' : 'Ketik pesanmu';
    sibuk = false;

    if (pertama) pertama = false;
    else if (lewatKetik) ketik.focus();
    else pilihan.querySelector('button')?.focus({ preventScroll: true });
};

const jawab = (teks, ke, pesanAwal) => {
    if (sibuk) return;
    tambah('user', teks);
    bicara(ke, pesanAwal);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const teks = ketik.value.trim();
    if (!teks || sibuk) return;
    ketik.value = '';
    lewatKetik = true;

    const ke = cariLangkah(teks);
    if (ke === 'krisis') return jawab(teks, 'krisis');

    if (ALUR[sekarang].minta === 'harga') {
        const h = keHarga(teks);
        if (!isNaN(h)) { konteks.harga = h; return jawab(teks, 'biaya'); }
        if (!ke) return jawab(teks, 'harga', ['Aku belum menangkap angkanya.']);
    }
    if (ke) return jawab(teks, ke);

    tambah('user', teks);
    sibuk = true;
    setTimeout(() => {
        tambah('bot', 'Maaf, aku belum paham. Aku cuma bisa bahas belanja impulsif. Coba pilih salah satu di bawah, atau ketik kata seperti <strong>diskon</strong>, <strong>bosan</strong>, atau <strong>paylater</strong>.');
        tampilPilihan(ALUR[sekarang].pilihan);
        sibuk = false;
    }, hemat.matches ? 150 : 700);
});

bicara('mulai');
