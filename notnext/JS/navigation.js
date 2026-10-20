document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector('#navigation');
    const heroSection = document.querySelector('#header-hero');

    window.addEventListener('scroll', function() {
        // Cek jika posisi scroll sudah melewati tinggi area Header/Hero
        if (window.scrollY > heroSection.offsetHeight - 50) {
            nav.classList.add('fixed-nav');
        } else {
            nav.classList.remove('fixed-nav');
        }
    });

    const navLinks = document.querySelectorAll("#navigation nav a");
    
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    navLinks.forEach((link) => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                observer.observe(targetSection);
            }
        }
    });

    const targetElements = document.querySelectorAll(`
        .section-heading, .origin-layout, 
        .history-content, #fr1, #fr2, .info-block, 
        .process-heading, .process-item, 
        .recipe-heading, .ingredient-area, .recipe-content, 
        .culture-card, .quote-box, 
        .character-heading, .character-item, 
        .types-intro, .search-container, .renlist, 
        .closing-text, .footer, #contact h2
    `);

    targetElements.forEach(el => {
        el.classList.add('fade-scroll');
    });

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.15 
    });

    targetElements.forEach(el => {
        fadeObserver.observe(el);
    });
});