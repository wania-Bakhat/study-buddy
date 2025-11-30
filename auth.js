// Authentication module
const auth = {
    init: function() {
        console.log('Auth module initializing...');
        this.bindEvents();
        this.checkExistingSession();
    },

    bindEvents: function() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', this.handleLogin.bind(this));
            console.log('Login button event listener added');
        } else {
            console.error('Login button not found!');
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
        console.log('Login button clicked!');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Email:', email, 'Password:', password ? '***' : 'empty');

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        // In a real app, this would validate with a backend
        AppState.currentUser = {
            email: email,
            name: email.split('@')[0],
            joined: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
        
        // Save user to backend
        if (typeof backend !== 'undefined') {
            backend.saveUser(AppState.currentUser);
        }
        
        this.showDashboard();
        
        // Show success notification
        if (typeof notifications !== 'undefined') {
            notifications.show('Welcome!', 'Successfully logged in to StudyBuddy', 'success');
        }
        
        // Load user-specific data
        if (typeof tasks !== 'undefined') {
            tasks.loadTasks();
        }
        if (typeof streaks !== 'undefined') {
            streaks.loadStreak();
        }
    },

    handleLogout: function() {
        AppState.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showAuthPage();
        
        if (typeof notifications !== 'undefined') {
            notifications.show('Logged Out', 'You have been successfully logged out', 'success');
        }
    },

    showAuthPage: function() {
        console.log('Showing auth page...');
        document.getElementById('auth-page').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
        
        // Clear form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    },

    showDashboard: function() {
        console.log('Showing dashboard...');
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }
};
