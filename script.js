// Preloader with minimum display time
const preloader = document.querySelector('.preloader');
const mainContent = document.querySelector('.main-content');
const minLoadingTime = 4000; // Show preloader for at least 4 seconds
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

// Fallback auto-hide after 8 seconds if load event hangs
preloaderTimeout = setTimeout(() => hidePreloader(false), 8000);

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
    smoothTouch: false
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

    // 2. Parallax shapes CSS variables update (flat background shapes)
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
});

// Mora-Style Typography Split & 3D Card Animation Hookup
const profileSection = document.getElementById('profile-summary');
const splitPartLeft = document.querySelector('.part-left');
const splitPartRight = document.querySelector('.part-right');
const cardPerspective = document.querySelector('.mora-card-perspective');
const profileCard = document.querySelector('.mora-profile-card');

let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
const lerpFactor = 0.08;

if (cardPerspective && profileCard) {
    cardPerspective.addEventListener('mousemove', (e) => {
        const rect = cardPerspective.getBoundingClientRect();
        // Calculate pointer coordinates relative to card center (range -1 to 1)
        const xVal = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const yVal = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        const maxTilt = 12; // Maximum tilt angle in degrees
        targetRotX = -yVal * maxTilt;
        targetRotY = xVal * maxTilt;
    });

    cardPerspective.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
    });
}

// Unified requestAnimationFrame loop for Lenis and Mora-style scroll/tilt effects
function animate(time) {
    lenis.raf(time);

    const scrolled = lenis.scroll || window.scrollY;
    const viewportHeight = window.innerHeight;

    // 1. Text-Splitting Scroll Parallax
    if (profileSection) {
        const sectionTop = profileSection.offsetTop;
        const sectionHeight = profileSection.offsetHeight;

        if (scrolled + viewportHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
            // Relative scroll offset starting when the section enters the screen
            const relativeScroll = scrolled + viewportHeight - sectionTop;
            const splitAmount = relativeScroll * 0.35; // Adjust split speed

            if (splitPartLeft && splitPartRight) {
                splitPartLeft.style.transform = `translateX(-${splitAmount}px) translateZ(0)`;
                splitPartRight.style.transform = `translateX(${splitAmount}px) translateZ(0)`;
            }

            // Slow vertical drift for the card wrapper
            if (cardPerspective) {
                const cardParallax = (scrolled - sectionTop) * -0.15;
                cardPerspective.style.transform = `translateY(${cardParallax}px)`;
            }
        }
    }

    // 2. Smooth LERP interpolation for 3D card tilt
    if (profileCard) {
        currentRotX += (targetRotX - currentRotX) * lerpFactor;
        currentRotY += (targetRotY - currentRotY) * lerpFactor;
        profileCard.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Typing animation with dynamic colors & neon glow
const typingText = document.querySelector('.typing-text');
const titles = [
    { text: 'Engineer', color: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
    { text: 'Creator', color: '#ff6b00', glow: 'rgba(255, 107, 0, 0.4)' },
    { text: 'Developer', color: '#b55fe6', glow: 'rgba(181, 95, 230, 0.4)' },
    { text: 'Architect', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' }
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

// Highlights Carousel Functionality
const initHighlightsSliders = () => {
    const carousels = document.querySelectorAll('.highlight-carousel');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.highlight-slide');
        const prevBtn = carousel.querySelector('.carousel-nav.prev');
        const nextBtn = carousel.querySelector('.carousel-nav.next');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        if (totalSlides <= 1) return;
        
        let autoSlideInterval;
        
        const updateCarousel = (index) => {
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
                updateCarousel(currentIndex + 1);
            }, 4500);
        };
        
        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        };
        
        // Start auto slide initially
        startAutoSlide();
        
        // Pause auto slide on hover
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateCarousel(currentIndex - 1);
                startAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateCarousel(currentIndex + 1);
                startAutoSlide();
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(dot.getAttribute('data-index'), 10);
                updateCarousel(index);
                startAutoSlide();
            });
        });
        
        // Add swipe support for mobile devices
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = false;
            stopAutoSlide();
        }, { passive: true });
        
        carousel.addEventListener('touchmove', () => {
            isSwiping = true;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (isSwiping) {
                handleSwipe();
            }
            startAutoSlide();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                updateCarousel(currentIndex + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                updateCarousel(currentIndex - 1);
            }
        };
    });
};

// Start typing animation and slider when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
    initProjectSliders();
    initHighlightsSliders();
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

// SFX Audio System (Custom Audio Files)
let isMuted = false; // Always default to unmuted (sound ON) when visiting the website

// Load custom audio files
const clickAudio = new Audio('assets/audio/touch.mp3');
const hoverAudio = new Audio('assets/audio/hower.mp3');
const heroAudio = new Audio('assets/audio/heartbeat.wav');
heroAudio.loop = true;
heroAudio.volume = 0;

const playHoverSound = () => {
    if (isMuted) return;
    try {
        const sound = hoverAudio.cloneNode();
        sound.volume = 0.35; // Subtle and clean
        sound.play();
    } catch (e) {}
};

const playClickSound = () => {
    if (isMuted) return;
    try {
        const sound = clickAudio.cloneNode();
        sound.volume = 0.55; // Balanced click volume
        sound.play();
    } catch (e) {}
};

// Hero Heartbeat Hover Logic (fade-in & fade-out)
let fadeInterval = null;
const fadeHeroAudio = (targetVolume, duration = 400, onComplete = null) => {
    if (fadeInterval) clearInterval(fadeInterval);
    
    const startVolume = heroAudio.volume;
    const steps = 15;
    const volumeStep = (targetVolume - startVolume) / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    fadeInterval = setInterval(() => {
        currentStep++;
        heroAudio.volume = Math.max(0, Math.min(1, startVolume + (volumeStep * currentStep)));
        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            heroAudio.volume = targetVolume;
            if (onComplete) onComplete();
        }
    }, stepDuration);
};

const startHeroAudio = () => {
    if (isMuted) return;
    try {
        heroAudio.play().then(() => {
            fadeHeroAudio(0.4, 400); // smooth fade-in to 40% volume
        }).catch(err => {});
    } catch (e) {}
};

const stopHeroAudio = () => {
    fadeHeroAudio(0, 300, () => {
        heroAudio.pause();
    });
};

// Hook up Hero Hover listeners
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            startHeroAudio();
        });
        heroSection.addEventListener('mouseleave', () => {
            stopHeroAudio();
        });
    }
});

// Cursor Hover States & SFX Triggering
const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-btn, .experience-card, .stat-card, .carousel-dot, .tech-badge, .cert-card, .experience-link, .btn-cert, .sound-toggle');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovering');
        // Do not play hover tick when hovering inside the hero section to keep heartbeat clean
        const isInsideHero = el.closest('#home');
        if (!isInsideHero) {
            playHoverSound();
        }
    });
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
});

// Global Click SFX Listener
window.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .project-card, .social-btn, .experience-card, .stat-card, .carousel-dot, .tech-badge, .cert-card, .experience-link, .btn-cert, .sound-toggle')) {
        playClickSound();
    }
});

// Sound Toggle Button Logic
document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        if (isMuted) {
            soundToggle.classList.add('muted');
        }
        
        soundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            isMuted = !isMuted;
            localStorage.setItem('sfx_muted', isMuted);
            
            if (isMuted) {
                soundToggle.classList.add('muted');
                stopHeroAudio();
            } else {
                soundToggle.classList.remove('muted');
                playClickSound();
                // If currently hovering hero section, start heartbeat immediately
                const heroSection = document.getElementById('home');
                if (heroSection && heroSection.matches(':hover')) {
                    startHeroAudio();
                }
            }
        });
    }
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


