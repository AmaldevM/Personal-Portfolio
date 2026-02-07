// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const mainContent = document.querySelector('.main-content');
    let preloaderTimeout;

    const hidePreloader = () => {
        if (preloader.classList.contains('fade-out')) return;

        clearTimeout(preloaderTimeout);
        preloader.classList.add('fade-out');

        // Start main content reveal slightly after preloader starts fading
        setTimeout(() => {
            mainContent.classList.add('reveal');
        }, 100);

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    };

    // Auto-hide after 5 seconds
    preloaderTimeout = setTimeout(hidePreloader, 5000);

    // Dismiss on click
    preloader.addEventListener('click', hidePreloader);
});

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');

const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
};

mobileMenuBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const titles = [
    'Full Stack Developer',
    'Angular Developer',
    'React Developer',
    'Spring Boot Developer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});

// Form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Create mailto link
    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:amaldevm.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    // Reset form
    contactForm.reset();
});

// Enhanced Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add a small delay for staggered effect if requested
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('active');
            }, delay);
            // Once revealed, no need to observe again
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

// Select all elements to reveal
document.querySelectorAll('.reveal').forEach((el, index) => {
    revealObserver.observe(el);
});

// Smooth scroll for anchor links
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

// Navbar background on scroll
const navbar = document.getElementById('navbar');
// Parallax Effect for 3D Shapes
const shapes = document.querySelectorAll('.floating-shape');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    shapes.forEach((shape, index) => {
        // Different speeds for different shapes
        const speed = (index + 1) * 0.1;
        const yOffset = scrolled * speed;
        // Combine the existing drift animation with the parallax offset
        shape.style.top = `${(index * 20 + 15) - (yOffset / 10)}%`;
    });

    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// Magnetic Elements Effect
const magneticElements = document.querySelectorAll('.btn-modern, .social-icon-modern, .social-btn, .btn-primary, .nav-link, .project-card');

magneticElements.forEach(item => {
    item.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    item.addEventListener('mouseleave', function (e) {
        this.style.transform = `translate(0px, 0px)`;
    });
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;

window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
});

function animateCursor() {
    // Smooth easing for the outline
    const easing = 0.15;
    outlineX += (cursorX - outlineX) * easing;
    outlineY += (cursorY - outlineY) * easing;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor Hover States
const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-btn, .experience-card, .stat-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
});


