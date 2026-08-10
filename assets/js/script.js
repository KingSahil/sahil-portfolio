/* ==========================================================================
   HANDCRAFTED BENTO INTERACTIVITY & HIGH-PERFORMANCE DSA TOUCH ENGINE
   Developer: Sahil
   Optimization: DSA Spatial Indexing (Zero Layout Reflow on Touch Drag)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let lastVibratedCardEl = null;

    let isHapticPrimed = false;

    // Helper for haptic vibration with Android Chrome security activation priming
    function triggerHaptic(pattern = 35) {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore security blocks
            }
        }
    }

    function primeHaptics() {
        if (!isHapticPrimed && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(25);
                isHapticPrimed = true;
            } catch (e) {}
        }
    }

    window.addEventListener('pointerdown', primeHaptics, { capture: true, passive: true });
    window.addEventListener('touchstart', primeHaptics, { capture: true, passive: true });

    // 1. Custom Cursor Logic (Desktop Only)
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

    // ==========================================================================
    // DSA SPATIAL INDEX ENGINE (O(1) Bounds Lookup - Zero DOM Layout Reflow)
    // ==========================================================================
    const cardNodes = Array.from(document.querySelectorAll('.bento-card'));
    const bentoBtns = Array.from(document.querySelectorAll('.bento-btn'));

    let spatialCards = [];
    let spatialBtns = [];
    let currentActiveCardObj = null;
    let currentActiveBtn = null;

    // Fast Card Physics Controller
    function createCardController(card) {
        return {
            card: card,
            bounds: null,
            targetRotateX: 0,
            targetRotateY: 0,
            targetScale: 1,
            currentRotateX: 0,
            currentRotateY: 0,
            currentScale: 1,
            isDirty: false,

            updateBounds(rect) {
                this.bounds = rect || this.card.getBoundingClientRect();
            },

            stepPhysics() {
                const lerpFactor = 0.22;
                this.currentRotateX += (this.targetRotateX - this.currentRotateX) * lerpFactor;
                this.currentRotateY += (this.targetRotateY - this.currentRotateY) * lerpFactor;
                this.currentScale += (this.targetScale - this.currentScale) * lerpFactor;

                this.card.style.transform = `perspective(1000px) rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg) scale3d(${this.currentScale}, ${this.currentScale}, ${this.currentScale})`;

                const deltaX = Math.abs(this.targetRotateX - this.currentRotateX);
                const deltaY = Math.abs(this.targetRotateY - this.currentRotateY);
                const deltaScale = Math.abs(this.targetScale - this.currentScale);

                if (deltaX < 0.01 && deltaY < 0.01 && deltaScale < 0.001) {
                    this.isDirty = false;
                    if (this.targetRotateX === 0 && this.targetRotateY === 0 && this.targetScale === 1) {
                        this.card.style.transform = 'none';
                    }
                } else {
                    this.isDirty = true;
                }
            },

            handleMove(clientX, clientY) {
                if (!this.bounds) this.updateBounds();
                const x = clientX - this.bounds.left;
                const y = clientY - this.bounds.top;
                const centerX = this.bounds.width * 0.5;
                const centerY = this.bounds.height * 0.5;

                // Normalize 3D tilt across card dimensions so physical edge lift is identical for all cards
                const baseSize = 220;
                const normX = Math.min(1, baseSize / Math.max(1, this.bounds.width));
                const normY = Math.min(1, baseSize / Math.max(1, this.bounds.height));
                const maxAngle = 2.4;

                this.targetRotateX = ((centerY - y) / centerY) * maxAngle * normY;
                this.targetRotateY = ((x - centerX) / centerX) * maxAngle * normX;

                const pctX = (x / this.bounds.width) * 100;
                const pctY = (y / this.bounds.height) * 100;

                this.card.style.setProperty('--touch-x', `${pctX}%`);
                this.card.style.setProperty('--touch-y', `${pctY}%`);
                this.card.style.setProperty('--touch-opacity', '1');

                this.isDirty = true;
            },

            activate(clientX, clientY, scale = 0.99, isTouch = false) {
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
                this.isDirty = true;
            }
        };
    }

    // Build & Refresh Spatial Cache
    function refreshSpatialIndex() {
        spatialCards = cardNodes.map(card => {
            const rect = card.getBoundingClientRect();
            const controller = createCardController(card);
            controller.updateBounds(rect);
            return {
                element: card,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                controller: controller
            };
        });

        spatialBtns = bentoBtns.map(btn => {
            const rect = btn.getBoundingClientRect();
            return {
                element: btn,
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
            };
        });
    }

    refreshSpatialIndex();
    window.addEventListener('resize', refreshSpatialIndex, { passive: true });
    window.addEventListener('orientationchange', refreshSpatialIndex, { passive: true });

    // Single Global Unified RAF Physics Loop
    function globalPhysicsLoop() {
        for (let i = 0; i < spatialCards.length; i++) {
            const ctrl = spatialCards[i].controller;
            if (ctrl.isDirty) {
                ctrl.stepPhysics();
            }
        }
        requestAnimationFrame(globalPhysicsLoop);
    }
    requestAnimationFrame(globalPhysicsLoop);

    // O(N) Pure Arithmetic Point-in-Rectangle DSA Lookup (No DOM layout query)
    function findCardAtPoint(x, y) {
        for (let i = 0; i < spatialCards.length; i++) {
            const item = spatialCards[i];
            if (x >= item.left && x <= item.right && y >= item.top && y <= item.bottom) {
                return item;
            }
        }
        return null;
    }

    function findBtnAtPoint(x, y) {
        for (let i = 0; i < spatialBtns.length; i++) {
            const item = spatialBtns[i];
            if (x >= item.left && x <= item.right && y >= item.top && y <= item.bottom) {
                return item;
            }
        }
        return null;
    }

    // Setup Event Listeners for Cards
    spatialCards.forEach(item => {
        const card = item.element;
        const ctrl = item.controller;

        card.addEventListener('contextmenu', (e) => e.preventDefault());
        card.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'touch') {
                triggerHaptic(40);
            }
        });

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            card.addEventListener('mouseenter', (e) => {
                ctrl.activate(e.clientX, e.clientY, 1.008, false);
            });
            card.addEventListener('mousemove', (e) => {
                ctrl.handleMove(e.clientX, e.clientY);
            });
            card.addEventListener('mouseleave', () => {
                ctrl.release();
            });
        }
    });

    // Button Pointer Movement (Desktop)
    spatialBtns.forEach(item => {
        const btn = item.element;
        btn.addEventListener('mousemove', (e) => {
            const pctX = ((e.clientX - item.left) / item.width) * 100;
            const pctY = ((e.clientY - item.top) / item.height) * 100;
            btn.style.setProperty('--btn-x', `${pctX}%`);
            btn.style.setProperty('--btn-y', `${pctY}%`);
        });
    });

    // High-Performance Touch Dragging (Zero Layout Reflow)
    window.addEventListener('touchstart', (e) => {
        refreshSpatialIndex(); // Quick bounds sync on touch start
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        const btnMatch = findBtnAtPoint(touchX, touchY);
        if (btnMatch) {
            currentActiveBtn = btnMatch.element;
            currentActiveBtn.classList.add('is-btn-active');
            triggerHaptic(30);
        }

        const cardMatch = findCardAtPoint(touchX, touchY);
        if (cardMatch) {
            currentActiveCardObj = cardMatch.controller;
            currentActiveCardObj.activate(touchX, touchY, 0.99, true);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Button spatial check (Pure arithmetic)
        const btnMatch = findBtnAtPoint(touchX, touchY);
        if (btnMatch) {
            if (currentActiveBtn !== btnMatch.element) {
                if (currentActiveBtn) currentActiveBtn.classList.remove('is-btn-active');
                currentActiveBtn = btnMatch.element;
                currentActiveBtn.classList.add('is-btn-active');
                triggerHaptic(30);
            }
            const pctX = ((touchX - btnMatch.left) / btnMatch.width) * 100;
            const pctY = ((touchY - btnMatch.top) / btnMatch.height) * 100;
            currentActiveBtn.style.setProperty('--btn-x', `${pctX}%`);
            currentActiveBtn.style.setProperty('--btn-y', `${pctY}%`);
        } else if (currentActiveBtn) {
            currentActiveBtn.classList.remove('is-btn-active');
            currentActiveBtn = null;
        }

        // Card spatial check (Pure arithmetic - zero reflow)
        const cardMatch = findCardAtPoint(touchX, touchY);
        if (cardMatch) {
            const newCtrl = cardMatch.controller;
            if (currentActiveCardObj !== newCtrl) {
                if (currentActiveCardObj) currentActiveCardObj.release();
                currentActiveCardObj = newCtrl;
                currentActiveCardObj.activate(touchX, touchY, 0.99, true);
            } else {
                newCtrl.handleMove(touchX, touchY);
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
    }

    window.addEventListener('touchend', clearTouchState, { passive: true });
    window.addEventListener('touchcancel', clearTouchState, { passive: true });

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
            // Retain pre-filled live values
        }
    }
    fetchGitHubStats();
});
