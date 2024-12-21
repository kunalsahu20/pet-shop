// Cache DOM elements
const loginForm = document.getElementById('loginForm');
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const emailInput = document.getElementById('email');
const messageDiv = document.getElementById('message');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for remembered credentials
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    
    if (rememberedEmail && rememberedPassword) {
        emailInput.value = rememberedEmail;
        passwordInput.value = rememberedPassword;
        rememberCheckbox.checked = true;
    }

    // Function to show message
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type} show`;
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 3000);
    }

    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        // Simple validation
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Check credentials
        if (isValidCredentials(email, password)) {
            // Save credentials if remember me is checked
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPassword', password);
            } else {
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
            }

            // Save login status
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);

            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect after showing message
            setTimeout(() => {
                const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
                window.location.href = `${baseUrl}/index.html`;
            }, 1500);
        } else {
            showMessage('Invalid email or password', 'error');
        }
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
});

// Validate credentials
function isValidCredentials(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length >= 6;
}

// Add message styles
const style = document.createElement('style');
style.textContent = `
    .message {
        margin-top: 1rem;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        animation: fadeIn 0.3s ease;
    }
    .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    .show {
        display: block;
    }
`;
document.head.appendChild(style);
