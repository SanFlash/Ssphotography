// Photography+ Studio - Admin CMS
// Complete Content Management System with CRUD operations

class AdminCMS {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentEditId = null;
        this.currentEditType = null;
        this.currentDeleteId = null;
        this.currentDeleteType = null;
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupModals();
        this.setupButtons();
        this.loadDashboard();
        this.loadAllContent();
        this.incrementPageViews();
    }

    // === TAB MANAGEMENT ===
    
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                
                // Update active states
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`${tab}Tab`).classList.add('active');
                
                this.currentTab = tab;
                this.loadTabContent(tab);
            });
        });
    }

    loadTabContent(tab) {
        switch(tab) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'gallery':
                this.renderPhotos();
                break;
            case 'events':
                this.renderEvents();
                break;
            case 'services':
                this.renderServices();
                break;
            case 'contacts':
                this.renderContacts();
                break;
        }
    }

    loadAllContent() {
        this.renderPhotos();
        this.renderEvents();
        this.renderServices();
        this.renderContacts();
    }

    // === DASHBOARD ===
    
    loadDashboard() {
        this.updateDashboardStats();
        this.renderRecentActivity();
    }

    updateDashboardStats() {
        const analytics = window.DataManager.getAnalytics();
        const photos = window.DataManager.getAllPhotos();
        const events = window.DataManager.getAllEvents();
        const services = window.DataManager.getAllServices();
        const contacts = window.DataManager.get('contacts') || [];

        // Update stats
        document.getElementById('totalPhotos').textContent = photos.length;
        document.getElementById('totalViews').textContent = this.formatNumber(analytics.photoViews);
        document.getElementById('totalEvents').textContent = events.length;
        document.getElementById('totalContacts').textContent = contacts.length;
        document.getElementById('totalServices').textContent = services.length;
        
        // Update last updated
        const lastUpdated = this.getLastUpdatedTime();
        document.getElementById('lastUpdated').textContent = lastUpdated;
        
        // Update trends
        const visiblePhotos = photos.filter(p => p.visible !== false);
        document.getElementById('photosTrend').textContent = `${visiblePhotos.length} Visible`;
        
        const upcomingEvents = events.filter(e => e.status === 'upcoming');
        document.getElementById('eventsTrend').textContent = `${upcomingEvents.length} Upcoming`;
    }

    renderRecentActivity() {
        const analytics = window.DataManager.getAnalytics();
        const activities = analytics.recentActivities || [];
        const container = document.getElementById('recentActivityList');

        if (activities.length === 0) {
            container.innerHTML = '<p class="empty-message">No recent activity</p>';
            return;
        }

        container.innerHTML = activities.slice(0, 10).map(activity => {
            const icon = this.getActivityIcon(activity.action);
            const message = this.getActivityMessage(activity.action);
            const time = this.formatTimeAgo(activity.timestamp);

            return `
                <div class="activity-item">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content">
                        <p><strong>${message}</strong></p>
                        <small>${time}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    getActivityIcon(action) {
        const icons = {
            photoAdded: '<i class="fas fa-plus-circle text-success"></i>',
            photoUpdated: '<i class="fas fa-edit text-info"></i>',
            photoDeleted: '<i class="fas fa-trash text-danger"></i>',
            eventAdded: '<i class="fas fa-calendar-plus text-success"></i>',
            eventUpdated: '<i class="fas fa-calendar-check text-info"></i>',
            eventDeleted: '<i class="fas fa-calendar-times text-danger"></i>',
            serviceAdded: '<i class="fas fa-briefcase text-success"></i>',
            serviceUpdated: '<i class="fas fa-pen text-info"></i>',
            serviceDeleted: '<i class="fas fa-times-circle text-danger"></i>'
        };
        return icons[action] || '<i class="fas fa-circle text-gray"></i>';
    }

    getActivityMessage(action) {
        const messages = {
            photoAdded: 'New photo added to gallery',
            photoUpdated: 'Photo updated',
            photoDeleted: 'Photo removed from gallery',
            eventAdded: 'New event created',
            eventUpdated: 'Event updated',
            eventDeleted: 'Event removed',
            serviceAdded: 'New service added',
            serviceUpdated: 'Service updated',
            serviceDeleted: 'Service removed'
        };
        return messages[action] || 'Activity occurred';
    }

    incrementPageViews() {
        window.DataManager.incrementPageViews();
    }

    // === PHOTO MANAGEMENT ===
    
    renderPhotos() {
        const photos = window.DataManager.getAllPhotos();
        const searchTerm = document.getElementById('searchPhotos')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const visibilityFilter = document.getElementById('visibilityFilter')?.value || '';

        let filtered = photos.filter(photo => {
            const matchesSearch = !searchTerm || 
                photo.title.toLowerCase().includes(searchTerm) ||
                photo.description.toLowerCase().includes(searchTerm) ||
                (photo.tags && photo.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
            
            const matchesCategory = !categoryFilter || photo.category === categoryFilter;
            
            const matchesVisibility = !visibilityFilter || 
                (visibilityFilter === 'visible' && photo.visible !== false) ||
                (visibilityFilter === 'hidden' && photo.visible === false);

            return matchesSearch && matchesCategory && matchesVisibility;
        });

        const grid = document.getElementById('photosGrid');
        const empty = document.getElementById('emptyPhotos');

        if (filtered.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        empty.style.display = 'none';

        grid.innerHTML = filtered.map(photo => `
            <div class="content-card ${photo.visible === false ? 'content-card--hidden' : ''}">
                <div class="card-image">
                    <img src="${photo.image}" alt="${photo.title}" loading="lazy">
                    ${photo.featured ? '<div class="badge badge--featured"><i class="fas fa-star"></i> Featured</div>' : ''}
                    ${photo.visible === false ? '<div class="badge badge--hidden"><i class="fas fa-eye-slash"></i> Hidden</div>' : ''}
                </div>
                <div class="card-content">
                    <h4>${photo.title}</h4>
                    <span class="badge badge--${photo.category}">${photo.category}</span>
                    <p>${photo.description || 'No description'}</p>
                    <div class="card-stats">
                        <span><i class="fas fa-eye"></i> ${photo.views || 0} views</span>
                        ${photo.tags ? `<span><i class="fas fa-tags"></i> ${photo.tags.length} tags</span>` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn--sm btn--outline" onclick="adminCMS.editPhoto('${photo.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn--sm btn--outline" onclick="adminCMS.togglePhotoVisibility('${photo.id}')">
                        <i class="fas fa-eye${photo.visible === false ? '' : '-slash'}"></i>
                    </button>
                    <button class="btn btn--sm btn--danger" onclick="adminCMS.confirmDelete('${photo.id}', 'photo')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addPhoto() {
        this.currentEditId = null;
        this.currentEditType = 'photo';
        document.getElementById('photoModalTitle').textContent = 'Add New Photo';
        document.getElementById('photoForm').reset();
        document.getElementById('photoVisible').checked = true;
        document.getElementById('photoFeatured').checked = false;
        this.openModal('photoModal');
    }

    editPhoto(id) {
        const photo = window.DataManager.getPhotoById(id);
        if (!photo) return;

        this.currentEditId = id;
        this.currentEditType = 'photo';
        document.getElementById('photoModalTitle').textContent = 'Edit Photo';
        
        document.getElementById('photoTitle').value = photo.title;
        document.getElementById('photoCategory').value = photo.category;
        document.getElementById('photoDescription').value = photo.description || '';
        document.getElementById('photoImage').value = photo.image;
        document.getElementById('photoTags').value = photo.tags ? photo.tags.join(', ') : '';
        document.getElementById('photoVisible').checked = photo.visible !== false;
        document.getElementById('photoFeatured').checked = photo.featured === true;
        
        this.openModal('photoModal');
    }

    savePhoto(e) {
        e.preventDefault();

        const photoData = {
            title: document.getElementById('photoTitle').value.trim(),
            category: document.getElementById('photoCategory').value,
            description: document.getElementById('photoDescription').value.trim(),
            image: document.getElementById('photoImage').value.trim(),
            tags: document.getElementById('photoTags').value.split(',').map(t => t.trim()).filter(t => t),
            visible: document.getElementById('photoVisible').checked,
            featured: document.getElementById('photoFeatured').checked
        };

        if (this.currentEditId) {
            window.DataManager.updatePhoto(this.currentEditId, photoData);
            this.showToast('Photo updated successfully!', 'success');
        } else {
            window.DataManager.addPhoto(photoData);
            this.showToast('Photo added successfully!', 'success');
        }

        this.closeModal('photoModal');
        this.renderPhotos();
        this.updateDashboardStats();
        this.renderRecentActivity();
    }

    togglePhotoVisibility(id) {
        const photo = window.DataManager.getPhotoById(id);
        if (photo) {
            window.DataManager.updatePhoto(id, { visible: !photo.visible });
            this.renderPhotos();
            this.showToast(`Photo ${photo.visible ? 'hidden' : 'shown'}`, 'info');
        }
    }

    // === EVENT MANAGEMENT ===
    
    renderEvents() {
        const events = window.DataManager.getAllEvents();
        const searchTerm = document.getElementById('searchEvents')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('eventStatusFilter')?.value || '';

        let filtered = events.filter(event => {
            const matchesSearch = !searchTerm || 
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                event.location.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || event.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        const grid = document.getElementById('eventsGrid');
        const empty = document.getElementById('emptyEvents');

        if (filtered.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        empty.style.display = 'none';

        grid.innerHTML = filtered.map(event => `
            <div class="content-card ${event.visible === false ? 'content-card--hidden' : ''}">
                ${event.image ? `
                    <div class="card-image">
                        <img src="${event.image}" alt="${event.title}" loading="lazy">
                        ${event.featured ? '<div class="badge badge--featured"><i class="fas fa-star"></i> Featured</div>' : ''}
                    </div>
                ` : ''}
                <div class="card-content">
                    <h4>${event.title}</h4>
                    <div class="event-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                        <span><i class="fas fa-clock"></i> ${event.time}</span>
                    </div>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    <p>${event.description}</p>
                    <div class="card-stats">
                        <span class="badge badge--${event.status}">${event.status}</span>
                        ${event.price ? `<span><i class="fas fa-dollar-sign"></i> ${event.price}</span>` : ''}
                        ${event.capacity ? `<span><i class="fas fa-users"></i> ${event.enrolled || 0}/${event.capacity}</span>` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn--sm btn--outline" onclick="adminCMS.editEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn--sm btn--danger" onclick="adminCMS.confirmDelete('${event.id}', 'event')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addEvent() {
        this.currentEditId = null;
        this.currentEditType = 'event';
        document.getElementById('eventModalTitle').textContent = 'Add New Event';
        document.getElementById('eventForm').reset();
        document.getElementById('eventVisible').checked = true;
        this.openModal('eventModal');
    }

    editEvent(id) {
        const event = window.DataManager.getEventById(id);
        if (!event) return;

        this.currentEditId = id;
        this.currentEditType = 'event';
        document.getElementById('eventModalTitle').textContent = 'Edit Event';
        
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventImage').value = event.image || '';
        document.getElementById('eventCategory').value = event.category || 'workshop';
        document.getElementById('eventPrice').value = event.price || '';
        document.getElementById('eventCapacity').value = event.capacity || '';
        document.getElementById('eventVisible').checked = event.visible !== false;
        
        this.openModal('eventModal');
    }

    saveEvent(e) {
        e.preventDefault();

        const eventData = {
            title: document.getElementById('eventTitle').value.trim(),
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value.trim(),
            description: document.getElementById('eventDescription').value.trim(),
            image: document.getElementById('eventImage').value.trim(),
            category: document.getElementById('eventCategory').value,
            price: document.getElementById('eventPrice').value.trim(),
            capacity: parseInt(document.getElementById('eventCapacity').value) || null,
            visible: document.getElementById('eventVisible').checked
        };

        if (this.currentEditId) {
            window.DataManager.updateEvent(this.currentEditId, eventData);
            this.showToast('Event updated successfully!', 'success');
        } else {
            window.DataManager.addEvent(eventData);
            this.showToast('Event added successfully!', 'success');
        }

        this.closeModal('eventModal');
        this.renderEvents();
        this.updateDashboardStats();
        this.renderRecentActivity();
    }

    // === SERVICE MANAGEMENT ===
    
    renderServices() {
        const services = window.DataManager.getAllServices();
        const grid = document.getElementById('servicesGrid');
        const empty = document.getElementById('emptyServices');

        if (services.length === 0) {
            grid.style.display = 'none';
            empty.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        empty.style.display = 'none';

        grid.innerHTML = services.map(service => `
            <div class="content-card service-card ${service.visible === false ? 'content-card--hidden' : ''}">
                <div class="service-icon-large">
                    <i class="fas ${service.icon}"></i>
                </div>
                <div class="card-content">
                    <h4>${service.name}</h4>
                    <p>${service.description}</p>
                    ${service.features && service.features.length > 0 ? `
                        <ul class="service-features">
                            ${service.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <div class="service-price-tag">${service.price}</div>
                    <div class="card-stats">
                        ${service.featured ? '<span class="badge badge--featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                        ${service.bookings ? `<span><i class="fas fa-bookmark"></i> ${service.bookings} bookings</span>` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn--sm btn--outline" onclick="adminCMS.editService('${service.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn--sm btn--danger" onclick="adminCMS.confirmDelete('${service.id}', 'service')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    addService() {
        this.currentEditId = null;
        this.currentEditType = 'service';
        document.getElementById('serviceModalTitle').textContent = 'Add New Service';
        document.getElementById('serviceForm').reset();
        document.getElementById('serviceVisible').checked = true;
        document.getElementById('serviceFeatured').checked = true;
        this.openModal('serviceModal');
    }

    editService(id) {
        const service = window.DataManager.getServiceById(id);
        if (!service) return;

        this.currentEditId = id;
        this.currentEditType = 'service';
        document.getElementById('serviceModalTitle').textContent = 'Edit Service';
        
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceIcon').value = service.icon;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('serviceFeatures').value = service.features ? service.features.join('\n') : '';
        document.getElementById('serviceVisible').checked = service.visible !== false;
        document.getElementById('serviceFeatured').checked = service.featured === true;
        
        this.openModal('serviceModal');
    }

    saveService(e) {
        e.preventDefault();

        const featuresText = document.getElementById('serviceFeatures').value.trim();
        const features = featuresText ? featuresText.split('\n').map(f => f.trim()).filter(f => f) : [];

        const serviceData = {
            name: document.getElementById('serviceName').value.trim(),
            icon: document.getElementById('serviceIcon').value.trim(),
            price: document.getElementById('servicePrice').value.trim(),
            description: document.getElementById('serviceDescription').value.trim(),
            features: features,
            visible: document.getElementById('serviceVisible').checked,
            featured: document.getElementById('serviceFeatured').checked
        };

        if (this.currentEditId) {
            window.DataManager.updateService(this.currentEditId, serviceData);
            this.showToast('Service updated successfully!', 'success');
        } else {
            window.DataManager.addService(serviceData);
            this.showToast('Service added successfully!', 'success');
        }

        this.closeModal('serviceModal');
        this.renderServices();
        this.updateDashboardStats();
        this.renderRecentActivity();
    }

    // === CONTACT MANAGEMENT ===
    
    renderContacts() {
        const contacts = window.DataManager.get('contacts') || [];
        const tbody = document.getElementById('submissionsBody');
        const table = document.getElementById('submissionsTable');
        const empty = document.getElementById('emptyContacts');

        if (contacts.length === 0) {
            table.style.display = 'none';
            empty.style.display = 'flex';
            return;
        }

        table.style.display = 'table';
        empty.style.display = 'none';

        tbody.innerHTML = contacts.map(contact => `
            <tr>
                <td>${contact.name}</td>
                <td><a href="mailto:${contact.email}">${contact.email}</a></td>
                <td><span class="badge badge--${contact.service}">${contact.service}</span></td>
                <td class="message-cell" title="${contact.message}">
                    ${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}
                </td>
                <td>${this.formatDate(contact.createdAt)}</td>
                <td class="actions-cell">
                    <button class="btn btn--sm btn--outline" onclick="adminCMS.viewContact('${contact.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn--sm btn--danger" onclick="adminCMS.deleteContact('${contact.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    viewContact(id) {
        const contacts = window.DataManager.get('contacts') || [];
        const contact = contacts.find(c => c.id === id);
        if (!contact) return;

        const message = `
            <strong>Contact Details</strong><br><br>
            <strong>Name:</strong> ${contact.name}<br>
            <strong>Email:</strong> ${contact.email}<br>
            <strong>Service:</strong> ${contact.service}<br>
            <strong>Date:</strong> ${this.formatDate(contact.createdAt)}<br><br>
            <strong>Message:</strong><br>
            ${contact.message}
        `;

        this.showToast(message, 'info', 10000);
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact submission?')) {
            const contacts = window.DataManager.get('contacts') || [];
            const filtered = contacts.filter(c => c.id !== id);
            window.DataManager.set('contacts', filtered);
            this.renderContacts();
            this.updateDashboardStats();
            this.showToast('Contact deleted successfully', 'success');
        }
    }

    // === DELETE CONFIRMATION ===
    
    confirmDelete(id, type) {
        this.currentDeleteId = id;
        this.currentDeleteType = type;
        
        const messages = {
            photo: 'Are you sure you want to delete this photo? This action cannot be undone.',
            event: 'Are you sure you want to delete this event? This action cannot be undone.',
            service: 'Are you sure you want to delete this service? This action cannot be undone.'
        };
        
        document.getElementById('deleteMessage').textContent = messages[type];
        this.openModal('deleteModal');
    }

    executeDelete() {
        if (!this.currentDeleteId || !this.currentDeleteType) return;

        switch(this.currentDeleteType) {
            case 'photo':
                window.DataManager.deletePhoto(this.currentDeleteId);
                this.renderPhotos();
                this.showToast('Photo deleted successfully', 'success');
                break;
            case 'event':
                window.DataManager.deleteEvent(this.currentDeleteId);
                this.renderEvents();
                this.showToast('Event deleted successfully', 'success');
                break;
            case 'service':
                window.DataManager.deleteService(this.currentDeleteId);
                this.renderServices();
                this.showToast('Service deleted successfully', 'success');
                break;
        }

        this.closeModal('deleteModal');
        this.updateDashboardStats();
        this.renderRecentActivity();
        this.currentDeleteId = null;
        this.currentDeleteType = null;
    }

    // === MODAL MANAGEMENT ===
    
    setupModals() {
        // Close buttons
        document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                if (modalId) {
                    this.closeModal(modalId);
                }
            });
        });

        // Outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Forms
        document.getElementById('photoForm').addEventListener('submit', (e) => this.savePhoto(e));
        document.getElementById('eventForm').addEventListener('submit', (e) => this.saveEvent(e));
        document.getElementById('serviceForm').addEventListener('submit', (e) => this.saveService(e));
        
        // Delete confirmation
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.executeDelete());
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    }

    // === BUTTON SETUP ===
    
    setupButtons() {
        // Header buttons
        document.getElementById('viewSiteBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });

        document.getElementById('backupBtn').addEventListener('click', () => {
            window.DataManager.exportData();
            this.showToast('Backup downloaded successfully', 'success');
        });

        // Add buttons
        document.getElementById('addPhotoBtn').addEventListener('click', () => this.addPhoto());
        document.getElementById('addEventBtn').addEventListener('click', () => this.addEvent());
        document.getElementById('addServiceBtn').addEventListener('click', () => this.addService());

        // Refresh button
        document.getElementById('refreshContactsBtn').addEventListener('click', () => {
            this.renderContacts();
            this.showToast('Contacts refreshed', 'info');
        });

        // Search and filter
        document.getElementById('searchPhotos')?.addEventListener('input', () => this.renderPhotos());
        document.getElementById('categoryFilter')?.addEventListener('change', () => this.renderPhotos());
        document.getElementById('visibilityFilter')?.addEventListener('change', () => this.renderPhotos());
        document.getElementById('searchEvents')?.addEventListener('input', () => this.renderEvents());
        document.getElementById('eventStatusFilter')?.addEventListener('change', () => this.renderEvents());
    }

    // === UTILITY FUNCTIONS ===
    
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return this.formatDate(dateString);
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    getLastUpdatedTime() {
        const analytics = window.DataManager.getAnalytics();
        if (!analytics.updatedAt) return 'Never';
        return this.formatTimeAgo(analytics.updatedAt);
    }

    // === TOAST NOTIFICATIONS ===
    
    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icon = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        }[type] || 'fa-info-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toast));

        // Auto remove
        setTimeout(() => this.removeToast(toast), duration);
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }
}

// Initialize Admin CMS
let adminCMS;
document.addEventListener('DOMContentLoaded', () => {
    adminCMS = new AdminCMS();
    window.adminCMS = adminCMS;
});
