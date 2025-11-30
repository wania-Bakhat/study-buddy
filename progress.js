// Progress tracking module
const progress = {
    init: function() {
        this.updateProgress();
        this.renderChart();
    },

    updateProgress: function() {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const tasksThisWeek = AppState.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate >= weekStart;
        });

        const completedThisWeek = tasksThisWeek.filter(task => task.completed);
        const studyHours = this.calculateStudyHours();

        document.getElementById('tasks-this-week').textContent = tasksThisWeek.length;
        document.getElementById('completed-this-week').textContent = completedThisWeek.length;
        document.getElementById('study-hours').textContent = studyHours + 'h';
    },

    calculateStudyHours: function() {
        const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());

        const weekSessions = sessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= weekStart;
        });

        const totalMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);
        return Math.floor(totalMinutes / 60);
    },

    renderChart: function() {
        const canvas = document.getElementById('progress-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = 300;

        ctx.clearRect(0, 0, width, height);

        const weeklyData = this.getWeeklyData();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const barWidth = Math.floor((width - 100) / 7);
        const maxValue = Math.max(...weeklyData, 1);
        const scale = (height - 60) / maxValue;

        ctx.fillStyle = '#4361ee';
        weeklyData.forEach((value, index) => {
            const x = 40 + (index * (barWidth + 10));
            const barHeight = value * scale;
            const y = height - 40 - barHeight;

            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.fillStyle = '#212529';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
            ctx.fillText(days[index], x + barWidth / 2, height - 20);
            ctx.fillStyle = '#4361ee';
        });

        ctx.fillStyle = '#212529';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Tasks Completed This Week', 10, 20);
    },

    getWeeklyData: function() {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const data = [0, 0, 0, 0, 0, 0, 0];

        AppState.tasks.forEach(task => {
            if (!task.completed) return;

            const taskDate = new Date(task.createdAt);
            if (taskDate < weekStart) return;

            const dayIndex = taskDate.getDay();
            data[dayIndex]++;
        });

        return data;
    }
};