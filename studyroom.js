// Study Room module
const studyRoom = {
    roomTimer: null,
    roomSeconds: 0,

    init: function() {
        this.bindEvents();
        this.startRoomTimer();
        this.loadMessages();
    },

    bindEvents: function() {
        const sendBtn = document.getElementById('send-message');
        const inputField = document.getElementById('chat-input-field');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    },

    startRoomTimer: function() {
        this.roomTimer = setInterval(() => {
            this.roomSeconds++;
            this.updateRoomTimer();
        }, 1000);
    },

    updateRoomTimer: function() {
        const timerEl = document.getElementById('room-timer');
        if (!timerEl) return;

        const hours = Math.floor(this.roomSeconds / 3600);
        const minutes = Math.floor((this.roomSeconds % 3600) / 60);
        const seconds = this.roomSeconds % 60;

        timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    sendMessage: function() {
        const inputField = document.getElementById('chat-input-field');
        const message = inputField.value.trim();

        if (!message) return;

        const messageObj = {
            user: AppState.currentUser?.name || 'You',
            message: message,
            timestamp: new Date().toISOString(),
            own: true
        };

        this.addMessageToUI(messageObj);
        this.saveMessage(messageObj);

        inputField.value = '';
    },

    addMessageToUI: function(messageObj) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${messageObj.own ? 'own' : ''}`;

        const time = new Date(messageObj.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageEl.innerHTML = `
            <strong>${messageObj.user}</strong>
            <p>${messageObj.message}</p>
            <small style="opacity: 0.7; font-size: 0.8rem;">${time}</small>
        `;

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    saveMessage: function(messageObj) {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push(messageObj);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    },

    loadMessages: function() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.forEach(msg => this.addMessageToUI(msg));
    }
};