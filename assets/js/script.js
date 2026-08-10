/* ==========================================================================
   HANDCRAFTED BENTO INTERACTIVITY & GOOGLE/ANDROID TACTILE PRESSURE
   Developer: Sahil
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');

    if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        const interactiveElements = document.querySelectorAll('a, button, .bento-card, .skill-pill');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 2. Ultra-Smooth Google Android Style 3D Touch/Pointer Pressure Effect
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach((card) => {
        let bounds = card.getBoundingClientRect();
        let targetRotateX = 0;
        let targetRotateY = 0;
        let targetScale = 1;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let currentScale = 1;
        let animationFrameId = null;

        function updateBounds() {
            bounds = card.getBoundingClientRect();
        }

        window.addEventListener('resize', updateBounds);
        window.addEventListener('scroll', updateBounds, { passive: true });

        function resetCardState() {
            card.classList.remove('is-touch-pressed');
            targetRotateX = 0;
            targetRotateY = 0;
            targetScale = 1;
            currentRotateX = 0;
            currentRotateY = 0;
            currentScale = 1;
            card.style.setProperty('--touch-opacity', '0');
            card.style.transform = 'none';
            card.blur();
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }

        function animatePhysics() {
            currentRotateX += (targetRotateX - currentRotateX) * 0.15;
            currentRotateY += (targetRotateY - currentRotateY) * 0.15;
            currentScale += (targetScale - currentScale) * 0.15;

            card.style.transform = `perspective(800px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;

            if (
                Math.abs(targetRotateX - currentRotateX) > 0.01 ||
                Math.abs(targetRotateY - currentRotateY) > 0.01 ||
                Math.abs(targetScale - currentScale) > 0.001
            ) {
                animationFrameId = requestAnimationFrame(animatePhysics);
            } else {
                animationFrameId = null;
            }
        }

        function startAnimationLoop() {
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(animatePhysics);
            }
        }

        function handlePointerMove(e) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const x = clientX - bounds.left;
            const y = clientY - bounds.top;

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            // Calculate subtle tilt angles max 3.5 deg for minimal tactile feel
            targetRotateX = ((centerY - y) / centerY) * 3.5;
            targetRotateY = ((x - centerX) / centerX) * 3.5;

            const pctX = ((x / bounds.width) * 100).toFixed(1);
            const pctY = ((y / bounds.height) * 100).toFixed(1);

            card.style.setProperty('--touch-x', `${pctX}%`);
            card.style.setProperty('--touch-y', `${pctY}%`);
            card.style.setProperty('--touch-opacity', '1');

            startAnimationLoop();
        }

        function handleTouchStart(e) {
            updateBounds();
            card.classList.add('is-touch-pressed');
            targetScale = 0.99; // Subtle tactile press
            handlePointerMove(e);
        }

        function handleTouchEnd() {
            resetCardState();
        }

        // On Click/Tap: Immediately reset card state so no animation/popover sticks after click
        card.addEventListener('click', () => {
            resetCardState();
        });

        // Desktop Mouse Events (Fine pointer)
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            card.addEventListener('mouseenter', (e) => {
                updateBounds();
                targetScale = 1.008;
                handlePointerMove(e);
            });

            card.addEventListener('mousemove', handlePointerMove);

            card.addEventListener('mouseleave', () => {
                resetCardState();
            });
        }

        // Touch Events & Context Menu Callout Prevention
        card.addEventListener('contextmenu', (e) => e.preventDefault());
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handlePointerMove, { passive: true });
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchEnd);
    });
});
