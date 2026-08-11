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
    // DSA SPATIAL INDEX ENGINE & COLLISION PHYSICS ENGINE
    // ==========================================================================
    const cardNodes = Array.from(document.querySelectorAll('.bento-card'));
    const bentoBtns = Array.from(document.querySelectorAll('.bento-btn'));

    let spatialCards = [];
    let spatialBtns = [];
    let activeHeldController = null;
    let currentActiveBtn = null;

    // Fast Card Physics Controller (Tilt, Translation, Momentum & Elastic Recoil)
    function createCardController(card) {
        return {
            card: card,
            restLeft: undefined,
            restTop: undefined,
            width: 0,
            height: 0,

            // 3D Tilt parameters
            targetRotateX: 0,
            targetRotateY: 0,
            targetScale: 1,
            currentRotateX: 0,
            currentRotateY: 0,
            currentScale: 1,

            // 2D Physics position, velocity, and rotation
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            rz: 0,
            vrz: 0,

            // Holding state
            isHeld: false,
            dragStartX: 0,
            dragStartY: 0,
            cardStartX: 0,
            cardStartY: 0,
            lastMouseX: 0,
            lastMouseY: 0,
            dragDistance: 0,

            // Spring Hooke's Law constants (elastic bounce & damping)
            kSpring: 0.15,
            kDamp: 0.78,
            kRotSpring: 0.12,
            kRotDamp: 0.75,

            isDirty: false,

            updateBounds(rect) {
                rect = rect || this.card.getBoundingClientRect();
                this.restLeft = rect.left - this.x;
                this.restTop = rect.top - this.y;
                this.width = rect.width;
                this.height = rect.height;
            },

            // Center coordinates in viewport space with active physical displacement
            getCenter() {
                if (this.restLeft === undefined) this.updateBounds();
                return {
                    x: this.restLeft + this.width * 0.5 + this.x,
                    y: this.restTop + this.height * 0.5 + this.y,
                    radius: Math.min(this.width, this.height) * 0.46
                };
            },

            stepPhysics() {
                // Smooth 3D tilt lerp
                const lerpFactor = 0.22;
                this.currentRotateX += (this.targetRotateX - this.currentRotateX) * lerpFactor;
                this.currentRotateY += (this.targetRotateY - this.currentRotateY) * lerpFactor;
                this.currentScale += (this.targetScale - this.currentScale) * lerpFactor;

                if (this.isHeld) {
                    // Calculate instantaneous drag velocity
                    const dtVx = this.x - (this.lastFrameX !== undefined ? this.lastFrameX : this.x);
                    const dtVy = this.y - (this.lastFrameY !== undefined ? this.lastFrameY : this.y);
                    this.vx = this.vx * 0.4 + dtVx * 0.6;
                    this.vy = this.vy * 0.4 + dtVy * 0.6;
                    this.lastFrameX = this.x;
                    this.lastFrameY = this.y;

                    // Dynamic rotation tilt along drag velocity vector
                    this.rz += (this.vx * 0.4 - this.rz) * 0.25;
                    this.isDirty = true;
                } else {
                    // Free Motion: Hooke's Law Spring Restoring Force (-k*x - d*v)
                    const fx = -this.kSpring * this.x - (1 - this.kDamp) * this.vx;
                    const fy = -this.kSpring * this.y - (1 - this.kDamp) * this.vy;
                    const frz = -this.kRotSpring * this.rz - (1 - this.kRotDamp) * this.vrz;

                    this.vx += fx;
                    this.vy += fy;
                    this.vrz += frz;

                    this.vx *= this.kDamp;
                    this.vy *= this.kDamp;
                    this.vrz *= this.kRotDamp;

                    this.x += this.vx;
                    this.y += this.vy;
                    this.rz += this.vrz;
                }

                // Elastic stretch deformation when moving at high speeds
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                let stretchX = 1;
                let stretchY = 1;
                if (speed > 0.4) {
                    const angle = Math.atan2(this.vy, this.vx);
                    const stretchFactor = Math.min(0.18, speed * 0.007);
                    stretchX = 1 + Math.abs(Math.cos(angle)) * stretchFactor;
                    stretchY = 1 + Math.abs(Math.sin(angle)) * stretchFactor;
                }

                const hasDisplacement = Math.abs(this.x) > 0.04 || Math.abs(this.y) > 0.04 || Math.abs(this.rz) > 0.04;
                const hasMotion = Math.abs(this.vx) > 0.04 || Math.abs(this.vy) > 0.04 || Math.abs(this.vrz) > 0.04;

                if (hasDisplacement || hasMotion || this.isHeld) {
                    this.card.classList.add('is-displaced');
                    this.card.style.transform = `perspective(1000px) translate3d(${this.x.toFixed(2)}px, ${this.y.toFixed(2)}px, 0px) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg) rotateZ(${this.rz.toFixed(2)}deg) scale3d(${(this.currentScale * stretchX).toFixed(3)}, ${(this.currentScale * stretchY).toFixed(3)}, 1)`;
                    this.isDirty = true;
                } else {
                    this.card.classList.remove('is-displaced');
                    this.x = 0;
                    this.y = 0;
                    this.vx = 0;
                    this.vy = 0;
                    this.rz = 0;
                    this.vrz = 0;

                    const deltaX = Math.abs(this.targetRotateX - this.currentRotateX);
                    const deltaY = Math.abs(this.targetRotateY - this.currentRotateY);
                    const deltaScale = Math.abs(this.targetScale - this.currentScale);

                    if (deltaX < 0.01 && deltaY < 0.01 && deltaScale < 0.001) {
                        this.isDirty = false;
                        if (this.targetRotateX === 0 && this.targetRotateY === 0 && this.targetScale === 1) {
                            this.card.style.transform = 'none';
                        }
                    } else {
                        this.card.style.transform = `perspective(1000px) rotateX(${this.currentRotateX.toFixed(2)}deg) rotateY(${this.currentRotateY.toFixed(2)}deg) scale3d(${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)}, 1)`;
                        this.isDirty = true;
                    }
                }
            },

            handleMove(clientX, clientY) {
                if (this.restLeft === undefined) this.updateBounds();
                const cardLeft = this.restLeft + this.x;
                const cardTop = this.restTop + this.y;
                const x = clientX - cardLeft;
                const y = clientY - cardTop;
                const centerX = this.width * 0.5;
                const centerY = this.height * 0.5;

                const isMobile = window.innerWidth <= 768;
                const maxAngleX = isMobile ? 3.6 : 2.8;
                const maxAngleY = isMobile ? 5.6 : 4.8;

                this.targetRotateX = ((centerY - y) / centerY) * maxAngleX;
                this.targetRotateY = ((x - centerX) / centerX) * maxAngleY;

                const pctX = (x / this.width) * 100;
                const pctY = (y / this.height) * 100;

                this.card.style.setProperty('--touch-x', `${pctX}%`);
                this.card.style.setProperty('--touch-y', `${pctY}%`);
                this.card.style.setProperty('--touch-opacity', '1');

                if (this.card.classList.contains('bento-tech-marquee')) {
                    if (pctX < 45) {
                        const intensity = Math.min(1, (45 - pctX) / 45);
                        targetSpeedTop = baseSpeed + (intensity * 0.9);
                        targetSpeedBottom = baseSpeed;
                    } else if (pctX > 55) {
                        const intensity = Math.min(1, (pctX - 55) / 45);
                        targetSpeedBottom = baseSpeed + (intensity * 0.9);
                        targetSpeedTop = baseSpeed;
                    } else {
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

            startHold(clientX, clientY) {
                this.isHeld = true;
                this.dragStartX = clientX;
                this.dragStartY = clientY;
                this.cardStartX = this.x;
                this.cardStartY = this.y;
                this.lastMouseX = clientX;
                this.lastMouseY = clientY;
                this.lastFrameX = this.x;
                this.lastFrameY = this.y;
                this.dragDistance = 0;
                this.card.classList.add('is-held');
                this.isDirty = true;
            },

            dragHold(clientX, clientY) {
                if (!this.isHeld) return;
                const dx = clientX - this.dragStartX;
                const dy = clientY - this.dragStartY;
                const stepDist = Math.sqrt((clientX - this.lastMouseX) ** 2 + (clientY - this.lastMouseY) ** 2);
                this.dragDistance += stepDist;

                this.x = this.cardStartX + dx;
                this.y = this.cardStartY + dy;

                this.lastMouseX = clientX;
                this.lastMouseY = clientY;
                this.isDirty = true;
            },

            releaseHold() {
                if (!this.isHeld) return;
                this.isHeld = false;
                this.card.classList.remove('is-held');
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

                // Impart drag momentum impulse
                this.vx = (this.vx || 0) * 1.3;
                this.vy = (this.vy || 0) * 1.3;
                this.vrz = (this.vx || 0) * 0.45;
                this.isDirty = true;
            },

            release() {
                if (this.isHeld) {
                    this.releaseHold();
                    return;
                }
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
            let controller = card._controller;
            if (!controller) {
                controller = createCardController(card);
                card._controller = controller;
            }
            controller.updateBounds();
            return {
                element: card,
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

    // O(N^2) Physics Collision Resolver with Momentum Transfer & Push Impulse
    function resolveCardCollisions() {
        for (let i = 0; i < spatialCards.length; i++) {
            const ctrlA = spatialCards[i].controller;
            const centerA = ctrlA.getCenter();

            for (let j = i + 1; j < spatialCards.length; j++) {
                const ctrlB = spatialCards[j].controller;
                const centerB = ctrlB.getCenter();

                const dx = centerB.x - centerA.x;
                const dy = centerB.y - centerA.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const minDistance = centerA.radius + centerB.radius;

                if (dist < minDistance && dist > 0.001) {
                    const overlap = minDistance - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    const pushFactor = 0.55;

                    if (ctrlA.isHeld && !ctrlB.isHeld) {
                        ctrlB.x += nx * overlap * pushFactor;
                        ctrlB.y += ny * overlap * pushFactor;
                        ctrlB.vx += nx * overlap * 0.35 + ctrlA.vx * 0.35;
                        ctrlB.vy += ny * overlap * 0.35 + ctrlA.vy * 0.35;
                        ctrlB.vrz += (nx * ny) * 0.6;
                        ctrlB.isDirty = true;
                        if (overlap > 12) triggerHaptic(20);
                    } else if (ctrlB.isHeld && !ctrlA.isHeld) {
                        ctrlA.x -= nx * overlap * pushFactor;
                        ctrlA.y -= ny * overlap * pushFactor;
                        ctrlA.vx -= nx * overlap * 0.35 - ctrlB.vx * 0.35;
                        ctrlA.vy -= ny * overlap * 0.35 - ctrlB.vy * 0.35;
                        ctrlA.vrz -= (nx * ny) * 0.6;
                        ctrlA.isDirty = true;
                        if (overlap > 12) triggerHaptic(20);
                    } else {
                        // Free-moving elastic collision
                        const split = overlap * 0.45;
                        ctrlA.x -= nx * split;
                        ctrlA.y -= ny * split;
                        ctrlB.x += nx * split;
                        ctrlB.y += ny * split;

                        const relVx = ctrlB.vx - ctrlA.vx;
                        const relVy = ctrlB.vy - ctrlA.vy;
                        const velAlongNormal = relVx * nx + relVy * ny;

                        if (velAlongNormal < 0) {
                            const restitution = 0.65;
                            const impulseScalar = -(1 + restitution) * velAlongNormal * 0.5;
                            const impX = impulseScalar * nx;
                            const impY = impulseScalar * ny;

                            ctrlA.vx -= impX;
                            ctrlA.vy -= impY;
                            ctrlB.vx += impX;
                            ctrlB.vy += impY;

                            ctrlA.vrz -= impX * 0.25;
                            ctrlB.vrz += impX * 0.25;
                        }
                        ctrlA.isDirty = true;
                        ctrlB.isDirty = true;
                    }
                }
            }
        }
    }

    // Single Global Unified RAF Physics Loop
    function globalPhysicsLoop() {
        resolveCardCollisions();

        for (let i = 0; i < spatialCards.length; i++) {
            const ctrl = spatialCards[i].controller;
            if (ctrl.isDirty || ctrl.isHeld) {
                ctrl.stepPhysics();
            }
        }
        requestAnimationFrame(globalPhysicsLoop);
    }
    requestAnimationFrame(globalPhysicsLoop);

    // O(N) Pure Arithmetic Point-in-Rectangle DSA Lookup
    function findCardAtPoint(x, y) {
        for (let i = 0; i < spatialCards.length; i++) {
            const ctrl = spatialCards[i].controller;
            if (ctrl.restLeft === undefined) ctrl.updateBounds();
            const currentLeft = ctrl.restLeft + ctrl.x;
            const currentTop = ctrl.restTop + ctrl.y;
            const currentRight = currentLeft + ctrl.width;
            const currentBottom = currentTop + ctrl.height;
            if (x >= currentLeft && x <= currentRight && y >= currentTop && y <= currentBottom) {
                return spatialCards[i];
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

    // Setup Listeners for All Cards (Link cards & Static cards)
    spatialCards.forEach(item => {
        const card = item.element;
        const ctrl = item.controller;

        card.addEventListener('contextmenu', (e) => e.preventDefault());
        card.addEventListener('dragstart', (e) => e.preventDefault());

        // Direct PointerDown Handler for instant response on all card types (<a> links and <article>)
        card.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.bento-btn')) return;

            activeHeldController = ctrl;
            ctrl.startHold(e.clientX, e.clientY);
            ctrl.activate(e.clientX, e.clientY, 0.98);
            triggerHaptic(40);

            try {
                card.setPointerCapture(e.pointerId);
            } catch (err) {}
        });

        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            card.addEventListener('mouseenter', (e) => {
                if (!ctrl.isHeld) ctrl.activate(e.clientX, e.clientY, 1.008);
            });
            card.addEventListener('mousemove', (e) => {
                if (!ctrl.isHeld) ctrl.handleMove(e.clientX, e.clientY);
            });
            card.addEventListener('mouseleave', () => {
                if (!ctrl.isHeld) ctrl.release();
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

    // Global Pointer Movement & Release Handlers
    window.addEventListener('pointermove', (e) => {
        if (activeHeldController && activeHeldController.isHeld) {
            activeHeldController.dragHold(e.clientX, e.clientY);
            activeHeldController.handleMove(e.clientX, e.clientY);
        }

        // Button hover checks
        const btnMatch = findBtnAtPoint(e.clientX, e.clientY);
        if (btnMatch) {
            if (currentActiveBtn !== btnMatch.element) {
                if (currentActiveBtn) currentActiveBtn.classList.remove('is-btn-active');
                currentActiveBtn = btnMatch.element;
                currentActiveBtn.classList.add('is-btn-active');
            }
            const pctX = ((e.clientX - btnMatch.left) / btnMatch.width) * 100;
            const pctY = ((e.clientY - btnMatch.top) / btnMatch.height) * 100;
            currentActiveBtn.style.setProperty('--btn-x', `${pctX}%`);
            currentActiveBtn.style.setProperty('--btn-y', `${pctY}%`);
        } else if (currentActiveBtn) {
            currentActiveBtn.classList.remove('is-btn-active');
            currentActiveBtn = null;
        }
    }, { passive: true });

    function handlePointerRelease(e) {
        if (activeHeldController) {
            const dragDist = activeHeldController.dragDistance;
            activeHeldController.releaseHold();

            // Intercept click navigation if card was held and dragged (> 6px movement)
            if (dragDist > 6) {
                const preventClickOnce = (clickEvent) => {
                    clickEvent.preventDefault();
                    clickEvent.stopPropagation();
                    window.removeEventListener('click', preventClickOnce, true);
                };
                window.addEventListener('click', preventClickOnce, true);
            }

            activeHeldController = null;
        }

        bentoBtns.forEach(btn => {
            btn.classList.remove('is-btn-active');
            btn.style.setProperty('--btn-shine-opacity', '0');
        });
        currentActiveBtn = null;
        lastVibratedCardEl = null;
    }

    window.addEventListener('pointerup', handlePointerRelease, { passive: true });
    window.addEventListener('pointercancel', handlePointerRelease, { passive: true });

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
