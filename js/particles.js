/**
 * Advanced Particle System
 * Quantum-inspired particle effects with Three.js and Canvas
 */

(function() {
    'use strict';

    // ===================================================================
    // PARTICLE SYSTEM MANAGER
    // ===================================================================

    class ParticleManager {
        constructor() {
            this.systems = new Map();
            this.activeSystem = null;
            this.performanceMode = 'high';
            this.particleCount = 1000;
            
            this.init();
        }

        init() {
            this.setupPerformanceMonitoring();
            this.createDefaultSystems();
        }

        setupPerformanceMonitoring() {
            // Monitor frame rate and adjust particle count accordingly
            let frameCount = 0;
            let lastTime = performance.now();
            
            const monitorPerformance = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = frameCount;
                    frameCount = 0;
                    lastTime = currentTime;
                    
                    // Adjust performance mode based on FPS
                    if (fps < 30) {
                        this.setPerformanceMode('low');
                    } else if (fps < 45) {
                        this.setPerformanceMode('medium');
                    } else {
                        this.setPerformanceMode('high');
                    }
                }
                
                requestAnimationFrame(monitorPerformance);
            };
            
            monitorPerformance();
        }

        createDefaultSystems() {
            // Create hero particle system
            this.createSystem('hero', {
                container: 'particles-js',
                type: 'threejs',
                particleCount: 150,
                colors: ['#00d4ff', '#ff006e', '#8338ec'],
                interactive: true
            });

            // Create gallery particle system
            this.createSystem('gallery', {
                container: 'gallery-particles',
                type: 'canvas',
                particleCount: 80,
                colors: ['#06ffa5', '#ffd60a', '#00d4ff'],
                interactive: false
            });
        }

        createSystem(id, config) {
            let system;
            
            switch (config.type) {
                case 'threejs':
                    system = new ThreeJSParticleSystem(config);
                    break;
                case 'canvas':
                    system = new CanvasParticleSystem(config);
                    break;
                case 'webgl':
                    system = new WebGLParticleSystem(config);
                    break;
                default:
                    system = new CanvasParticleSystem(config);
            }
            
            this.systems.set(id, system);
            return system;
        }

        getSystem(id) {
            return this.systems.get(id);
        }

        activateSystem(id) {
            if (this.activeSystem) {
                this.activeSystem.pause();
            }
            
            this.activeSystem = this.getSystem(id);
            if (this.activeSystem) {
                this.activeSystem.resume();
            }
        }

        setPerformanceMode(mode) {
            if (this.performanceMode === mode) return;
            
            this.performanceMode = mode;
            
            this.systems.forEach(system => {
                system.setPerformanceMode(mode);
            });
        }

        destroy() {
            this.systems.forEach(system => {
                system.destroy();
            });
            this.systems.clear();
        }
    }

    // ===================================================================
    // THREE.JS PARTICLE SYSTEM
    // ===================================================================

    class ThreeJSParticleSystem {
        constructor(config) {
            this.config = config;
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.particles = null;
            this.particleCount = config.particleCount || 1000;
            this.mouse = { x: 0, y: 0 };
            this.time = 0;
            
            this.init();
        }

        init() {
            this.setupScene();
            this.createParticles();
            this.setupEventListeners();
            this.animate();
        }

        setupScene() {
            const container = document.getElementById(this.config.container);
            const width = container.clientWidth;
            const height = container.clientHeight;

            // Scene
            this.scene = new THREE.Scene();

            // Camera
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 5;

            // Renderer
            this.renderer = new THREE.WebGLRenderer({ 
                alpha: true, 
                antialias: true 
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(this.renderer.domElement);

            // Handle resize
            window.addEventListener('resize', () => this.onResize());
        }

        createParticles() {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(this.particleCount * 3);
            const colors = new Float32Array(this.particleCount * 3);
            const sizes = new Float32Array(this.particleCount);

            for (let i = 0; i < this.particleCount; i++) {
                // Positions
                positions[i * 3] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

                // Colors
                const color = new THREE.Color(
                    this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
                );
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;

                // Sizes
                sizes[i] = Math.random() * 3 + 1;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            // Material
            const material = new THREE.PointsMaterial({
                size: 0.05,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            this.particles = new THREE.Points(geometry, material);
            this.scene.add(this.particles);
        }

        setupEventListeners() {
            if (this.config.interactive) {
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                });
            }
        }

        animate() {
            this.time += 0.01;

            // Update particles
            if (this.particles) {
                const positions = this.particles.geometry.attributes.position.array;
                const sizes = this.particles.geometry.attributes.size.array;

                for (let i = 0; i < this.particleCount; i++) {
                    // Floating motion
                    positions[i * 3 + 1] += Math.sin(this.time + i * 0.01) * 0.01;
                    positions[i * 3] += Math.cos(this.time + i * 0.01) * 0.01;

                    // Interactive movement
                    if (this.config.interactive) {
                        positions[i * 3] += this.mouse.x * 0.01;
                        positions[i * 3 + 1] += this.mouse.y * 0.01;
                    }

                    // Pulsing size
                    sizes[i] = Math.sin(this.time + i * 0.1) * 2 + 3;
                }

                this.particles.geometry.attributes.position.needsUpdate = true;
                this.particles.geometry.attributes.size.needsUpdate = true;

                // Rotate particle system
                this.particles.rotation.y += 0.001;
                this.particles.rotation.x += 0.0005;
            }

            this.renderer.render(this.scene, this.camera);
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        onResize() {
            const container = document.getElementById(this.config.container);
            const width = container.clientWidth;
            const height = container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }

        setPerformanceMode(mode) {
            switch (mode) {
                case 'low':
                    this.particleCount = Math.floor(this.config.particleCount * 0.5);
                    break;
                case 'medium':
                    this.particleCount = Math.floor(this.config.particleCount * 0.75);
                    break;
                case 'high':
                    this.particleCount = this.config.particleCount;
                    break;
            }
            
            // Recreate particles with new count
            if (this.particles) {
                this.scene.remove(this.particles);
                this.createParticles();
            }
        }

        pause() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        resume() {
            if (!this.animationId) {
                this.animate();
            }
        }

        destroy() {
            this.pause();
            if (this.renderer) {
                this.renderer.dispose();
            }
            if (this.scene) {
                this.scene.clear();
            }
        }
    }

    // ===================================================================
    // CANVAS PARTICLE SYSTEM
    // ===================================================================

    class CanvasParticleSystem {
        constructor(config) {
            this.config = config;
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.particleCount = config.particleCount || 100;
            this.mouse = { x: 0, y: 0 };
            this.time = 0;
            this.animationId = null;
            
            this.init();
        }

        init() {
            this.createCanvas();
            this.createParticles();
            this.setupEventListeners();
            this.animate();
        }

        createCanvas() {
            const container = document.getElementById(this.config.container);
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.zIndex = '1';
            this.canvas.style.pointerEvents = this.config.interactive ? 'auto' : 'none';
            
            container.appendChild(this.canvas);
            
            window.addEventListener('resize', () => this.onResize());
        }

        createParticles() {
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    radius: Math.random() * 3 + 1,
                    color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                    life: 1,
                    maxLife: Math.random() * 100 + 50
                });
            }
        }

        setupEventListeners() {
            if (this.config.interactive) {
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.time += 0.01;

            // Draw connections
            if (this.config.connectParticles !== false) {
                this.drawConnections();
            }

            // Update and draw particles
            this.particles.forEach((particle, index) => {
                this.updateParticle(particle);
                this.drawParticle(particle);

                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        radius: Math.random() * 3 + 1,
                        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                        life: 1,
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
            if (this.config.interactive) {
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
            if (speed > 3) {
                particle.vx = (particle.vx / speed) * 3;
                particle.vy = (particle.vy / speed) * 3;
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
                    
                    if (distance < 100) {
                        const alpha = (1 - distance / 100) * 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            });
        }

        onResize() {
            const container = document.getElementById(this.config.container);
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        setPerformanceMode(mode) {
            switch (mode) {
                case 'low':
                    this.particleCount = Math.floor(this.config.particleCount * 0.5);
                    break;
                case 'medium':
                    this.particleCount = Math.floor(this.config.particleCount * 0.75);
                    break;
                case 'high':
                    this.particleCount = this.config.particleCount;
                    break;
            }
            
            // Recreate particles with new count
            this.particles = [];
            this.createParticles();
        }

        pause() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        resume() {
            if (!this.animationId) {
                this.animate();
            }
        }

        destroy() {
            this.pause();
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // ===================================================================
    // WEBGL PARTICLE SYSTEM (ADVANCED)
    // ===================================================================

    class WebGLParticleSystem {
        constructor(config) {
            this.config = config;
            this.canvas = null;
            this.gl = null;
            this.program = null;
            this.particles = [];
            this.particleCount = config.particleCount || 500;
            this.animationId = null;
            
            this.init();
        }

        init() {
            this.createCanvas();
            this.setupWebGL();
            this.createParticles();
            this.animate();
        }

        createCanvas() {
            const container = document.getElementById(this.config.container);
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.zIndex = '1';
            this.canvas.style.pointerEvents = 'none';
            
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            
            container.appendChild(this.canvas);
            
            window.addEventListener('resize', () => this.onResize());
        }

        setupWebGL() {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            
            if (!this.gl) {
                console.warn('WebGL not supported, falling back to Canvas');
                return;
            }

            // Vertex shader
            const vertexShaderSource = `
                attribute vec2 a_position;
                attribute vec3 a_color;
                attribute float a_size;
                uniform vec2 u_resolution;
                uniform float u_time;
                varying vec3 v_color;
                
                void main() {
                    vec2 clipSpace = ((a_position / u_resolution) * 2.0) - 1.0;
                    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                    v_color = a_color;
                    gl_PointSize = a_size;
                }
            `;

            // Fragment shader
            const fragmentShaderSource = `
                precision mediump float;
                varying vec3 v_color;
                
                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    gl_FragColor = vec4(v_color, alpha);
                }
            `;

            // Compile shaders and create program
            const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
            const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
            
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, vertexShader);
            this.gl.attachShader(this.program, fragmentShader);
            this.gl.linkProgram(this.program);
            
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                console.error('WebGL program failed to link');
                return;
            }

            this.gl.useProgram(this.program);
        }

        compileShader(source, type) {
            const shader = this.gl.createShader(type);
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
                return null;
            }
            
            return shader;
        }

        createParticles() {
            const positions = [];
            const colors = [];
            const sizes = [];

            for (let i = 0; i < this.particleCount; i++) {
                positions.push(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height
                );

                const color = this.hexToRgb(this.config.colors[Math.floor(Math.random() * this.config.colors.length)]);
                colors.push(color.r, color.g, color.b);

                sizes.push(Math.random() * 20 + 5);
            }

            // Create buffers
            const positionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

            const colorBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

            const sizeBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(sizes), this.gl.STATIC_DRAW);

            // Get attribute locations
            const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
            const colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
            const sizeLocation = this.gl.getAttribLocation(this.program, 'a_size');

            // Set up attributes
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
            this.gl.enableVertexAttribArray(colorLocation);
            this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sizeBuffer);
            this.gl.enableVertexAttribArray(sizeLocation);
            this.gl.vertexAttribPointer(sizeLocation, 1, this.gl.FLOAT, false, 0, 0);
        }

        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255
            } : null;
        }

        animate() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            
            // Update uniforms
            const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
            const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
            
            this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
            this.gl.uniform1f(timeLocation, performance.now() * 0.001);

            // Draw particles
            this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
            
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        onResize() {
            const container = document.getElementById(this.config.container);
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }

        setPerformanceMode(mode) {
            // WebGL performance adjustments
            switch (mode) {
                case 'low':
                    this.particleCount = Math.floor(this.config.particleCount * 0.5);
                    break;
                case 'medium':
                    this.particleCount = Math.floor(this.config.particleCount * 0.75);
                    break;
                case 'high':
                    this.particleCount = this.config.particleCount;
                    break;
            }
        }

        pause() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        resume() {
            if (!this.animationId) {
                this.animate();
            }
        }

        destroy() {
            this.pause();
            if (this.gl && this.program) {
                this.gl.deleteProgram(this.program);
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // ===================================================================
    // PARTICLE EFFECTS LIBRARY
    // ===================================================================

    class ParticleEffects {
        static createExplosion(x, y, options = {}) {
            const defaults = {
                count: 20,
                colors: ['#ff006e', '#8338ec', '#00d4ff'],
                duration: 1000,
                radius: 100
            };
            
            const config = { ...defaults, ...options };
            const container = document.body;
            
            for (let i = 0; i < config.count; i++) {
                const particle = document.createElement('div');
                particle.className = 'explosion-particle';
                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: 4px;
                    height: 4px;
                    background: ${config.colors[Math.floor(Math.random() * config.colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: explosion-burst ${config.duration}ms ease-out forwards;
                `;
                
                // Calculate random direction
                const angle = (Math.PI * 2 * i) / config.count;
                const distance = Math.random() * config.radius;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                particle.style.setProperty('--end-x', `${endX}px`);
                particle.style.setProperty('--end-y', `${endY}px`);
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, config.duration);
            }
            
            // Add explosion animation
            const explosionStyle = `
                @keyframes explosion-burst {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--end-x), var(--end-y)) scale(0);
                        opacity: 0;
                    }
                }
            `;
            
            if (!document.querySelector('#explosion-styles')) {
                const style = document.createElement('style');
                style.id = 'explosion-styles';
                style.textContent = explosionStyle;
                document.head.appendChild(style);
            }
        }

        static createTrail(element, options = {}) {
            const defaults = {
                duration: 500,
                color: '#00d4ff',
                frequency: 50
            };
            
            const config = { ...defaults, ...options };
            let lastTrail = 0;
            
            const createTrailParticle = (x, y) => {
                const particle = document.createElement('div');
                particle.className = 'trail-particle';
                particle.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: 3px;
                    height: 3px;
                    background: ${config.color};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    animation: trail-fade ${config.duration}ms ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, config.duration);
            };
            
            const trailHandler = (e) => {
                const now = Date.now();
                if (now - lastTrail > config.frequency) {
                    lastTrail = now;
                    createTrailParticle(e.clientX, e.clientY);
                }
            };
            
            element.addEventListener('mousemove', trailHandler);
            
            // Add trail animation
            const trailStyle = `
                @keyframes trail-fade {
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
            
            // Return cleanup function
            return () => {
                element.removeEventListener('mousemove', trailHandler);
            };
        }

        static createWave(element, options = {}) {
            const defaults = {
                duration: 1000,
                color: 'rgba(0, 212, 255, 0.3)',
                scale: 1.5
            };
            
            const config = { ...defaults, ...options };
            
            const wave = document.createElement('div');
            wave.className = 'liquid-wave';
            wave.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${config.color};
                border-radius: inherit;
                pointer-events: none;
                animation: wave-expand ${config.duration}ms ease-out forwards;
                z-index: 1;
            `;
            
            element.style.position = 'relative';
            element.appendChild(wave);
            
            setTimeout(() => {
                if (wave.parentNode) {
                    wave.parentNode.removeChild(wave);
                }
            }, config.duration);
            
            // Add wave animation
            const waveStyle = `
                @keyframes wave-expand {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(${config.scale});
                        opacity: 0;
                    }
                }
            `;
            
            if (!document.querySelector('#wave-styles')) {
                const style = document.createElement('style');
                style.id = 'wave-styles';
                style.textContent = waveStyle;
                document.head.appendChild(style);
            }
        }
    }

    // ===================================================================
    // INITIALIZATION
    // ===================================================================

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize particle manager
        window.particleManager = new ParticleManager();
        
        // Make particle effects available globally
        window.ParticleEffects = ParticleEffects;
        
        console.log('✨ Particle system initialized successfully!');
    });

})();