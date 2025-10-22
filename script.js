// Projects data based on your GitHub repositories
const projects = [
    {
        title: "GNDU Attendance System",
        description: "A comprehensive attendance management system for educational institutions with modern web technologies.",
        tech: ["JavaScript", "Web Development", "Education"],
        stars: 2,
        forks: 1,
        githubUrl: "https://github.com/KingSahil/GNDU-Attendance-System",
        featured: true
    },
    {
        title: "The Science Lab",
        description: "An interactive virtual science laboratory built with Godot Engine for educational purposes.",
        tech: ["GDScript", "Godot", "Education", "Game Development"],
        stars: 2,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/the-science-lab",
        featured: true
    },
    {
        title: "Godot 4.4 Liquid Shader",
        description: "Advanced liquid shader effects for Godot Engine 4.4, showcasing realistic fluid simulations.",
        tech: ["GDShader", "Godot", "Graphics", "Shader Programming"],
        stars: 2,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/Godot-4.4-Liquid-Shader",
        featured: true
    },
    {
        title: "Automated Attendance System for Rural School",
        description: "Attendance management solution specifically designed for rural educational institutions.",
        tech: ["JavaScript", "Education", "Rural Development"],
        stars: 1,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/Automated-Attendance-System-for-Rural-School",
        featured: true
    },
    {
        title: "GNDU Attendance System (Next.js)",
        description: "Modern remake of the attendance system using Next.js and TypeScript for better performance.",
        tech: ["TypeScript", "Next.js", "React", "Web Development"],
        stars: 1,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/GNDU-Attendance-System-Nextjs",
        featured: true
    },
    {
        title: "Gamified Education Platform",
        description: "An innovative platform that combines gaming elements with educational content to enhance learning.",
        tech: ["HTML", "CSS", "JavaScript", "Education", "Gamification"],
        stars: 1,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/gamified-education",
        featured: true
    },
    {
        title: "WhatsApp Clipboard Image Rotator",
        description: "A Python utility tool for rotating clipboard images before pasting them into WhatsApp.",
        tech: ["Python", "Automation", "Utility"],
        stars: 1,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/whatsapp-clipboard-image-rotator",
        featured: false
    },
    {
        title: "Medicine Reminder App",
        description: "A TypeScript-based mobile application to help users manage and remember their medication schedules.",
        tech: ["TypeScript", "Mobile Development", "Healthcare"],
        stars: 0,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/Medicine-Reminder-App",
        featured: false
    },
    {
        title: "Virtual Science Lab",
        description: "A comprehensive virtual laboratory simulation for science education and experimentation.",
        tech: ["Game Development", "Education", "Science"],
        stars: 1,
        forks: 0,
        githubUrl: "https://github.com/KingSahil/Virtual-Science-Lab",
        featured: false
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadProjects();
    setupContactForm();
    setupScrollAnimations();
    setupSmoothScrolling();
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

// Load and display projects
function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const featuredProjects = projects.filter(project => project.featured);

    projectsContainer.innerHTML = featuredProjects.map(project => createProjectCard(project)).join('');
}

function createProjectCard(project) {
    return `
        <div class="project-card fade-in">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="project-footer">
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${project.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                </div>
                <div class="project-links">
                    <a href="${project.githubUrl}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simulate form submission
        showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

function showFormMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' ?
            'background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' :
            'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
        }
    `;

    // Insert message
    const contactForm = document.getElementById('contact-form');
    contactForm.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
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
    document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
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

// Handle navbar background on scroll
window.addEventListener('scroll', debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 25, 47, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 25, 47, 0.9)';
    }
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
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            subtitleElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitleElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    // Start typing animation after a delay
    setTimeout(typeText, 1000);
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTypingAnimation, 2000);
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