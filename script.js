const GITHUB_USERNAME = 'KingSahil';
let projectsAutoScrollPaused = false;
const FALLBACK_PROJECTS = [
    {
        name: 'englishvocab',
        description: 'A recent vocabulary-focused web project built for fast, simple learning flows.',
        html_url: 'https://github.com/KingSahil/englishvocab',
        language: 'HTML',
        stargazers_count: 0,
        forks_count: 0,
        homepage: '',
        pushed_at: '2026-03-04T10:33:25Z'
    },
    {
        name: 'clipboard-rotator-landing-page',
        description: 'Landing page for a clipboard image rotation utility with a clean product-first presentation.',
        html_url: 'https://github.com/KingSahil/clipboard-rotator-landing-page',
        language: 'HTML',
        stargazers_count: 1,
        forks_count: 0,
        homepage: '',
        pushed_at: '2026-02-28T11:11:28Z'
    },
    {
        name: 'whatsapp-clipboard-image-rotator',
        description: 'Rotates clipboard images with keyboard shortcuts before sharing them in WhatsApp on desktop.',
        html_url: 'https://github.com/KingSahil/whatsapp-clipboard-image-rotator',
        language: 'Python',
        stargazers_count: 2,
        forks_count: 0,
        homepage: '',
        pushed_at: '2026-02-28T11:03:40Z'
    },
    {
        name: 'the-science-lab',
        description: 'An interactive science lab experience built with Godot for education-focused exploration.',
        html_url: 'https://github.com/KingSahil/the-science-lab',
        language: 'GDScript',
        stargazers_count: 3,
        forks_count: 1,
        homepage: '',
        pushed_at: '2026-02-11T17:43:02Z'
    }
];

const LANGUAGE_GROUPS = {
    Frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
    'Automation & Backend': ['Python', 'Node.js', 'Shell', 'Batchfile'],
    'Game & Creative Dev': ['GDScript', 'GLSL', 'ShaderLab', 'HLSL']
};

const PLAYGROUND_PINNED_TECH = [
    'React',
    'React Native',
    'Expo',
    'n8n',
    'Docker',
    'Next.js',
    'Pandas',
    'NumPy',
    'FastAPI',
    'Arduino',
    'C',
    'C++'
];

const MIN_SHOWCASE_REPO_SIZE = 25;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

async function initializeApp() {
    setupNavigation();
    updateCurrentYear();
    setupHoverImagePreviews();
    setupSideCardPressure();
    setupProjectsDragScroll();
    setupContactCardPressure();
    await loadGitHubContent();
    setupScrollAnimations();
    setupSmoothScrolling();
}

function setupSideCardPressure() {
    const cards = document.querySelectorAll('.about .pressure-card');
    if (!cards.length || !window.matchMedia('(hover: hover)').matches) {
        return;
    }

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    cards.forEach((card) => {
        const updateSidePress = (event, depth = 0.85) => {
            const rect = card.getBoundingClientRect();
            const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
            const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
            const nx = (px - 0.5) * 2;
            const ny = (py - 0.5) * 2;

            card.style.setProperty('--press-x', `${px * 100}%`);
            card.style.setProperty('--press-y', `${py * 100}%`);
            card.style.setProperty('--press-depth', `${depth}`);
            card.style.setProperty('--press-shift-x', `${nx * 5.2}`);
            card.style.setProperty('--press-shift-y', `${ny * 1.8}`);
            card.style.setProperty('--press-tilt-x', `${ny * -3.4}`);
            card.style.setProperty('--press-tilt-y', `${nx * 4.8}`);
        };

        card.addEventListener('mouseenter', (event) => {
            updateSidePress(event, 0.65);
        });

        card.addEventListener('mousemove', (event) => {
            updateSidePress(event, 0.92);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--press-depth', '0');
            card.style.removeProperty('--press-x');
            card.style.removeProperty('--press-y');
            card.style.removeProperty('--press-shift-x');
            card.style.removeProperty('--press-shift-y');
            card.style.removeProperty('--press-tilt-x');
            card.style.removeProperty('--press-tilt-y');
        });

        card.addEventListener('mousedown', (event) => {
            updateSidePress(event, 1);
        });

        card.addEventListener('mouseup', (event) => {
            updateSidePress(event, 0.9);
        });
    });
}

function setupHoverImagePreviews() {
    const hoverTargets = document.querySelectorAll('.hover-preview-target[data-preview-image]');
    if (!hoverTargets.length || !window.matchMedia('(hover: hover)').matches) {
        return;
    }

    const previewCard = document.createElement('div');
    previewCard.className = 'hover-preview-card';
    previewCard.innerHTML = `
        <img src="" alt="" loading="lazy">
        <div class="hover-preview-caption"></div>
    `;
    document.body.appendChild(previewCard);

    const previewImage = previewCard.querySelector('img');
    const previewCaption = previewCard.querySelector('.hover-preview-caption');
    const gap = 20;

    const positionPreview = (clientX, clientY) => {
        const cardWidth = previewCard.offsetWidth || 260;
        const cardHeight = previewCard.offsetHeight || 198;

        let left = clientX + gap;
        let top = clientY + gap;

        if (left + cardWidth > window.innerWidth - 12) {
            left = clientX - cardWidth - gap;
        }
        if (left < 12) {
            left = 12;
        }

        if (top + cardHeight > window.innerHeight - 12) {
            top = clientY - cardHeight - gap;
        }
        if (top < 12) {
            top = 12;
        }

        previewCard.style.left = `${left}px`;
        previewCard.style.top = `${top}px`;
    };

    hoverTargets.forEach((target) => {
        const imageSrc = target.dataset.previewImage;
        const imageAlt = target.dataset.previewAlt || target.textContent.trim();
        const captionText = target.textContent.trim();

        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '0');
        }

        const showPreview = (event) => {
            previewImage.src = imageSrc;
            previewImage.alt = imageAlt;
            previewCaption.textContent = captionText;
            previewCard.classList.add('is-visible');

            const x = event?.clientX ?? target.getBoundingClientRect().left + target.offsetWidth / 2;
            const y = event?.clientY ?? target.getBoundingClientRect().top + target.offsetHeight / 2;
            positionPreview(x, y);
        };

        const movePreview = (event) => {
            if (!previewCard.classList.contains('is-visible')) {
                return;
            }
            positionPreview(event.clientX, event.clientY);
        };

        const hidePreview = () => {
            previewCard.classList.remove('is-visible');
        };

        target.addEventListener('mouseenter', showPreview);
        target.addEventListener('mousemove', movePreview);
        target.addEventListener('mouseleave', hidePreview);
        target.addEventListener('focus', showPreview);
        target.addEventListener('blur', hidePreview);
    });
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

async function loadGitHubContent() {
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`);

        if (!reposResponse.ok) {
            throw new Error('GitHub API request failed');
        }

        const repos = (await reposResponse.json())
            .filter(repo => !repo.fork && !repo.archived)
            .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at));
        const activeRepos = repos.filter(repo => !isLikelyEmptyRepo(repo));
        const showcaseRepos = activeRepos.filter(isShowcaseRepo);
        const displayRepos = (showcaseRepos.length ? showcaseRepos : activeRepos).slice(0, 16);
        const reposWithLanguages = await enrichReposWithLanguages(displayRepos);

        renderTechPlayground(reposWithLanguages);
        renderProjects(displayRepos.slice(0, 12));
    } catch (error) {
        const fallbackWithLanguages = FALLBACK_PROJECTS.map(repo => ({ ...repo, languages: repo.language ? [repo.language] : [] }));
        renderTechPlayground(fallbackWithLanguages, true);
        renderProjects(FALLBACK_PROJECTS, true);
    }
}

function setupProjectsDragScroll() {
    const marquee = document.getElementById('projects-container');
    if (!marquee) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let coastRaf = null;

    marquee.addEventListener('contextmenu', (e) => e.preventDefault());

    // Any mouse button starts the drag
    marquee.addEventListener('mousedown', (e) => {
        isDown = true;
        projectsAutoScrollPaused = true;
        startX = e.clientX;
        lastX = e.clientX;
        lastTime = performance.now();
        scrollStart = marquee.scrollLeft;
        velocity = 0;
        if (coastRaf) { cancelAnimationFrame(coastRaf); coastRaf = null; }
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        marquee.scrollLeft = scrollStart - dx;

        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
            // velocity: positive = leftward (drag left), negative = rightward
            velocity = (lastX - e.clientX) / dt * 16 * 2.5;
        }
        lastX = e.clientX;
        lastTime = now;
    });

    document.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;

        const coast = () => {
            if (Math.abs(velocity) < 0.25) {
                velocity = 0;
                projectsAutoScrollPaused = false;
                return;
            }
            marquee.scrollLeft += velocity;
            velocity *= 0.92;
            coastRaf = requestAnimationFrame(coast);
        };
        coastRaf = requestAnimationFrame(coast);
    });
}

function setupContactCardPressure() {
    const cards = document.querySelectorAll('.contact .social-card');
    if (!cards.length || !window.matchMedia('(hover: hover)').matches) {
        return;
    }

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    cards.forEach((card) => {
        const updatePressPoint = (event) => {
            const rect = card.getBoundingClientRect();
            const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
            const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

            card.style.setProperty('--press-x', `${x}%`);
            card.style.setProperty('--press-y', `${y}%`);
        };

        card.addEventListener('mouseenter', (event) => {
            card.style.setProperty('--press-depth', '0.72');
            updatePressPoint(event);
        });

        card.addEventListener('mousemove', (event) => {
            card.style.setProperty('--press-depth', '0.9');
            updatePressPoint(event);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--press-depth', '0');
            card.style.removeProperty('--press-x');
            card.style.removeProperty('--press-y');
        });

        card.addEventListener('mousedown', () => {
            card.style.setProperty('--press-depth', '1');
        });

        card.addEventListener('mouseup', () => {
            card.style.setProperty('--press-depth', '0.9');
        });
    });
}

function renderProjects(repositories, useFallback = false) {
    const projectsContainer = document.getElementById('projects-track');
    if (!projectsContainer) {
        return;
    }

    if (!repositories.length) {
        projectsContainer.innerHTML = '<article class="project-ticker-card"><h3>Projects are loading</h3><p class="ticker-description">GitHub data is temporarily unavailable.</p></article>';
        return;
    }

    const tickerCards = repositories.map(project => createProjectTickerCard(project, useFallback)).join('');
    // Duplicate cards for seamless loop
    projectsContainer.innerHTML = tickerCards + tickerCards;

    startProjectsAutoScroll();
}

function startProjectsAutoScroll() {
    const marquee = document.getElementById('projects-container');
    const track = document.getElementById('projects-track');
    if (!marquee || !track) return;

    if (marquee._autoScrollRaf) {
        cancelAnimationFrame(marquee._autoScrollRaf);
    }

    // Start at the halfway point so rightward scroll has space before looping
    requestAnimationFrame(() => {
        marquee.scrollLeft = track.scrollWidth / 2;
    });

    const SPEED = 0.45; // px per frame — slow drift

    // Guard against duplicate listeners
    if (!marquee._hoverBound) {
        marquee._hoverBound = true;
        marquee.addEventListener('mouseenter', () => { marquee._hovering = true; });
        marquee.addEventListener('mouseleave', () => { marquee._hovering = false; });
    }

    const tick = () => {
        if (!marquee._hovering && !projectsAutoScrollPaused) {
            // Scroll rightward: decrease scrollLeft
            marquee.scrollLeft -= SPEED;
            // Loop: when we reach the start, jump back to the halfway clone
            if (marquee.scrollLeft <= 0) {
                marquee.scrollLeft = track.scrollWidth / 2;
            }
        }
        marquee._autoScrollRaf = requestAnimationFrame(tick);
    };

    marquee._autoScrollRaf = requestAnimationFrame(tick);
}

function createProjectTickerCard(project, useFallback = false) {
    const title = formatRepoName(project.name || project.title);
    const description = escapeHTML(project.description || buildFallbackDescription(project.name || project.title));
    const techTags = getProjectTags(project, useFallback).slice(0, 3);
    const updatedLabel = formatRelativeDate(project.pushed_at);
    const repoName = project.name || (project.html_url || '').split('/').pop();
    const previewImg = `https://socialify.git.ci/${GITHUB_USERNAME}/${repoName}/image?description=1&language=1&name=1&owner=1&theme=Dark&font=Raleway`;
    const liveUrl = project.homepage && project.homepage.trim() ? project.homepage.trim() : null;

    return `
        <article class="project-ticker-card fade-in">
            <div class="ticker-preview">
                <img
                    src="${previewImg}"
                    alt="${escapeHTML(title)} preview"
                    class="ticker-preview-img"
                    loading="lazy"
                    onerror="this.parentElement.style.display='none'"
                >
            </div>
            <div class="ticker-top">
                <h3 class="ticker-title">${escapeHTML(title)}</h3>
                <span class="ticker-updated">${updatedLabel}</span>
            </div>
            <p class="ticker-description">${description}</p>
            <div class="ticker-tech">
                ${techTags.map(tech => `<span class="ticker-tag">${renderTechIcon(tech, 'ticker-tag-icon')}<span>${escapeHTML(tech)}</span></span>`).join('')}
            </div>
            <div class="ticker-meta">
                <div class="ticker-stats">
                    <span><i class="fas fa-star"></i> ${project.stargazers_count ?? project.stars ?? 0}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks_count ?? project.forks ?? 0}</span>
                </div>
                <div class="ticker-links">
                    ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="ticker-link ticker-link-live"><i class="fas fa-external-link-alt"></i> Live</a>` : ''}
                    <a href="${project.html_url || project.githubUrl}" target="_blank" class="ticker-link">Open Repo</a>
                </div>
            </div>
        </article>
    `;
}

function renderTechPlayground(repositories, useFallback = false) {
    const playground = document.getElementById('tech-playground');
    if (!playground) {
        return;
    }

    const techStack = extractTechStack(repositories, useFallback).slice(0, 18);
    playground.innerHTML = '';

    if (!techStack.length) {
        playground.innerHTML = '<p class="section-intro">Tech stack is loading...</p>';
        return;
    }

    techStack.forEach((tech, index) => {
        const chip = document.createElement('div');
        chip.className = 'stack-chip';
        chip.innerHTML = `${renderTechIcon(tech, 'stack-chip-icon')}<span class="stack-chip-label">${escapeHTML(tech)}</span>`;
        chip.setAttribute('aria-label', tech);
        chip.dataset.index = String(index);
        playground.appendChild(chip);
    });

    initializeTechPlaygroundPhysics(playground);
}

function renderTechIcon(tech, extraClass = '') {
    const iconClass = getTechIconClass(tech);
    return `<i class="${iconClass}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
}

function getTechIconClass(tech) {
    const key = String(tech || '').toLowerCase().trim();

    const iconMap = {
        html: 'devicon-html5-plain colored',
        html5: 'devicon-html5-plain colored',
        css: 'devicon-css3-plain colored',
        css3: 'devicon-css3-plain colored',
        javascript: 'devicon-javascript-plain colored',
        typescript: 'devicon-typescript-plain colored',
        python: 'devicon-python-plain colored',
        pandas: 'fa-solid fa-table-columns',
        numpy: 'fa-solid fa-cubes',
        react: 'devicon-react-original colored',
        'react native': 'devicon-react-original colored',
        expo: 'fa-solid fa-mobile-screen-button',
        'next.js': 'devicon-nextjs-plain',
        'next js': 'devicon-nextjs-plain',
        next: 'devicon-nextjs-plain',
        nextjs: 'devicon-nextjs-plain',
        'nextjs.': 'devicon-nextjs-plain',
        'node.js': 'devicon-nodejs-plain colored',
        nodejs: 'devicon-nodejs-plain colored',
        node: 'devicon-nodejs-plain colored',
        fastapi: 'devicon-fastapi-plain colored',
        docker: 'devicon-docker-plain colored',
        arduino: 'devicon-arduino-plain colored',
        c: 'devicon-c-plain colored',
        'c++': 'devicon-cplusplus-plain colored',
        n8n: 'fa-solid fa-diagram-project',
        github: 'devicon-github-original',
        git: 'devicon-git-plain colored',
        godot: 'devicon-godot-plain colored',
        gdscript: 'fa-solid fa-gamepad',
        'shader work': 'fa-solid fa-wand-magic-sparkles',
        automation: 'fa-solid fa-gears',
        'api design': 'fa-solid fa-diagram-project',
        edtech: 'fa-solid fa-graduation-cap',
        'ui design': 'fa-solid fa-palette',
        backend: 'fa-solid fa-server',
        'backend apis': 'fa-solid fa-server',
        shell: 'fa-solid fa-terminal',
        cli: 'fa-solid fa-terminal',
        'rapid prototyping': 'fa-solid fa-bolt'
    };

    if (iconMap[key]) {
        return iconMap[key];
    }

    if (key.includes('sql')) {
        return 'fa-solid fa-database';
    }
    if (key.includes('shader')) {
        return 'fa-solid fa-wand-magic-sparkles';
    }
    if (key.includes('api')) {
        return 'fa-solid fa-diagram-project';
    }
    if (key.includes('next')) {
        return 'devicon-nextjs-plain';
    }

    return 'fa-solid fa-code';
}

function isShowcaseRepo(repo) {
    const hasDescription = Boolean(repo.description && repo.description.trim());
    const hasSocialProof = (repo.stargazers_count ?? 0) > 0 || (repo.forks_count ?? 0) > 0;
    const hasLiveSite = Boolean(repo.homepage && repo.homepage.trim());
    const hasSubstantialContent = (repo.size ?? 0) >= MIN_SHOWCASE_REPO_SIZE;

    return hasDescription || hasSocialProof || hasLiveSite || hasSubstantialContent;
}

function isLikelyEmptyRepo(repo) {
    const repoName = (repo.name || '').toLowerCase();
    const description = (repo.description || '').trim();
    const isPlaceholderName = ['test', 'temp', 'new', 'demo', 'sample'].some(token => repoName === token || repoName.startsWith(`${token}-`));
    const noSignals = (repo.size ?? 0) <= 1 && !description && (repo.stargazers_count ?? 0) === 0 && (repo.forks_count ?? 0) === 0;

    return isPlaceholderName || noSignals;
}

async function enrichReposWithLanguages(repositories) {
    const enriched = await Promise.all(
        repositories.map(async (repo) => {
            if (!repo.languages_url) {
                return { ...repo, languages: repo.language ? [repo.language] : [] };
            }

            try {
                const response = await fetch(repo.languages_url);
                const languages = response.ok ? Object.keys(await response.json()) : [];
                return { ...repo, languages: languages.length ? languages : (repo.language ? [repo.language] : []) };
            } catch (error) {
                return { ...repo, languages: repo.language ? [repo.language] : [] };
            }
        })
    );

    return enriched;
}

function extractTechStack(repositories, useFallback = false) {
    const scores = new Map();

    // Keep key stack items visible even when recent repos are dominated by a few languages.
    PLAYGROUND_PINNED_TECH.forEach((tech) => {
        scores.set(tech, (scores.get(tech) || 0) + 3);
    });

    repositories.forEach((repo) => {
        const importance = 1 + Math.min(4, (repo.stargazers_count ?? 0));
        const languages = [...new Set([...(repo.languages || []), repo.language].filter(Boolean))];
        const text = `${repo.name || ''} ${repo.description || ''}`.toLowerCase();

        languages.forEach((language) => {
            scores.set(language, (scores.get(language) || 0) + importance);
        });

        if (text.includes('next')) {
            scores.set('Next.js', (scores.get('Next.js') || 0) + 2);
        }
        if (text.includes('react')) {
            scores.set('React', (scores.get('React') || 0) + 2);
        }
        if (text.includes('godot') || text.includes('platformer')) {
            scores.set('Godot', (scores.get('Godot') || 0) + 2);
        }
        if (text.includes('shader')) {
            scores.set('Shader Work', (scores.get('Shader Work') || 0) + 2);
        }
        if (text.includes('automation') || text.includes('clipboard') || text.includes('rotator')) {
            scores.set('Automation', (scores.get('Automation') || 0) + 2);
        }
        if (text.includes('api') || text.includes('backend')) {
            scores.set('API Design', (scores.get('API Design') || 0) + 2);
        }
        if (text.includes('education') || text.includes('campus') || text.includes('vocab') || text.includes('science')) {
            scores.set('EdTech', (scores.get('EdTech') || 0) + 2);
        }
    });

    const sorted = [...scores.entries()]
        .sort((left, right) => right[1] - left[1])
        .map(([name]) => name);

    if (sorted.length) {
        return sorted;
    }

    if (useFallback) {
        return ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'Godot', 'GitHub'];
    }

    return [];
}

function initializeTechPlaygroundPhysics(playground) {
    const chips = Array.from(playground.querySelectorAll('.stack-chip'));
    if (!chips.length) {
        return;
    }

    const bounds = () => ({ width: playground.clientWidth, height: playground.clientHeight });
    const box = bounds();
    const padding = 14;
    const minCellWidth = 132;
    const minCellHeight = 52;
    const columns = Math.max(1, Math.floor((box.width - padding * 2) / minCellWidth));
    const rows = Math.max(1, Math.ceil(chips.length / columns));
    const cellWidth = Math.max(minCellWidth, (box.width - padding * 2) / columns);
    const cellHeight = Math.max(minCellHeight, (box.height - padding * 2) / rows);

    const states = chips.map((chip, index) => {
        const chipWidth = Math.max(82, chip.offsetWidth || 110);
        const chipHeight = Math.max(34, chip.offsetHeight || 38);
        const col = index % columns;
        const row = Math.floor(index / columns);

        const baseX = padding + col * cellWidth + (cellWidth - chipWidth) / 2;
        const baseY = padding + row * cellHeight + (cellHeight - chipHeight) / 2;
        const x = Math.max(0, Math.min(box.width - chipWidth, baseX));
        const y = Math.max(0, Math.min(box.height - chipHeight, baseY));

        const state = {
            chip,
            x,
            y,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            width: chipWidth,
            height: chipHeight,
            mass: Math.max(1, (chipWidth * chipHeight) / 4200),
            dragging: false,
            lastX: x,
            lastY: y,
            pointerX: 0,
            pointerY: 0,
            pointerSamples: [],
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: 0.003 + Math.random() * 0.004
        };

        chip.style.left = '0px';
        chip.style.top = '0px';
        chip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        chip.style.zIndex = String(20 + index);
        return state;
    });

    const drift = 0.004;
    const frictionPerFrame = 0.992;
    const bounce = 0.9;
    const collisionBounce = 0.94;
    const maxSpeed = 2.2;
    const maxThrowSpeed = 7.5;
    let animationFrame;
    let lastFrameTime = performance.now();
    let frameTick = 0;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const moveDraggedChipWithBlocking = (chipState, maxX, maxY) => {
        const targetX = Math.min(maxX, Math.max(0, chipState.pointerX - chipState.width / 2));
        const targetY = Math.min(maxY, Math.max(0, chipState.pointerY - chipState.height / 2));
        chipState.x = targetX;
        chipState.y = targetY;
    };

    const resolveChipCollisions = (iterations = 1) => {
        for (let pass = 0; pass < iterations; pass += 1) {
        for (let i = 0; i < states.length; i += 1) {
            for (let j = i + 1; j < states.length; j += 1) {
                const first = states[i];
                const second = states[j];
                const firstPinned = first.dragging;
                const secondPinned = second.dragging;

                if (firstPinned && secondPinned) {
                    continue;
                }

                const overlapX = Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x);
                const overlapY = Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y);

                if (overlapX <= 0 || overlapY <= 0) {
                    continue;
                }

                // Resolve on least-penetration axis to avoid sticky corner behavior.
                const firstCenterX = first.x + first.width / 2;
                const firstCenterY = first.y + first.height / 2;
                const secondCenterX = second.x + second.width / 2;
                const secondCenterY = second.y + second.height / 2;

                let normalX = 0;
                let normalY = 0;
                let overlap = 0;

                if (overlapX < overlapY) {
                    normalX = secondCenterX >= firstCenterX ? 1 : -1;
                    overlap = overlapX;
                } else {
                    normalY = secondCenterY >= firstCenterY ? 1 : -1;
                    overlap = overlapY;
                }

                // Dragged chips should push other chips instead of getting blocked.
                if (firstPinned && !secondPinned) {
                    second.x += normalX * overlap;
                    second.y += normalY * overlap;
                    second.vx += first.vx * 0.35;
                    second.vy += first.vy * 0.35;
                } else if (!firstPinned && secondPinned) {
                    first.x -= normalX * overlap;
                    first.y -= normalY * overlap;
                    first.vx += second.vx * 0.35;
                    first.vy += second.vy * 0.35;
                } else {
                    first.x -= normalX * (overlap * 0.5);
                    first.y -= normalY * (overlap * 0.5);
                    second.x += normalX * (overlap * 0.5);
                    second.y += normalY * (overlap * 0.5);
                }

                const relativeVelocityX = second.vx - first.vx;
                const relativeVelocityY = second.vy - first.vy;
                const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY;

                if (velocityAlongNormal > 0) {
                    continue;
                }

                const firstInverseMass = firstPinned ? 0 : (1 / first.mass);
                const secondInverseMass = secondPinned ? 0 : (1 / second.mass);
                const inverseMassSum = firstInverseMass + secondInverseMass;

                if (inverseMassSum === 0) {
                    continue;
                }

                const impulse = (-(1 + collisionBounce) * velocityAlongNormal) / inverseMassSum;
                const impulseX = impulse * normalX;
                const impulseY = impulse * normalY;

                if (!firstPinned) {
                    first.vx -= impulseX / first.mass;
                    first.vy -= impulseY / first.mass;
                }
                if (!secondPinned) {
                    second.vx += impulseX / second.mass;
                    second.vy += impulseY / second.mass;
                }
            }
        }
        }
    };

    const render = (now = performance.now()) => {
        const dtMs = Math.min(34, Math.max(8, now - lastFrameTime));
        const dtFactor = dtMs / 16.666;
        const damping = Math.pow(frictionPerFrame, dtFactor);
        lastFrameTime = now;
        frameTick += 1;
        const { width, height } = bounds();
        states.forEach((state) => {
            const maxX = Math.max(0, width - state.width);
            const maxY = Math.max(0, height - state.height);

            if (!state.dragging) {
                const waveX = Math.cos(frameTick * state.phaseSpeed + state.phase);
                const waveY = Math.sin(frameTick * state.phaseSpeed + state.phase);

                // Zero-gravity drift with tiny directional waves.
                state.vx += waveX * drift * dtFactor;
                state.vy += waveY * drift * dtFactor;
                state.vx *= damping;
                state.vy *= damping;

                state.vx = Math.max(-maxSpeed, Math.min(maxSpeed, state.vx));
                state.vy = Math.max(-maxSpeed, Math.min(maxSpeed, state.vy));

                state.x += state.vx * dtFactor;
                state.y += state.vy * dtFactor;

                if (state.x <= 0) {
                    state.x = 0;
                    state.vx *= -bounce;
                }
                if (state.x >= maxX) {
                    state.x = maxX;
                    state.vx *= -bounce;
                }
                if (state.y <= 0) {
                    state.y = 0;
                    state.vy *= -bounce;
                }
                if (state.y >= maxY) {
                    state.y = maxY;
                    state.vy *= -bounce;
                }
            } else {
                moveDraggedChipWithBlocking(state, maxX, maxY);
            }

        });

        resolveChipCollisions(3);

        states.forEach((state) => {
            const maxX = Math.max(0, width - state.width);
            const maxY = Math.max(0, height - state.height);
            state.x = clamp(state.x, 0, maxX);
            state.y = clamp(state.y, 0, maxY);
            state.vx = clamp(state.vx, -maxThrowSpeed, maxThrowSpeed);
            state.vy = clamp(state.vy, -maxThrowSpeed, maxThrowSpeed);
            state.chip.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
        });

        animationFrame = requestAnimationFrame(render);
    };

    const dragStart = (state, event) => {
        event.preventDefault();
        state.dragging = true;
        state.chip.classList.add('dragging');
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.classList.add('is-hidden');
        }
        state.lastX = state.x;
        state.lastY = state.y;
        state.pointerX = event.clientX - playground.getBoundingClientRect().left;
        state.pointerY = event.clientY - playground.getBoundingClientRect().top;
        state.pointerSamples = [{ x: state.pointerX, y: state.pointerY, t: performance.now() }];
        state.vx = 0;
        state.vy = 0;
        state.chip.setPointerCapture(event.pointerId);
        state.chip.style.zIndex = '300';
    };

    const dragMove = (state, event) => {
        if (!state.dragging) {
            return;
        }

        event.preventDefault();

        const rect = playground.getBoundingClientRect();
        state.pointerX = event.clientX - rect.left;
        state.pointerY = event.clientY - rect.top;

        const now = performance.now();
        state.pointerSamples.push({ x: state.pointerX, y: state.pointerY, t: now });
        state.pointerSamples = state.pointerSamples.filter((sample) => now - sample.t <= 140);

        const recent = state.pointerSamples[state.pointerSamples.length - 1];
        const older = state.pointerSamples.find((sample) => recent.t - sample.t >= 28) || state.pointerSamples[0];
        const elapsed = Math.max(1, recent.t - older.t);
        const pointerVelocityX = ((recent.x - older.x) / elapsed) * 16.666;
        const pointerVelocityY = ((recent.y - older.y) / elapsed) * 16.666;

        // Keep live velocity in sync with pointer so release momentum feels immediate.
        state.vx = pointerVelocityX;
        state.vy = pointerVelocityY;
        state.lastX = state.x;
        state.lastY = state.y;
    };

    const dragEnd = (state, event) => {
        if (!state.dragging) {
            return;
        }

        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.classList.remove('is-hidden');
        }

        const now = performance.now();
        state.pointerSamples = state.pointerSamples.filter((sample) => now - sample.t <= 160);

        if (state.pointerSamples.length >= 2) {
            const newest = state.pointerSamples[state.pointerSamples.length - 1];
            const oldest = state.pointerSamples[0];
            const elapsed = Math.max(1, newest.t - oldest.t);
            const releaseVX = ((newest.x - oldest.x) / elapsed) * 16.666;
            const releaseVY = ((newest.y - oldest.y) / elapsed) * 16.666;
            state.vx = state.vx * 0.35 + releaseVX * 0.65;
            state.vy = state.vy * 0.35 + releaseVY * 0.65;
        }

        state.dragging = false;
        state.chip.classList.remove('dragging');
        state.vx = clamp(state.vx, -maxThrowSpeed, maxThrowSpeed);
        state.vy = clamp(state.vy, -maxThrowSpeed, maxThrowSpeed);
        state.chip.style.zIndex = '40';
        if (state.chip.hasPointerCapture(event.pointerId)) {
            state.chip.releasePointerCapture(event.pointerId);
        }
    };

    states.forEach((state) => {
        state.chip.addEventListener('pointerdown', (event) => dragStart(state, event));
        state.chip.addEventListener('pointermove', (event) => dragMove(state, event));
        state.chip.addEventListener('pointerup', (event) => dragEnd(state, event));
        state.chip.addEventListener('pointercancel', (event) => dragEnd(state, event));
    });

    if (playground.dataset.physicsAttached === 'true') {
        cancelAnimationFrame(Number(playground.dataset.physicsId));
    }

    animationFrame = requestAnimationFrame(render);
    playground.dataset.physicsAttached = 'true';
    playground.dataset.physicsId = String(animationFrame);
}

function updateCurrentYear() {
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

function getProjectTags(project, useFallback) {
    const tags = new Set();

    if (project.language) {
        tags.add(project.language);
    }

    const combinedText = `${project.name || ''} ${project.description || ''}`.toLowerCase();
    if (combinedText.includes('godot') || combinedText.includes('platformer')) {
        tags.add('Godot');
    }
    if (combinedText.includes('science') || combinedText.includes('campus') || combinedText.includes('vocab')) {
        tags.add('Education');
    }
    if (combinedText.includes('clipboard') || combinedText.includes('rotator')) {
        tags.add('Automation');
    }
    if (combinedText.includes('landing') || combinedText.includes('portfolio')) {
        tags.add('UI');
    }
    if (combinedText.includes('backend')) {
        tags.add('Backend');
    }
    if (!tags.size && useFallback) {
        tags.add('GitHub Project');
    }

    return [...tags];
}

function formatRepoName(name = '') {
    return name
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildFallbackDescription(name = '') {
    const formattedName = formatRepoName(name);
    return `${formattedName} is one of my recent GitHub projects and reflects the kind of practical work I ship regularly.`;
}

function formatRelativeDate(dateValue) {
    if (!dateValue) {
        return 'recently';
    }

    const now = new Date();
    const updated = new Date(dateValue);
    const diffInDays = Math.max(0, Math.floor((now - updated) / (1000 * 60 * 60 * 24)));

    if (diffInDays === 0) {
        return 'today';
    }
    if (diffInDays === 1) {
        return '1 day ago';
    }
    if (diffInDays < 30) {
        return `${diffInDays} days ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) {
        return '1 month ago';
    }
    return `${diffInMonths} months ago`;
}

function escapeHTML(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.project-ticker-card, .skill-category, .stat').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

let lastScrollY = window.scrollY;

// Handle navbar state on scroll
window.addEventListener('scroll', debounce(() => {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    if (!navbar) {
        return;
    }

    const currentScrollY = window.scrollY;
    const isMenuOpen = navMenu?.classList.contains('active');

    if (currentScrollY > 24) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }

    if (!isMenuOpen && currentScrollY > lastScrollY && currentScrollY > 80) {
        navbar.classList.add('navbar-hidden');
    } else {
        navbar.classList.remove('navbar-hidden');
    }

    lastScrollY = currentScrollY;
}, 10));

// Initialize typing animation for hero section
function initTypingAnimation() {
    const texts = [
        "Full Stack Developer",
        "Game Developer",
        "Problem Solver",
        "Tech Enthusiast"
    ];

    const subtitleElement = document.querySelector('.hero-subtitle');
    if (!subtitleElement || subtitleElement.querySelector('.hover-preview-target') || subtitleElement.dataset.typingInitialized === 'true') {
        return;
    }
    subtitleElement.dataset.typingInitialized = 'true';

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeoutId = null;

    // Reset static fallback text so the animation has a clean first frame.
    subtitleElement.textContent = '';

    const schedule = (ms) => {
        if (typingTimeoutId) {
            clearTimeout(typingTimeoutId);
        }
        typingTimeoutId = setTimeout(typeText, ms);
    };

    function typeText() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            subtitleElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitleElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 36 : 62;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 1200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 280;
        } else if (!isDeleting) {
            // Slight jitter keeps the typewriter from feeling robotic.
            typeSpeed += Math.floor(Math.random() * 28);
        }

        schedule(typeSpeed);
    }

    typeText();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
});

// Add particle background effect
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    document.querySelector('.hero').appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    .nav-link.active {
        color: var(--accent-color);
        position: relative;
        text-shadow: var(--glow-red);
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-color);
        border-radius: 1px;
        box-shadow: var(--glow-red);
    }
`;
document.head.appendChild(style);

// Initialize particles on load
window.addEventListener('load', createParticles);

// Simple Custom Cursor Implementation
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop devices
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Click effect
        document.addEventListener('mousedown', (event) => {
            if (event.target && event.target.closest('.stack-chip')) {
                cursor.classList.remove('click');
                return;
            }

            cursor.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });

        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .social-link, .project-ticker-card, .stack-chip');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                if (element.classList.contains('btn-secondary')) {
                    cursor.classList.add('secondary-hover');
                }
            });

            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursor.classList.remove('secondary-hover');
            });
        });

        // Tech stack chips are created dynamically, so handle their hover state via delegation.
        document.addEventListener('mouseover', (event) => {
            if (event.target && event.target.closest('.stack-chip')) {
                cursor.classList.add('hover');
                cursor.classList.add('secondary-hover');
            }
        });

        document.addEventListener('mouseout', (event) => {
            if (!event.target || !event.target.closest('.stack-chip')) {
                return;
            }

            const movedInsideChip = event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest('.stack-chip');
            if (movedInsideChip) {
                return;
            }

            cursor.classList.remove('hover');
            cursor.classList.remove('secondary-hover');
        });
    }
});