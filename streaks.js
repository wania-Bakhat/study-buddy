// Streaks tracking module
const streaks = {
    init: function() {
        this.loadStreak();
        this.updateDisplay();
    },

    loadStreak: function() {
        AppState.streak = parseInt(localStorage.getItem('streak')) || 0;
        AppState.lastStudyDate = localStorage.getItem('lastStudyDate') || '';
    },

    saveStreak: function() {
        localStorage.setItem('streak', AppState.streak.toString());
        localStorage.setItem('lastStudyDate', AppState.lastStudyDate);
    },

    updateStreak: function() {
        const today = new Date().toDateString();
        
        // If we already updated streak today, do nothing
        if (AppState.lastStudyDate === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        // If last study was yesterday, increment streak
        if (AppState.lastStudyDate === yesterdayStr) {
            AppState.streak++;
        } 
        // If last study was not yesterday (and not today), reset streak
        else if (AppState.lastStudyDate !== today) {
            AppState.streak = 1;
        }
        
        AppState.lastStudyDate = today;
        this.saveStreak();
        this.updateDisplay();
    },

    updateDisplay: function() {
        const streakCount = document.getElementById('streak-count');
        const streakDetail = document.getElementById('streak-detail');
        
        if (streakCount) {
            streakCount.textContent = `${AppState.streak} day${AppState.streak !== 1 ? 's' : ''}`;
        }
        
        if (streakDetail) {
            streakDetail.textContent = `${AppState.streak} day${AppState.streak !== 1 ? 's' : ''}`;
        }
    }
};