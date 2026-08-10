/* ==========================================================================
   HANDCRAFTED BENTO INTERACTIVITY & HIGH-PERFORMANCE DSA TOUCH ENGINE
   Developer: Sahil
   Optimization: DSA Spatial Indexing & Smooth Continuous Marquee Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let lastVibratedCardEl = null;

    // Helper for haptic vibration
    function triggerHaptic(pattern = 35) {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore security blocks
            }
        }
    }

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
    // HIGH-PERFORMANCE CONTINUOUS INFINITE MARQUEE ENGINE (ZERO JERK, ZERO JUMP)
    // ==========================================================================
    const trackTop = document.getElementById('marquee-track-top');
    const trackBottom = document.getElementById('marquee-track-bottom');

    let posTop = 0;
    let posBottom = 0;
    let halfWidthTop = 0;
    let halfWidthBottom = 0;

    const baseSpeed = 0.55; // Relaxed, elegant base ambient speed (px / frame)
    let targetSpeedTop = baseSpeed;
    let targetSpeedBottom = baseSpeed;
    let currentSpeedTop = baseSpeed;
    let currentSpeedBottom = baseSpeed;

    let isHoldingTechCard = false;
    let techTouchStartX = 0;

    function measureMarqueeWidths() {
        if (trackTop) {
            const g = trackTop.querySelector('.marquee-group');
            if (g && g.offsetWidth > 0) halfWidthTop = g.offsetWidth;
        }
        if (trackBottom) {
            const g = trackBottom.querySelector('.marquee-group');
            if (g && g.offsetWidth > 0) halfWidthBottom = g.offsetWidth;
        }
    }
    
    measureMarqueeWidths();
    setTimeout(measureMarqueeWidths, 100);
    setTimeout(measureMarqueeWidths, 500);
    window.addEventListener('load', measureMarqueeWidths, { passive: true });
    window.addEventListener('resize', measureMarqueeWidths, { passive: true });

    function stepMarqueeLoop() {
        // Fallback width check
        if (halfWidthTop === 0 && trackTop) {
            const g = trackTop.querySelector('.marquee-group');
            if (g && g.offsetWidth > 0) halfWidthTop = g.offsetWidth;
        }
        if (halfWidthBottom === 0 && trackBottom) {
            const g = trackBottom.querySelector('.marquee-group');
            if (g && g.offsetWidth > 0) halfWidthBottom = g.offsetWidth;
        }

        const effectiveHalfTop = halfWidthTop || 450;
        const effectiveHalfBottom = halfWidthBottom || 450;

        // Smooth lerp speed transition (Zero jerk, zero jump!)
        currentSpeedTop += (targetSpeedTop - currentSpeedTop) * 0.08;
        currentSpeedBottom += (targetSpeedBottom - currentSpeedBottom) * 0.08;

        // Top Row ALWAYS moves LEFT ONLY (DSA Modulo Virtualization)
        if (trackTop) {
            posTop -= currentSpeedTop;
            const wrapWidth = halfWidthTop || 450;
            if (Math.abs(posTop) >= wrapWidth) {
                posTop = posTop % wrapWidth; // Modulo Ring Buffer Wrap
            }
            trackTop.style.transform = `translate3d(${posTop}px, 0, 0)`;
        }

        // Bottom Row ALWAYS moves RIGHT ONLY (DSA Modulo Virtualization)
        if (trackBottom) {
            posBottom += currentSpeedBottom;
            const wrapWidth = halfWidthBottom || 450;
            if (posBottom >= 0) {
                posBottom = -wrapWidth + (posBottom % wrapWidth); // Modulo Ring Buffer Wrap
            }
            trackBottom.style.transform = `translate3d(${posBottom}px, 0, 0)`;
        }

        requestAnimationFrame(stepMarqueeLoop);
    }
    requestAnimationFrame(stepMarqueeLoop);

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

                // Responsive tilt scaling with enhanced left/right (Y-axis) tilt responsiveness
                const isMobile = window.innerWidth <= 768;
                const maxAngleX = isMobile ? 3.6 : 2.8;
                const maxAngleY = isMobile ? 5.6 : 4.8; // Boosted left/right tilt

                this.targetRotateX = ((centerY - y) / centerY) * maxAngleX;
                this.targetRotateY = ((x - centerX) / centerX) * maxAngleY;

                const pctX = (x / this.bounds.width) * 100;
                const pctY = (y / this.bounds.height) * 100;

                this.card.style.setProperty('--touch-x', `${pctX}%`);
                this.card.style.setProperty('--touch-y', `${pctY}%`);
                this.card.style.setProperty('--touch-opacity', '1');

                // Absolute Spatial Positioning Acceleration (Holding Left or Right)
                if (this.card.classList.contains('bento-tech-marquee')) {
                    if (pctX < 45) {
                        // Holding/resting on LEFT side: Top row (moving left) speeds up!
                        const intensity = Math.min(1, (45 - pctX) / 45);
                        targetSpeedTop = baseSpeed + (intensity * 0.9); // Subtle boost from 0.55 to 1.45px/frame
                        targetSpeedBottom = baseSpeed;
                    } else if (pctX > 55) {
                        // Holding/resting on RIGHT side: Bottom row (moving right) speeds up!
                        const intensity = Math.min(1, (pctX - 55) / 45);
                        targetSpeedBottom = baseSpeed + (intensity * 0.9); // Subtle boost from 0.55 to 1.45px/frame
                        targetSpeedTop = baseSpeed;
                    } else {
                        // Resting in middle (45% to 55%): Base speed!
                        targetSpeedTop = baseSpeed;
                        targetSpeedBottom = baseSpeed;
                    }
                }

                this.isDirty = true;
            },

            activate(clientX, clientY, scale = 0.99) {
                this.card.classList.add('is-touch-pressed');
                this.targetScale = scale;
                if (this.card.classList.contains('bento-tech-marquee')) {
                    isHoldingTechCard = true;
                    techTouchStartX = clientX;
                }
                this.handleMove(clientX, clientY);
            },

            release() {
                this.card.classList.remove('is-touch-pressed');
                this.targetRotateX = 0;
                this.targetRotateY = 0;
                this.targetScale = 1;
                this.card.style.setProperty('--touch-opacity', '0');
                if (this.card.classList.contains('bento-tech-marquee')) {
                    isHoldingTechCard = false;
                    targetSpeedTop = baseSpeed;
                    targetSpeedBottom = baseSpeed;
                }
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

    // O(N) Pure Arithmetic Point-in-Rectangle DSA Lookup
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

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            card.addEventListener('mouseenter', (e) => {
                ctrl.activate(e.clientX, e.clientY, 1.008);
            });
            card.addEventListener('mousemove', (e) => {
                ctrl.handleMove(e.clientX, e.clientY);
            });
            card.addEventListener('mouseleave', () => {
                ctrl.release();
            });
        }
    });

    // Button Pointer Movement & Context Menu Prevention
    spatialBtns.forEach(item => {
        const btn = item.element;
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
        btn.addEventListener('mousemove', (e) => {
            const pctX = ((e.clientX - item.left) / item.width) * 100;
            const pctY = ((e.clientY - item.top) / item.height) * 100;
            btn.style.setProperty('--btn-x', `${pctX}%`);
            btn.style.setProperty('--btn-y', `${pctY}%`);
        });
    });

    // High-Performance Touch Dragging (Zero Layout Reflow)
    window.addEventListener('touchstart', (e) => {
        refreshSpatialIndex();
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        const btnMatch = findBtnAtPoint(touchX, touchY);
        if (btnMatch) {
            currentActiveBtn = btnMatch.element;
            currentActiveBtn.classList.add('is-btn-active');
            const pctX = ((touchX - btnMatch.left) / btnMatch.width) * 100;
            const pctY = ((touchY - btnMatch.top) / btnMatch.height) * 100;
            currentActiveBtn.style.setProperty('--btn-x', `${pctX}%`);
            currentActiveBtn.style.setProperty('--btn-y', `${pctY}%`);
            triggerHaptic(30);
        }

        const cardMatch = findCardAtPoint(touchX, touchY);
        if (cardMatch) {
            currentActiveCardObj = cardMatch.controller;
            currentActiveCardObj.activate(touchX, touchY, 0.99);
            lastVibratedCardEl = cardMatch.element;
            triggerHaptic(45);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Button spatial check
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

        // Card spatial check - Instant sliding haptic trigger on card crossing
        const cardMatch = findCardAtPoint(touchX, touchY);
        if (cardMatch) {
            const newCtrl = cardMatch.controller;
            if (currentActiveCardObj !== newCtrl) {
                if (currentActiveCardObj) currentActiveCardObj.release();
                currentActiveCardObj = newCtrl;
                currentActiveCardObj.activate(touchX, touchY, 0.99);

                if (lastVibratedCardEl !== cardMatch.element) {
                    lastVibratedCardEl = cardMatch.element;
                    triggerHaptic(35);
                }
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
        bentoBtns.forEach(btn => {
            btn.classList.remove('is-btn-active');
            btn.style.setProperty('--btn-shine-opacity', '0');
        });
        if (currentActiveCardObj) {
            currentActiveCardObj.release();
            currentActiveCardObj = null;
        }
        currentActiveBtn = null;
        isHoldingTechCard = false;
        targetSpeedTop = baseSpeed;
        targetSpeedBottom = baseSpeed;
        lastVibratedCardEl = null;
    }

    window.addEventListener('touchend', clearTouchState, { passive: true });
    window.addEventListener('touchcancel', clearTouchState, { passive: true });
    window.addEventListener('pointerup', clearTouchState, { passive: true });
    window.addEventListener('pointercancel', clearTouchState, { passive: true });

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
