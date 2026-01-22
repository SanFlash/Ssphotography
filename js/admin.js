// Photography+ Studio - Admin Dashboard JavaScript
// CRUD operations for photo management and contact submissions

class AdminDashboard {
    constructor() {
        this.photos = [];
        this.contacts = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderPhotos();
        this.renderContacts();
        this.updateStats();
    }

    // Data Management
    loadData() {
        // Load photos from localStorage or use default data
        const savedPhotos = localStorage.getItem('photos');
        const savedContacts = localStorage.getItem('contacts');
        
        this.photos = savedPhotos ? JSON.parse(savedPhotos) : this.getDefaultPhotos();
        this.contacts = savedContacts ? JSON.parse(savedContacts) : [];
    }

    saveData() {
        localStorage.setItem('photos', JSON.stringify(this.photos));
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

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
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Professional Portrait",
                category: "portrait",
                description: "Corporate headshot with professional lighting setup",
                image: "images/portrait-1.jpg",
                tags: ["portrait", "business", "professional"],
                views: 156,
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "Product Photography",
                category: "commercial",
                description: "Commercial product photography for brand marketing",
                image: "images/commercial-1.jpg",
                tags: ["commercial", "product", "branding"],
                views: 89,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.getElementById('viewSiteBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });

        // Photo management
        document.getElementById('addPhotoBtn').addEventListener('click', () => {
            this.showAddPhotoModal();
        });

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterPhotos();
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterPhotos();
        });

        // Contact submissions
        document.getElementById('refreshContactsBtn').addEventListener('click', () => {
            this.renderContacts();
        });

        // Modal events
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal('photoModal');
        });

        document.getElementById('deleteModalClose').addEventListener('click', () => {
            this.closeModal('deleteModal');
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal('photoModal');
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeModal('deleteModal');
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Form submission
        document.getElementById('photoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePhotoSubmit();
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                if (e.target.id === 'photoModal') {
                    this.closeModal('photoModal');
                } else if (e.target.id === 'deleteModal') {
                    this.closeModal('deleteModal');
                }
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('photoModal');
                this.closeModal('deleteModal');
            }
        });
    }

    // Photo Management
    renderPhotos(photos = this.photos) {
        const grid = document.getElementById('photosGrid');
        const emptyState = document.getElementById('emptyState');

        if (photos.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        grid.innerHTML = photos.map(photo => `
            <div class="photo-card">
                <img src="${photo.image}" alt="${photo.title}" class="photo-image" loading="lazy">
                <div class="photo-info">
                    <h4 class="photo-title" title="${photo.title}">${photo.title}</h4>
                    <span class="photo-category">${photo.category}</span>
                    <p class="photo-description">${photo.description || 'No description'}</p>
                    <div class="photo-stats">
                        <small><i class="fas fa-eye"></i> ${photo.views || 0} views</small>
                    </div>
                    <div class="photo-actions">
                        <button class="btn btn--outline btn--small" onclick="adminDashboard.editPhoto('${photo.id}')">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="btn btn--danger btn--small" onclick="adminDashboard.confirmDeletePhoto('${photo.id}')">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterPhotos() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;

        const filtered = this.photos.filter(photo => {
            const matchesSearch = photo.title.toLowerCase().includes(searchTerm) ||
                                photo.description.toLowerCase().includes(searchTerm) ||
                                photo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !categoryFilter || photo.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        this.renderPhotos(filtered);
    }

    showAddPhotoModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Add New Photo';
        document.getElementById('photoForm').reset();
        this.openModal('photoModal');
    }

    editPhoto(id) {
        const photo = this.photos.find(p => p.id === id);
        if (!photo) return;

        this.currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Photo';
        
        // Populate form
        document.getElementById('photoTitle').value = photo.title;
        document.getElementById('photoCategory').value = photo.category;
        document.getElementById('photoDescription').value = photo.description || '';
        document.getElementById('photoImage').value = photo.image;
        document.getElementById('photoTags').value = photo.tags.join(', ');
        
        this.openModal('photoModal');
    }

    handlePhotoSubmit() {
        const formData = new FormData(document.getElementById('photoForm'));
        const photoData = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            image: formData.get('image'),
            tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
            views: 0,
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing photo
            const index = this.photos.findIndex(p => p.id === this.currentEditId);
            if (index !== -1) {
                this.photos[index] = { ...this.photos[index], ...photoData };
            }
        } else {
            // Add new photo
            photoData.id = this.generateId();
            photoData.createdAt = new Date().toISOString();
            this.photos.unshift(photoData);
        }

        this.saveData();
        this.renderPhotos();
        this.updateStats();
        this.closeModal('photoModal');
        this.showNotification('Photo saved successfully!', 'success');
    }

    confirmDeletePhoto(id) {
        this.currentDeleteId = id;
        this.openModal('deleteModal');
    }

    confirmDelete() {
        if (this.currentDeleteId) {
            this.photos = this.photos.filter(p => p.id !== this.currentDeleteId);
            this.saveData();
            this.renderPhotos();
            this.updateStats();
            this.closeModal('deleteModal');
            this.showNotification('Photo deleted successfully!', 'success');
        }
    }

    // Contact Management
    renderContacts() {
        const tbody = document.getElementById('submissionsBody');
        const noSubmissions = document.getElementById('noSubmissions');

        if (this.contacts.length === 0) {
            document.getElementById('submissionsTable').style.display = 'none';
            noSubmissions.style.display = 'block';
            return;
        }

        document.getElementById('submissionsTable').style.display = 'table';
        noSubmissions.style.display = 'none';

        tbody.innerHTML = this.contacts.map(contact => `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>
                    <span class="service-badge service-badge--${contact.service}">
                        ${contact.service}
                    </span>
                </td>
                <td>
                    <div class="message-preview" title="${contact.message}">
                        ${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}
                    </div>
                </td>
                <td>${this.formatDate(contact.createdAt)}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn--outline btn--small" onclick="adminDashboard.viewContact('${contact.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn--danger btn--small" onclick="adminDashboard.deleteContact('${contact.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    viewContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return;

        alert(`Contact Details:\n\nName: ${contact.name}\nEmail: ${contact.email}\nService: ${contact.service}\nMessage: ${contact.message}\nDate: ${this.formatDate(contact.createdAt)}`);
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact submission?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.saveData();
            this.renderContacts();
            this.updateStats();
            this.showNotification('Contact submission deleted!', 'success');
        }
    }

    // Statistics
    updateStats() {
        const totalPhotos = this.photos.length;
        const totalViews = this.photos.reduce((sum, photo) => sum + (photo.views || 0), 0);
        const totalContacts = this.contacts.length;
        
        // Get last updated date
        let lastUpdated = 'Never';
        const allDates = [
            ...this.photos.map(p => p.updatedAt || p.createdAt),
            ...this.contacts.map(c => c.createdAt)
        ].filter(date => date).sort().reverse();
        
        if (allDates.length > 0) {
            lastUpdated = this.formatDate(allDates[0]);
        }

        document.getElementById('totalPhotos').textContent = totalPhotos;
        document.getElementById('totalViews').textContent = totalViews.toLocaleString();
        document.getElementById('totalContacts').textContent = totalContacts;
        document.getElementById('lastUpdated').textContent = lastUpdated;
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
        
        if (modalId === 'photoModal') {
            this.currentEditId = null;
        } else if (modalId === 'deleteModal') {
            this.currentDeleteId = null;
        }
    }

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

// Add some CSS for notifications and additional styling
const adminStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        background-color: var(--white);
        border-radius: 6px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid var(--info);
    }
    
    .notification--success {
        border-left-color: var(--success);
    }
    
    .notification--error {
        border-left-color: var(--error);
    }
    
    .notification--warning {
        border-left-color: var(--warning);
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
        color: var(--gray-700);
    }
    
    .notification__close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--gray-400);
        padding: 0;
        line-height: 1;
    }
    
    .notification__close:hover {
        color: var(--gray-600);
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .service-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: capitalize;
    }
    
    .service-badge--wedding {
        background-color: #ffeaa7;
        color: #fdcb6e;
    }
    
    .service-badge--portrait {
        background-color: #a29bfe;
        color: #6c5ce7;
    }
    
    .service-badge--commercial {
        background-color: #74b9ff;
        color: #0984e3;
    }
    
    .service-badge--event {
        background-color: #81ecec;
        color: #00b894;
    }
    
    .message-preview {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: help;
    }
    
    .photo-stats {
        margin-bottom: var(--spacing-sm);
    }
    
    .photo-stats small {
        color: var(--gray-500);
        font-size: 0.75rem;
    }
`;

// Add admin styles to head
const adminStyleSheet = document.createElement('style');
adminStyleSheet.textContent = adminStyles;
document.head.appendChild(adminStyleSheet);

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});