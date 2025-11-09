// Tasks management module
/*const tasks = {
    init: function () {
        this.bindEvents();
        this.loadTasks();
    },

    bindEvents: function () {
        const addTaskBtn = document.getElementById('add-task-btn');
        const closeTaskModal = document.getElementById('close-task-modal');
        const cancelTask = document.getElementById('cancel-task');
        const taskForm = document.getElementById('task-form');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', this.openTaskModal.bind(this));
        }

        if (closeTaskModal) {
            closeTaskModal.addEventListener('click', this.closeTaskModal.bind(this));
        }

        if (cancelTask) {
            cancelTask.addEventListener('click', this.closeTaskModal.bind(this));
        }

        if (taskForm) {
            taskForm.addEventListener('submit', this.handleAddTask.bind(this));
        }
    },

    loadTasks: function () {
        const savedTasks = localStorage.getItem('tasks');
        AppState.tasks = savedTasks ? JSON.parse(savedTasks) : [];
        this.renderTasks();
    },

    saveTasks: function () {
        localStorage.setItem('tasks', JSON.stringify(AppState.tasks));
    },

    openTaskModal: function () {
        document.getElementById('task-modal').classList.add('active');

        // Set minimum datetime to current time
        const now = new Date();
        const localDateTime = now.toISOString().slice(0, 16);
        document.getElementById('task-due').min = localDateTime;

        // Set default to 1 hour from now
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const defaultDateTime = oneHourLater.toISOString().slice(0, 16);
        document.getElementById('task-due').value = defaultDateTime;
    },

    closeTaskModal: function () {
        document.getElementById('task-modal').classList.remove('active');
        document.getElementById('task-form').reset();
    },

    handleAddTask: function (e) {
        e.preventDefault();

        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const due = document.getElementById('task-due').value;
        const priority = document.getElementById('task-priority').value;

        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            due: new Date(due),
            priority,
            completed: false,
            createdAt: new Date()
        };

        AppState.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.closeTaskModal();

        notifications.show('Task Added', 'Your new task has been added successfully', 'success');

        // Update streak if this is the first task completed today
        streaks.updateStreak();
    },

    toggleTaskCompletion: function (taskId) {
        const task = AppState.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();

            // Update streak when a task is completed
            if (task.completed) {
                streaks.updateStreak();
            }
        }
    },

    deleteTask: function (taskId) {
        AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        notifications.show('Task Deleted', 'The task has been removed', 'success');
    },

    renderTasks: function () {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        taskList.innerHTML = '';

        if (AppState.tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--gray);">No tasks yet. Add your first task!</p>';
            return;
        }

        // Sort tasks: incomplete first, then by due date
        const sortedTasks = [...AppState.tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(a.due) - new Date(b.due);
        });

        sortedTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;

            const dueDate = new Date(task.due);
            const now = new Date();
            const isOverdue = !task.completed && dueDate < now;

            taskEl.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <div class="task-due ${isOverdue ? 'overdue' : ''}">
                            <i class="far fa-clock"></i> ${dueDate.toLocaleString()}
                        </div>
                        <div class="task-priority priority-${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </div>
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="delete-task" data-id="${task.id}"><i class="far fa-trash-alt"></i></button>
                </div>
            `;

            taskList.appendChild(taskEl);

            // Add event listeners for the task actions
            const checkbox = taskEl.querySelector('.task-checkbox input');
            checkbox.addEventListener('change', () => {
                this.toggleTaskCompletion(task.id);
            });

            const deleteBtn = taskEl.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => {
                this.deleteTask(task.id);
            });
        });
    }
    // Add these methods to your existing tasks object

editTask: function (taskId) {
        const task = AppState.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Populate the modal with task data
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';

        // Format date for datetime-local input
        const dueDate = new Date(task.due);
        const localDateTime = dueDate.toISOString().slice(0, 16);
        document.getElementById('task-due').value = localDateTime;

        document.getElementById('task-priority').value = task.priority;

        // Change modal to edit mode
        const modal = document.getElementById('task-modal');
        const modalHeader = modal.querySelector('.modal-header h3');
        const submitBtn = modal.querySelector('.form-actions button[type="submit"]');

        modalHeader.textContent = 'Edit Task';
        submitBtn.textContent = 'Update Task';

        // Store the task ID being edited
        modal.dataset.editingTaskId = taskId;

        // Open modal
        modal.classList.add('active');
    },

    handleEditTask: function (e) {
        e.preventDefault();

        const taskId = document.getElementById('task-modal').dataset.editingTaskId;
        const task = AppState.tasks.find(t => t.id === taskId);

        if (!task) return;

        // Update task properties
        task.title = document.getElementById('task-title').value;
        task.description = document.getElementById('task-description').value;
        task.due = new Date(document.getElementById('task-due').value);
        task.priority = document.getElementById('task-priority').value;

        this.saveTasks();
        this.renderTasks();
        this.closeTaskModal();

        notifications.show('Task Updated', 'Your task has been updated successfully', 'success');
    },

    // Update the handleAddTask method to handle both add and edit
    handleAddTask: function (e) {
        e.preventDefault();

        const modal = document.getElementById('task-modal');
        const isEditing = modal.dataset.editingTaskId;

        if (isEditing) {
            this.handleEditTask(e);
        } else {
            // Your existing add task logic
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-description').value;
            const due = document.getElementById('task-due').value;
            const priority = document.getElementById('task-priority').value;

            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                due: new Date(due),
                priority,
                completed: false,
                createdAt: new Date()
            };

            AppState.tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            this.closeTaskModal();

            notifications.show('Task Added', 'Your new task has been added successfully', 'success');

            // Update streak if this is the first task completed today
            streaks.updateStreak();
        }
    },

    // Update closeTaskModal to reset edit state
    closeTaskModal: function () {
        const modal = document.getElementById('task-modal');
        modal.classList.remove('active');
        document.getElementById('task-form').reset();

        // Reset edit mode
        const modalHeader = modal.querySelector('.modal-header h3');
        const submitBtn = modal.querySelector('.form-actions button[type="submit"]');

        modalHeader.textContent = 'Add New Task';
        submitBtn.textContent = 'Add Task';
        delete modal.dataset.editingTaskId;
    },

    // Update the renderTasks method to include edit button
    renderTasks: function () {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        taskList.innerHTML = '';

        if (AppState.tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--gray);">No tasks yet. Add your first task!</p>';
            return;
        }

        // Sort tasks: incomplete first, then by due date
        const sortedTasks = [...AppState.tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(a.due) - new Date(b.due);
        });

        sortedTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;

            const dueDate = new Date(task.due);
            const now = new Date();
            const isOverdue = !task.completed && dueDate < now;

            taskEl.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
            </div>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <div class="task-due ${isOverdue ? 'overdue' : ''}">
                        <i class="far fa-clock"></i> ${dueDate.toLocaleString()}
                    </div>
                    <div class="task-priority priority-${task.priority}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </div>
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="edit-task" data-id="${task.id}" title="Edit Task"><i class="far fa-edit"></i></button>
                <button class="delete-task" data-id="${task.id}" title="Delete Task"><i class="far fa-trash-alt"></i></button>
            </div>
        `;

            taskList.appendChild(taskEl);

            // Add event listeners for the task actions
            const checkbox = taskEl.querySelector('.task-checkbox input');
            checkbox.addEventListener('change', () => {
                this.toggleTaskCompletion(task.id);
            });

            const editBtn = taskEl.querySelector('.edit-task');
            editBtn.addEventListener('click', () => {
                this.editTask(task.id);
            });

            const deleteBtn = taskEl.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => {
                this.deleteTask(task.id);
            });
        });
    }
}; */
// Tasks management module
const tasks = {
    init: function() {
        this.bindEvents();
        this.loadTasks();
    },

    bindEvents: function() {
        const addTaskBtn = document.getElementById('add-task-btn');
        const closeTaskModal = document.getElementById('close-task-modal');
        const cancelTask = document.getElementById('cancel-task');
        const taskForm = document.getElementById('task-form');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', this.openTaskModal.bind(this));
        }

        if (closeTaskModal) {
            closeTaskModal.addEventListener('click', this.closeTaskModal.bind(this));
        }

        if (cancelTask) {
            cancelTask.addEventListener('click', this.closeTaskModal.bind(this));
        }

        if (taskForm) {
            taskForm.addEventListener('submit', this.handleAddTask.bind(this));
        }
    },

    loadTasks: function() {
        const savedTasks = localStorage.getItem('tasks');
        AppState.tasks = savedTasks ? JSON.parse(savedTasks) : [];
        this.renderTasks();
    },

    saveTasks: function() {
        localStorage.setItem('tasks', JSON.stringify(AppState.tasks));
    },

    openTaskModal: function() {
        document.getElementById('task-modal').classList.add('active');
        
        // Set minimum datetime to current time
        const now = new Date();
        const localDateTime = now.toISOString().slice(0, 16);
        document.getElementById('task-due').min = localDateTime;
        
        // Set default to 1 hour from now
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const defaultDateTime = oneHourLater.toISOString().slice(0, 16);
        document.getElementById('task-due').value = defaultDateTime;
    },

    closeTaskModal: function() {
        const modal = document.getElementById('task-modal');
        modal.classList.remove('active');
        document.getElementById('task-form').reset();
        
        // Reset edit mode
        const modalHeader = modal.querySelector('.modal-header h3');
        const submitBtn = modal.querySelector('.form-actions button[type="submit"]');
        
        modalHeader.textContent = 'Add New Task';
        submitBtn.textContent = 'Add Task';
        delete modal.dataset.editingTaskId;
    },

    handleAddTask: function(e) {
        e.preventDefault();
        
        const modal = document.getElementById('task-modal');
        const isEditing = modal.dataset.editingTaskId;
        
        if (isEditing) {
            this.handleEditTask(e);
        } else {
            // Your existing add task logic
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-description').value;
            const due = document.getElementById('task-due').value;
            const priority = document.getElementById('task-priority').value;

            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                due: new Date(due),
                priority,
                completed: false,
                createdAt: new Date()
            };

            AppState.tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            this.closeTaskModal();
            
            notifications.show('Task Added', 'Your new task has been added successfully', 'success');
            
            // Update streak if this is the first task completed today
            streaks.updateStreak();
        }
    },

    handleEditTask: function(e) {
        e.preventDefault();
        
        const taskId = document.getElementById('task-modal').dataset.editingTaskId;
        const task = AppState.tasks.find(t => t.id === taskId);
        
        if (!task) return;

        // Update task properties
        task.title = document.getElementById('task-title').value;
        task.description = document.getElementById('task-description').value;
        task.due = new Date(document.getElementById('task-due').value);
        task.priority = document.getElementById('task-priority').value;

        this.saveTasks();
        this.renderTasks();
        this.closeTaskModal();
        
        notifications.show('Task Updated', 'Your task has been updated successfully', 'success');
    },

    editTask: function(taskId) {
        const task = AppState.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Populate the modal with task data
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        
        // Format date for datetime-local input
        const dueDate = new Date(task.due);
        const localDateTime = dueDate.toISOString().slice(0, 16);
        document.getElementById('task-due').value = localDateTime;
        
        document.getElementById('task-priority').value = task.priority;

        // Change modal to edit mode
        const modal = document.getElementById('task-modal');
        const modalHeader = modal.querySelector('.modal-header h3');
        const submitBtn = modal.querySelector('.form-actions button[type="submit"]');
        
        modalHeader.textContent = 'Edit Task';
        submitBtn.textContent = 'Update Task';
        
        // Store the task ID being edited
        modal.dataset.editingTaskId = taskId;
        
        // Open modal
        modal.classList.add('active');
    },

    toggleTaskCompletion: function(taskId) {
        const task = AppState.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            
            // Update streak when a task is completed
            if (task.completed) {
                streaks.updateStreak();
            }
        }
    },

    deleteTask: function(taskId) {
        AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        notifications.show('Task Deleted', 'The task has been removed', 'success');
    },

    renderTasks: function() {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;
        
        taskList.innerHTML = '';
        
        if (AppState.tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--gray);">No tasks yet. Add your first task!</p>';
            return;
        }
        
        // Sort tasks: incomplete first, then by due date
        const sortedTasks = [...AppState.tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(a.due) - new Date(b.due);
        });
        
        sortedTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const dueDate = new Date(task.due);
            const now = new Date();
            const isOverdue = !task.completed && dueDate < now;
            
            taskEl.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <div class="task-due ${isOverdue ? 'overdue' : ''}">
                            <i class="far fa-clock"></i> ${dueDate.toLocaleString()}
                        </div>
                        <div class="task-priority priority-${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </div>
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="edit-task" data-id="${task.id}" title="Edit Task"><i class="far fa-edit"></i></button>
                    <button class="delete-task" data-id="${task.id}" title="Delete Task"><i class="far fa-trash-alt"></i></button>
                </div>
            `;
            
            taskList.appendChild(taskEl);
            
            // Add event listeners for the task actions
            const checkbox = taskEl.querySelector('.task-checkbox input');
            checkbox.addEventListener('change', () => {
                this.toggleTaskCompletion(task.id);
            });
            
            const editBtn = taskEl.querySelector('.edit-task');
            editBtn.addEventListener('click', () => {
                this.editTask(task.id);
            });
            
            const deleteBtn = taskEl.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => {
                this.deleteTask(task.id);
            });
        });
    }
};
