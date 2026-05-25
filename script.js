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

    // Auto-hide after 4 seconds
    preloaderTimeout = setTimeout(hidePreloader, 4000);

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

// Active nav link, navbar styling, and 3D shapes parallax on scroll (Unified & requestAnimationFrame optimized)
const navbar = document.getElementById('navbar');
const shapes = document.querySelectorAll('.floating-shape');
let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;

            // 1. Navbar scrolled state
            if (scrolled > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // 2. Parallax shapes CSS variables update
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.15;
                const yOffset = scrolled * speed;
                shape.style.setProperty('--parallax-y', `${-yOffset}px`);
            });

            // 3. Scroll spy active section selection
            let current = '';
            const sections = document.querySelectorAll('section');

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrolled >= (sectionTop - 220)) {
                    current = section.getAttribute('id');
                }
            });

            if (current === 'profile-summary') {
                current = 'home';
            } else if (current === 'education') {
                current = 'experience';
            }

            // 4. Update desktop & mobile nav link active classes
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });

            mobileLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });

            scrollTicking = false;
        });
        scrollTicking = true;
    }
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

// Project Slider Functionality
const initProjectSliders = () => {
    const sliders = document.querySelectorAll('.project-slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev-slide');
        const nextBtn = slider.querySelector('.next-slide');
        const dots = slider.querySelectorAll('.slider-dot');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        if (totalSlides === 0) return;
        
        const updateSlider = (index) => {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            slides.forEach((slide, i) => {
                if (i === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateSlider(currentIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateSlider(currentIndex + 1);
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(dot.getAttribute('data-index'), 10);
                updateSlider(index);
            });
        });
    });
};

// Start typing animation and slider when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
    initProjectSliders();
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
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('active');
            }, delay);
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

// Magnetic Elements Effect (Optimized with instant translation & smooth snap back)
const magneticElements = document.querySelectorAll('.btn-modern, .social-icon-modern, .social-btn, .btn-primary, .nav-link');

magneticElements.forEach(item => {
    item.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transition = 'none'; // Instant follow
        this.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
    });

    item.addEventListener('mouseleave', function (e) {
        this.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; // Smooth spring-back
        this.style.transform = 'translate3d(0px, 0px, 0)';
    });
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;
let isCursorInitial = false;

window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;

    if (!isCursorInitial) {
        cursorDot.classList.add('visible');
        cursorOutline.classList.add('visible');
        isCursorInitial = true;
    }
});

function animateCursor() {
    const easing = 0.15;
    outlineX += (cursorX - outlineX) * easing;
    outlineY += (cursorY - outlineY) * easing;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hide custom cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('visible');
    cursorOutline.classList.remove('visible');
});

document.addEventListener('mouseenter', () => {
    if (isCursorInitial) {
        cursorDot.classList.add('visible');
        cursorOutline.classList.add('visible');
    }
});

// Cursor Hover States
const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-btn, .experience-card, .stat-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
});


