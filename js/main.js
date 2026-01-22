// Photography+ Studio - Main JavaScript
// Professional interactions and functionality

class PhotographyStudio {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupGallery();
        this.setupContactForm();
        this.setupScrollEffects();
        this.setupLazyLoading();
    }

    // Navigation
    setupNavigation() {
        const navToggle = document.querySelector('.nav__toggle');
        const navMenu = document.querySelector('.nav__menu');
        const navLinks = document.querySelectorAll('.nav__link');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    navToggle?.classList.remove('active');
                    navMenu?.classList.remove('active');
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'var(--background)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // Gallery functionality
    setupGallery() {
        const filterButtons = document.querySelectorAll('.filter__btn');
        const galleryItems = document.querySelectorAll('.gallery__item');

        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Gallery item interactions
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                
                this.openLightbox(img.src, title, description);
            });
        });
    }

    // Lightbox functionality
    openLightbox(src, title, description) {
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <img src="${src}" alt="${title}" class="lightbox-image">
                <div class="lightbox-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Close functionality
        const closeBtn = overlay.querySelector('.lightbox-close');
        const closeLightbox = () => {
            overlay.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // Contact form
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Simple validation
                if (!this.validateForm(data)) {
                    return;
                }
                
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                try {
                    // Simulate API call
                    await this.simulateFormSubmission(data);
                    
                    // Success
                    this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                    
                } catch (error) {
                    // Error
                    this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                } finally {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }

    // Form validation
    validateForm(data) {
        const errors = [];
        
        if (!data.name?.trim()) {
            errors.push('Please enter your name');
        }
        
        if (!data.email?.trim()) {
            errors.push('Please enter your email address');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.service) {
            errors.push('Please select a service type');
        }
        
        if (!data.message?.trim()) {
            errors.push('Please enter your message');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Simulate form submission
    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Store contact submission in localStorage for admin dashboard
                const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
                const newContact = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    name: data.name,
                    email: data.email,
                    service: data.service,
                    message: data.message,
                    createdAt: new Date().toISOString()
                };
                contacts.unshift(newContact);
                localStorage.setItem('contacts', JSON.stringify(contacts));
                
                console.log('Form submission data:', data);
                resolve();
            }, 2000);
        });
    }

    // Scroll effects
    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service__card, .gallery__item, .about__content > *');
        animateElements.forEach(el => observer.observe(el));
    }

    // Lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
            clearTimeout(autoRemove);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotographyStudio();
});

// Add some CSS for dynamic elements
const dynamicStyles = `
    .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background-color: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .lightbox-close {
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2rem;
        color: #333;
        cursor: pointer;
        z-index: 1;
    }
    
    .lightbox-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
    }
    
    .lightbox-info {
        padding: 20px;
        text-align: center;
    }
    
    .lightbox-info h3 {
        margin-bottom: 10px;
        color: var(--primary);
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1500;
        animation: slideInRight 0.3s ease;
    }
    
    .notification--success {
        border-left: 4px solid var(--success);
    }
    
    .notification--error {
        border-left: 4px solid var(--error);
    }
    
    .notification__content {
        padding: 15px 20px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
    }
    
    .notification__message {
        flex: 1;
        line-height: 1.5;
    }
    
    .notification__close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #999;
        padding: 0;
        line-height: 1;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
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
`;

// Add dynamic styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);