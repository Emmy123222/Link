// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // ========== LOADING ANIMATION ==========
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Simulate loading (replace with actual loading logic if needed)
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.opacity = '1';
            
            // Initialize animations after loading
            initAnimations();
            initScrollEffects();
        }, 500);
    }, 1500);

    // ========== DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const themeIconLight = document.getElementById('theme-icon-light');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcons(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark ? 'dark' : 'light');
    });
    
    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            themeIconDark.classList.remove('hidden');
            themeIconLight.classList.add('hidden');
        } else {
            themeIconDark.classList.add('hidden');
            themeIconLight.classList.remove('hidden');
        }
    }

    // ========== ANIMATIONS INITIALIZATION ==========
    function initAnimations() {
        // Hero section typing effect
        const heroText = "modern teams";
        const heroGradient = document.querySelector('.text-gradient');
        if (heroGradient) {
            heroGradient.textContent = '';
            let i = 0;
            const typingInterval = setInterval(() => {
                heroGradient.textContent += heroText[i];
                i++;
                if (i === heroText.length) {
                    clearInterval(typingInterval);
                    // Add cursor blink animation after typing
                    heroGradient.classList.add('after:content-[""]', 'after:ml-1', 'after:animate-blink', 
                                             'after:border-r-2', 'after:border-primary-500');
                }
            }, 100);
        }

        // Floating blob animations
        const blobs = document.querySelectorAll('[class*="animate-blob"]');
        blobs.forEach((blob, index) => {
            // Randomize animation delay and duration slightly for natural feel
            const delay = index * 2000 + Math.random() * 1000;
            const duration = 6000 + Math.random() * 3000;
            blob.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite`;
        });
    }

    // ========== SCROLL EFFECTS ==========
    function initScrollEffects() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const slideUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    slideUpObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply observers to elements
        document.querySelectorAll('.hero-section h1, .hero-section p, .hero-section a').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.6s ease-out ${i * 0.1}s`;
            slideUpObserver.observe(el);
        });

        document.querySelectorAll('.features-section .relative').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.5s ease-out ${i * 0.1 + 0.3}s`;
            slideUpObserver.observe(el);
        });

        document.querySelectorAll('.logo-cloud img').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.9)';
            el.style.transition = `all 0.4s ease-out ${i * 0.1}s`;
            fadeObserver.observe(el);
        });

        // CTA section parallax effect
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
            window.addEventListener('scroll', () => {
                const scrollPosition = window.scrollY;
                ctaSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            });
        }
    }

    // ========== INTERACTIVE ELEMENTS ==========
    // Navigation smooth scroll
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hover effects for buttons
    const primaryButtons = document.querySelectorAll('.bg-primary-500');
    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 10px 15px -3px rgba(14, 165, 233, 0.3)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    });

    // ========== PERFORMANCE OPTIMIZATIONS ==========
    // Debounce scroll events
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            // Code that runs after scrolling stops
        }, 100);
    }, false);

    // Lazy load images (if you add more images later)
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

// ========== ADDITIONAL UTILITIES ==========
// Add a class to html element when user starts scrolling
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        document.documentElement.classList.add('scrolled');
    } else {
        document.documentElement.classList.remove('scrolled');
    }
});

// Add this to your CSS (or Tailwind config):
// html.scrolled nav { @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm; }