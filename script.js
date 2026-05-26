// Preloader with minimum display time
const preloader = document.querySelector('.preloader');
const mainContent = document.querySelector('.main-content');
const minLoadingTime = 2200; // Show preloader for at least 2.2 seconds
const startTime = Date.now();
let preloaderTimeout;

const hidePreloader = (force = false) => {
    if (!preloader || preloader.classList.contains('fade-out')) return;

    const elapsedTime = Date.now() - startTime;
    const remainingTime = force ? 0 : Math.max(0, minLoadingTime - elapsedTime);

    setTimeout(() => {
        preloader.classList.add('fade-out');

        // Start main content reveal slightly after preloader starts fading
        setTimeout(() => {
            if (mainContent) mainContent.classList.add('reveal');
        }, 100);

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, remainingTime);
};

// Dismiss when page is fully loaded (respecting min display time)
window.addEventListener('load', () => hidePreloader(false));

// Fallback auto-hide after 5 seconds if load event hangs
preloaderTimeout = setTimeout(() => hidePreloader(false), 5000);

// Dismiss immediately on click (if user wants to skip)
if (preloader) {
    preloader.addEventListener('click', () => hidePreloader(true));
}

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');

const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined') lenis.stop();
    } else {
        document.body.style.overflow = '';
        if (typeof lenis !== 'undefined') lenis.start();
    }
};

mobileMenuBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        if (typeof lenis !== 'undefined') lenis.start();
    });
});

// Active nav link, navbar styling, and 3D shapes parallax on scroll (Unified & requestAnimationFrame optimized)
const navbar = document.getElementById('navbar');
const shapes = document.querySelectorAll('.floating-shape');

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false // Native scroll on touch devices
});

// Update Lenis scroll callback
lenis.on('scroll', (e) => {
    const scrolled = e.scroll;

    // 1. Navbar scrolled state
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 2. Scroll spy active section selection
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

    // 3. Update desktop & mobile nav link active classes
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
});

// 3D Background Shapes Animation Setup
const shapeStates = Array.from(shapes).map((el, index) => ({
    element: el,
    index: index,
    x: 0,
    y: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    lerp: 0.08
}));

let globalMouseX = window.innerWidth / 2;
let globalMouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
});

// Primary requestAnimationFrame Loop (Drives Lenis and 3D floating shapes)
function animate(time) {
    lenis.raf(time);

    const elapsed = time * 0.001 || Date.now() * 0.001;
    const scrolled = lenis.scroll || window.scrollY;

    shapeStates.forEach((state) => {
        // Parallax speed modifier based on shape index
        const scrollYFactor = state.index === 0 ? -0.22 : state.index === 1 ? -0.38 : -0.15;
        const scrollTranslateY = scrolled * scrollYFactor;

        // Idle floating oscillation
        const driftX = Math.sin(elapsed + state.index * 3.5) * 20;
        const driftY = Math.cos(elapsed * 0.9 + state.index * 2.5) * 20;
        const driftRotZ = elapsed * (state.index === 1 ? -4 : 6) * 1.5;

        // Proximity mouse calculations
        let mouseTiltX = 0;
        let mouseTiltY = 0;
        let mousePullX = 0;
        let mousePullY = 0;

        const rect = state.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = globalMouseX - centerX;
        const dy = globalMouseY - centerY;
        const dist = Math.hypot(dx, dy);
        const maxDist = 550; // Proximity tracking zone

        if (dist < maxDist) {
            const factor = (maxDist - dist) / maxDist; // 0 to 1
            const smoothFactor = Math.sin(factor * Math.PI / 2); // sine ease-out
            mouseTiltX = -(dy / maxDist) * 38 * smoothFactor;
            mouseTiltY = (dx / maxDist) * 38 * smoothFactor;
            mousePullX = (dx / maxDist) * 55 * smoothFactor;
            mousePullY = (dy / maxDist) * 55 * smoothFactor;
        }

        // Scroll-induced 3D rotation
        const scrollRotX = scrolled * (state.index === 0 ? 0.04 : state.index === 1 ? -0.02 : 0.06);
        const scrollRotY = scrolled * (state.index === 0 ? -0.03 : state.index === 1 ? 0.05 : -0.04);

        // Combined targets
        const targetX = driftX + mousePullX;
        const targetY = scrollTranslateY + driftY + mousePullY;
        const targetRotX = scrollRotX + mouseTiltX;
        const targetRotY = scrollRotY + mouseTiltY;
        const targetRotZ = driftRotZ;

        // Interpolation
        state.x += (targetX - state.x) * state.lerp;
        state.y += (targetY - state.y) * state.lerp;
        state.rotX += (targetRotX - state.rotX) * state.lerp;
        state.rotY += (targetRotY - state.rotY) * state.lerp;
        state.rotZ += (targetRotZ - state.rotZ) * state.lerp;

        // Apply transforms
        state.element.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg) rotateZ(${state.rotZ}deg)`;
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Typing animation with dynamic colors & neon glow
const typingText = document.querySelector('.typing-text');
const titles = [
    { text: 'Software Engineer', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
    { text: 'Digital Creator', color: '#ff6b00', glow: 'rgba(255, 107, 0, 0.4)' },
    { text: 'Full Stack Developer', color: '#b55fe6', glow: 'rgba(181, 95, 230, 0.4)' },
    { text: 'System Architect', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' }
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentTitle = titles[titleIndex];
    const textToShow = currentTitle.text;

    // Apply role-specific theme colors
    if (typingText) {
        typingText.style.color = currentTitle.color;
        typingText.style.textShadow = `0 0 10px ${currentTitle.glow}, 0 0 20px ${currentTitle.glow}`;
    }

    if (isDeleting) {
        typingText.textContent = textToShow.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = textToShow.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === textToShow.length) {
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
        
        let autoSlideInterval;
        
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
        
        const startAutoSlide = () => {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                updateSlider(currentIndex + 1);
            }, 3000); // Autoplay every 3 seconds
        };
        
        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        };
        
        // Start auto slide
        startAutoSlide();
        
        // Pause auto slide on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateSlider(currentIndex - 1);
                startAutoSlide(); // Reset timer
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateSlider(currentIndex + 1);
                startAutoSlide(); // Reset timer
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(dot.getAttribute('data-index'), 10);
                updateSlider(index);
                startAutoSlide(); // Reset timer
            });
        });
        
        // Add swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = false;
            stopAutoSlide();
        }, { passive: true });
        
        slider.addEventListener('touchmove', () => {
            isSwiping = true;
        }, { passive: true });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (isSwiping) {
                handleSwipe();
            }
            startAutoSlide();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe Left -> Next Slide
                updateSlider(currentIndex + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe Right -> Prev Slide
                updateSlider(currentIndex - 1);
            }
        };
        
        // Prevent link click if a swipe gesture just occurred
        const overlay = slider.querySelector('.project-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (isSwiping) {
                    e.preventDefault();
                    e.stopPropagation();
                    isSwiping = false;
                }
            });
        }
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
            lenis.scrollTo(target, {
                offset: 0,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// Magnetic Elements Effect (Optimized with instant translation & smooth snap back)
const magneticElements = document.querySelectorAll('.btn-modern, .social-icon-modern, .social-btn, .btn-primary, .nav-link, .nav-logo, .btn-primary-modern, .magnetic-btn');

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

// Interactive Spotlight Grid Background Tracker
const spotlightGrids = document.querySelectorAll('.spotlight-grid');
spotlightGrids.forEach(grid => {
    grid.addEventListener('mousemove', (e) => {
        const rect = grid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        grid.style.setProperty('--mouse-x', `${x}px`);
        grid.style.setProperty('--mouse-y', `${y}px`);
    });
});


// Glowing Experience Timeline Connector Progress
const timeline = document.querySelector('.timeline');
const timelineProgress = document.querySelector('.timeline-progress');
const timelineDots = document.querySelectorAll('.timeline-dot');

if (timeline && timelineProgress) {
    const updateTimelineProgress = () => {
        const rect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // 70% of viewport triggers start of scroll progress
        const startThreshold = viewportHeight * 0.7;
        const totalPath = rect.height;
        const currentProgressPos = startThreshold - rect.top;
        
        let progressPercent = 0;
        if (currentProgressPos > 0) {
            progressPercent = Math.min((currentProgressPos / totalPath) * 100, 100);
        }
        
        timelineProgress.style.height = `${progressPercent}%`;
        
        // Highlight dot items as progress bar reaches their heights
        timelineDots.forEach(dot => {
            const dotRect = dot.getBoundingClientRect();
            const dotPosRelativeToTimeline = dotRect.top - rect.top;
            
            if (currentProgressPos >= dotPosRelativeToTimeline) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateTimelineProgress);
    window.addEventListener('resize', updateTimelineProgress);
    // Initial call in case experience is already visible on page load
    updateTimelineProgress();
}

// 3D Parallax Tilt Card Effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        // Calculate pointer coordinates relative to card center (range -1 to 1)
        const xVal = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const yVal = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        // Define maximum tilt angle in degrees
        const maxTilt = 6;
        
        // Calculate tilt rotation
        const rotateX = -yVal * maxTilt;
        const rotateY = xVal * maxTilt;
        
        // Apply 3D rotation and scale card slightly
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Shift inner image container slightly opposite for parallax depth
        const img = card.querySelector('.project-image');
        if (img) {
            img.style.transform = `translate3d(${-xVal * 6}px, ${-yVal * 6}px, 20px) scale(1.05)`;
        }
    });

    card.addEventListener('mouseenter', () => {
        card.classList.add('hovering');
        const img = card.querySelector('.project-image');
        if (img) img.classList.add('hovering');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('hovering');
        // Reset rotation and scale smoothly
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        
        const img = card.querySelector('.project-image');
        if (img) {
            img.classList.remove('hovering');
            img.style.transform = 'translate3d(0px, 0px, 20px) scale(1)';
        }
    });
});


