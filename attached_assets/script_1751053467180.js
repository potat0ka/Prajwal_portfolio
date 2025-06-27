/* ===========================
   Personal Portfolio JavaScript
   Clean, modular JavaScript for portfolio functionality
   =========================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
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
    mobileToggle.addEventListener('click', function() {
        navbarNav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Update ARIA attribute for accessibility
        const isExpanded = navbarNav.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
        
        // Animate hamburger lines
        animateHamburgerMenu(mobileToggle, isExpanded);
    });
    
    // Close mobile menu when clicking nav links
    const navLinks = navbarNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            animateHamburgerMenu(mobileToggle, false);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileToggle.contains(event.target) && !navbarNav.contains(event.target)) {
            navbarNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            animateHamburgerMenu(mobileToggle, false);
        }
    });
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
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
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
}

/**
 * Setup scroll-triggered animations
 * Animates elements as they come into view
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .project-card, .skill-category, .timeline-item'
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
                
                // Trigger skill bar animations if it's a skill category
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
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
 * Animate skill progress bars
 * @param {Element} skillCategory - The skill category container
 */
function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            // Trigger reflow and animate
            bar.offsetHeight;
            bar.style.width = width;
        }, index * 200);
    });
}

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
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                // Add validation visual feedback
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = '';
                }
            });
            
            // Real-time validation feedback
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    this.style.borderColor = '';
                }
            });
        });
    });
}

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

/* ===========================
   Advanced Features
   =========================== */

/**
 * Setup lazy loading for images
 * Improves page performance by loading images on demand
 */
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver(function(entries) {
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
}

/**
 * Setup loading states for dynamic content
 * Provides visual feedback during content loading
 */
function showLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
    
    // Add loading spinner if not present
    if (!element.querySelector('.loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.appendChild(spinner);
    }
}

/**
 * Hide loading state
 */
function hideLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
    
    const spinner = element.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

/* ===========================
   Error Handling
   =========================== */

/**
 * Global error handler for JavaScript errors
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    
    // You can add error reporting here
    // reportError(event.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default behavior (logging to console)
    event.preventDefault();
    
    // You can add error reporting here
    // reportError(event.reason);
});

/* ===========================
   Performance Monitoring
   =========================== */

/**
 * Monitor page performance
 */
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart + 'ms');
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms');
            }, 0);
        });
    }
}

// Initialize performance monitoring if needed
// monitorPerformance();