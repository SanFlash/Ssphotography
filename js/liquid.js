/**
 * Liquid Effects Module
 * Advanced liquid morphing, glassmorphism, and fluid animations
 */

(function() {
    'use strict';

    // ===================================================================
    // LIQUID MORPHING EFFECTS
    // ===================================================================

    class LiquidMorph {
        constructor(element) {
            this.element = element;
            this.isAnimating = false;
            this.init();
        }

        init() {
            this.setupMorphAnimation();
            this.startMorphing();
        }

        setupMorphAnimation() {
            // Create morphing keyframes
            const keyframes = `
                @keyframes liquid-morph-${this.element.id || 'default'} {
                    0% { 
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
                        transform: rotate(0deg) scale(1);
                    }
                    25% { 
                        border-radius: 40% 60% 70% 30% / 40% 60% 30% 70%; 
                        transform: rotate(90deg) scale(1.05);
                    }
                    50% { 
                        border-radius: 30% 70% 60% 40% / 30% 70% 40% 60%; 
                        transform: rotate(180deg) scale(0.95);
                    }
                    75% { 
                        border-radius: 70% 30% 40% 60% / 70% 40% 60% 30%; 
                        transform: rotate(270deg) scale(1.02);
                    }
                    100% { 
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
                        transform: rotate(360deg) scale(1);
                    }
                }
            `;

            // Add keyframes to document
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);

            // Apply animation
            this.element.style.animation = `liquid-morph-${this.element.id || 'default'} 8s ease-in-out infinite`;
        }

        startMorphing() {
            this.isAnimating = true;
            
            // Add liquid glow effect
            this.element.addEventListener('animationiteration', () => {
                if (this.isAnimating) {
                    this.addLiquidGlow();
                }
            });
        }

        addLiquidGlow() {
            this.element.style.boxShadow = `
                0 0 20px rgba(0, 212, 255, 0.4),
                0 0 40px rgba(0, 212, 255, 0.2),
                inset 0 0 20px rgba(0, 212, 255, 0.1)
            `;

            setTimeout(() => {
                this.element.style.boxShadow = '';
            }, 1000);
        }

        stopMorphing() {
            this.isAnimating = false;
            this.element.style.animation = '';
            this.element.style.boxShadow = '';
        }
    }

    // ===================================================================
    // GLASSMORPHISM EFFECTS
    // ===================================================================

    class GlassEffect {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                blur: 20,
                transparency: 0.1,
                borderOpacity: 0.2,
                glow: true,
                shimmer: true,
                ...options
            };
            this.init();
        }

        init() {
            this.applyGlassEffect();
            if (this.options.shimmer) {
                this.addShimmerEffect();
            }
            if (this.options.glow) {
                this.addGlowEffect();
            }
        }

        applyGlassEffect() {
            const styles = {
                background: `rgba(255, 255, 255, ${this.options.transparency})`,
                backdropFilter: `blur(${this.options.blur}px)`,
                border: `1px solid rgba(255, 255, 255, ${this.options.borderOpacity})`,
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
                transition: 'all 0.3s ease'
            };

            Object.assign(this.element.style, styles);
        }

        addShimmerEffect() {
            const shimmer = document.createElement('div');
            shimmer.className = 'glass-shimmer';
            shimmer.style.cssText = `
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(
                    45deg,
                    transparent 30%,
                    rgba(255, 255, 255, 0.1) 50%,
                    transparent 70%
                );
                transform: rotate(45deg);
                animation: shimmer-anim 3s ease-in-out infinite;
                pointer-events: none;
                z-index: 1;
            `;

            this.element.style.position = 'relative';
            this.element.appendChild(shimmer);

            // Add shimmer animation
            const shimmerStyle = `
                @keyframes shimmer-anim {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = shimmerStyle;
            document.head.appendChild(style);
        }

        addGlowEffect() {
            this.element.addEventListener('mouseenter', () => {
                this.element.style.boxShadow = `
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 0 40px rgba(0, 212, 255, 0.3),
                    0 0 80px rgba(0, 212, 255, 0.1)
                `;
            });

            this.element.addEventListener('mouseleave', () => {
                this.element.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.3)`;
            });
        }

        updateOptions(newOptions) {
            this.options = { ...this.options, ...newOptions };
            this.applyGlassEffect();
        }
    }

    // ===================================================================
    // FLUID BACKGROUND EFFECTS
    // ===================================================================

    class FluidBackground {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                particleCount: 50,
                colors: ['#00d4ff', '#ff006e', '#8338ec', '#06ffa5'],
                speed: 0.5,
                interactive: true,
                ...options
            };
            this.particles = [];
            this.canvas = null;
            this.ctx = null;
            this.animationId = null;
            this.mouse = { x: 0, y: 0 };
            
            this.init();
        }

        init() {
            this.createCanvas();
            this.createParticles();
            if (this.options.interactive) {
                this.setupInteractivity();
            }
            this.animate();
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.pointerEvents = this.options.interactive ? 'auto' : 'none';
            
            this.container.style.position = 'relative';
            this.container.appendChild(this.canvas);
            
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
        }

        resizeCanvas() {
            const rect = this.container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        createParticles() {
            for (let i = 0; i < this.options.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.options.speed,
                    vy: (Math.random() - 0.5) * this.options.speed,
                    radius: Math.random() * 3 + 1,
                    color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                    life: Math.random() * 100 + 50,
                    maxLife: Math.random() * 100 + 50
                });
            }
        }

        setupInteractivity() {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw connections
            this.drawConnections();

            // Update and draw particles
            this.particles.forEach((particle, index) => {
                this.updateParticle(particle);
                this.drawParticle(particle);

                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: (Math.random() - 0.5) * this.options.speed,
                        vy: (Math.random() - 0.5) * this.options.speed,
                        radius: Math.random() * 3 + 1,
                        color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                        life: Math.random() * 100 + 50,
                        maxLife: Math.random() * 100 + 50
                    });
                }
            });

            this.animationId = requestAnimationFrame(() => this.animate());
        }

        updateParticle(particle) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 1 / particle.maxLife;

            // Interactive behavior
            if (this.options.interactive) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += (dx / distance) * force * 0.1;
                    particle.vy += (dy / distance) * force * 0.1;
                }
            }

            // Boundary checking
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }

            // Add some randomness
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;

            // Limit speed
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > this.options.speed * 2) {
                particle.vx = (particle.vx / speed) * this.options.speed * 2;
                particle.vy = (particle.vy / speed) * this.options.speed * 2;
            }
        }

        drawParticle(particle) {
            const alpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }

        drawConnections() {
            this.particles.forEach((particle, i) => {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const other = this.particles[j];
                    const distance = Math.sqrt(
                        Math.pow(particle.x - other.x, 2) + 
                        Math.pow(particle.y - other.y, 2)
                    );
                    
                    if (distance < 150) {
                        const alpha = (1 - distance / 150) * 0.3;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            });
        }

        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // ===================================================================
    // LIQUID TEXT EFFECTS
    // ===================================================================

    class LiquidText {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                speed: 50,
                color: '#00d4ff',
                glow: true,
                ...options
            };
            this.chars = this.element.textContent.split('');
            this.isAnimating = false;
            
            this.init();
        }

        init() {
            this.wrapCharacters();
            if (this.options.glow) {
                this.addTextGlow();
            }
        }

        wrapCharacters() {
            this.element.innerHTML = this.chars.map((char, index) => {
                if (char === ' ') return ' ';
                return `<span class="liquid-char" style="
                    display: inline-block;
                    animation: liquid-char-wave 2s ease-in-out infinite;
                    animation-delay: ${index * 0.1}s;
                ">${char}</span>`;
            }).join('');

            // Add character animation
            const charStyle = `
                @keyframes liquid-char-wave {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                        color: var(--quantum-primary);
                    }
                    50% {
                        transform: translateY(-10px) scale(1.1);
                        color: var(--quantum-secondary);
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = charStyle;
            document.head.appendChild(style);
        }

        addTextGlow() {
            this.element.style.textShadow = `
                0 0 10px ${this.options.color},
                0 0 20px ${this.options.color},
                0 0 30px ${this.options.color}
            `;
        }

        startAnimation() {
            this.isAnimating = true;
            this.element.style.animationPlayState = 'running';
        }

        stopAnimation() {
            this.isAnimating = false;
            this.element.style.animationPlayState = 'paused';
        }
    }

    // ===================================================================
    // LIQUID MOSAIC GENERATOR
    // ===================================================================

    class LiquidMosaic {
        constructor(container, images, options = {}) {
            this.container = container;
            this.images = images;
            this.options = {
                columns: 3,
                gap: 20,
                animation: 'morph',
                ...options
            };
            this.items = [];
            
            this.init();
        }

        init() {
            this.createMosaic();
            this.setupAnimations();
        }

        createMosaic() {
            this.container.style.display = 'grid';
            this.container.style.gridTemplateColumns = `repeat(${this.options.columns}, 1fr)`;
            this.container.style.gap = `${this.options.gap}px`;

            this.images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'mosaic-item';
                item.style.cssText = `
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.5s ease;
                    animation: ${this.options.animation} 10s ease-in-out infinite;
                    animation-delay: ${index * 0.5}s;
                `;

                item.innerHTML = `
                    <img src="${image.url}" alt="${image.alt}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.5s ease;
                    ">
                    <div class="mosaic-overlay" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, 
                            rgba(0, 212, 255, 0.8) 0%, 
                            rgba(255, 0, 110, 0.8) 100%);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        color: white;
                        text-align: center;
                        padding: 20px;
                    ">
                        <h3 style="font-size: 1.5rem; margin-bottom: 10px;">${image.title}</h3>
                        <p style="opacity: 0.9;">${image.description}</p>
                    </div>
                `;

                // Add hover effects
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-10px) scale(1.05)';
                    item.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
                    item.querySelector('.mosaic-overlay').style.opacity = '1';
                    item.querySelector('img').style.transform = 'scale(1.1)';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(0) scale(1)';
                    item.style.boxShadow = 'none';
                    item.querySelector('.mosaic-overlay').style.opacity = '0';
                    item.querySelector('img').style.transform = 'scale(1)';
                });

                this.container.appendChild(item);
                this.items.push(item);
            });
        }

        setupAnimations() {
            if (this.options.animation === 'morph') {
                this.setupMorphAnimation();
            } else if (this.options.animation === 'wave') {
                this.setupWaveAnimation();
            }
        }

        setupMorphAnimation() {
            const morphStyle = `
                @keyframes morph {
                    0% { 
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
                        transform: rotate(0deg) scale(1);
                    }
                    25% { 
                        border-radius: 40% 60% 70% 30% / 40% 60% 30% 70%; 
                        transform: rotate(90deg) scale(1.05);
                    }
                    50% { 
                        border-radius: 30% 70% 60% 40% / 30% 70% 40% 60%; 
                        transform: rotate(180deg) scale(0.95);
                    }
                    75% { 
                        border-radius: 70% 30% 40% 60% / 70% 40% 60% 30%; 
                        transform: rotate(270deg) scale(1.02);
                    }
                    100% { 
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
                        transform: rotate(360deg) scale(1);
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = morphStyle;
            document.head.appendChild(style);
        }

        setupWaveAnimation() {
            const waveStyle = `
                @keyframes wave {
                    0%, 100% { 
                        transform: translateY(0) scale(1);
                        filter: hue-rotate(0deg);
                    }
                    25% { 
                        transform: translateY(-10px) scale(1.02);
                        filter: hue-rotate(90deg);
                    }
                    50% { 
                        transform: translateY(0) scale(0.98);
                        filter: hue-rotate(180deg);
                    }
                    75% { 
                        transform: translateY(10px) scale(1.01);
                        filter: hue-rotate(270deg);
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = waveStyle;
            document.head.appendChild(style);
        }

        shuffle() {
            const shuffled = [...this.images].sort(() => Math.random() - 0.5);
            this.container.innerHTML = '';
            this.items = [];
            this.images = shuffled;
            this.createMosaic();
        }

        destroy() {
            this.container.innerHTML = '';
            this.items = [];
        }
    }

    // ===================================================================
    // LIQUID INTERACTION TRACKER
    // ===================================================================

    class LiquidInteraction {
        constructor() {
            this.interactions = [];
            this.mouseTrail = [];
            this.isTracking = false;
            this.init();
        }

        init() {
            this.setupMouseTracking();
            this.setupClickTracking();
            this.setupScrollTracking();
        }

        setupMouseTracking() {
            document.addEventListener('mousemove', (e) => {
                if (!this.isTracking) return;

                const interaction = {
                    type: 'mouse',
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now(),
                    element: e.target.tagName
                };

                this.interactions.push(interaction);
                this.createMouseTrail(e.clientX, e.clientY);

                // Limit interactions array size
                if (this.interactions.length > 1000) {
                    this.interactions = this.interactions.slice(-500);
                }
            });
        }

        createMouseTrail(x, y) {
            const trail = document.createElement('div');
            trail.className = 'mouse-trail';
            trail.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: var(--quantum-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: mouse-trail-fade 1s ease-out forwards;
            `;

            document.body.appendChild(trail);

            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 1000);

            // Add trail animation
            const trailStyle = `
                @keyframes mouse-trail-fade {
                    0% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                }
            `;

            if (!document.querySelector('#trail-styles')) {
                const style = document.createElement('style');
                style.id = 'trail-styles';
                style.textContent = trailStyle;
                document.head.appendChild(style);
            }
        }

        setupClickTracking() {
            document.addEventListener('click', (e) => {
                const interaction = {
                    type: 'click',
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now(),
                    element: e.target.tagName,
                    text: e.target.textContent?.substring(0, 50)
                };

                this.interactions.push(interaction);
                this.createClickRipple(e.clientX, e.clientY);
            });
        }

        createClickRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                border: 2px solid var(--quantum-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                animation: click-ripple-expand 0.6s ease-out forwards;
                transform: translate(-50%, -50%);
            `;

            document.body.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);

            // Add ripple animation
            const rippleStyle = `
                @keyframes click-ripple-expand {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(5);
                        opacity: 0;
                    }
                }
            `;

            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = rippleStyle;
                document.head.appendChild(style);
            }
        }

        setupScrollTracking() {
            let lastScrollY = window.scrollY;
            let scrollTimeout;

            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                
                const currentScrollY = window.scrollY;
                const scrollDelta = currentScrollY - lastScrollY;
                
                const interaction = {
                    type: 'scroll',
                    delta: scrollDelta,
                    position: currentScrollY,
                    timestamp: Date.now()
                };

                this.interactions.push(interaction);
                lastScrollY = currentScrollY;

                // Group scroll events
                scrollTimeout = setTimeout(() => {
                    const scrollInteraction = {
                        type: 'scroll-end',
                        position: currentScrollY,
                        timestamp: Date.now()
                    };
                    this.interactions.push(scrollInteraction);
                }, 150);
            });
        }

        startTracking() {
            this.isTracking = true;
        }

        stopTracking() {
            this.isTracking = false;
        }

        getInteractionSummary() {
            const summary = {
                total: this.interactions.length,
                mouse: this.interactions.filter(i => i.type === 'mouse').length,
                clicks: this.interactions.filter(i => i.type === 'click').length,
                scrolls: this.interactions.filter(i => i.type === 'scroll').length,
                timeSpan: this.interactions.length > 0 
                    ? this.interactions[this.interactions.length - 1].timestamp - this.interactions[0].timestamp 
                    : 0
            };

            return summary;
        }

        clearInteractions() {
            this.interactions = [];
        }

        exportInteractions() {
            return JSON.stringify(this.interactions, null, 2);
        }
    }

    // ===================================================================
    // EXPORT TO GLOBAL SCOPE
    // ===================================================================

    window.LiquidEffects = {
        LiquidMorph,
        GlassEffect,
        FluidBackground,
        LiquidText,
        LiquidMosaic,
        LiquidInteraction
    };

    // ===================================================================
    // AUTO-INITIALIZATION
    // ===================================================================

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize liquid morphing elements
        document.querySelectorAll('.liquid-morph').forEach(element => {
            new LiquidMorph(element);
        });

        // Initialize glass effects
        document.querySelectorAll('.glass-effect').forEach(element => {
            new GlassEffect(element);
        });

        // Initialize fluid backgrounds
        document.querySelectorAll('.fluid-bg').forEach(container => {
            new FluidBackground(container);
        });

        // Initialize liquid text
        document.querySelectorAll('.liquid-text').forEach(element => {
            new LiquidText(element);
        });

        // Initialize liquid mosaic
        document.querySelectorAll('.liquid-mosaic').forEach(container => {
            const images = JSON.parse(container.dataset.images || '[]');
            new LiquidMosaic(container, images);
        });

        // Initialize interaction tracking
        const interactionTracker = new LiquidInteraction();
        window.liquidInteraction = interactionTracker;

        console.log('🌊 Liquid Effects initialized successfully!');
    });

})();