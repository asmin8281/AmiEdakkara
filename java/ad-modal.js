// Admission Ad Modal Logic
(function() {
    console.log("Admission Ad Modal system initialized.");

    function initAd() {
        const adModal = document.getElementById('ad-modal');
        const closeBtn = document.getElementById('ad-close');

        if (!adModal) {
            console.error("Ad Modal element (#ad-modal) not found in the page HTML.");
            return;
        }

        console.log("Ad Modal found. Preparing to show in 1.5 seconds...");

        setTimeout(() => {
            // First make it display: flex so it takes up space and can be animated
            adModal.style.display = 'flex';
            
            // Lock the body scroll
            document.body.style.overflow = 'hidden';

            // Use a tiny delay to trigger the transition
            setTimeout(() => {
                adModal.classList.add('is-active');
            }, 50);

        }, 1500);

        // Close logic
        function dismissAd() {
            adModal.classList.remove('is-active');
            document.body.style.overflow = '';
            setTimeout(() => {
                adModal.style.display = 'none';
            }, 500);
        }

        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                dismissAd();
            };
        }

        adModal.onclick = (e) => {
            if (e.target === adModal) dismissAd();
        };
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAd);
    } else {
        initAd();
    }
})();
