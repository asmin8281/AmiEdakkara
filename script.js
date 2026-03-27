// ─── Page Transition Overlay ──────────────────────────────────
(function () {
    // Inject the overlay element once
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    document.body.appendChild(overlay);

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Page ENTER: slide up on load
    if (!prefersReducedMotion) {
        document.body.classList.add('page-entering');
        // Remove class after animation completes so it doesn't interfere with scroll-reveal
        window.addEventListener('animationend', function onEnter(e) {
            if (e.target === document.querySelector('main')) {
                document.body.classList.remove('page-entering');
                window.removeEventListener('animationend', onEnter);
            }
        });
    }

    // Page EXIT: intercept all internal links
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        // Only handle same-site .html links (not anchors, not external)
        if (!href || href.startsWith('#') || href.startsWith('http') ||
            href.startsWith('mailto') || href.startsWith('tel') ||
            !href.endsWith('.html')) return;

        // Skip if it's the same page
        if (href === window.location.pathname.split('/').pop()) return;

        e.preventDefault();
        if (prefersReducedMotion) { window.location.href = href; return; }

        // Flash overlay white (exit transition)
        overlay.classList.add('exiting');
        setTimeout(() => {
            window.location.href = href;
        }, 360); // matches the 0.35s CSS transition + tiny buffer
    });
})();

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Text animation after navigating via nav links
    const shouldAnimateText = sessionStorage.getItem('animateTextOnLoad') === '1';
    if (shouldAnimateText) {
        sessionStorage.removeItem('animateTextOnLoad');
    }

    if (shouldAnimateText && !prefersReducedMotion) {
        document.body.classList.add('is-text-enter');

        const textTargets = document.querySelectorAll(
            'main h1, main h2, main h3, main h4, main p, main li, main label, main .btn'
        );

        textTargets.forEach((el, i) => {
            el.classList.add('text-enter');
            el.style.setProperty('--d', `${Math.min(i * 55, 700)}ms`);
        });

        window.setTimeout(() => {
            document.body.classList.remove('is-text-enter');
        }, 1200);
    }

    function toggleNav() {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNav();
    });

    // Close when clicking outside nav or hamburger
    document.addEventListener('click', function (e) {
        if (!navMenu.classList.contains('active')) return;
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Close when clicking a nav link (mobile)
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const isMobile = navMenu.classList.contains('active');
            
            if (isMobile) {
                // Close the mobile nav UI
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('nav-open');
                
                const href = this.getAttribute('href');
                if (!href) return;
                const isInternalHtml = href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel');
                
                if (isInternalHtml) {
                    // Prevent double-handling by other listeners and navigate after drawer closed.
                    e.preventDefault();
                    e.stopPropagation();
                    // Preserve the small text animation state used elsewhere
                    try { sessionStorage.setItem('animateTextOnLoad', '1'); } catch (err) {}
                    // Short delay so the close transition can run smoothly before navigation
                    setTimeout(() => { window.location.href = href; }, 150);
                }
            } else {
                try { sessionStorage.setItem('animateTextOnLoad', '1'); } catch (err) {}
            }
        });
    });

    // Scroll reveal animations
    const revealTargets = document.querySelectorAll(
        '.hero-content, .features, .feature-card, .quick-info, .info-item, .page-header, .container section, .mission-section, .teachers-section, .facilities-section, .classes-intro, .class-category, .video-card, .papers-intro, .paper-card, .gallery-intro, .gallery-item, .contact-section, .contact-item, .contact-form, .map-section, .directions-section, .direction-item'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { root: null, threshold: 0.15, rootMargin: '0px 0px -20% 0px' }
        );

        revealTargets.forEach((el) => io.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('is-visible'));
    }
});


// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ─── BorderGlow — full vanilla JS port ───────────────────────
(function () {

    /* ── Helpers matching the TS component exactly ── */

    function parseHSL(hslStr) {
        const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
        if (!match) return { h: 40, s: 80, l: 80 };
        return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
    }

    function buildGlowVars(glowColor, intensity) {
        const { h, s, l } = parseHSL(glowColor);
        const base = `${h}deg ${s}% ${l}%`;
        const opacities = [100, 60, 50, 40, 30, 20, 10];
        const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
        const vars = {};
        for (let i = 0; i < opacities.length; i++) {
            vars[`--glow-color${keys[i]}`] =
                `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
        }
        return vars;
    }

    const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
    const GRADIENT_KEYS = ['--gradient-one','--gradient-two','--gradient-three','--gradient-four','--gradient-five','--gradient-six','--gradient-seven'];
    const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

    function buildGradientVars(colors) {
        const vars = {};
        for (let i = 0; i < 7; i++) {
            const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
            vars[GRADIENT_KEYS[i]] =
                `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
        }
        vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
        return vars;
    }

    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function easeInCubic(x)  { return x * x * x; }

    function animateValue({ start = 0, end = 100, duration = 1000, delay = 0,
                            ease = easeOutCubic, onUpdate, onEnd }) {
        const t0 = performance.now() + delay;
        function tick() {
            const elapsed = performance.now() - t0;
            const t = Math.min(elapsed / duration, 1);
            onUpdate(start + (end - start) * ease(t));
            if (t < 1) requestAnimationFrame(tick);
            else if (onEnd) onEnd();
        }
        setTimeout(() => requestAnimationFrame(tick), delay);
    }

    /* ── Pointer tracking ── */

    function getCenterOfElement(el) {
        const { width, height } = el.getBoundingClientRect();
        return [width / 2, height / 2];
    }

    function getEdgeProximity(el, x, y) {
        const [cx, cy] = getCenterOfElement(el);
        const dx = x - cx, dy = y - cy;
        let kx = Infinity, ky = Infinity;
        if (dx !== 0) kx = cx / Math.abs(dx);
        if (dy !== 0) ky = cy / Math.abs(dy);
        return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    }

    function getCursorAngle(el, x, y) {
        const [cx, cy] = getCenterOfElement(el);
        const dx = x - cx, dy = y - cy;
        if (dx === 0 && dy === 0) return 0;
        let degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        return degrees;
    }

    /* ── Per-card configuration ── */
    // Customize the quran-quote card appearance here:
    const QURAN_CARD_CONFIG = {
        glowColor:       '280 80 75',           // purple hue (HSL values, space-separated)
        glowIntensity:   1.0,
        coneSpread:      25,
        fillOpacity:     0.5,
        borderRadius:    16,
        backgroundColor: '#ffffff',
        colors:          ['#c084fc', '#f472b6', '#38bdf8'],
        animated:        true,                  // runs sweep animation on page load
    };

    /* ── Init one card ── */

    function initBorderGlow(card) {
        // Read config from data attributes, or fall back to defaults
        const cfg = Object.assign({}, QURAN_CARD_CONFIG);

        // Apply CSS custom properties
        card.style.setProperty('--cone-spread',    cfg.coneSpread);
        card.style.setProperty('--fill-opacity',   cfg.fillOpacity);
        card.style.setProperty('--border-radius',  `${cfg.borderRadius}px`);
        card.style.setProperty('--card-bg',        cfg.backgroundColor);

        // Apply glow color vars
        const glowVars = buildGlowVars(cfg.glowColor, cfg.glowIntensity);
        Object.entries(glowVars).forEach(([k, v]) => card.style.setProperty(k, v));

        // Apply gradient background vars
        const gradVars = buildGradientVars(cfg.colors);
        Object.entries(gradVars).forEach(([k, v]) => card.style.setProperty(k, v));

        // Pointer tracking
        card.addEventListener('pointermove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--edge-proximity', (getEdgeProximity(card, x, y) * 100).toFixed(3));
            card.style.setProperty('--cursor-angle',   getCursorAngle(card, x, y).toFixed(3) + 'deg');
        });

        card.addEventListener('pointerleave', function () {
            card.style.setProperty('--edge-proximity', '0');
        });

        // Sweep animation on load (matches animated=true in the React component)
        if (cfg.animated) {
            const angleStart = 110, angleEnd = 465;
            card.classList.add('sweep-active');
            card.style.setProperty('--cursor-angle', `${angleStart}deg`);

            animateValue({ duration: 500,
                onUpdate: v => card.style.setProperty('--edge-proximity', v) });

            animateValue({ ease: easeInCubic, duration: 1500, end: 50,
                onUpdate: v => card.style.setProperty('--cursor-angle',
                    `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`) });

            animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100,
                onUpdate: v => card.style.setProperty('--cursor-angle',
                    `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`) });

            animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
                onUpdate: v => card.style.setProperty('--edge-proximity', v),
                onEnd: () => card.classList.remove('sweep-active') });
        }
    }

    // Run on existing cards
    document.querySelectorAll('.border-glow-card').forEach(initBorderGlow);

    // Watch for cards added by scroll-reveal or dynamic content
    const glowObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('border-glow-card')) initBorderGlow(node);
                    node.querySelectorAll && node.querySelectorAll('.border-glow-card').forEach(initBorderGlow);
                }
            });
        });
    });
    glowObserver.observe(document.body, { childList: true, subtree: true });

})();




