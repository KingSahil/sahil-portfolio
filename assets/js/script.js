/* ==========================================================================
   HANDCRAFTED BENTO INTERACTIVITY & GOOGLE/ANDROID TACTILE PRESSURE
   Developer: Sahil
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let lastVibratedCardEl = null;

    // Helper function for mobile haptic feedback
    function triggerHaptic(pattern = 40) {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore if browser restricts vibration during move
            }
        }
    }

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
    const cardNodes = document.querySelectorAll('.bento-card');
    const cardMap = new Map();
    let currentActiveCardObj = null;

    cardNodes.forEach((card) => {
        const cardObj = {
            card: card,
            bounds: card.getBoundingClientRect(),
            targetRotateX: 0,
            targetRotateY: 0,
            targetScale: 1,
            currentRotateX: 0,
            currentRotateY: 0,
            currentScale: 1,
            animationFrameId: null,

            updateBounds() {
                this.bounds = this.card.getBoundingClientRect();
            },

            animatePhysics() {
                // Smooth spring lerp interpolation (0.10 dampening for silky smooth decay)
                this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.10;
                this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.10;
                this.currentScale += (this.targetScale - this.currentScale) * 0.10;

                this.card.style.transform = `perspective(800px) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg) scale3d(${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)})`;

                const deltaX = Math.abs(this.targetRotateX - this.currentRotateX);
                const deltaY = Math.abs(this.targetRotateY - this.currentRotateY);
                const deltaScale = Math.abs(this.targetScale - this.currentScale);

                if (deltaX > 0.01 || deltaY > 0.01 || deltaScale > 0.001) {
                    this.animationFrameId = requestAnimationFrame(() => this.animatePhysics());
                } else {
                    if (this.targetRotateX === 0 && this.targetRotateY === 0 && this.targetScale === 1) {
                        this.card.style.transform = 'none';
                    }
                    this.animationFrameId = null;
                }
            },

            startAnimationLoop() {
                if (!this.animationFrameId) {
                    this.animationFrameId = requestAnimationFrame(() => this.animatePhysics());
                }
            },

            handleMove(clientX, clientY) {
                const x = clientX - this.bounds.left;
                const y = clientY - this.bounds.top;
                const centerX = this.bounds.width / 2;
                const centerY = this.bounds.height / 2;

                // Subtle tilt max 3.5 deg
                this.targetRotateX = ((centerY - y) / centerY) * 3.5;
                this.targetRotateY = ((x - centerX) / centerX) * 3.5;

                const pctX = ((x / this.bounds.width) * 100).toFixed(1);
                const pctY = ((y / this.bounds.height) * 100).toFixed(1);

                this.card.style.setProperty('--touch-x', `${pctX}%`);
                this.card.style.setProperty('--touch-y', `${pctY}%`);
                this.card.style.setProperty('--touch-opacity', '1');

                this.startAnimationLoop();
            },

            activate(clientX, clientY, scale = 0.99, isTouch = false) {
                this.updateBounds();
                this.card.classList.add('is-touch-pressed');
                this.targetScale = scale;
                this.handleMove(clientX, clientY);

                if (isTouch && lastVibratedCardEl !== this.card) {
                    lastVibratedCardEl = this.card;
                    triggerHaptic(40); // 40ms pulse on card enter
                }
            },

            release() {
                this.card.classList.remove('is-touch-pressed');
                this.targetRotateX = 0;
                this.targetRotateY = 0;
                this.targetScale = 1;
                this.card.style.setProperty('--touch-opacity', '0');
                this.card.blur();
                this.startAnimationLoop(); // Smooth lerp decay back to flat zero!
            }
        };

        window.addEventListener('resize', () => cardObj.updateBounds());
        window.addEventListener('scroll', () => cardObj.updateBounds(), { passive: true });
        card.addEventListener('contextmenu', (e) => e.preventDefault());

        cardMap.set(card, cardObj);

        // Direct PointerDown Trigger (Guarantees user activation registration on Android Chrome)
        card.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') {
                triggerHaptic(40);
            }
        });

        // Desktop Mouse Events
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            card.addEventListener('mouseenter', (e) => {
                cardObj.activate(e.clientX, e.clientY, 1.008, false);
            });

            card.addEventListener('mousemove', (e) => {
                cardObj.handleMove(e.clientX, e.clientY);
            });

            card.addEventListener('mouseleave', () => {
                cardObj.release();
            });
        }
    });

    // Global Mobile Finger Dragging across elements
    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        const cardEl = targetEl ? targetEl.closest('.bento-card') : null;

        if (cardEl && cardMap.has(cardEl)) {
            currentActiveCardObj = cardMap.get(cardEl);
            currentActiveCardObj.activate(touch.clientX, touch.clientY, 0.99, true);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        const cardEl = targetEl ? targetEl.closest('.bento-card') : null;

        if (cardEl && cardMap.has(cardEl)) {
            const newCardObj = cardMap.get(cardEl);
            if (currentActiveCardObj !== newCardObj) {
                if (currentActiveCardObj) {
                    currentActiveCardObj.release();
                }
                currentActiveCardObj = newCardObj;
                currentActiveCardObj.activate(touch.clientX, touch.clientY, 0.99, true);
            } else {
                newCardObj.handleMove(touch.clientX, touch.clientY);
            }
        } else if (currentActiveCardObj) {
            currentActiveCardObj.release();
            currentActiveCardObj = null;
            lastVibratedCardEl = null;
        }
    }, { passive: true });

    function clearTouchState() {
        if (currentActiveCardObj) {
            currentActiveCardObj.release();
            currentActiveCardObj = null;
        }
        lastVibratedCardEl = null;
    }

    window.addEventListener('touchend', clearTouchState);
    window.addEventListener('touchcancel', clearTouchState);
});
