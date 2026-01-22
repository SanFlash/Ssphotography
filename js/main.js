// Photography+ Studio - Main JavaScript
// Professional interactions and functionality with dynamic content loading

class PhotographyStudio {
    constructor() {
        this.dataManager = null;
        this.init();
    }

    init() {
        // Initialize data manager for dynamic content
        this.initializeDataManager();
        
        // Setup all functionality
        this.setupNavigation();
        this.loadDynamicGallery();
        this.loadDynamicServices();
        this.setupContactForm();
        this.setupScrollEffects();
        this.setupLazyLoading();
        
        // Track page view
        this.trackPageView();
    }

    // Initialize data manager
    initializeDataManager() {
        // Load data-manager if available
        if (typeof DataManager !== 'undefined') {
            this.dataManager = window.DataManager;
        } else {
            // Create inline data manager for landing page
            this.createInlineDataManager();
        }
    }

    createInlineDataManager() {
        // Minimal data manager for landing page
        this.dataManager = {
            getVisiblePhotos: () => {
                try {
                    const photos = JSON.parse(localStorage.getItem('photo_studio_gallery') || '[]');
                    return photos.filter(p => p.visible !== false);
                } catch (e) {
                    return [];
                }
            },
            getVisibleServices: () => {
                try {
                    const services = JSON.parse(localStorage.getItem('photo_studio_services') || '[]');
                    return services.filter(s => s.visible !== false);
                } catch (e) {
                    return [];
                }
            },
            incrementPhotoViews: (id) => {
                try {
                    const photos = JSON.parse(localStorage.getItem('photo_studio_gallery') || '[]');
                    const photo = photos.find(p => p.id === id);
                    if (photo) {
                        photo.views = (photo.views || 0) + 1;
                        localStorage.setItem('photo_studio_gallery', JSON.stringify(photos));
                    }
                } catch (e) {
                    console.error('Error updating views:', e);
                }
            }
        };
    }

    // Track page view
    trackPageView() {
        try {
            const analytics = JSON.parse(localStorage.getItem('photo_studio_analytics') || '{}');
            analytics.pageViews = (analytics.pageViews || 0) + 1;
            analytics.lastVisit = new Date().toISOString();
            localStorage.setItem('photo_studio_analytics', JSON.stringify(analytics));
        } catch (e) {
            console.error('Error tracking page view:', e);
        }
    }

    // Dynamic Gallery Loading
    loadDynamicGallery() {
        const galleryGrid = document.querySelector('.gallery__grid');
        if (!galleryGrid) return;

        const photos = this.dataManager.getVisiblePhotos();
        
        // If no photos in storage, use existing HTML content
        if (photos.length === 0) {
            console.log('No dynamic photos found, using static content');
            return;
        }

        // Clear existing content
        galleryGrid.innerHTML = '';

        // Render dynamic photos
        photos.forEach(photo => {
            const photoElement = this.createGalleryItem(photo);
            galleryGrid.appendChild(photoElement);
        });

        // Re-setup gallery functionality
        this.setupGalleryInteractions();
    }

    createGalleryItem(photo) {
        const div = document.createElement('div');
        div.className = 'gallery__item';
        div.setAttribute('data-category', photo.category);
        div.setAttribute('data-id', photo.id);

        div.innerHTML = `
            <img src="${photo.image}" alt="${photo.title}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
            <div class="gallery__overlay">
                <h3>${photo.title}</h3>
                <p>${photo.description || ''}</p>
                ${photo.tags ? `<div class="gallery__tags">${photo.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
            </div>
        `;

        return div;
    }

    // Dynamic Services Loading
    loadDynamicServices() {
        const servicesGrid = document.querySelector('.services__grid');
        if (!servicesGrid) return;

        const services = this.dataManager.getVisibleServices();
        
        // If no services in storage, use existing HTML content
        if (services.length === 0) {
            console.log('No dynamic services found, using static content');
            return;
        }

        // Clear existing content
        servicesGrid.innerHTML = '';

        // Render dynamic services
        services.forEach(service => {
            const serviceElement = this.createServiceCard(service);
            servicesGrid.appendChild(serviceElement);
        });
    }

    createServiceCard(service) {
        const div = document.createElement('div');
        div.className = 'service__card';

        const features = service.features && service.features.length > 0 
            ? service.features.map(f => `<li>${f}</li>`).join('') 
            : '';

        div.innerHTML = `
            <div class="service__icon">
                <i class="fas ${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            ${features ? `<ul class="service__features">${features}</ul>` : ''}
            <div class="service__price">${service.price}</div>
        `;

        return div;
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
    setupGalleryInteractions() {
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
                const description = item.querySelector('p')?.textContent || '';
                const photoId = item.getAttribute('data-id');
                
                // Track view
                if (photoId) {
                    this.dataManager.incrementPhotoViews(photoId);
                }
                
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
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
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
                    // Simulate API call and store in localStorage
                    await this.submitContactForm(data);
                    
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

    // Submit form and store in localStorage
    submitContactForm(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    // Store contact submission in localStorage
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
                    
                    console.log('Contact form submitted:', newContact);
                    resolve();
                } catch (error) {
                    console.error('Error saving contact:', error);
                    resolve(); // Still resolve to show success message
                }
            }, 1500);
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
        const animateElements = document.querySelectorAll('.service__card, .gallery__item, .about__content > *, .stat');
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
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
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

// Add dynamic styles (unchanged)
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
        transition: transform 0.2s;
    }
    
    .lightbox-close:hover {
        transform: scale(1.1);
    }
    
    .lightbox-image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        display: block;
    }
    
    .lightbox-info {
        padding: 20px;
        text-align: center;
    }
    
    .lightbox-info h3 {
        margin-bottom: 10px;
        color: var(--primary);
    }

    .gallery__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 10px;
        justify-content: center;
    }

    .gallery__tags .tag {
        background: rgba(255, 255, 255, 0.2);
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
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
