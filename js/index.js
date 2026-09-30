function toggleFaq(element) {
    const wrapper = element.querySelector('.faq-content-wrapper');
    const isOpen = wrapper.style.gridTemplateRows === '1fr';

    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-content-wrapper').style.gridTemplateRows = '0fr';
        item.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
    });

    document.querySelectorAll('.faq-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));

    if (!isOpen) {
        wrapper.style.gridTemplateRows = '1fr';
        element.querySelector('.faq-icon').style.transform = 'rotate(180deg)';
        element.querySelector('.faq-trigger').setAttribute('aria-expanded', 'true');
    }
}

document.querySelectorAll('.faq-item').forEach(item => item.addEventListener('click', () => toggleFaq(item)));

document.querySelectorAll('.faq-trigger').forEach(t => t.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    toggleFaq(t.closest('.faq-item'));
}));

document.addEventListener('DOMContentLoaded', () => {
    {
        const cx = 150, cy = 150, rOut = 144, rIn = 122, n = 48;
        let d = "";
        for (let i = 0; i < n; i++) {
            const r = i % 2 === 0 ? rOut : rIn, a = i * 2 * Math.PI / n - Math.PI / 2;
            d += (i ? "L" : "M") + (cx + r * Math.cos(a)).toFixed(2) + " " + (cy + r * Math.sin(a)).toFixed(2) + " ";
        }
        document.getElementById("burst").setAttribute("d", d + "Z");
    }

    const statsSection = document.getElementById('stats-section');
    const navWrapper = document.getElementById('floating-nav-wrapper');
    const logoWrapper = document.getElementById('floating-logo-wrapper');
    const menuWrapper = document.getElementById('floating-menu-wrapper');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navWrapper.classList.add('visible');
                logoWrapper.classList.add('visible');
                menuWrapper.classList.add('visible');
            } else {
                if (window.scrollY < statsSection.offsetTop) {
                    navWrapper.classList.remove('visible');
                    logoWrapper.classList.remove('visible');
                    menuWrapper.classList.remove('visible');
                    menuWrapper.querySelector('.site-nav').dispatchEvent(new Event('tutup'));
                }
            }
        });
    }, { threshold: 0.05 });
    navObserver.observe(statsSection);

    const sourcesElement = document.getElementById('stats-sources');
    const statsBoard = document.querySelector('.stats-board-wrap');
    const statsBadges = statsSection.querySelectorAll('.badge');
    let boardTimer;
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === statsBoard.parentElement) {
                clearTimeout(boardTimer);
                if (entry.isIntersecting && !statsBoard.classList.contains('is-visible')) {
                    boardTimer = setTimeout(() => statsBoard.classList.add('is-visible'), 600);
                }
            } else if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -64px 0px' });
    statsBadges.forEach(badge => cardObserver.observe(badge));
    cardObserver.observe(sourcesElement);
    cardObserver.observe(statsBoard.parentElement);

    new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) return;
        clearTimeout(boardTimer);
        statsBadges.forEach(badge => badge.classList.remove('show'));
        sourcesElement.classList.remove('show');
        statsBoard.classList.remove('is-visible');
    }).observe(statsSection);

    const hangingSign = document.getElementById('hanging-sign');
    const signObserver = new IntersectionObserver((entries) => {
        hangingSign.classList.toggle('animate-drop-sign', entries[0].isIntersecting);
    }, { threshold: 0.3 });
    signObserver.observe(hangingSign.parentElement);

    const doomCardsContainer = document.getElementById('doom-cards-container');
    const fanCards = document.querySelectorAll('.fan-card');
    let unfoldTimeout;
    const doomObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            clearTimeout(unfoldTimeout);
            if (entry.isIntersecting) {
                unfoldTimeout = setTimeout(() => {
                    fanCards.forEach(card => card.classList.add('unfold'));
                }, 100);
            } else {
                fanCards.forEach(card => card.classList.remove('unfold'));
            }
        });
    }, { threshold: 0.15 });
    if (doomCardsContainer) doomObserver.observe(doomCardsContainer);

    const ticketTrigger = document.getElementById('ticket-trigger');
    const ticketObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = document.getElementById('ticket-card');
            if (entry.isIntersecting) {
                card.classList.add('is-expanded');
            } else {
                card.classList.remove('is-expanded');
            }
        });
    }, { threshold: 0.4 });
    if (ticketTrigger) ticketObserver.observe(ticketTrigger);

    const getStartedSection = document.getElementById('get-started-section');
    getStartedSection.classList.add('entrance-ready');
    const getStartedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('is-visible', entry.intersectionRatio >= 0.45);
        });
    }, { threshold: 0.45 });
    getStartedSection.querySelectorAll('.get-started-reveal').forEach(item => getStartedObserver.observe(item));

    const navItems = document.querySelectorAll('.nav-item');
    const pill = document.getElementById('sliding-pill');
    const navContainer = document.getElementById('nav-container');
    let currentActiveItem = navItems[0];

    function tandaiAktif(item) {
        navItems.forEach(a => a === item ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    }

    function movePill(item) {
        const width = item.offsetWidth;
        const left = item.offsetLeft;
        const height = item.offsetHeight;
        pill.style.width = `${width}px`;
        pill.style.height = `${height}px`;
        pill.style.transform = `translateX(${left}px)`;

        navContainer.scrollTo({ left: left - (navContainer.clientWidth - width) / 2, behavior: 'smooth' });
    }

    setTimeout(() => movePill(currentActiveItem), 100);

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => movePill(item));
        item.addEventListener('click', (e) => {
            currentActiveItem = item;
            tandaiAktif(item);
            movePill(item);
        });
    });

    navContainer.addEventListener('mouseleave', () => movePill(currentActiveItem));
    window.addEventListener('resize', () => movePill(currentActiveItem));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const matchingLink = Array.from(navItems).find(item => item.getAttribute('href') === `#${id}`);
                if (matchingLink) {
                    currentActiveItem = matchingLink;
                    tandaiAktif(matchingLink);
                    if (!navContainer.matches(':hover')) {
                        movePill(matchingLink);
                    }
                }
            }
        });
    }, { threshold: 0.2, rootMargin: '-100px 0px -20% 0px' });

    navItems.forEach(item => {
        const targetId = item.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            sectionObserver.observe(targetSection);
        }
    });
});

const contentData = {
    genz: {
        name: "Gen Z Indonesia",
        badgeColor: "#aa322f",
        title: "Generasi terbesar, tumbuh bareng internet, toko cuma sejauh jempol",
        subtitle: "Ada 75,49 juta Gen Z di Indonesia, dan hampir 9 dari 10 sudah online. Promo, live shopping, dan tombol checkout ikut masuk ke layar setiap hari",
        takeaway: "Karena belanja cuma sejauh jempol, jedanya juga harus ada di situ: sebelum checkout",
        b1_stat: "75,49 jt",
        b1_text: "Jumlah Gen Z di Indonesia, generasi dengan porsi penduduk terbesar",
        b2_stat: "27,94%",
        b2_text: "Porsi Gen Z dari seluruh penduduk Indonesia",
        b3_stat: "87,80%",
        b3_text: "Gen Z yang sudah memakai internet",
        b4_stat: "80,66%",
        b4_text: "Rata-rata penetrasi internet nasional. Gen Z berada di atasnya",
        sources: "Sumber: BPS, Sensus Penduduk 2020 (rilis 21 Januari 2021). APJII, Survei Profil Internet Indonesia 2025, 8.700 responden usia 13 tahun ke atas, 10 April–16 Juni 2025.",
        next: "Uang Gen Z",
        nextKey: "uang"
    },
    uang: {
        name: "Uang Gen Z",
        badgeColor: "#d26b41",
        title: "Sudah bisa bayar sendiri, tapi pemahamannya belum menyusul",
        subtitle: "Di kelompok usia Gen Z, yang memakai produk keuangan selalu lebih banyak daripada yang benar-benar paham produknya",
        takeaway: "Kamu butuh jeda yang muncul di titik paling rawan, bukan sekadar edukasi finansial biasa",
        b1_stat: "56,04%",
        b1_text: "Literasi keuangan Gen Z termuda (15–17 tahun), paling rendah dari semua kelompok umur",
        b2_stat: "89,13%",
        b2_text: "Gen Z termuda (15–17 tahun) yang sudah memakai produk keuangan",
        b3_stat: "73,32%",
        b3_text: "Literasi keuangan usia 18–25 tahun. Naik, tapi masih di bawah pemakaiannya",
        b4_stat: "95,69%",
        b4_text: "Usia 18–25 tahun yang sudah memakai produk keuangan. Hampir semuanya",
        sources: "Sumber: OJK, LPS & BPS, Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) 2026, SP 152/OJK/DKPU/VIII/2026. 75.000 responden usia 15–79 tahun di 514 kabupaten/kota.",
        next: "Gen Z Indonesia",
        nextKey: "genz"
    }
};

const modal = document.getElementById('data-modal');
const body = document.body;
let currentGeneration = 'genz';

function openModal(generation) {
    currentGeneration = generation;
    const data = contentData[generation];

    const badge = document.getElementById('m-category-badge');
    badge.innerText = data.name;
    badge.style.backgroundColor = data.badgeColor;

    document.getElementById('m-title').innerText = data.title;
    document.getElementById('m-subtitle').innerText = data.subtitle;
    document.getElementById('m-takeaway').innerText = data.takeaway;

    document.getElementById('m-box1-stat').innerText = data.b1_stat;

    ['m-box1-stat', 'm-box4-stat'].forEach(id => {
        const el = document.getElementById(id);
        el.style.fontSize = data[id === 'm-box1-stat' ? 'b1_stat' : 'b4_stat'].length > 4 ? 'clamp(2.5rem, 6vw, 4.5rem)' : '';
    });
    document.getElementById('m-box1-text').innerText = data.b1_text;

    document.getElementById('m-box2-stat').innerText = data.b2_stat;
    document.getElementById('m-box2-text').innerText = data.b2_text;

    document.getElementById('m-box3-stat').innerText = data.b3_stat;
    document.getElementById('m-box3-text').innerText = data.b3_text;

    document.getElementById('m-box4-stat').innerText = data.b4_stat;
    document.getElementById('m-box4-text').innerText = data.b4_text;

    document.getElementById('m-sources').innerText = data.sources;
    document.getElementById('m-next').innerText = data.next;

    modal.classList.add('active');
    body.classList.add('modal-open');
    document.querySelector('.overflow-y-auto').scrollTop = 0;
}

function switchModal() {
    const nextKey = contentData[currentGeneration].nextKey;
    openModal(nextKey);
}

function closeModal() {
    modal.classList.remove('active');
    body.classList.remove('modal-open');
}

document.querySelectorAll('[data-modal-open]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.modalOpen)));
document.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));
document.querySelector('[data-modal-next]').addEventListener('click', switchModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

const hoverTextEl = document.getElementById('dynamic-hover-text');

function updateHoverText(text) {
    if (hoverTextEl) hoverTextEl.textContent = text;
}

function hideHoverText() {
    if (hoverTextEl) hoverTextEl.textContent = 'Kenali kebiasaanmu, pahami datanya, dan ambil jeda sebelum menyesal.';
}

document.querySelectorAll('[data-hover]').forEach(el => {
    const tampilkan = () => updateHoverText(el.dataset.hover);
    el.addEventListener('mouseenter', tampilkan);
    el.addEventListener('focus', tampilkan);
    el.addEventListener('mouseleave', hideHoverText);
    el.addEventListener('blur', hideHoverText);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const bodyWrapper = document.getElementById('body-wrapper');
        if (bodyWrapper) bodyWrapper.classList.remove('overflow-hidden');

        const logoWrapper = document.getElementById('logo-wrapper');
        if (logoWrapper) logoWrapper.classList.add('logo-loaded');

        const heroBottom = document.getElementById('hero-bottom');
        if (heroBottom) heroBottom.classList.remove('opacity-0', 'translate-y-[35vh]');

        const headerLogo = document.getElementById('header-logo');
        if (headerLogo) headerLogo.classList.add('header-loaded');

        setTimeout(() => {
            const cards = document.querySelectorAll('.hero-card');
            cards.forEach(card => card.classList.remove('stacked'));

            setTimeout(() => {
                const container = document.getElementById('cards-container');
                if (container) container.classList.remove('cards-animating');
            }, 1200);
        }, 800);
    }, 1200);
});
