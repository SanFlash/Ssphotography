/**
 * PHOTOGRAPHY+ STUDIO - ADVANCED INTERACTIONS
 * Camera-themed interactions with particle effects and 60fps performance
 */

(function() {
    'use strict';

    // ===================================================================
    // INTERACTION CONFIGURATION
    // ===================================================================

    const INTERACTION_CONFIG = {
        // Mouse tracking
        mouseFollow: {
            enabled: true,
            speed: 0.08,
            scale: 1.15,
            smooth: true
        },

        // Particle system
        particles: {
            enabled: true,
            count: 25,
            colors: ['#d4af37', '#c0c0c0', '#b87333', '#f4f4f4'],
            size: {
                min: 2,
                max: 6
            },
            speed: {
                min: 0.5,
                max: 2
            },
            lifetime: {
                min: 2000,
                max: 5000
            }
        },

        // Tilt effect
        tilt: {
            enabled: true,
            maxRotation: 12,
            perspective: 1000,
            smooth: true
        },

        // Camera effects
        camera: {
            flash: {
                enabled: true,
                duration: 300,
                intensity: 0.8
            },
            shake: {
                enabled: true,
                intensity: 2,
                duration: 200
            },
            focus: {
                enabled: true,
                duration: 1000
            }
        },

        // Performance
        performance: {
            fps: 60,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        }
    };

    // ===================================================================
    // PARTICLE SYSTEM
    // ===================================================================

    class ParticleSystem {
        constructor(config) {
            this.config = config;
            this.particles = [];
            this.canvas = null;
            this.ctx = null;
            this.animationId = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.centerX = 0;
            this.centerY = 0;
            
            this.init();
        }

        init() {
            if (this.config.performance.reducedMotion || this.config.performance.mobile) {
                return;
            }

            this.createCanvas();
            this.bindEvents();
            this.start();
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'particle-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0.7;
            `;
            
            this.ctx = this.canvas.getContext('2d');
            document.body.appendChild(this.canvas);
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.centerX = this.canvas.width / 2;
            this.centerY = this.canvas.height / 2;
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            document.addEventListener('click', (e) => {
                this.createBurst(e.clientX, e.clientY);
            });
        }

        createParticle(x, y, color = null) {
            const colors = this.config.particles.colors;
            const colorChoice = color || colors[Math.floor(Math.random() * colors.length)];
            
            return {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * this.config.particles.speed.max,
                vy: (Math.random() - 0.5) * this.config.particles.speed.max,
                size: Math.random() * (this.config.particles.size.max - this.config.particles.size.min) + this.config.particles.size.min,
                color: colorChoice,
                life: 1,
                decay: 1 / (Math.random() * (this.config.particles.lifetime.max - this.config.particles.lifetime.min) + this.config.particles.lifetime.min),
                gravity: 0.05,
                friction: 0.98
            };
        }

        createBurst(x, y) {
            const burstCount = Math.floor(Math.random() * 8) + 5;
            for (let i = 0; i < burstCount; i++) {
                this.particles.push(this.createParticle(x, y));
            }
        }

        updateParticles() {
            this.particles = this.particles.filter(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Apply gravity
                particle.vy += particle.gravity;
                
                // Apply friction
                particle.vx *= particle.friction;
                particle.vy *= particle.friction;
                
                // Update life
                particle.life -= particle.decay;
                
                // Remove dead particles
                return particle.life > 0;
            });
        }

        drawParticles() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                this.ctx.save();
                
                // Set alpha based on life
                this.ctx.globalAlpha = particle.life;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = particle.color;
                this.ctx.fill();
                
                // Add glow effect
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 10;
                this.ctx.fill();
                
                this.ctx.restore();
            });
        }

        animate() {
            this.updateParticles();
            this.drawParticles();
            
            if (this.config.particles.enabled) {
                this.animationId = requestAnimationFrame(() => this.animate());
            }
        }

        start() {
            this.animate();
        }

        stop() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        destroy() {
            this.stop();
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // ===================================================================
    // MOUSE TRACKING SYSTEM
    // ===================================================================

    class MouseTracker {
        constructor(config) {
            this.config = config;
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetX = 0;
            this.targetY = 0;
            this.trackedElements = [];
            this.isRunning = false;
            
            this.init();
        }

        init() {
            if (this.config.performance.reducedMotion) return;

            this.bindEvents();
            this.startTracking();
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.targetX = e.clientX;
                this.targetY = e.clientY;
            });
        }

        startTracking() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.update();
        }

        stopTracking() {
            this.isRunning = false;
        }

        update() {
            if (!this.isRunning) return;

            // Smooth interpolation
            const ease = this.config.mouseFollow.smooth ? 0.08 : 1;
            this.mouseX += (this.targetX - this.mouseX) * ease;
            this.mouseY += (this.targetY - this.mouseY) * ease;

            // Update tracked elements
            this.updateTrackedElements();

            requestAnimationFrame(() => this.update());
        }

        addTrackedElement(element, options = {}) {
            const trackedElement = {
                element: element,
                speed: options.speed || this.config.mouseFollow.speed,
                scale: options.scale || this.config.mouseFollow.scale,
                offsetX: options.offsetX || 0,
                offsetY: options.offsetY || 0,
                invert: options.invert || false
            };

            this.trackedElements.push(trackedElement);
            return () => this.removeTrackedElement(trackedElement);
        }

        removeTrackedElement(trackedElement) {
            const index = this.trackedElements.indexOf(trackedElement);
            if (index > -1) {
                this.trackedElements.splice(index, 1);
            }
        }

        updateTrackedElements() {
            this.trackedElements.forEach(tracked => {
                const rect = tracked.element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (this.mouseX - centerX) * tracked.speed;
                const deltaY = (this.mouseY - centerY) * tracked.speed;

                const transformX = tracked.invert ? -deltaX + tracked.offsetX : deltaX + tracked.offsetX;
                const transformY = tracked.invert ? -deltaY + tracked.offsetY : deltaY + tracked.offsetY;

                tracked.element.style.transform = `
                    translate(${transformX}px, ${transformY}px) 
                    scale(${tracked.scale})
                `;
            });
        }

        destroy() {
            this.stopTracking();
            this.trackedElements = [];
        }
    }

    // ===================================================================
    // TILT EFFECT SYSTEM
    // ===================================================================

    class TiltEffect {
        constructor(config) {
            this.config = config;
            this.elements = []
            this.isRunning = false;
            
            this.init();
        }

        init() {
            if (this.config.performance.reducedMotion) return;

            this.findElements();
            this.bindEvents();
        }

        findElements() {
            this.elements = Array.from(document.querySelectorAll('[data-tilt]'));
            
            // Add default tilt elements
            const defaultElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial');
            defaultElements.forEach(el => {
                if (!el.hasAttribute('data-tilt')) {
                    el.setAttribute('data-tilt', 'true');
                    this.elements.push(el);
                }
            });
        }

        bindEvents() {
            this.elements.forEach(element => {
                element.addEventListener('mouseenter', (e) => this.onMouseEnter(e, element));
                element.addEventListener('mouseleave', (e) => this.onMouseLeave(e, element));
                element.addEventListener('mousemove', (e) => this.onMouseMove(e, element));
            });
        }

        onMouseEnter(e, element) {
            element.style.transition = 'transform 0.1s ease';
            element.style.transformStyle = 'preserve-3d';
        }

        onMouseLeave(e, element) {
            element.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }

        onMouseMove(e, element) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * this.config.tilt.maxRotation;
            const rotateY = (centerX - x) / centerX * this.config.tilt.maxRotation;
            
            element.style.transform = `
                perspective(${this.config.tilt.perspective}px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale3d(1.02, 1.02, 1.02)
            `;
        }
    }

    // ===================================================================
    // CAMERA EFFECTS SYSTEM
    // ===================================================================

    class CameraEffects {
        constructor(config) {
            this.config = config;
            this.isFlashing = false;
            this.isShaking = false;
            
            this.init();
        }

        init() {
            this.setupFlashEffect();
            this.bindEvents();
        }

        setupFlashEffect() {
            // Create flash overlay
            this.flashOverlay = document.createElement('div');
            this.flashOverlay.className = 'camera-flash-overlay';
            this.flashOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                opacity: 0;
                pointer-events: none;
                z-index: 9999;
                transition: opacity ${this.config.camera.flash.duration}ms ease;
            `;
            document.body.appendChild(this.flashOverlay);
        }

        bindEvents() {
            // Add camera click effects to buttons
            const buttons = document.querySelectorAll('.btn, .gallery-item, .filter-btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.triggerCameraEffects(e.target);
                });
            });

            // Add focus effects to form inputs
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => this.triggerFocusEffect(input));
            });
        }

        triggerCameraEffects(element) {
            if (this.config.camera.flash.enabled) {
                this.cameraFlash();
            }
            
            if (this.config.camera.shake.enabled) {
                this.cameraShake(element);
            }
        }

        cameraFlash() {
            if (this.isFlashing) return;
            
            this.isFlashing = true;
            
            this.flashOverlay.style.opacity = this.config.camera.flash.intensity;
            
            setTimeout(() => {
                this.flashOverlay.style.opacity = '0';
                this.isFlashing = false;
            }, this.config.camera.flash.duration);
        }

        cameraShake(element) {
            if (this.isShaking) return;
            
            this.isShaking = true;
            
            const intensity = this.config.camera.shake.intensity;
            const duration = this.config.camera.shake.duration;
            
            element.style.animation = `camera-shake ${duration}ms ease-in-out`;
            element.style.setProperty('--shake-intensity', intensity + 'px');
            
            setTimeout(() => {
                element.style.animation = '';
                this.isShaking = false;
            }, duration);
        }

        triggerFocusEffect(element) {
            if (!this.config.camera.focus.enabled) return;
            
            // Create focus ring effect
            const focusRing = document.createElement('div');
            focusRing.className = 'focus-ring-effect';
            focusRing.style.cssText = `
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border: 2px solid var(--color-accent-gold);
                border-radius: inherit;
                opacity: 0;
                pointer-events: none;
                z-index: 1;
            `;
            
            element.style.position = 'relative';
            element.appendChild(focusRing);
            
            // Animate focus ring
            requestAnimationFrame(() => {
                focusRing.style.opacity = '1';
                focusRing.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    focusRing.style.opacity = '0';
                    setTimeout(() => {
                        if (focusRing.parentElement) {
                            focusRing.parentElement.removeChild(focusRing);
                        }
                    }, 300);
                }, 1000);
            });
        }
    }

    // ===================================================================
    // INTERACTION MANAGER
    // ===================================================================

    class InteractionManager {
        constructor() {
            this.config = INTERACTION_CONFIG;
            this.particleSystem = null;
            this.mouseTracker = null;
            this.tiltEffect = null;
            this.cameraEffects = null;
            this.isInitialized = false;
            
            this.init();
        }

        init() {
            if (this.isInitialized) return;

            this.setupParticleSystem();
            this.setupMouseTracking();
            this.setupTiltEffect();
            this.setupCameraEffects();
            this.bindGlobalEvents();
            
            this.isInitialized = true;
        }

        setupParticleSystem() {
            if (this.config.particles.enabled) {
                this.particleSystem = new ParticleSystem(this.config);
            }
        }

        setupMouseTracking() {
            if (this.config.mouseFollow.enabled) {
                this.mouseTracker = new MouseTracker(this.config);
            }
        }

        setupTiltEffect() {
            if (this.config.tilt.enabled) {
                this.tiltEffect = new TiltEffect(this.config);
            }
        }

        setupCameraEffects() {
            if (this.config.camera.flash.enabled || this.config.camera.shake.enabled) {
                this.cameraEffects = new CameraEffects(this.config);
            }
        }

        bindGlobalEvents() {
            // Handle reduced motion changes
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            mediaQuery.addListener((e) => {
                this.config.performance.reducedMotion = e.matches;
                this.handleReducedMotionChange();
            });

            // Handle visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseInteractions();
                } else {
                    this.resumeInteractions();
                }
            });

            // Handle beforeunload
            window.addEventListener('beforeunload', () => {
                this.destroy();
            });
        }

        handleReducedMotionChange() {
            if (this.config.performance.reducedMotion) {
                this.pauseInteractions();
            } else {
                this.resumeInteractions();
            }
        }

        pauseInteractions() {
            if (this.particleSystem) this.particleSystem.stop();
            if (this.mouseTracker) this.mouseTracker.stopTracking();
        }

        resumeInteractions() {
            if (this.particleSystem) this.particleSystem.start();
            if (this.mouseTracker) this.mouseTracker.startTracking();
        }

        destroy() {
            if (this.particleSystem) this.particleSystem.destroy();
            if (this.mouseTracker) this.mouseTracker.destroy();
            
            this.isInitialized = false;
        }

        // Public API methods
        addTrackedElement(element, options) {
            if (this.mouseTracker) {
                return this.mouseTracker.addTrackedElement(element, options);
            }
            return () => {};
        }

        triggerCameraEffects(element) {
            if (this.cameraEffects) {
                this.cameraEffects.triggerCameraEffects(element);
            }
        }

        createParticleBurst(x, y, color) {
            if (this.particleSystem) {
                this.particleSystem.createBurst(x, y, color);
            }
        }
    }

    // ===================================================================
    // CSS KEYFRAME ANIMATIONS
    // ===================================================================

    const addInteractionStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes camera-shake {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                10% { transform: translate(-2px, -2px) rotate(-0.5deg); }
                20% { transform: translate(2px, -2px) rotate(0.5deg); }
                30% { transform: translate(-2px, 2px) rotate(0.5deg); }
                40% { transform: translate(2px, 2px) rotate(-0.5deg); }
                50% { transform: translate(-1px, -1px) rotate(0deg); }
                60% { transform: translate(1px, -1px) rotate(-0.5deg); }
                70% { transform: translate(-1px, 1px) rotate(0.5deg); }
                80% { transform: translate(1px, 1px) rotate(-0.5deg); }
                90% { transform: translate(-1px, -1px) rotate(0deg); }
            }

            .particle-canvas {
                background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
            }

            .camera-flash-overlay {
                backdrop-filter: blur(1px);
            }

            .focus-ring-effect {
                box-shadow: 0 0 20px var(--color-accent-gold);
            }

            .gallery-item:hover {
                transform: scale(1.02);
                transition: transform 0.3s ease;
            }

            .service-card:hover {
                transform: translateY(-5px);
                transition: transform 0.3s ease;
            }

            .btn:hover {
                transform: translateY(-2px);
                transition: transform 0.2s ease;
            }

            .btn:active {
                transform: translateY(0);
            }

            .animations-paused * {
                animation-play-state: paused !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    };

    // ===================================================================
    // INITIALIZE INTERACTIONS
    // ===================================================================

    document.addEventListener('DOMContentLoaded', () => {
        addInteractionStyles();
        window.interactionManager = new InteractionManager();
    });

    // ===================================================================
    // PUBLIC API
    // ===================================================================

    window.PhotographyInteractions = {
        createManager: (config) => new InteractionManager(config),
        addTrackedElement: (element, options) => {
            if (window.interactionManager) {
                return window.interactionManager.addTrackedElement(element, options);
            }
            return () => {};
        },
        triggerCameraEffects: (element) => {
            if (window.interactionManager) {
                window.interactionManager.triggerCameraEffects(element);
            }
        },
        createParticleBurst: (x, y, color) => {
            if (window.interactionManager) {
                window.interactionManager.createParticleBurst(x, y, color);
            }
        }
    };

})();