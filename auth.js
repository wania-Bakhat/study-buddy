// Authentication module
const auth = {
    init: function() {
        this.bindEvents();
        this.checkExistingSession();
    },

    bindEvents: function() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', this.handleLogin.bind(this));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
    },

    checkExistingSession: function() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            AppState.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    },

    handleLogin: function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            notifications.show('Error', 'Please enter both email and password', 'error');
            return;
        }

        // In a real app, this would validate with a backend
        AppState.currentUser = {
            email: email,
            name: email.split('@')[0],
            joined: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
        this.showDashboard();
        notifications.show('Welcome!', 'Successfully logged in to StudyBuddy', 'success');
        
        // Load user-specific data
        tasks.loadTasks();
        streaks.loadStreak();
    },

    handleLogout: function() {
        AppState.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showAuthPage();
        notifications.show('Logged Out', 'You have been successfully logged out', 'success');
    },

    showAuthPage: function() {
        document.getElementById('auth-page').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
        
        // Clear form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    },

    showDashboard: function() {
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }
};