// Photography+ Studio - Data Management System
// LocalStorage-based persistence for gallery, events, services, and analytics

class DataManager {
    constructor() {
        this.STORAGE_VERSION = '1.0.0';
        this.KEYS = {
            PHOTOS: 'photo_studio_gallery',
            EVENTS: 'photo_studio_events',
            SERVICES: 'photo_studio_services',
            CONTACTS: 'contacts',
            ANALYTICS: 'photo_studio_analytics',
            SETTINGS: 'photo_studio_settings',
            BACKUP: 'photo_studio_backup'
        };
        
        this.init();
    }

    init() {
        this.initializeStorage();
        this.setupAutoBackup();
    }

    // Initialize storage with default data if empty
    initializeStorage() {
        if (!this.get(this.KEYS.PHOTOS)) {
            this.set(this.KEYS.PHOTOS, this.getDefaultPhotos());
        }
        
        if (!this.get(this.KEYS.EVENTS)) {
            this.set(this.KEYS.EVENTS, this.getDefaultEvents());
        }
        
        if (!this.get(this.KEYS.SERVICES)) {
            this.set(this.KEYS.SERVICES, this.getDefaultServices());
        }
        
        if (!this.get(this.KEYS.ANALYTICS)) {
            this.set(this.KEYS.ANALYTICS, this.getDefaultAnalytics());
        }
        
        if (!this.get(this.KEYS.SETTINGS)) {
            this.set(this.KEYS.SETTINGS, this.getDefaultSettings());
        }
    }

    // === GALLERY MANAGEMENT ===
    
    getDefaultPhotos() {
        return [
            {
                id: this.generateId(),
                title: "Wedding Ceremony",
                category: "wedding",
                description: "Beautiful wedding ceremony captured with artistic lighting",
                image: "images/wedding-1.jpg",
                tags: ["wedding", "ceremony", "bride", "groom"],
                views: 234,
                visible: true,
                featured: true,
                order: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Professional Portrait",
                category: "portrait",
                description: "Corporate headshot with professional lighting setup",
                image: "images/portrait-1.jpg",
                tags: ["portrait", "business", "professional"],
                views: 156,
                visible: true,
                featured: false,
                order: 2,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Product Photography",
                category: "commercial",
                description: "Commercial product photography for brand marketing",
                image: "images/commercial-1.jpg",
                tags: ["commercial", "product", "branding"],
                views: 89,
                visible: true,
                featured: false,
                order: 3,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Event Coverage",
                category: "event",
                description: "Corporate and social event photography",
                image: "images/event-1.jpg",
                tags: ["event", "corporate", "social"],
                views: 67,
                visible: true,
                featured: false,
                order: 4,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Ceremony Moments",
                category: "wedding",
                description: "Emotional wedding highlights and special moments",
                image: "images/wedding-2.jpg",
                tags: ["wedding", "emotional", "moments"],
                views: 198,
                visible: true,
                featured: true,
                order: 5,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Family Portraits",
                category: "portrait",
                description: "Creating lasting memories with family photography",
                image: "images/portrait-2.jpg",
                tags: ["portrait", "family", "memories"],
                views: 143,
                visible: true,
                featured: false,
                order: 6,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    getAllPhotos() {
        return this.get(this.KEYS.PHOTOS) || [];
    }

    getVisiblePhotos() {
        return this.getAllPhotos().filter(photo => photo.visible !== false);
    }

    getPhotoById(id) {
        const photos = this.getAllPhotos();
        return photos.find(photo => photo.id === id);
    }

    addPhoto(photoData) {
        const photos = this.getAllPhotos();
        const newPhoto = {
            id: this.generateId(),
            ...photoData,
            views: 0,
            visible: true,
            order: photos.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        photos.unshift(newPhoto);
        this.set(this.KEYS.PHOTOS, photos);
        this.updateAnalytics('photoAdded');
        return newPhoto;
    }

    updatePhoto(id, photoData) {
        const photos = this.getAllPhotos();
        const index = photos.findIndex(p => p.id === id);
        if (index !== -1) {
            photos[index] = {
                ...photos[index],
                ...photoData,
                updatedAt: new Date().toISOString()
            };
            this.set(this.KEYS.PHOTOS, photos);
            this.updateAnalytics('photoUpdated');
            return photos[index];
        }
        return null;
    }

    deletePhoto(id) {
        const photos = this.getAllPhotos();
        const filtered = photos.filter(p => p.id !== id);
        this.set(this.KEYS.PHOTOS, filtered);
        this.updateAnalytics('photoDeleted');
        return true;
    }

    incrementPhotoViews(id) {
        const photo = this.getPhotoById(id);
        if (photo) {
            photo.views = (photo.views || 0) + 1;
            this.updatePhoto(id, photo);
        }
    }

    // === EVENTS MANAGEMENT ===
    
    getDefaultEvents() {
        return [
            {
                id: this.generateId(),
                title: "Spring Photography Workshop",
                date: "2024-04-15",
                time: "10:00 AM",
                location: "Photography Studio, Downtown",
                description: "Join us for an intensive workshop on portrait photography techniques",
                image: "images/event-1.jpg",
                category: "workshop",
                featured: true,
                visible: true,
                status: "upcoming",
                capacity: 20,
                enrolled: 12,
                price: "$150",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Annual Photography Exhibition",
                date: "2024-05-20",
                time: "6:00 PM",
                location: "City Art Gallery",
                description: "Showcase of our best photography work from the past year",
                image: "images/event-2.jpg",
                category: "exhibition",
                featured: true,
                visible: true,
                status: "upcoming",
                capacity: 100,
                enrolled: 45,
                price: "Free",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    getAllEvents() {
        return this.get(this.KEYS.EVENTS) || [];
    }

    getVisibleEvents() {
        return this.getAllEvents()
            .filter(event => event.visible !== false)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    getEventById(id) {
        const events = this.getAllEvents();
        return events.find(event => event.id === id);
    }

    addEvent(eventData) {
        const events = this.getAllEvents();
        const newEvent = {
            id: this.generateId(),
            ...eventData,
            visible: true,
            status: 'upcoming',
            enrolled: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        events.unshift(newEvent);
        this.set(this.KEYS.EVENTS, events);
        this.updateAnalytics('eventAdded');
        return newEvent;
    }

    updateEvent(id, eventData) {
        const events = this.getAllEvents();
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = {
                ...events[index],
                ...eventData,
                updatedAt: new Date().toISOString()
            };
            this.set(this.KEYS.EVENTS, events);
            this.updateAnalytics('eventUpdated');
            return events[index];
        }
        return null;
    }

    deleteEvent(id) {
        const events = this.getAllEvents();
        const filtered = events.filter(e => e.id !== id);
        this.set(this.KEYS.EVENTS, filtered);
        this.updateAnalytics('eventDeleted');
        return true;
    }

    // === SERVICES MANAGEMENT ===
    
    getDefaultServices() {
        return [
            {
                id: this.generateId(),
                name: "Wedding Photography",
                icon: "fa-heart",
                description: "Complete wedding day coverage from preparation to reception, capturing every precious moment.",
                features: [
                    "Full day coverage",
                    "Engagement sessions",
                    "Professional editing",
                    "Online gallery"
                ],
                price: "$2,500",
                priceValue: 2500,
                visible: true,
                featured: true,
                order: 1,
                bookings: 45,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: "Portrait Photography",
                icon: "fa-user",
                description: "Professional headshots, family portraits, and individual sessions with artistic flair.",
                features: [
                    "Studio or location",
                    "Professional lighting",
                    "Wardrobe consultation",
                    "Digital gallery"
                ],
                price: "$350",
                priceValue: 350,
                visible: true,
                featured: true,
                order: 2,
                bookings: 78,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: "Commercial Photography",
                icon: "fa-briefcase",
                description: "High-quality product photography and brand imagery for your business needs.",
                features: [
                    "Product photography",
                    "Corporate headshots",
                    "Brand imagery",
                    "Marketing materials"
                ],
                price: "$500",
                priceValue: 500,
                visible: true,
                featured: true,
                order: 3,
                bookings: 32,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: "Event Photography",
                icon: "fa-calendar-alt",
                description: "Professional coverage of corporate events, parties, and special occasions.",
                features: [
                    "Event coverage",
                    "Candid moments",
                    "Group photos",
                    "Fast delivery"
                ],
                price: "$400",
                priceValue: 400,
                visible: true,
                featured: false,
                order: 4,
                bookings: 28,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    getAllServices() {
        return this.get(this.KEYS.SERVICES) || [];
    }

    getVisibleServices() {
        return this.getAllServices()
            .filter(service => service.visible !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getServiceById(id) {
        const services = this.getAllServices();
        return services.find(service => service.id === id);
    }

    addService(serviceData) {
        const services = this.getAllServices();
        const newService = {
            id: this.generateId(),
            ...serviceData,
            visible: true,
            bookings: 0,
            order: services.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        services.push(newService);
        this.set(this.KEYS.SERVICES, services);
        this.updateAnalytics('serviceAdded');
        return newService;
    }

    updateService(id, serviceData) {
        const services = this.getAllServices();
        const index = services.findIndex(s => s.id === id);
        if (index !== -1) {
            services[index] = {
                ...services[index],
                ...serviceData,
                updatedAt: new Date().toISOString()
            };
            this.set(this.KEYS.SERVICES, services);
            this.updateAnalytics('serviceUpdated');
            return services[index];
        }
        return null;
    }

    deleteService(id) {
        const services = this.getAllServices();
        const filtered = services.filter(s => s.id !== id);
        this.set(this.KEYS.SERVICES, filtered);
        this.updateAnalytics('serviceDeleted');
        return true;
    }

    // === ANALYTICS ===
    
    getDefaultAnalytics() {
        return {
            pageViews: 0,
            totalPhotos: 0,
            totalEvents: 0,
            totalServices: 0,
            totalContacts: 0,
            photoViews: 0,
            recentActivities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    getAnalytics() {
        return this.get(this.KEYS.ANALYTICS) || this.getDefaultAnalytics();
    }

    updateAnalytics(action, data = {}) {
        const analytics = this.getAnalytics();
        
        // Update counts
        analytics.totalPhotos = this.getAllPhotos().length;
        analytics.totalEvents = this.getAllEvents().length;
        analytics.totalServices = this.getAllServices().length;
        analytics.totalContacts = (this.get(this.KEYS.CONTACTS) || []).length;
        analytics.photoViews = this.getAllPhotos().reduce((sum, p) => sum + (p.views || 0), 0);
        
        // Add activity
        const activity = {
            id: this.generateId(),
            action: action,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        analytics.recentActivities = analytics.recentActivities || [];
        analytics.recentActivities.unshift(activity);
        
        // Keep only last 50 activities
        if (analytics.recentActivities.length > 50) {
            analytics.recentActivities = analytics.recentActivities.slice(0, 50);
        }
        
        analytics.updatedAt = new Date().toISOString();
        this.set(this.KEYS.ANALYTICS, analytics);
        
        return analytics;
    }

    incrementPageViews() {
        const analytics = this.getAnalytics();
        analytics.pageViews = (analytics.pageViews || 0) + 1;
        this.set(this.KEYS.ANALYTICS, analytics);
    }

    // === SETTINGS ===
    
    getDefaultSettings() {
        return {
            siteName: "Photography+ Studio",
            siteTagline: "Capturing Life's Precious Moments",
            contactEmail: "info@photographyplus.studio",
            contactPhone: "(555) 123-4567",
            address: "New York, NY 10001",
            socialMedia: {
                facebook: "#",
                instagram: "#",
                twitter: "#",
                linkedin: "#"
            },
            gallerySettings: {
                itemsPerPage: 12,
                defaultCategory: "all",
                enableLightbox: true
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    getSettings() {
        return this.get(this.KEYS.SETTINGS) || this.getDefaultSettings();
    }

    updateSettings(settings) {
        const current = this.getSettings();
        const updated = {
            ...current,
            ...settings,
            updatedAt: new Date().toISOString()
        };
        this.set(this.KEYS.SETTINGS, updated);
        return updated;
    }

    // === BACKUP & RESTORE ===
    
    createBackup() {
        const backup = {
            version: this.STORAGE_VERSION,
            timestamp: new Date().toISOString(),
            data: {
                photos: this.getAllPhotos(),
                events: this.getAllEvents(),
                services: this.getAllServices(),
                contacts: this.get(this.KEYS.CONTACTS) || [],
                analytics: this.getAnalytics(),
                settings: this.getSettings()
            }
        };
        
        this.set(this.KEYS.BACKUP, backup);
        return backup;
    }

    restoreBackup(backupData) {
        try {
            if (backupData && backupData.data) {
                this.set(this.KEYS.PHOTOS, backupData.data.photos);
                this.set(this.KEYS.EVENTS, backupData.data.events);
                this.set(this.KEYS.SERVICES, backupData.data.services);
                this.set(this.KEYS.CONTACTS, backupData.data.contacts);
                this.set(this.KEYS.ANALYTICS, backupData.data.analytics);
                this.set(this.KEYS.SETTINGS, backupData.data.settings);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Restore failed:', error);
            return false;
        }
    }

    exportData() {
        const data = this.createBackup();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `photography-studio-backup-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    // === AUTO BACKUP ===
    
    setupAutoBackup() {
        // Create backup every hour
        setInterval(() => {
            this.createBackup();
        }, 60 * 60 * 1000);
    }

    // === STORAGE UTILITIES ===
    
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error reading ${key}:`, error);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }

    clear() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // === UTILITIES ===
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2) + ' KB';
    }
}

// Initialize and export data manager
const dataManager = new DataManager();
window.DataManager = dataManager;
