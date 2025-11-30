// File-based backend simulation module
// This simulates a backend using localStorage as file storage
const backend = {
    dataFile: 'studybuddy_data.json',

    init: function() {
        this.ensureDataStructure();
        this.startAutoSave();
        this.checkOverdueTasks();
    },

    ensureDataStructure: function() {
        const data = this.loadData();
        if (!data.users) data.users = {};
        if (!data.tasks) data.tasks = {};
        if (!data.sessions) data.sessions = {};
        if (!data.feedback) data.feedback = [];
        this.saveData(data);
    },

    loadData: function() {
        const stored = localStorage.getItem(this.dataFile);
        return stored ? JSON.parse(stored) : {};
    },

    saveData: function(data) {
        localStorage.setItem(this.dataFile, JSON.stringify(data));
    },

    // User operations
    saveUser: function(user) {
        const data = this.loadData();
        if (!data.users) data.users = {};
        data.users[user.email] = {
            ...user,
            lastLogin: new Date().toISOString()
        };
        this.saveData(data);
    },

    getUser: function(email) {
        const data = this.loadData();
        return data.users?.[email] || null;
    },

    // Task operations
    saveTasks: function(email, tasks) {
        const data = this.loadData();
        if (!data.tasks) data.tasks = {};
        data.tasks[email] = tasks;
        this.saveData(data);
    },

    getTasks: function(email) {
        const data = this.loadData();
        return data.tasks?.[email] || [];
    },

    // Session operations (for timer tracking)
    saveSession: function(email, session) {
        const data = this.loadData();
        if (!data.sessions) data.sessions = {};
        if (!data.sessions[email]) data.sessions[email] = [];
        
        data.sessions[email].push({
            ...session,
            timestamp: new Date().toISOString()
        });
        
        this.saveData(data);
    },

    getSessions: function(email) {
        const data = this.loadData();
        return data.sessions?.[email] || [];
    },

    // Feedback operations
    saveFeedback: function(feedback) {
        const data = this.loadData();
        if (!data.feedback) data.feedback = [];
        
        data.feedback.push({
            ...feedback,
            timestamp: new Date().toISOString(),
            id: Date.now().toString()
        });
        
        this.saveData(data);
        return true;
    },

    getAllFeedback: function() {
        const data = this.loadData();
        return data.feedback || [];
    },

    // Auto-save functionality
    startAutoSave: function() {
        // Save current user data every 30 seconds
        setInterval(() => {
            if (AppState.currentUser) {
                this.saveTasks(AppState.currentUser.email, AppState.tasks);
            }
        }, 30000); // 30 seconds
    },

    // Check for overdue tasks and send reminders
    checkOverdueTasks: function() {
        setInterval(() => {
            if (!AppState.currentUser) return;

            const now = new Date();
            const overdueTasks = AppState.tasks.filter(task => {
                if (task.completed) return false;
                const dueDate = new Date(task.due);
                return dueDate < now;
            });

            if (overdueTasks.length > 0 && localStorage.getItem('notifications') !== 'disabled') {
                const task = overdueTasks[0];
                notifications.show(
                    'Overdue Task!',
                    `"${task.title}" is overdue. Time to complete it!`,
                    'warning'
                );
            }
        }, 300000); // Check every 5 minutes
    },

    // Export data to JSON file
    exportData: function() {
        const data = this.loadData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `studybuddy_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        notifications.show('Success', 'Data exported successfully!', 'success');
    },

    // Import data from JSON file
    importData: function(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.saveData(data);
                
                // Reload current user data
                if (AppState.currentUser) {
                    AppState.tasks = this.getTasks(AppState.currentUser.email);
                    tasks.renderTasks();
                }
                
                notifications.show('Success', 'Data imported successfully!', 'success');
            } catch (error) {
                notifications.show('Error', 'Failed to import data. Invalid file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    },

    // Clear all data (for testing or user request)
    clearAllData: function() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }
};