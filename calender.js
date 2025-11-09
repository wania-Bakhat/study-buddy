// Calendar module
const calendar = {
    currentDate: new Date(),

    init: function() {
        this.bindEvents();
        this.renderCalendar(this.currentDate);
    },

    bindEvents: function() {
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar(this.currentDate);
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar(this.currentDate);
            });
        }
    },

    renderCalendar: function(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update calendar header
        const calendarMonth = document.getElementById('calendar-month');
        if (calendarMonth) {
            calendarMonth.textContent = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
        }
        
        // Clear previous calendar
        const calendarDays = document.getElementById('calendar-days');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day header';
            dayEl.textContent = day;
            calendarDays.appendChild(dayEl);
        });
        
        // Get first day of month and last day of previous month
        const firstDay = new Date(year, month, 1);
        const lastDayPrevMonth = new Date(year, month, 0).getDate();
        
        // Add days from previous month
        const startingDay = firstDay.getDay();
        for (let i = startingDay - 1; i >= 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = lastDayPrevMonth - i;
            calendarDays.appendChild(dayEl);
        }
        
        // Add days of current month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            
            // Check if this is today
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('active');
            }
            
            dayEl.textContent = i;
            calendarDays.appendChild(dayEl);
        }
        
        // Calculate how many days from next month to show
        const totalCells = 42; // 6 rows x 7 days
        const daysSoFar = startingDay + daysInMonth;
        const daysNextMonth = totalCells - daysSoFar;
        
        // Add days from next month
        for (let i = 1; i <= daysNextMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.textContent = i;
            calendarDays.appendChild(dayEl);
        }
    }
};