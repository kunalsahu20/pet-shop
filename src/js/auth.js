// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');

    if (loginBtn && logoutBtn) {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
        }
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = 'index.html';
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    
    // Add logout handler
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});
