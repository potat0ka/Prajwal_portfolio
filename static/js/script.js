/* ===========================
   Personal Portfolio JavaScript
   Enhanced with comprehensive theme support and animations
   =========================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure theme system is initialized first
    if (!window.themeManager) {
        // Wait a bit for theme manager to initialize
        setTimeout(() => {
            initializePortfolio();
        }, 100);
    } else {
        initializePortfolio();
    }
});

/**
 * Main initialization function
 * Sets up all interactive features of the portfolio
 */
function initializePortfolio() {
    setupMobileNavigation();
    setupScrollToTop();
    setupSmoothScrolling();
    setupNavbarScroll();
    setupAnimations();
    setupFormValidation();
    setupSkillAnimations();
    initializeActiveNavigation();
    setupThemeTransitions();
}

/* ===========================
   Mobile Navigation
   =========================== */

/**
 * Setup mobile navigation toggle functionality
 * Handles hamburger menu and mobile nav display
 */
function setupMobileNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarNav = document.getElementById('navbarNav');
    
    if (!mobileToggle || !navbarNav) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking nav links
    const navLinks = navbarNav.querySelectorAll('.nav-link:not(.theme-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navbarNav.contains(event.target);
        const isClickOnToggle = mobileToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navbarNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarNav = document.getElementById('navbarNav');
    
    navbarNav.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Update ARIA attribute for accessibility
    const isExpanded = navbarNav.classList.contains('active');
    mobileToggle.setAttribute('aria-expanded', isExpanded);
    
    // Animate hamburger lines
    animateHamburgerMenu(mobileToggle, isExpanded);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : '';
}

function closeMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarNav = document.getElementById('navbarNav');
    
    navbarNav.classList.remove('active');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    animateHamburgerMenu(mobileToggle, false);
    document.body.style.overflow = '';
}

/**
 * Animate hamburger menu transformation
 * @param {Element} toggle - The mobile toggle button
 * @param {boolean} isActive - Whether menu is active
 */
function animateHamburgerMenu(toggle, isActive) {
    const lines = toggle.querySelectorAll('.hamburger-line');
    
    if (isActive) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
}

/* ===========================
   Scroll to Top Button
   =========================== */

/**
 * Setup scroll to top button functionality
 * Shows/hides button based on scroll position
 */
function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (!scrollTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100));
    
    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===========================
   Smooth Scrolling
   =========================== */

/**
 * Setup smooth scrolling for internal links
 * Provides smooth navigation between sections
 */
function setupSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

/* ===========================
   Navbar Scroll Effects
   =========================== */

/**
 * Setup navbar behavior on scroll
 * Adds shadow and background effects when scrolling
 */
function setupNavbarScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 50) {
            header.style.boxShadow = '0 2px 20px var(--shadow-medium)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.boxShadow = '0 1px 3px var(--shadow-light)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }, 100));
}

/* ===========================
   Active Navigation
   =========================== */

/**
 * Update active navigation based on scroll position
 */
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;
    
    window.addEventListener('scroll', throttle(function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

/* ===========================
   Animations and Interactions
   =========================== */

/**
 * Setup various animations and interactive elements
 * Includes scroll animations, form interactions, etc.
 */
function setupAnimations() {
    setupScrollAnimations();
    setupFormInteractions();
    setupProjectFiltering();
    setupParallaxEffects();
}

/**
 * Setup scroll-triggered animations
 * Animates elements as they come into view
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .project-card, .skill-category, .timeline-item, .stat-item, .contact-item'
    );
    
    if (!animatedElements.length) return;
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for multiple elements
                const index = Array.from(animatedElements).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                
                // Trigger skill bar animations if it's a skill category
                if (entry.target.classList.contains('skill-category')) {
                    setTimeout(() => animateSkillBars(entry.target), 300);
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Set initial state and observe elements
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Setup skill bar animations
 */
function setupSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                setTimeout(() => {
                    bar.style.width = progress + '%';
                    bar.classList.add('animated');
                }, 300);
            }
        });
    };
    
    // Initial check
    animateSkillBars();
    
    // Check on scroll
    window.addEventListener('scroll', throttle(animateSkillBars, 100));
}

/**
 * Animate skill progress bars
 * @param {Element} skillCategory - The skill category container
 */
function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const progress = bar.getAttribute('data-progress');
        
        setTimeout(() => {
            bar.style.width = progress + '%';
            bar.classList.add('animated');
        }, index * 200);
    });
}

/**
 * Setup parallax effects for enhanced visual appeal
 */
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.profile-image-placeholder');
    
    if (!parallaxElements.length) return;
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16)); // 60fps
}

/* ===========================
   Form Interactions
   =========================== */

/**
 * Setup form interactions and validation
 * Enhances form user experience
 */
function setupFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                this.style.borderColor = 'var(--primary-color)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                // Add validation visual feedback
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = 'var(--error-color)';
                    this.classList.add('error');
                } else {
                    this.style.borderColor = '';
                    this.classList.remove('error');
                }
            });
            
            // Real-time validation feedback
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.style.borderColor = '';
                    this.classList.remove('error');
                }
            });
        });
        
        // Form submission handling
        form.addEventListener('submit', function(e) {
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--error-color)';
                    field.classList.add('error');
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // If valid, show loading message
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitButton.disabled = true;
            }
        });
    });
}

/**
 * Show form submission message
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success/error)
 */
function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    // Add to form
    const form = document.querySelector('form');
    if (form) {
        form.appendChild(messageElement);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value.trim();
            const isValid = validateEmail(email);
            
            if (email && !isValid) {
                this.style.borderColor = 'var(--error-color)';
                this.classList.add('error');
                showFieldError(this, 'Please enter a valid email address.');
            } else {
                this.style.borderColor = '';
                this.classList.remove('error');
                hideFieldError(this);
            }
        });
    });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show field error message
 * @param {Element} field - The field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentElement.appendChild(errorElement);
}

/**
 * Hide field error message
 * @param {Element} field - The field element
 */
function hideFieldError(field) {
    const existingError = field.parentElement.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
}

/* ===========================
   Project Filtering
   =========================== */

/**
 * Setup project filtering functionality
 * Filters projects based on category selection
 */
function setupProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (!filterButtons.length || !projectItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter projects with animation
            projectItems.forEach((item, index) => {
                const shouldShow = filterValue === 'all' || 
                                 item.getAttribute('data-category') === filterValue;
                
                if (shouldShow) {
                    setTimeout(() => {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        
                        // Trigger animation
                        requestAnimationFrame(() => {
                            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        });
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ===========================
   Theme Transitions
   =========================== */

/**
 * Setup smooth theme transitions
 */
function setupThemeTransitions() {
    const body = document.body;
    let isTransitioning = false;
    
    // Listen for theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                if (!isTransitioning) {
                    isTransitioning = true;
                    body.classList.add('theme-transitioning');
                    
                    setTimeout(() => {
                        body.classList.remove('theme-transitioning');
                        isTransitioning = false;
                    }, 300);
                }
            }
        });
    });
    
    observer.observe(body, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

/* ===========================
   Utility Functions
   =========================== */

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function to delay function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get scroll percentage of page
 * @returns {number} Scroll percentage (0-100)
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return Math.round((scrollTop / scrollHeight) * 100);
}

/**
 * Smooth scroll to element
 * @param {Element} element - Target element
 * @param {number} offset - Offset from top
 */
function scrollToElement(element, offset = 80) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/* ===========================
   Performance Optimizations
   =========================== */

// Lazy load images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading if needed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLazyLoading);
} else {
    setupLazyLoading();
}

/* ===========================
   Error Handling
   =========================== */

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Portfolio JavaScript Error:', e.error);
    
    // Show user-friendly message for critical errors
    if (e.error && e.error.message.includes('script')) {
        showNotification('Some features may not work properly. Please refresh the page.', 'warning');
    }
});

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
