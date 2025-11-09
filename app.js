// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    auth.init();
    tasks.init();
    calendar.init();
    timer.init();
    streaks.init();
    notifications.init();

    // Set current date
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    console.log('StudyBuddy initialized successfully!');
});

// Global state
const AppState = {
    currentUser: null,
    currentPage: 'taskboard',
    tasks: [],
    streak: 0,
    lastStudyDate: ''
};

// Navigation functions
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Show the selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Add active class to the clicked sidebar link
    const selectedLink = document.querySelector(`[data-page="${pageName}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }

    AppState.currentPage = pageName;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const overlay = document.getElementById('overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                showPage(page);
                toggleSidebar();
            }
        });
    });
});