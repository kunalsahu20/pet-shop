// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 50,
    disable: 'mobile' // Disable on mobile for better performance
});

// Sample pet data with more details
const pets = [
    {
        id: 1,
        name: 'Max',
        type: 'dogs',
        breed: 'Golden Retriever',
        age: '2 years',
        size: 'large',
        image: 'images/dog1.jpg',
        description: 'Friendly and energetic Golden Retriever looking for an active family.',
        status: 'available'
    },
    {
        id: 2,
        name: 'Luna',
        type: 'cats',
        breed: 'Persian',
        age: '1.5 years',
        size: 'medium',
        image: 'images/cat1.jpg',
        description: 'Sweet and gentle Persian cat who loves cuddles.',
        status: 'available'
    },
    {
        id: 3,
        name: 'Rocky',
        type: 'dogs',
        breed: 'German Shepherd',
        age: '3 years',
        size: 'large',
        image: 'images/dog2.jpg',
        description: 'Intelligent and loyal German Shepherd, great with kids.',
        status: 'available'
    }
];

// Performance optimization: Use requestAnimationFrame for scroll handler
let ticking = false;
let lastKnownScrollPosition = 0;
const header = document.querySelector('header');

document.addEventListener('scroll', () => {
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll(lastKnownScrollPosition);
            ticking = false;
        });

        ticking = true;
    }
});

function handleScroll(scrollPos) {
    if (scrollPos > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Performance optimization: Debounce window resize handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Use Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe elements that need animation
document.querySelectorAll('.pet-card, .team-card, .value-card, .contact-card').forEach(el => {
    observer.observe(el);
});

// Performance optimization: Event delegation for card interactions
document.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.pet-card, .team-card, .value-card, .contact-card');
    if (card) {
        card.style.transform = 'translateY(-10px)';
    }
}, { passive: true });

document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.pet-card, .team-card, .value-card, .contact-card');
    if (card) {
        card.style.transform = 'translateY(0)';
    }
}, { passive: true });

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Cache DOM queries
const filterButtons = document.querySelectorAll('.filter-btn');
const petsGrid = document.querySelector('.pets-grid');

if (filterButtons.length > 0 && petsGrid) {
    const filteredPets = {};
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Cache filtered results
            if (!filteredPets[filter]) {
                filteredPets[filter] = filter === 'all' ? 
                    [...pets] : 
                    pets.filter(pet => pet.type === filter);
            }
            
            // Update UI
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Use cached results
            updatePetsGrid(filteredPets[filter]);
        });
    });
}

function updatePetsGrid(petsToShow) {
    requestAnimationFrame(() => {
        petsGrid.innerHTML = petsToShow.map(createPetCard).join('');
    });
}

// Performance optimization: Use createDocumentFragment for multiple DOM updates
function createPetCard(pet) {
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="pet-card" data-aos="fade-up">
            <div class="pet-image">
                <img data-src="${pet.image}" alt="${pet.name}" loading="lazy">
                <div class="pet-status ${pet.status}">${pet.status}</div>
            </div>
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p class="pet-breed">${pet.breed} • ${pet.age}</p>
                <p class="pet-size">${pet.size}</p>
                <p>${pet.description}</p>
                <button class="cta-button meet-pet" data-pet-id="${pet.id}">Meet ${pet.name}</button>
            </div>
        </div>
    `;
    return template.content.firstChild.outerHTML;
}

// Pet filtering and display functionality
function filterPets(filters = {}) {
    let filteredPets = [...pets];

    if (filters.type && filters.type !== 'all') {
        filteredPets = filteredPets.filter(pet => pet.type === filters.type);
    }
    if (filters.size && filters.size !== 'all') {
        filteredPets = filteredPets.filter(pet => pet.size === filters.size);
    }
    if (filters.age && filters.age !== 'all') {
        filteredPets = filteredPets.filter(pet => {
            const petAge = parseInt(pet.age);
            switch(filters.age) {
                case 'young': return petAge <= 2;
                case 'adult': return petAge > 2 && petAge <= 8;
                case 'senior': return petAge > 8;
                default: return true;
            }
        });
    }

    const petsGrid = document.querySelector('.pets-grid');
    if (petsGrid) {
        petsGrid.innerHTML = filteredPets.map(pet => createPetCard(pet)).join('');
        
        // Add event listeners to new pet cards
        document.querySelectorAll('.meet-pet').forEach(button => {
            button.addEventListener('click', () => handleMeetPet(button.dataset.petId));
        });
    }
}

// Handle meet pet button click
function handleMeetPet(petId) {
    const pet = pets.find(p => p.id === parseInt(petId));
    if (pet) {
        alert(`Thank you for your interest in ${pet.name}! Our team will contact you shortly to schedule a meet and greet.`);
    }
}

// Initialize pet filters if on pets page
document.addEventListener('DOMContentLoaded', () => {
    const searchFilters = document.querySelector('.search-filters');
    if (searchFilters) {
        const filterSelects = searchFilters.querySelectorAll('select');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                const filters = {};
                filterSelects.forEach(s => {
                    filters[s.name] = s.value;
                });
                filterPets(filters);
            });
        });
        
        // Initialize with all pets
        filterPets();
    }

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Handle newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our updates soon.`);
            newsletterForm.reset();
        });
    }

    // Donation button functionality
    const donateBtn = document.querySelector('.donate-btn');
    if (donateBtn) {
        donateBtn.addEventListener('click', () => {
            alert('Thank you for your interest in donating! Redirecting to our secure payment page...');
        });
    }
});

// FAQ Accordion functionality
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight;
            
            // Close all other answers
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('p');
                otherAnswer.style.maxHeight = null;
                otherItem.classList.remove('active');
            });
            
            // Toggle current answer
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
            }
        });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Authentication and Redirect Logic
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname;
    
    // If not logged in and not already on login page, redirect to login
    if (!isLoggedIn && !currentPage.includes('login.html')) {
        // Store the current page URL to redirect back after login
        localStorage.setItem('redirectUrl', window.location.href);
        window.location.href = 'login.html';
    }
}

// Update UI based on login status
function updateLoginUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    document.body.classList.toggle('logged-in', isLoggedIn);
    
    if (isLoggedIn) {
        const userEmail = localStorage.getItem('userEmail');
        const navLinks = document.querySelector('.nav-links');
        const logoutBtn = navLinks.querySelector('.logout-btn');
        
        if (!logoutBtn) {
            const li = document.createElement('li');
            li.innerHTML = `<button onclick="logout()" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> 
                <span>Logout</span>
            </button>`;
            navLinks.appendChild(li);
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    updateLoginUI();
});

// Login form submission handler
function handleLogin(event) {
    if (event) {
        event.preventDefault();
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const messageDiv = document.getElementById('message');

    // Simple validation
    if (email && password) {
        // Set login status
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        }

        messageDiv.className = 'message success show';
        messageDiv.textContent = 'Login successful! Redirecting...';

        // Update UI immediately
        updateLoginUI();

        // Get redirect URL or default to index.html
        const redirectUrl = localStorage.getItem('redirectUrl') || 'index.html';
        localStorage.removeItem('redirectUrl'); // Clear stored URL
        
        // Delay redirect to show success message
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    } else {
        messageDiv.className = 'message error show';
        messageDiv.textContent = 'Please enter both email and password';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    document.body.classList.remove('logged-in');
    window.location.href = 'login.html';
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.querySelector('#password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});
