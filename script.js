
// ==================== HERO CANVAS ANIMATION ====================
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null };

// Resize canvas to fill container
function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
}

window.addEventListener('resize', resizeCanvas);

// Mouse interaction tracking
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5; // Small points
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Mouse Parallax Effect
        if (mouse.x != null) {
            const dx = mouse.x - canvas.width / 2;
            const dy = mouse.y - canvas.height / 2;

            // Subtle movement opposite to mouse
            this.x -= dx * 0.00005;
            this.y -= dy * 0.00005;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = 60; // Minimal density
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines for "Generative" feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby particles
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

// Initialize Canvas
if (canvas) {
    resizeCanvas();
    initParticles();
    animateParticles();
}

// ==================== TAB SWITCHING ====================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Tab button click handlers (Re-added)
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        switchTab(tabName);
    });
});


// ==================== FADE IN ANIMATIONS ====================
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

// Observe all cards when tab becomes active
function observeElements() {
    const elementsToAnimate = document.querySelectorAll('.tab-content.active .glass-card, .tab-content.active .section-title, .hero-cta-buttons');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Initial observation
document.addEventListener('DOMContentLoaded', observeElements);

// ==================== ENHANCED HOVER EFFECTS ====================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c✨ Elif Buse Çınar Portfolio ✨', 'color: #F28695; font-size: 20px; font-weight: bold;');
console.log('%cDesigned with love and creativity 💖', 'color: #F2BFB4; font-size: 14px;');

// ==================== PROJECT SCROLL INDICATOR ====================
// Run finding elements after DOM is fully loaded + when switching tabs
function initProjectObserver() {
    const projectSections = document.querySelectorAll('.project-section');
    const projectLabel = document.querySelector('.current-project-label');
    const projectsContainer = document.querySelector('.projects-scroll-container');

    if (projectSections.length > 0 && projectLabel && projectsContainer) {

        const observerOptions = {
            root: projectsContainer,
            threshold: 0.5 // Trigger when 50% of the project is visible
        };

        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const title = entry.target.getAttribute('data-title');
                    // Fade out
                    projectLabel.style.opacity = '0';

                    setTimeout(() => {
                        projectLabel.textContent = title;
                        // Fade in
                        projectLabel.style.opacity = '1';
                    }, 300);
                }
            });
        }, observerOptions);

        projectSections.forEach(section => {
            projectObserver.observe(section);
        });
    }
}

// Re-init when switching to projects tab
window.switchTab = function (tabName) {
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(tabName);

    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    // Re-observe elements for animation
    setTimeout(observeElements, 100);

    // Init project observer if on projects tab
    if (tabName === 'projects') {
        setTimeout(initProjectObserver, 200);
    }
}

// Initial check
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    initProjectObserver();
    initLightbox();
    initGalleryNav();
});

// ==================== GALLERY NAVIGATION ====================
function initGalleryNav() {
    const wrappers = document.querySelectorAll('.project-gallery-wrapper');

    wrappers.forEach(wrapper => {
        const media = wrapper.querySelector('.project-media');
        const prevBtn = wrapper.querySelector('.gallery-nav.prev');
        const nextBtn = wrapper.querySelector('.gallery-nav.next');

        if (!media || !prevBtn || !nextBtn) return;

        prevBtn.addEventListener('click', () => {
            media.scrollBy({
                left: -media.clientWidth,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            media.scrollBy({
                left: media.clientWidth,
                behavior: 'smooth'
            });
        });
    });
}


// ==================== LIGHTBOX LOGIC ====================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            lightbox.classList.add('active');
            lightboxImg.src = this.src;
            lightboxCaption.textContent = this.alt;
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

