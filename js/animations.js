/**
 * Photography+ Animations
 * Handles advanced animations and effects
 */

class AnimationManager {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.animationFrame = null;
        this.animations = new Map();
        this.init();
    }

    init() {
        if (this.isReducedMotion) return;
        
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupTextAnimations();
        this.setupParticleEffects();
        this.setupWaveAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .portfolio-item, .testimonial-item, .stat-card, .timeline-item'
        );

        elementsToAnimate.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay) || 0;
        const duration = parseInt(element.dataset.duration) || 600;

        setTimeout(() => {
            element.style.animation = `${animationType} ${duration}ms ease-out forwards`;
            element.classList.add('animated');
        }, delay);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrolled = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', this.throttle(handleParallax, 16));
    }

    setupTextAnimations() {
        const textElements = document.querySelectorAll('.hero-title, .section-title');
        
        textElements.forEach(element => {
            this.splitText(element);
        });
    }

    splitText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.textContent = word + ' ';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.opacity = '0';
            wordSpan.style.transform = 'translateY(20px)';
            wordSpan.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            wordSpan.style.transitionDelay = `${index * 100}ms`;
            
            element.appendChild(wordSpan);
        });

        // Animate words on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach((word, index) => {
                        setTimeout(() => {
                            word.style.opacity = '1';
                            word.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        });

        observer.observe(element);
    }

    setupParticleEffects() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.position = 'fixed';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '1';
        
        document.body.appendChild(particleContainer);

        // Create floating particles
        this.createFloatingParticles(particleContainer);
    }

    createFloatingParticles(container) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'var(--accent-color)';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '0.6';
            
            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            container.appendChild(particle);
            
            // Animate particle
            this.animateParticle(particle);
        }
    }

    animateParticle(particle) {
        const animate = () => {
            const duration = 10000 + Math.random() * 20000;
            const startTime = Date.now();
            
            const moveParticle = () => {
                const elapsed = Date.now() - startTime;
                const progress = (elapsed % duration) / duration;
                
                // Floating motion
                const x = Math.sin(progress * Math.PI * 2) * 50;
                const y = Math.cos(progress * Math.PI * 2) * 30;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = (Math.sin(progress * Math.PI * 2) + 1) * 0.3;
                
                if (elapsed < duration) {
                    requestAnimationFrame(moveParticle);
                } else {
                    animate();
                }
            };
            
            moveParticle();
        };
        
        animate();
    }

    setupWaveAnimations() {
        const waveElements = document.querySelectorAll('[data-wave]');
        
        waveElements.forEach(element => {
            this.createWaveEffect(element);
        });
    }

    createWaveEffect(element) {
        const waveCount = 3;
        const waves = [];
        
        for (let i = 0; i < waveCount; i++) {
            const wave = document.createElement('div');
            wave.className = 'wave';
            wave.style.position = 'absolute';
            wave.style.width = '100%';
            wave.style.height = '100%';
            wave.style.background = `rgba(212, 175, 55, ${0.1 - i * 0.03})`;
            wave.style.transform = 'scale(0)';
            wave.style.borderRadius = '50%';
            wave.style.transition = 'transform 1.5s ease-out';
            
            element.appendChild(wave);
            waves.push(wave);
        }

        // Animate waves on hover
        element.addEventListener('mouseenter', () => {
            waves.forEach((wave, index) => {
                setTimeout(() => {
                    wave.style.transform = 'scale(1)';
                }, index * 200);
            });
        });

        element.addEventListener('mouseleave', () => {
            waves.forEach(wave => {
                wave.style.transform = 'scale(0)';
            });
        });
    }

    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
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

    // Camera shutter animation
    createShutterEffect(element) {
        const shutter = document.createElement('div');
        shutter.className = 'shutter-overlay';
        shutter.style.position = 'absolute';
        shutter.style.top = '0';
        shutter.style.left = '0';
        shutter.style.width = '100%';
        shutter.style.height = '100%';
        shutter.style.background = 'var(--darkroom-black)';
        shutter.style.transform = 'scaleY(0)';
        shutter.style.transformOrigin = 'top';
        shutter.style.transition = 'transform 0.3s ease';
        shutter.style.zIndex = '1000';

        element.appendChild(shutter);

        return {
            open: () => {
                shutter.style.transform = 'scaleY(0)';
            },
            close: () => {
                shutter.style.transform = 'scaleY(1)';
            }
        };
    }

    // Aperture animation
    createApertureEffect(element) {
        const aperture = document.createElement('div');
        aperture.className = 'aperture-overlay';
        aperture.style.position = 'absolute';
        aperture.style.top = '50%';
        aperture.style.left = '50%';
        aperture.style.transform = 'translate(-50%, -50%)';
        aperture.style.width = '0';
        aperture.style.height = '0';
        aperture.style.background = 'var(--accent-color)';
        aperture.style.borderRadius = '50%';
        aperture.style.transition = 'all 0.6s ease';
        aperture.style.zIndex = '1000';

        element.appendChild(aperture);

        return {
            open: () => {
                aperture.style.width = '200vw';
                aperture.style.height = '200vw';
                aperture.style.opacity = '0';
            },
            close: () => {
                aperture.style.width = '0';
                aperture.style.height = '0';
                aperture.style.opacity = '1';
            }
        };
    }

    // Focus ring animation
    createFocusRing(element) {
        const focusRing = document.createElement('div');
        focusRing.className = 'focus-ring-overlay';
        focusRing.style.position = 'absolute';
        focusRing.style.top = '50%';
        focusRing.style.left = '50%';
        focusRing.style.transform = 'translate(-50%, -50%)';
        focusRing.style.width = '0';
        focusRing.style.height = '0';
        focusRing.style.border = '3px solid var(--accent-color)';
        focusRing.style.borderRadius = '50%';
        focusRing.style.transition = 'all 0.4s ease';
        focusRing.style.zIndex = '1001';

        element.appendChild(focusRing);

        return {
            focus: () => {
                focusRing.style.width = '100px';
                focusRing.style.height = '100px';
                focusRing.style.opacity = '0.8';
            },
            blur: () => {
                focusRing.style.width = '0';
                focusRing.style.height = '0';
                focusRing.style.opacity = '0';
            }
        };
    }

    // Loading animation
    createLoadingAnimation(container) {
        const loader = document.createElement('div');
        loader.className = 'loading-animation';
        loader.style.display = 'flex';
        loader.style.alignItems = 'center';
        loader.style.justifyContent = 'center';
        loader.style.flexDirection = 'column';
        loader.style.gap = '1rem';

        // Create loading dots
        const dots = document.createElement('div');
        dots.className = 'loading-dots';
        dots.style.display = 'flex';
        dots.style.gap = '0.5rem';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.width = '12px';
            dot.style.height = '12px';
            dot.style.background = 'var(--accent-color)';
            dot.style.borderRadius = '50%';
            dot.style.animation = `loadingDot 1.4s infinite ease-in-out`;
            dot.style.animationDelay = `${i * 0.2}s`;
            dots.appendChild(dot);
        }

        const text = document.createElement('div');
        text.textContent = 'Loading...';
        text.style.color = 'var(--accent-color)';
        text.style.fontSize = '0.9rem';

        loader.appendChild(dots);
        loader.appendChild(text);
        container.appendChild(loader);

        return loader;
    }

    // CSS keyframes for animations
    addAnimationStyles() {
        const styles = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes fadeInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes loadingDot {
                0%, 80%, 100% {
                    opacity: 0.3;
                    transform: scale(0.8);
                }
                40% {
                    opacity: 1;
                    transform: scale(1.2);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(1.05);
                }
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes shake {
                0%, 100% {
                    transform: translateX(0);
                }
                10%, 30%, 50%, 70%, 90% {
                    transform: translateX(-5px);
                }
                20%, 40%, 60%, 80% {
                    transform: translateX(5px);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    destroy() {
        // Clean up animations and observers
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        
        // Clear animations map
        this.animations.clear();
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    animationManager.addAnimationStyles();
});