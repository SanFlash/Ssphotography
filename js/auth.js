// Photography+ Studio - Admin Authentication System
// Secure session-based authentication with route protection

class AuthenticationManager {
    constructor() {
        this.SESSION_KEY = 'photo_admin_session';
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        this.INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
        
        // Default credentials (in production, use secure backend authentication)
        this.CREDENTIALS = {
            username: 'admin',
            password: 'photo123'
        };
        
        this.inactivityTimer = null;
        this.init();
    }

    init() {
        // Check if we're on login page or admin page
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'login.html') {
            this.setupLoginPage();
        } else if (currentPage === 'admin.html') {
            this.protectAdminPage();
        }
    }

    // Login Page Setup
    setupLoginPage() {
        // Check if already logged in
        if (this.isAuthenticated()) {
            window.location.href = 'admin.html';
            return;
        }

        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const rememberMeCheckbox = document.getElementById('rememberMe');
        const loginBtn = document.getElementById('loginBtn');

        // Focus on username field
        usernameInput.focus();

        // Handle form submission
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const rememberMe = rememberMeCheckbox.checked;

            // Clear previous alerts
            this.hideAlert();

            // Validate inputs
            if (!username || !password) {
                this.showAlert('Please enter both username and password', 'error');
                return;
            }

            // Disable form while processing
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing in...</span>';

            // Simulate processing delay
            await this.delay(800);

            // Verify credentials
            if (this.verifyCredentials(username, password)) {
                // Create session
                this.createSession(rememberMe);
                
                this.showAlert('Login successful! Redirecting...', 'success');
                
                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                this.showAlert('Invalid username or password', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
                passwordInput.value = '';
                passwordInput.focus();
            }
        });

        // Enter key handling
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Admin Page Protection
    protectAdminPage() {
        if (!this.isAuthenticated()) {
            // Not authenticated, redirect to login
            window.location.href = 'login.html';
            return;
        }

        // User is authenticated, setup session management
        this.setupSessionManagement();
        this.setupLogoutButton();
        this.startInactivityMonitor();
    }

    // Session Management
    createSession(persistent = false) {
        const session = {
            authenticated: true,
            username: 'admin',
            loginTime: Date.now(),
            lastActivity: Date.now(),
            persistent: persistent,
            token: this.generateToken()
        };

        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        
        if (persistent) {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        }
    }

    getSession() {
        // Check sessionStorage first (active session)
        let sessionData = sessionStorage.getItem(this.SESSION_KEY);
        
        // If not in sessionStorage, check localStorage (persistent session)
        if (!sessionData) {
            sessionData = localStorage.getItem(this.SESSION_KEY);
            if (sessionData) {
                // Restore to sessionStorage
                sessionStorage.setItem(this.SESSION_KEY, sessionData);
            }
        }

        return sessionData ? JSON.parse(sessionData) : null;
    }

    updateLastActivity() {
        const session = this.getSession();
        if (session) {
            session.lastActivity = Date.now();
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            
            if (session.persistent) {
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            }
        }
    }

    isAuthenticated() {
        const session = this.getSession();
        
        if (!session || !session.authenticated) {
            return false;
        }

        // Check if session has expired
        const currentTime = Date.now();
        const sessionAge = currentTime - session.loginTime;
        const inactivityTime = currentTime - session.lastActivity;

        // Session timeout check
        if (sessionAge > this.SESSION_TIMEOUT) {
            this.clearSession();
            return false;
        }

        // Inactivity timeout check
        if (inactivityTime > this.INACTIVITY_TIMEOUT) {
            this.clearSession();
            return false;
        }

        return true;
    }

    setupSessionManagement() {
        // Update last activity on user interaction
        const updateActivity = () => {
            this.updateLastActivity();
            this.resetInactivityTimer();
        };

        // Monitor user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });

        // Check session validity periodically
        setInterval(() => {
            if (!this.isAuthenticated()) {
                alert('Your session has expired. Please login again.');
                window.location.href = 'login.html';
            }
        }, 60000); // Check every minute
    }

    startInactivityMonitor() {
        this.resetInactivityTimer();
    }

    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }

        this.inactivityTimer = setTimeout(() => {
            alert('You have been logged out due to inactivity.');
            this.logout();
        }, this.INACTIVITY_TIMEOUT);
    }

    setupLogoutButton() {
        // Create logout button if it doesn't exist
        let logoutBtn = document.getElementById('logoutBtn');
        
        if (!logoutBtn) {
            const headerActions = document.querySelector('.header-actions');
            if (headerActions) {
                logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.className = 'btn btn--outline';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                headerActions.appendChild(logoutBtn);
            }
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    logout() {
        this.clearSession();
        window.location.href = 'login.html';
    }

    clearSession() {
        sessionStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.SESSION_KEY);
        
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
    }

    // Credential Verification
    verifyCredentials(username, password) {
        // Simple validation - in production, this should be server-side
        return username === this.CREDENTIALS.username && 
               password === this.CREDENTIALS.password;
    }

    // Utility Functions
    generateToken() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showAlert(message, type = 'error') {
        const alertBox = document.getElementById('alertBox');
        if (alertBox) {
            alertBox.textContent = message;
            alertBox.className = `alert alert--${type} show`;
        }
    }

    hideAlert() {
        const alertBox = document.getElementById('alertBox');
        if (alertBox) {
            alertBox.className = 'alert';
        }
    }
}

// Auto-detect browser close and clear non-persistent sessions
window.addEventListener('beforeunload', () => {
    const session = sessionStorage.getItem('photo_admin_session');
    if (session) {
        const sessionData = JSON.parse(session);
        // Only clear if not persistent
        if (!sessionData.persistent) {
            sessionStorage.removeItem('photo_admin_session');
        }
    }
});

// Initialize authentication manager
const authManager = new AuthenticationManager();

// Export for use in other scripts
window.AuthManager = authManager;
