document.querySelectorAll('.site-nav').forEach((nav) => {
    const tombol = nav.querySelector('.site-nav__toggle');
    const atur = (buka) => { nav.classList.toggle('is-open', buka); tombol.setAttribute('aria-expanded', String(buka)); };
    nav.classList.add('site-nav--js');
    tombol.addEventListener('click', () => atur(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { atur(false); tombol.focus(); } });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) atur(false); });
    nav.addEventListener('focusout', (e) => { if (!nav.contains(e.relatedTarget)) atur(false); });
    nav.addEventListener('tutup', () => atur(false));
});

document.addEventListener('click', (event) => {
    const link = event.target.closest('nav a[href^="#"]');
    if (!link) return;

    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', link.hash);
});
