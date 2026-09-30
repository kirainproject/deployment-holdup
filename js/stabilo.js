if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-hl');
    const amati = new IntersectionObserver((entri) => entri.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-lit'); amati.unobserve(e.target); }
    }), { rootMargin: '0px 0px -15% 0px' });
    document.querySelectorAll('.hl').forEach(el => amati.observe(el));
}
