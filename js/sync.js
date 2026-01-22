/**
 * PHOTOGRAPHY+ STUDIO - REAL-TIME SYNC
 * Synchronizes content between admin dashboard and public website
 */

(function() {
    'use strict';

    // Sync Configuration
    const SYNC_CONFIG = {
        enabled: true,
        interval: 5000, // 5 seconds for demo purposes
        storageKey: 'photographyPlusSync',
        channels: {
            gallery: 'gallery_update',
            events: 'events_update',
            bookings: 'bookings_update',
            settings: 'settings_update',
            stats: 'stats_update'
        }
    };

    // Sync State
    const syncState = {
        isConnected: false,
        lastUpdate: null,
        pendingChanges: [],
        syncInterval: null
    };

    /**
     * Initialize Real-time Sync
     */
    function initSync() {
        if (!SYNC_CONFIG.enabled) return;
        
        console.log('🔄 Initializing real-time sync...');
        
        // Initialize sync channels
        initSyncChannels();
        
        // Start sync interval
        startSyncInterval();
        
        // Listen for storage events (cross-tab communication)
        window.addEventListener('storage', handleStorageEvent);
        
        // Listen for custom events
        window.addEventListener('themeChanged', handleThemeChange);
        
        syncState.isConnected = true;
        console.log('✅ Real-time sync initialized!');
    }

    /**
     * Initialize Sync Channels
     */
    function initSyncChannels() {
        // Create broadcast channels for real-time communication
        Object.values(SYNC_CONFIG.channels).forEach(channel => {
            if ('BroadcastChannel' in window) {
                const broadcast = new BroadcastChannel(channel);
                broadcast.onmessage = handleBroadcastMessage;
            }
        });
    }

    /**
     * Handle Broadcast Messages
     */
    function handleBroadcastMessage(event) {
        const { type, data, timestamp } = event.data;
        
        switch(type) {
            case 'gallery_update':
                syncGallery(data);
                break;
            case 'events_update':
                syncEvents(data);
                break;
            case 'bookings_update':
                syncBookings(data);
                break;
            case 'settings_update':
                syncSettings(data);
                break;
            case 'stats_update':
                syncStats(data);
                break;
        }
        
        syncState.lastUpdate = timestamp;
    }

    /**
     * Start Sync Interval
     */
    function startSyncInterval() {
        syncState.syncInterval = setInterval(() => {
            checkForUpdates();
        }, SYNC_CONFIG.interval);
    }

    /**
     * Check for Updates
     */
    function checkForUpdates() {
        const lastSync = localStorage.getItem(`${SYNC_CONFIG.storageKey}_lastSync`);
        const currentTime = Date.now();
        
        // Check if there are updates from other tabs/windows
        Object.keys(SYNC_CONFIG.channels).forEach(channel => {
            const channelData = localStorage.getItem(`${SYNC_CONFIG.storageKey}_${channel}`);
            if (channelData) {
                const { data, timestamp } = JSON.parse(channelData);
                if (!lastSync || timestamp > parseInt(lastSync)) {
                    // There's new data to sync
                    handleChannelUpdate(channel, data);
                }
            }
        });
        
        // Update last sync time
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_lastSync`, currentTime.toString());
    }

    /**
     * Handle Channel Updates
     */
    function handleChannelUpdate(channel, data) {
        switch(channel) {
            case 'gallery':
                syncGallery(data);
                break;
            case 'events':
                syncEvents(data);
                break;
            case 'bookings':
                syncBookings(data);
                break;
            case 'settings':
                syncSettings(data);
                break;
            case 'stats':
                syncStats(data);
                break;
        }
    }

    /**
     * Sync Gallery Updates
     */
    function syncGallery(data) {
        const { action, item } = data;
        
        switch(action) {
            case 'add':
                addGalleryItem(item);
                break;
            case 'update':
                updateGalleryItem(item);
                break;
            case 'delete':
                deleteGalleryItem(item.id);
                break;
            case 'bulk_update':
                updateGalleryItems(item);
                break;
        }
        
        // Update local storage
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_gallery`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        // Broadcast to other tabs
        broadcastUpdate('gallery_update', data);
    }

    /**
     * Sync Events Updates
     */
    function syncEvents(data) {
        const { action, event } = data;
        
        switch(action) {
            case 'add':
                addEvent(event);
                break;
            case 'update':
                updateEvent(event);
                break;
            case 'delete':
                deleteEvent(event.id);
                break;
            case 'status_change':
                updateEventStatus(event.id, event.status);
                break;
        }
        
        // Update local storage
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_events`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        // Broadcast to other tabs
        broadcastUpdate('events_update', data);
    }

    /**
     * Sync Bookings Updates
     */
    function syncBookings(data) {
        const { action, booking } = data;
        
        switch(action) {
            case 'add':
                addBooking(booking);
                break;
            case 'update':
                updateBooking(booking);
                break;
            case 'status_change':
                updateBookingStatus(booking.id, booking.status);
                break;
        }
        
        // Update local storage
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_bookings`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        // Broadcast to other tabs
        broadcastUpdate('bookings_update', data);
    }

    /**
     * Sync Settings Updates
     */
    function syncSettings(data) {
        const { action, settings } = data;
        
        switch(action) {
            case 'update':
                updateSettings(settings);
                break;
            case 'theme_change':
                applyTheme(settings.theme);
                break;
        }
        
        // Update local storage
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_settings`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        // Broadcast to other tabs
        broadcastUpdate('settings_update', data);
    }

    /**
     * Sync Stats Updates
     */
    function syncStats(data) {
        const { stats } = data;
        
        // Update stats display
        updateStatsDisplay(stats);
        
        // Update local storage
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_stats`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        // Broadcast to other tabs
        broadcastUpdate('stats_update', data);
    }

    /**
     * Gallery Item Operations
     */
    function addGalleryItem(item) {
        // Add to public gallery
        const galleryGrid = document.getElementById('portfolio-grid');
        if (galleryGrid) {
            const galleryItem = createGalleryElement(item);
            galleryGrid.appendChild(galleryItem);
        }
        
        // Add to admin gallery
        const adminGallery = document.getElementById('admin-gallery-grid');
        if (adminGallery) {
            const adminItem = createAdminGalleryElement(item);
            adminGallery.appendChild(adminItem);
        }
        
        console.log('Gallery item added:', item);
    }

    function updateGalleryItem(item) {
        // Update in public gallery
        const galleryItem = document.querySelector(`[data-gallery-id="${item.id}"]`);
        if (galleryItem) {
            updateGalleryElement(galleryItem, item);
        }
        
        // Update in admin gallery
        const adminItem = document.querySelector(`[data-admin-gallery-id="${item.id}"]`);
        if (adminItem) {
            updateAdminGalleryElement(adminItem, item);
        }
        
        console.log('Gallery item updated:', item);
    }

    function deleteGalleryItem(id) {
        // Remove from public gallery
        const galleryItem = document.querySelector(`[data-gallery-id="${id}"]`);
        if (galleryItem) {
            galleryItem.remove();
        }
        
        // Remove from admin gallery
        const adminItem = document.querySelector(`[data-admin-gallery-id="${id}"]`);
        if (adminItem) {
            adminItem.remove();
        }
        
        console.log('Gallery item deleted:', id);
    }

    function updateGalleryItems(items) {
        // Bulk update gallery items
        items.forEach(item => {
            updateGalleryItem(item);
        });
        
        console.log('Gallery items updated:', items.length);
    }

    /**
     * Event Operations
     */
    function addEvent(event) {
        // Add to public events
        const eventsList = document.getElementById('events-list');
        if (eventsList) {
            const eventElement = createEventElement(event);
            eventsList.appendChild(eventElement);
        }
        
        // Add to admin events
        const adminEvents = document.getElementById('events-list');
        if (adminEvents && window.AdminDashboard) {
            // Refresh admin events
            window.AdminDashboard.loadEvents();
        }
        
        console.log('Event added:', event);
    }

    function updateEvent(event) {
        // Update in public events
        const eventElement = document.querySelector(`[data-event-id="${event.id}"]`);
        if (eventElement) {
            updateEventElement(eventElement, event);
        }
        
        // Update in admin events
        if (window.AdminDashboard) {
            window.AdminDashboard.loadEvents();
        }
        
        console.log('Event updated:', event);
    }

    function deleteEvent(id) {
        // Remove from public events
        const eventElement = document.querySelector(`[data-event-id="${id}"]`);
        if (eventElement) {
            eventElement.remove();
        }
        
        // Remove from admin events
        if (window.AdminDashboard) {
            window.AdminDashboard.loadEvents();
        }
        
        console.log('Event deleted:', id);
    }

    function updateEventStatus(id, status) {
        // Update event status
        const eventElement = document.querySelector(`[data-event-id="${id}"]`);
        if (eventElement) {
            const statusBadge = eventElement.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${status}`;
                statusBadge.textContent = status;
            }
        }
        
        // Update in admin
        if (window.AdminDashboard) {
            window.AdminDashboard.loadEvents();
        }
        
        console.log('Event status updated:', id, status);
    }

    /**
     * Booking Operations
     */
    function addBooking(booking) {
        // Add to public bookings
        const bookingsTable = document.getElementById('bookings-tbody');
        if (bookingsTable) {
            const bookingRow = createBookingElement(booking);
            bookingsTable.appendChild(bookingRow);
        }
        
        // Add to admin bookings
        if (window.AdminDashboard) {
            window.AdminDashboard.loadBookings();
        }
        
        console.log('Booking added:', booking);
    }

    function updateBooking(booking) {
        // Update in public bookings
        const bookingRow = document.querySelector(`[data-booking-id="${booking.id}"]`);
        if (bookingRow) {
            updateBookingElement(bookingRow, booking);
        }
        
        // Update in admin bookings
        if (window.AdminDashboard) {
            window.AdminDashboard.loadBookings();
        }
        
        console.log('Booking updated:', booking);
    }

    function updateBookingStatus(id, status) {
        // Update booking status
        const bookingRow = document.querySelector(`[data-booking-id="${id}"]`);
        if (bookingRow) {
            const statusBadge = bookingRow.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${status}`;
                statusBadge.textContent = status;
            }
        }
        
        // Update in admin
        if (window.AdminDashboard) {
            window.AdminDashboard.loadBookings();
        }
        
        console.log('Booking status updated:', id, status);
    }

    /**
     * Settings Operations
     */
    function updateSettings(settings) {
        // Apply settings changes
        if (settings.theme) {
            applyTheme(settings.theme);
        }
        
        if (settings.animations !== undefined) {
            toggleAnimations(settings.animations);
        }
        
        if (settings.particles !== undefined) {
            toggleParticles(settings.particles);
        }
        
        console.log('Settings updated:', settings);
    }

    function applyTheme(theme) {
        // Apply theme to the website
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme-specific CSS variables
        const themes = {
            default: {
                '--primary-dark': '#1a1a1a',
                '--primary-light': '#f8f9fa',
                '--accent-gold': '#d4af37'
            },
            dark: {
                '--primary-dark': '#0a0a0a',
                '--primary-light': '#2a2a2a',
                '--accent-gold': '#f4d03f'
            },
            light: {
                '--primary-dark': '#ffffff',
                '--primary-light': '#f8f9fa',
                '--accent-gold': '#d4af37'
            },
            colorful: {
                '--primary-dark': '#2c3e50',
                '--primary-light': '#ecf0f1',
                '--accent-gold': '#e74c3c'
            }
        };
        
        if (themes[theme]) {
            Object.entries(themes[theme]).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            });
        }
        
        console.log('Theme applied:', theme);
    }

    function toggleAnimations(enabled) {
        // Toggle animations
        if (enabled) {
            document.body.classList.remove('animations-disabled');
        } else {
            document.body.classList.add('animations-disabled');
        }
        
        console.log('Animations toggled:', enabled);
    }

    function toggleParticles(enabled) {
        // Toggle particle system
        const particleCanvas = document.querySelector('.particle-canvas');
        if (particleCanvas) {
            particleCanvas.style.display = enabled ? 'block' : 'none';
        }
        
        console.log('Particles toggled:', enabled);
    }

    /**
     * Stats Operations
     */
    function updateStatsDisplay(stats) {
        // Update stats in the UI
        const totalImagesEl = document.getElementById('total-images');
        const totalEventsEl = document.getElementById('total-events');
        const totalBookingsEl = document.getElementById('total-bookings');
        const avgRatingEl = document.getElementById('avg-rating');
        
        if (totalImagesEl) totalImagesEl.textContent = stats.totalImages || 0;
        if (totalEventsEl) totalEventsEl.textContent = stats.totalEvents || 0;
        if (totalBookingsEl) totalBookingsEl.textContent = stats.totalBookings || 0;
        if (avgRatingEl) avgRatingEl.textContent = (stats.avgRating || 0).toFixed(1);
        
        console.log('Stats updated:', stats);
    }

    /**
     * Helper Functions
     */
    function createGalleryElement(item) {
        const element = document.createElement('div');
        element.className = 'gallery-item';
        element.dataset.galleryId = item.id;
        element.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        `;
        return element;
    }

    function createAdminGalleryElement(item) {
        const element = document.createElement('div');
        element.className = 'gallery-item';
        element.dataset.adminGalleryId = item.id;
        element.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-info">
                <h4 class="gallery-item-title">${item.title}</h4>
                <p class="gallery-item-category">${item.category}</p>
            </div>
            <div class="gallery-item-actions">
                <button class="gallery-action-btn edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="gallery-action-btn delete-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return element;
    }

    function createEventElement(event) {
        const element = document.createElement('div');
        element.className = 'event-card';
        element.dataset.eventId = event.id;
        element.innerHTML = `
            <div class="event-info">
                <h3>${event.name}</h3>
                <p>${event.date} at ${event.time} - ${event.location}</p>
                <span class="status-badge ${event.status}">${event.status}</span>
            </div>
        `;
        return element;
    }

    function createBookingElement(booking) {
        const element = document.createElement('tr');
        element.dataset.bookingId = booking.id;
        element.innerHTML = `
            <td>${booking.client}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
        `;
        return element;
    }

    function broadcastUpdate(channel, data) {
        // Broadcast to other tabs/windows
        if ('BroadcastChannel' in window) {
            const broadcast = new BroadcastChannel(channel);
            broadcast.postMessage({
                type: channel,
                data: data,
                timestamp: Date.now()
            });
        }
        
        // Also update localStorage for persistence
        localStorage.setItem(`${SYNC_CONFIG.storageKey}_${channel}`, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
    }

    function handleStorageEvent(e) {
        // Handle storage events from other tabs
        if (e.key && e.key.startsWith(SYNC_CONFIG.storageKey)) {
            const channel = e.key.replace(`${SYNC_CONFIG.storageKey}_`, '');
            const data = JSON.parse(e.newValue || '{}');
            
            if (data.data && data.timestamp) {
                handleChannelUpdate(channel, data.data);
            }
        }
    }

    function handleThemeChange(e) {
        // Handle theme changes
        const { theme } = e.detail;
        applyTheme(theme);
    }

    /**
     * Initialize Sync
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSync);
    } else {
        initSync();
    }

    // Expose sync functions globally
    window.RealTimeSync = {
        init: initSync,
        syncGallery: syncGallery,
        syncEvents: syncEvents,
        syncBookings: syncBookings,
        syncSettings: syncSettings,
        syncStats: syncStats,
        broadcastUpdate: broadcastUpdate
    };

})();