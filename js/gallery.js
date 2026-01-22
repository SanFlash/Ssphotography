/**
 * PHOTOGRAPHY+ STUDIO - GALLERY MANAGEMENT
 * Advanced gallery with filtering, lazy loading, and camera-themed interactions
 */

(function() {
    'use strict';

    // ===================================================================
    // GALLERY CONFIGURATION
    // ===================================================================

    const GALLERY_CONFIG = {
        // Grid layout options
        gridColumns: {
            mobile: 1,
            tablet: 2,
            desktop: 3,
            large: 4,
            xlarge: 5
        },
        
        // Animation settings
        animation: {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            staggerDelay: 100
        },
        
        // Lazy loading
        lazyLoading: {
            threshold: 0.1,
            rootMargin: '50px'
        },
        
        // Lightbox settings
        lightbox: {
            enabled: true,
            keyboard: true,
            loop: true,
            counter: true,
            zoom: true
        },
        
        // Filter settings
        filter: {
            animation: 'fade',
            duration: 400
        },
        
        // Touch/swipe settings
        touch: {
            threshold: 50,
            enabled: true
        }
    };

    // ===================================================================
    // GALLERY ITEMS DATABASE
    // ===================================================================

    const GALLERY_ITEMS = [
        {
            id: 1,
            title: 'Sunset Wedding Vows',
            category: 'wedding',
            tags: ['outdoor', 'sunset', 'romantic'],
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
            description: 'A magical sunset wedding ceremony with golden hour lighting',
            photographer: 'Sarah Mitchell',
            date: '2024-03-15',
            featured: true,
            rating: 5
        },
        {
            id: 2,
            title: 'Corporate Conference',
            category: 'event',
            tags: ['corporate', 'conference', 'professional'],
            image: 'https://images.unsplash.com/photo-1505373877841-8d25dd690bde?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25dd690bde?w=400&h=300&fit=crop',
            description: 'Professional corporate event photography',
            photographer: 'John Davis',
            date: '2024-03-10',
            featured: false,
            rating: 4
        },
        {
            id: 3,
            title: 'Family Joy',
            category: 'portrait',
            tags: ['family', 'outdoor', 'natural'],
            image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=400&h=300&fit=crop',
            description: 'Capturing genuine family moments in natural light',
            photographer: 'Emma Wilson',
            date: '2024-03-08',
            featured: true,
            rating: 5
        },
        {
            id: 4,
            title: 'Product Showcase',
            category: 'commercial',
            tags: ['product', 'commercial', 'studio'],
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            description: 'Professional product photography for marketing',
            photographer: 'Michael Chen',
            date: '2024-03-05',
            featured: false,
            rating: 4
        },
        {
            id: 5,
            title: 'Garden Romance',
            category: 'wedding',
            tags: ['wedding', 'garden', 'romantic'],
            image: 'https://images.unsplash.com/photo-1606800052052-208ae7ba5e4f?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1606800052052-208ae7ba5e4f?w=400&h=300&fit=crop',
            description: 'Intimate garden wedding with floral arrangements',
            photographer: 'Sarah Mitchell',
            date: '2024-02-28',
            featured: true,
            rating: 5
        },
        {
            id: 6,
            title: 'Birthday Celebration',
            category: 'event',
            tags: ['birthday', 'party', 'celebration'],
            image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop',
            description: 'Colorful birthday party photography',
            photographer: 'Lisa Thompson',
            date: '2024-02-25',
            featured: false,
            rating: 4
        },
        {
            id: 7,
            title: 'Executive Portrait',
            category: 'portrait',
            tags: ['business', 'executive', 'professional'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
            description: 'Professional business headshot photography',
            photographer: 'David Rodriguez',
            date: '2024-02-20',
            featured: false,
            rating: 5
        },
        {
            id: 8,
            title: 'Culinary Art',
            category: 'commercial',
            tags: ['food', 'restaurant', 'culinary'],
            image: 'https://images.unsplash.com/photo-1414235077429-338032a33d00?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1414235077429-338032a33d00?w=400&h=300&fit=crop',
            description: 'Appetizing food photography for restaurants',
            photographer: 'Jennifer Liu',
            date: '2024-02-18',
            featured: true,
            rating: 5
        },
        {
            id: 9,
            title: 'Beach Sunset Wedding',
            category: 'wedding',
            tags: ['beach', 'sunset', 'wedding'],
            image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop',
            description: 'Romantic beach wedding at sunset',
            photographer: 'Sarah Mitchell',
            date: '2024-02-15',
            featured: true,
            rating: 5
        },
        {
            id: 10,
            title: 'Tech Conference',
            category: 'event',
            tags: ['technology', 'conference', 'corporate'],
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
            description: 'Modern technology conference photography',
            photographer: 'Robert Kim',
            date: '2024-02-12',
            featured: false,
            rating: 4
        },
        {
            id: 11,
            title: 'Graduation Portrait',
            category: 'portrait',
            tags: ['graduation', 'senior', 'academic'],
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
            description: 'Graduation portrait session with cap and gown',
            photographer: 'Amanda Foster',
            date: '2024-02-10',
            featured: false,
            rating: 4
        },
        {
            id: 12,
            title: 'Fashion Editorial',
            category: 'commercial',
            tags: ['fashion', 'editorial', 'model'],
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
            description: 'High-fashion editorial photography',
            photographer: 'Sophie Laurent',
            date: '2024-02-08',
            featured: true,
            rating: 5
        }
    ];

    // ===================================================================
    // GALLERY MANAGER CLASS
    // ===================================================================

    class GalleryManager {
        constructor(config = {}) {
            this.config = { ...GALLERY_CONFIG, ...config };
            this.gallery = null;
            this.filterButtons = [];
            this.currentFilter = 'all';
            this.filteredItems = [];
            this.currentPage = 1;
            this.itemsPerPage = 8;
            this.isAnimating = false;
            this.observer = null;
            this.lightbox = null;
            this.touchStartX = 0;
            this.touchEndX = 0;
            
            this.init();
        }

        init() {
            this.setupGallery();
            this.setupFilters();
            this.setupLazyLoading();
            this.setupLightbox();
            this.setupTouchEvents();
            this.loadItems();
        }

        setupGallery() {
            this.gallery = document.getElementById('portfolio-gallery');
            if (!this.gallery) {
                console.warn('Gallery element not found');
                return;
            }

            // Add gallery classes
            this.gallery.classList.add('gallery-container');
            
            // Set up grid columns based on screen size
            this.updateGridColumns();
            window.addEventListener('resize', this.debounce(() => this.updateGridColumns(), 250));
        }

        updateGridColumns() {
            const width = window.innerWidth;
            let columns = this.config.gridColumns.mobile;

            if (width >= 1536) columns = this.config.gridColumns.xlarge;
            else if (width >= 1280) columns = this.config.gridColumns.large;
            else if (width >= 1024) columns = this.config.gridColumns.desktop;
            else if (width >= 768) columns = this.config.gridColumns.tablet;

            this.gallery.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }

        setupFilters() {
            const filterContainer = document.querySelector('.portfolio-filters');
            if (!filterContainer) return;

            this.filterButtons = Array.from(filterContainer.querySelectorAll('.filter-btn'));
            
            this.filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    this.applyFilter(filter);
                });
            });
        }

        applyFilter(filter) {
            if (this.isAnimating || filter === this.currentFilter) return;

            this.isAnimating = true;
            this.currentFilter = filter;
            this.currentPage = 1;

            // Update active filter button
            this.updateActiveFilterButton(filter);

            // Filter items
            this.filteredItems = filter === 'all' 
                ? [...GALLERY_ITEMS] 
                : GALLERY_ITEMS.filter(item => item.category === filter);

            // Animate transition
            this.animateFilterChange(() => {
                this.renderItems();
                this.isAnimating = false;
            });
        }

        updateActiveFilterButton(activeFilter) {
            this.filterButtons.forEach(button => {
                const isActive = button.getAttribute('data-filter') === activeFilter;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-pressed', isActive);
            });
        }

        animateFilterChange(callback) {
            const items = this.gallery.querySelectorAll('.gallery-item');
            
            if (items.length === 0) {
                callback();
                return;
            }

            // Fade out current items
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                }, index * 50);
            });

            // Wait for fade out, then callback
            setTimeout(() => {
                callback();
                
                // Fade in new items
                const newItems = this.gallery.querySelectorAll('.gallery-item');
                newItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * this.config.animation.staggerDelay);
                });
            }, items.length * 50 + 200);
        }

        renderItems() {
            const startIndex = 0;
            const endIndex = this.currentPage * this.itemsPerPage;
            const itemsToShow = this.filteredItems.slice(startIndex, endIndex);

            this.gallery.innerHTML = '';

            itemsToShow.forEach((item, index) => {
                const galleryItem = this.createGalleryItem(item, index);
                this.gallery.appendChild(galleryItem);
            });

            // Update load more button
            this.updateLoadMoreButton();

            // Initialize lazy loading for new items
            this.initLazyLoading();
        }

        createGalleryItem(item, index) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.setAttribute('data-index', index);
            galleryItem.setAttribute('data-id', item.id);

            // Create inner HTML
            galleryItem.innerHTML = `
                <div class="gallery-image-container">
                    <img 
                        class="gallery-image lazy-image" 
                        data-src="${item.thumbnail}"
                        data-full-src="${item.image}"
                        alt="${item.title}"
                        loading="lazy"
                    />
                    <div class="gallery-overlay">
                        <div class="gallery-content">
                            <h3 class="gallery-title">${item.title}</h3>
                            <p class="gallery-description">${item.description}</p>
                            <div class="gallery-meta">
                                <span class="gallery-category">${item.category}</span>
                                <span class="gallery-date">${this.formatDate(item.date)}</span>
                            </div>
                            ${item.featured ? '<span class="gallery-featured">Featured</span>' : ''}
                        </div>
                    </div>
                </div>
            `;

            // Add click event for lightbox
            galleryItem.addEventListener('click', () => this.openLightbox(item));

            // Add hover effects
            this.addHoverEffects(galleryItem);

            return galleryItem;
        }

        addHoverEffects(item) {
            const imageContainer = item.querySelector('.gallery-image-container');
            
            if (!imageContainer) return;

            // Mouse enter effect
            imageContainer.addEventListener('mouseenter', () => {
                const overlay = item.querySelector('.gallery-overlay');
                if (overlay) {
                    overlay.style.opacity = '1';
                    overlay.style.transform = 'translateY(0)';
                }
            });

            // Mouse leave effect
            imageContainer.addEventListener('mouseleave', () => {
                const overlay = item.querySelector('.gallery-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'translateY(20px)';
                }
            });
        }

        setupLazyLoading() {
            if (!('IntersectionObserver' in window)) {
                // Fallback for browsers without IntersectionObserver
                this.loadAllImages();
                return;
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: this.config.lazyLoading.rootMargin,
                threshold: this.config.lazyLoading.threshold
            });
        }

        initLazyLoading() {
            const images = this.gallery.querySelectorAll('.lazy-image');
            images.forEach(img => {
                if (this.observer) {
                    this.observer.observe(img);
                }
            });
        }

        loadImage(img) {
            const src = img.getAttribute('data-src');
            const fullSrc = img.getAttribute('data-full-src');
            
            if (src) {
                // Create a new image to preload
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    img.src = src;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                    
                    // Add camera flash effect
                    this.addCameraFlash(img);
                };
                preloadImg.onerror = () => {
                    // Fallback image
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                    img.classList.remove('lazy-image');
                };
                preloadImg.src = src;
            }
        }

        loadAllImages() {
            const images = this.gallery.querySelectorAll('.lazy-image');
            images.forEach(img => this.loadImage(img));
        }

        addCameraFlash(img) {
            // Create flash effect
            const flash = document.createElement('div');
            flash.className = 'camera-flash-effect';
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                opacity: 0;
                pointer-events: none;
                z-index: 10;
            `;

            img.parentElement.appendChild(flash);

            // Animate flash
            requestAnimationFrame(() => {
                flash.style.opacity = '0.8';
                flash.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        if (flash.parentElement) {
                            flash.parentElement.removeChild(flash);
                        }
                    }, 300);
                }, 100);
            });
        }

        setupLightbox() {
            if (!this.config.lightbox.enabled) return;

            this.lightbox = new LightboxManager(this.config.lightbox);
        }

        openLightbox(item) {
            if (this.lightbox) {
                this.lightbox.open(item);
            }
        }

        setupTouchEvents() {
            if (!this.config.touch.enabled) return;

            let touchStartX = 0;
            let touchStartY = 0;

            this.gallery.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            this.gallery.addEventListener('touchend', (e) => {
                if (!touchStartX || !touchStartY) return;

                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;

                // Determine if horizontal swipe
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.config.touch.threshold) {
                    if (diffX > 0) {
                        // Swipe left - next item
                        this.handleSwipe('left');
                    } else {
                        // Swipe right - previous item
                        this.handleSwipe('right');
                    }
                }

                // Reset
                touchStartX = 0;
                touchStartY = 0;
            });
        }

        handleSwipe(direction) {
            // Implement swipe navigation logic
            console.log('Swipe detected:', direction);
        }

        loadItems() {
            // Initial load with animation
            this.filteredItems = [...GALLERY_ITEMS];
            this.renderItems();
            
            // Add entrance animation
            this.animateEntrance();
        }

        animateEntrance() {
            const items = this.gallery.querySelectorAll('.gallery-item');
            
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px) scale(0.9)';
                
                setTimeout(() => {
                    item.style.transition = `all ${this.config.animation.duration}ms ${this.config.animation.easing}`;
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, index * this.config.animation.staggerDelay);
            });
        }

        updateLoadMoreButton() {
            const loadMoreBtn = document.getElementById('load-more');
            if (!loadMoreBtn) return;

            const hasMore = this.currentPage * this.itemsPerPage < this.filteredItems.length;
            loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';

            if (hasMore) {
                loadMoreBtn.addEventListener('click', () => this.loadMore());
            }
        }

        loadMore() {
            if (this.isAnimating) return;

            this.isAnimating = true;
            const loadMoreBtn = document.getElementById('load-more');
            const spinner = loadMoreBtn.querySelector('.fa-spinner');
            const text = loadMoreBtn.childNodes[0];

            // Show loading state
            if (spinner) spinner.style.display = 'inline-block';
            if (text) text.textContent = 'Loading...';

            // Simulate loading delay
            setTimeout(() => {
                this.currentPage++;
                this.renderMoreItems();
                
                // Reset button state
                if (spinner) spinner.style.display = 'none';
                if (text) text.textContent = 'Load More';
                this.isAnimating = false;
            }, 1000);
        }

        renderMoreItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = this.currentPage * this.itemsPerPage;
            const newItems = this.filteredItems.slice(startIndex, endIndex);

            newItems.forEach((item, index) => {
                const galleryItem = this.createGalleryItem(item, startIndex + index);
                this.gallery.appendChild(galleryItem);
            });

            // Initialize lazy loading for new items
            this.initLazyLoading();
            
            // Update load more button
            this.updateLoadMoreButton();

            // Animate new items
            this.animateNewItems(newItems.length);
        }

        animateNewItems(count) {
            const newItemElements = Array.from(this.gallery.querySelectorAll('.gallery-item')).slice(-count);
            
            newItemElements.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = `all ${this.config.animation.duration}ms ${this.config.animation.easing}`;
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * this.config.animation.staggerDelay);
            });
        }

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }

        // Utility function for debouncing
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

        // Method to add custom items
        addItems(items) {
            GALLERY_ITEMS.push(...items);
            if (this.currentFilter === 'all') {
                this.filteredItems = [...GALLERY_ITEMS];
                this.renderItems();
            }
        }

        // Method to remove items
        removeItems(itemIds) {
            const idsToRemove = new Set(itemIds);
            
            // Remove from main array
            for (let i = GALLERY_ITEMS.length - 1; i >= 0; i--) {
                if (idsToRemove.has(GALLERY_ITEMS[i].id)) {
                    GALLERY_ITEMS.splice(i, 1);
                }
            }

            // Update filtered items and re-render
            this.applyFilter(this.currentFilter);
        }

        // Method to update an item
        updateItem(itemId, updates) {
            const item = GALLERY_ITEMS.find(item => item.id === itemId);
            if (item) {
                Object.assign(item, updates);
                this.applyFilter(this.currentFilter);
            }
        }

        // Method to get current state
        getState() {
            return {
                currentFilter: this.currentFilter,
                currentPage: this.currentPage,
                totalItems: this.filteredItems.length,
                itemsPerPage: this.itemsPerPage,
                isAnimating: this.isAnimating
            };
        }
    }

    // ===================================================================
    // LIGHTBOX MANAGER
    // ===================================================================

    class LightboxManager {
        constructor(config = {}) {
            this.config = { ...GALLERY_CONFIG.lightbox, ...config };
            this.currentItem = null;
            this.currentIndex = 0;
            this.items = [];
            this.isOpen = false;
            this.isAnimating = false;
            
            this.init();
        }

        init() {
            this.createLightbox();
            this.bindEvents();
        }

        createLightbox() {
            // Create lightbox container
            this.lightbox = document.createElement('div');
            this.lightbox.className = 'lightbox';
            this.lightbox.setAttribute('role', 'dialog');
            this.lightbox.setAttribute('aria-label', 'Image lightbox');
            this.lightbox.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <div class="lightbox-container">
                    <button class="lightbox-close" aria-label="Close lightbox">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="lightbox-prev" aria-label="Previous image">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-next" aria-label="Next image">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="lightbox-content">
                        <img class="lightbox-image" src="" alt="">
                        <div class="lightbox-info">
                            <h3 class="lightbox-title"></h3>
                            <p class="lightbox-description"></p>
                            <div class="lightbox-meta">
                                <span class="lightbox-category"></span>
                                <span class="lightbox-date"></span>
                            </div>
                        </div>
                    </div>
                    <div class="lightbox-counter"></div>
                    <div class="lightbox-loading">
                        <div class="spinner"></div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.lightbox);
        }

        bindEvents() {
            // Close button
            const closeBtn = this.lightbox.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => this.close());

            // Navigation buttons
            const prevBtn = this.lightbox.querySelector('.lightbox-prev');
            const nextBtn = this.lightbox.querySelector('.lightbox-next');
            
            prevBtn.addEventListener('click', () => this.previous());
            nextBtn.addEventListener('click', () => this.next());

            // Backdrop click
            const backdrop = this.lightbox.querySelector('.lightbox-backdrop');
            backdrop.addEventListener('click', () => this.close());

            // Keyboard navigation
            if (this.config.keyboard) {
                document.addEventListener('keydown', (e) => {
                    if (!this.isOpen) return;
                    
                    switch(e.key) {
                        case 'Escape':
                            this.close();
                            break;
                        case 'ArrowLeft':
                            this.previous();
                            break;
                        case 'ArrowRight':
                            this.next();
                            break;
                    }
                });
            }

            // Touch/swipe support
            this.setupTouchEvents();
        }

        setupTouchEvents() {
            let touchStartX = 0;
            let touchStartY = 0;

            this.lightbox.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });

            this.lightbox.addEventListener('touchend', (e) => {
                if (!touchStartX || !touchStartY) return;

                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;

                // Determine if horizontal swipe
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.next();
                    } else {
                        this.previous();
                    }
                }

                // Reset
                touchStartX = 0;
                touchStartY = 0;
            });
        }

        open(item, items = []) {
            if (this.isAnimating) return;

            this.currentItem = item;
            this.items = items.length > 0 ? items : [item];
            this.currentIndex = this.items.findIndex(i => i.id === item.id);
            
            this.isAnimating = true;
            this.isOpen = true;

            // Show lightbox
            this.lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');

            // Load and display image
            this.loadCurrentImage(() => {
                this.isAnimating = false;
            });

            // Update counter
            this.updateCounter();

            // Focus management
            const closeBtn = this.lightbox.querySelector('.lightbox-close');
            setTimeout(() => closeBtn.focus(), 100);
        }

        close() {
            if (this.isAnimating) return;

            this.isAnimating = true;
            this.isOpen = false;

            this.lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');

            setTimeout(() => {
                this.isAnimating = false;
                this.currentItem = null;
                this.items = [];
                this.currentIndex = 0;
            }, 300);
        }

        previous() {
            if (this.isAnimating || !this.config.loop && this.currentIndex === 0) return;

            this.currentIndex = this.currentIndex > 0 
                ? this.currentIndex - 1 
                : (this.config.loop ? this.items.length - 1 : 0);

            this.loadCurrentImage();
            this.updateCounter();
        }

        next() {
            if (this.isAnimating || !this.config.loop && this.currentIndex === this.items.length - 1) return;

            this.currentIndex = this.currentIndex < this.items.length - 1 
                ? this.currentIndex + 1 
                : (this.config.loop ? 0 : this.items.length - 1);

            this.loadCurrentImage();
            this.updateCounter();
        }

        loadCurrentImage(callback) {
            const item = this.items[this.currentIndex];
            if (!item) return;

            const img = this.lightbox.querySelector('.lightbox-image');
            const loading = this.lightbox.querySelector('.lightbox-loading');
            
            // Show loading
            if (loading) loading.style.display = 'flex';

            // Preload image
            const preloadImg = new Image();
            preloadImg.onload = () => {
                img.src = item.image;
                img.alt = item.title;
                
                // Update info
                this.updateInfo(item);
                
                // Hide loading
                if (loading) loading.style.display = 'none';
                
                if (callback) callback();
            };
            
            preloadImg.onerror = () => {
                // Fallback image
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                if (loading) loading.style.display = 'none';
                if (callback) callback();
            };
            
            preloadImg.src = item.image;
        }

        updateInfo(item) {
            const title = this.lightbox.querySelector('.lightbox-title');
            const description = this.lightbox.querySelector('.lightbox-description');
            const category = this.lightbox.querySelector('.lightbox-category');
            const date = this.lightbox.querySelector('.lightbox-date');

            if (title) title.textContent = item.title;
            if (description) description.textContent = item.description;
            if (category) category.textContent = item.category;
            if (date) date.textContent = this.formatDate(item.date);
        }

        updateCounter() {
            if (!this.config.counter) return;
            
            const counter = this.lightbox.querySelector('.lightbox-counter');
            if (counter && this.items.length > 0) {
                counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
            }
        }

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    // ===================================================================
    // INITIALIZE GALLERY
    // ===================================================================

    document.addEventListener('DOMContentLoaded', () => {
        const gallery = new GalleryManager();
        
        // Make gallery available globally for external access
        window.photographyGallery = gallery;
    });

})();