// Notifications module
const notifications = {
    init: function() {
        this.bindEvents();
        this.loadPreferences();
    },

    bindEvents: function() {
        const closeNotification = document.getElementById('close-notification');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const notificationToggle = document.getElementById('notification-toggle');

        if (closeNotification) {
            closeNotification.addEventListener('click', this.hide.bind(this));
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', this.toggleDarkMode.bind(this));
        }

        if (notificationToggle) {
            notificationToggle.addEventListener('change', this.toggleNotifications.bind(this));
        }
    },

    loadPreferences: function() {
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            document.getElementById('dark-mode-toggle').checked = true;
        }

        // Check for saved notification preference
        if (localStorage.getItem('notifications') === 'disabled') {
            document.getElementById('notification-toggle').checked = false;
        }
    },

    show: function(title, message, type) {
        // Check if notifications are enabled
        if (localStorage.getItem('notifications') === 'disabled' && type !== 'error') {
            return;
        }
        
        const notification = document.getElementById('notification');
        const notificationTitle = document.getElementById('notification-title');
        const notificationMessage = document.getElementById('notification-message');
        const notificationIcon = notification.querySelector('i');
        
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        
        // Set icon based on type
        if (type === 'success') {
            notificationIcon.className = 'fas fa-check-circle';
            notification.classList.remove('warning', 'error');
            notification.classList.add('success');
        } else if (type === 'warning') {
            notificationIcon.className = 'fas fa-exclamation-triangle';
            notification.classList.remove('success', 'error');
            notification.classList.add('warning');
        } else if (type === 'error') {
            notificationIcon.className = 'fas fa-exclamation-circle';
            notification.classList.remove('success', 'warning');
            notification.classList.add('error');
        } else {
            notificationIcon.className = 'fas fa-bell';
            notification.classList.remove('success', 'warning', 'error');
        }
        
        notification.classList.add('active');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hide();
        }, 5000);
    },

    hide: function() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('active');
        }
    },

    toggleDarkMode: function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    },

    toggleNotifications: function() {
        const toggle = document.getElementById('notification-toggle');
        if (toggle.checked) {
            localStorage.setItem('notifications', 'enabled');
            this.show('Notifications Enabled', 'You will now receive reminders and alerts', 'success');
        } else {
            localStorage.setItem('notifications', 'disabled');
            this.show('Notifications Disabled', 'You will no longer receive reminders and alerts', 'warning');
        }
    }
};