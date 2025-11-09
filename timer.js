// Pomodoro Timer module
const timer = {
    interval: null,
    running: false,
    modeIsStudy: true,
    secondsLeft: 25 * 60,
    studyDuration: 25,
    breakDuration: 5,

    init: function() {
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents: function() {
        const startTimerBtn = document.getElementById('start-timer');
        const pauseTimerBtn = document.getElementById('pause-timer');
        const resetTimerBtn = document.getElementById('reset-timer');
        const studyTimeInput = document.getElementById('study-time');
        const breakTimeInput = document.getElementById('break-time');

        if (startTimerBtn) {
            startTimerBtn.addEventListener('click', this.start.bind(this));
        }

        if (pauseTimerBtn) {
            pauseTimerBtn.addEventListener('click', this.pause.bind(this));
        }

        if (resetTimerBtn) {
            resetTimerBtn.addEventListener('click', this.reset.bind(this));
        }

        if (studyTimeInput) {
            studyTimeInput.addEventListener('change', (e) => {
                this.studyDuration = parseInt(e.target.value);
                if (this.modeIsStudy && !this.running) {
                    this.secondsLeft = this.studyDuration * 60;
                    this.updateDisplay();
                }
            });
        }

        if (breakTimeInput) {
            breakTimeInput.addEventListener('change', (e) => {
                this.breakDuration = parseInt(e.target.value);
                if (!this.modeIsStudy && !this.running) {
                    this.secondsLeft = this.breakDuration * 60;
                    this.updateDisplay();
                }
            });
        }
    },

    start: function() {
        if (this.running) return;
        
        this.running = true;
        document.getElementById('start-timer').disabled = true;
        document.getElementById('pause-timer').disabled = false;
        
        this.interval = setInterval(() => {
            this.secondsLeft--;
            
            if (this.secondsLeft <= 0) {
                clearInterval(this.interval);
                this.running = false;
                
                // Show notification
                notifications.show(
                    'Timer Complete', 
                    this.modeIsStudy ? 'Time for a break!' : 'Break is over, back to study!',
                    'success'
                );
                
                // Switch mode
                this.modeIsStudy = !this.modeIsStudy;
                this.secondsLeft = (this.modeIsStudy ? this.studyDuration : this.breakDuration) * 60;
                
                document.getElementById('timer-mode').textContent = this.modeIsStudy ? 'Study Time' : 'Break Time';
                document.getElementById('start-timer').disabled = false;
                document.getElementById('pause-timer').disabled = true;
                
                // Update streak when study session completes
                if (!this.modeIsStudy) { // Just finished a study session
                    streaks.updateStreak();
                }
            }
            
            this.updateDisplay();
        }, 1000);
    },

    pause: function() {
        if (!this.running) return;
        
        clearInterval(this.interval);
        this.running = false;
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
    },

    reset: function() {
        clearInterval(this.interval);
        this.running = false;
        this.secondsLeft = (this.modeIsStudy ? this.studyDuration : this.breakDuration) * 60;
        this.updateDisplay();
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
    },

    updateDisplay: function() {
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            const minutes = Math.floor(this.secondsLeft / 60);
            const seconds = this.secondsLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
};