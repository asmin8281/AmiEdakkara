// Scroll Animations Script
document.addEventListener('DOMContentLoaded', function() {
    // ===== SMOOTH SCROLL WITH ANIMATIONS =====
    
    // Create an Intersection Observer for scroll reveal animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add smooth animation
                entry.target.style.animation = 'slideInUp 0.6s cubic-bezier(0.25, 1, 0.3, 1) forwards';
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ===== SCROLL PROGRESS BAR =====
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        document.documentElement.style.setProperty('--scroll-width', scrollPercent + '%');
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ===== SCROLL-TO-TOP BUTTON - DISABLED =====
    // Scroll-to-top button has been disabled
    // If you want to re-enable it, uncomment the code below:
    
    /*
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Show button when scrolled down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
        updateScrollProgress();
    }, { passive: true });

    // Smooth scroll to top on button click
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    */

    // ===== SMOOTH ANCHOR LINK SCROLLING =====
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile nav if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const hamburger = document.querySelector('.hamburger');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }

                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== SCROLL EVENT TRACKING =====
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        document.body.classList.add('is-scrolling');

        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('is-scrolling');
        }, 150);
    }, { passive: true });
});

// Add CSS custom property for scroll progress bar
document.documentElement.style.setProperty('--scroll-width', '0%');

