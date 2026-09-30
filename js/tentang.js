const status = document.getElementById('hapus-status');

document.getElementById('hapus-semua').addEventListener('click', () => {
    if (!confirm('Hapus hasil kuis, uang saku, dan Jurnal Tunda dari browser ini? Tidak bisa dibatalkan.')) return;
    try {
        Object.values(KUNCI).forEach(k => localStorage.removeItem(k));
        status.textContent = 'Beres. Tidak ada data HoldUp lagi di browser ini.';
    } catch (e) {
        status.textContent = 'Browser ini memblokir penyimpanan, jadi memang tidak ada data yang tersimpan.';
    }
});
