/* ==========================================================================
   HANDCRAFTED BENTO INTERACTIVITY & GOOGLE/ANDROID TACTILE PRESSURE
   Developer: Sahil
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let lastVibratedCardEl = null;
    let lastVibratedBtnEl = null;

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

    // 2. Bento Card 3D Pressure Physics
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
                this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.20;
                this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.20;
                this.currentScale += (this.targetScale - this.currentScale) * 0.20;

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
                    triggerHaptic(40);
                }
            },

            release() {
                this.card.classList.remove('is-touch-pressed');
                this.targetRotateX = 0;
                this.targetRotateY = 0;
                this.targetScale = 1;
                this.card.style.setProperty('--touch-opacity', '0');
                this.card.blur();
                this.startAnimationLoop();
            }
        };

        window.addEventListener('resize', () => cardObj.updateBounds());
        window.addEventListener('scroll', () => cardObj.updateBounds(), { passive: true });
        card.addEventListener('contextmenu', (e) => e.preventDefault());

        cardMap.set(card, cardObj);

        card.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') {
                triggerHaptic(40);
            }
        });

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

    // 3. Apple VisionOS Style Specular Glass Glare for Buttons (.bento-btn)
    const bentoBtns = document.querySelectorAll('.bento-btn');
    let currentActiveBtn = null;

    function handleBtnMove(btn, clientX, clientY) {
        const btnBounds = btn.getBoundingClientRect();
        const btnX = clientX - btnBounds.left;
        const btnY = clientY - btnBounds.top;
        const pctX = ((btnX / btnBounds.width) * 100).toFixed(1);
        const pctY = ((btnY / btnBounds.height) * 100).toFixed(1);

        btn.style.setProperty('--btn-x', `${pctX}%`);
        btn.style.setProperty('--btn-y', `${pctY}%`);
    }

    bentoBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            handleBtnMove(btn, e.clientX, e.clientY);
        });
    });

    // Global Mobile Finger Dragging across cards and buttons
    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        const cardEl = targetEl ? targetEl.closest('.bento-card') : null;
        const btnEl = targetEl ? targetEl.closest('.bento-btn') : null;

        if (btnEl) {
            if (currentActiveBtn !== btnEl) {
                if (currentActiveBtn) currentActiveBtn.classList.remove('is-btn-active');
                currentActiveBtn = btnEl;
                currentActiveBtn.classList.add('is-btn-active');
                triggerHaptic(30);
            }
            handleBtnMove(btnEl, touch.clientX, touch.clientY);
        }

        if (cardEl && cardMap.has(cardEl)) {
            currentActiveCardObj = cardMap.get(cardEl);
            currentActiveCardObj.activate(touch.clientX, touch.clientY, 0.99, true);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        const cardEl = targetEl ? targetEl.closest('.bento-card') : null;
        const btnEl = targetEl ? targetEl.closest('.bento-btn') : null;

        // Button tracking during drag
        if (btnEl) {
            if (currentActiveBtn !== btnEl) {
                if (currentActiveBtn) currentActiveBtn.classList.remove('is-btn-active');
                currentActiveBtn = btnEl;
                currentActiveBtn.classList.add('is-btn-active');
                triggerHaptic(30); // Apple button activation pulse
            }
            handleBtnMove(btnEl, touch.clientX, touch.clientY);
        } else if (currentActiveBtn) {
            currentActiveBtn.classList.remove('is-btn-active');
            currentActiveBtn = null;
        }

        // Card tracking during drag
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
        if (currentActiveBtn) {
            currentActiveBtn.classList.remove('is-btn-active');
            currentActiveBtn = null;
        }
        lastVibratedCardEl = null;
        lastVibratedBtnEl = null;
    }

    window.addEventListener('touchend', clearTouchState);
    window.addEventListener('touchcancel', clearTouchState);

    // Live GitHub API Stats Fetcher for KingSahil
    async function fetchGitHubStats() {
        try {
            const userRes = await fetch('https://api.github.com/users/KingSahil');
            if (userRes.ok) {
                const userData = await userRes.json();
                const followersEl = document.getElementById('gh-followers');
                const reposEl = document.getElementById('gh-repos');
                if (followersEl) followersEl.textContent = userData.followers;
                if (reposEl) reposEl.textContent = Math.max(65, userData.public_repos);
            }

            const reposRes = await fetch('https://api.github.com/users/KingSahil/repos?per_page=100');
            if (reposRes.ok) {
                const reposData = await reposRes.json();
                const totalStars = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
                const starsEl = document.getElementById('gh-stars');
                if (starsEl) starsEl.textContent = totalStars;
            }
        } catch (err) {
            // Silently retain pre-filled live values
        }
    }
    fetchGitHubStats();
});
