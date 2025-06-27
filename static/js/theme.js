/* ===========================
   Theme Management System
   Comprehensive dark/light mode toggle with persistence
   =========================== */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.systemPreference = 'light';
        this.themeButtons = [];
        this.observers = [];
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.detectSystemPreference();
        this.loadSavedTheme();
        this.initializeThemeButtons();
        this.setupSystemPreferenceListener();
        this.setupTransitionAnimations();
        this.applyTheme(this.currentTheme, false); // Don't animate initial load
        
        console.log(`Theme manager initialized with theme: ${this.currentTheme}`);
    }

    /**
     * Detect system color scheme preference
     */
    detectSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemPreference = mediaQuery.matches ? 'dark' : 'light';
        
        console.log(`System preference detected: ${this.systemPreference}`);
    }

    /**
     * Load theme from localStorage or use system preference
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = this.systemPreference;
        }
        
        console.log(`Loaded theme: ${this.currentTheme}`);
    }

    /**
     * Save theme preference to localStorage
     * @param {string} theme - Theme to save
     */
    saveTheme(theme) {
        localStorage.setItem('theme-preference', theme);
        console.log(`Theme saved: ${theme}`);
    }

    /**
     * Initialize all theme toggle buttons
     */
    initializeThemeButtons() {
        this.themeButtons = document.querySelectorAll('.theme-toggle, #theme-toggle');
        
        this.themeButtons.forEach(button => {
            // Set initial icon
            this.updateButtonIcon(button, this.currentTheme);
            
            // Add click listener
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
            
            // Add keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
            
            // Ensure proper ARIA attributes
            button.setAttribute('aria-label', `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`);
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
        });
        
        console.log(`Initialized ${this.themeButtons.length} theme buttons`);
    }

    /**
     * Update button icon based on current theme
     * @param {Element} button - Theme button element
     * @param {string} theme - Current theme
     */
    updateButtonIcon(button, theme) {
        const icon = button.querySelector('i');
        if (!icon) return;
        
        // Remove existing classes
        icon.className = '';
        
        // Add new icon class based on theme
        if (theme === 'light') {
            icon.className = 'fas fa-moon';
            button.title = 'Switch to dark mode';
        } else {
            icon.className = 'fas fa-sun';
            button.title = 'Switch to light mode';
        }
        
        // Update ARIA label
        button.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }

    /**
     * Listen for system preference changes
     */
    setupSystemPreferenceListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            this.systemPreference = e.matches ? 'dark' : 'light';
            console.log(`System preference changed to: ${this.systemPreference}`);
            
            // If user hasn't manually set a preference, follow system
            const savedTheme = localStorage.getItem('theme-preference');
            if (!savedTheme) {
                this.applyTheme(this.systemPreference);
            }
        });
    }

    /**
     * Setup smooth transition animations
     */
    setupTransitionAnimations() {
        // Add CSS for theme transitions if not already present
        if (!document.getElementById('theme-transitions')) {
            const style = document.createElement('style');
            style.id = 'theme-transitions';
            style.textContent = `
                .theme-transitioning * {
                    transition: 
                        background-color 0.3s ease,
                        border-color 0.3s ease,
                        color 0.3s ease,
                        box-shadow 0.3s ease !important;
                }
                
                .theme-transitioning .theme-toggle i {
                    transition: transform 0.5s ease, opacity 0.3s ease;
                }
                
                .theme-button-animating {
                    transform: scale(0.95);
                    transition: transform 0.15s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        if (this.isTransitioning) return;
        
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    /**
     * Apply a specific theme
     * @param {string} theme - Theme to apply ('light' or 'dark')
     * @param {boolean} animate - Whether to animate the transition
     */
    applyTheme(theme, animate = true) {
        if (this.isTransitioning || !['light', 'dark'].includes(theme)) return;
        
        console.log(`Applying theme: ${theme}`);
        
        this.isTransitioning = true;
        const body = document.body;
        
        // Add transition class if animating
        if (animate) {
            body.classList.add('theme-transitioning');
            
            // Animate theme buttons
            this.themeButtons.forEach(button => {
                button.classList.add('theme-button-animating');
                setTimeout(() => {
                    button.classList.remove('theme-button-animating');
                }, 150);
            });
        }
        
        // Apply theme to body
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
        }
        
        // Update current theme
        this.currentTheme = theme;
        
        // Save preference
        this.saveTheme(theme);
        
        // Update all theme buttons
        this.themeButtons.forEach(button => {
            this.updateButtonIcon(button, theme);
        });
        
        // Notify observers
        this.notifyObservers(theme);
        
        // Update favicon if needed
        this.updateFavicon(theme);
        
        // Update meta theme-color
        this.updateMetaThemeColor(theme);
        
        // Clean up transition class
        if (animate) {
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
                this.isTransitioning = false;
            }, 300);
        } else {
            this.isTransitioning = false;
        }
        
        console.log(`Theme applied successfully: ${theme}`);
    }

    /**
     * Update favicon based on theme
     * @param {string} theme - Current theme
     */
    updateFavicon(theme) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            // You can set different favicons for different themes
            const faviconPath = theme === 'dark' ? '/static/favicon-dark.ico' : '/static/favicon-light.ico';
            // Only update if the file exists
            favicon.href = faviconPath;
        }
    }

    /**
     * Update meta theme-color for mobile browsers
     * @param {string} theme - Current theme
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Set theme color based on current theme
        metaThemeColor.content = theme === 'dark' ? '#111827' : '#ffffff';
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if dark theme is active
     * @returns {boolean} Whether dark theme is active
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    /**
     * Force set theme without animation
     * @param {string} theme - Theme to set
     */
    setTheme(theme) {
        this.applyTheme(theme, false);
    }

    /**
     * Register observer for theme changes
     * @param {Function} callback - Callback function to call on theme change
     */
    addObserver(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
        }
    }

    /**
     * Remove observer
     * @param {Function} callback - Callback function to remove
     */
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    /**
     * Notify all observers of theme change
     * @param {string} theme - New theme
     */
    notifyObservers(theme) {
        this.observers.forEach(callback => {
            try {
                callback(theme);
            } catch (error) {
                console.error('Error in theme observer:', error);
            }
        });
    }

    /**
     * Get system preference
     * @returns {string} System preference ('light' or 'dark')
     */
    getSystemPreference() {
        return this.systemPreference;
    }

    /**
     * Reset to system preference
     */
    resetToSystemPreference() {
        localStorage.removeItem('theme-preference');
        this.applyTheme(this.systemPreference);
    }

    /**
     * Preload theme assets
     */
    preloadThemeAssets() {
        // Preload any theme-specific assets
        const themes = ['light', 'dark'];
        themes.forEach(theme => {
            // Example: preload theme-specific images
            const img = new Image();
            img.src = `/static/images/bg-${theme}.jpg`;
        });
    }

    /**
     * Export theme settings
     * @returns {Object} Theme settings object
     */
    exportSettings() {
        return {
            currentTheme: this.currentTheme,
            systemPreference: this.systemPreference,
            timestamp: Date.now()
        };
    }

    /**
     * Import theme settings
     * @param {Object} settings - Theme settings object
     */
    importSettings(settings) {
        if (settings && settings.currentTheme) {
            this.applyTheme(settings.currentTheme);
        }
    }
}

// Initialize theme manager
let themeManager;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeManager);
} else {
    initializeThemeManager();
}

function initializeThemeManager() {
    try {
        themeManager = new ThemeManager();
        
        // Make theme manager globally available
        window.themeManager = themeManager;
        
        // Add convenience functions to window
        window.toggleTheme = () => themeManager.toggleTheme();
        window.setTheme = (theme) => themeManager.setTheme(theme);
        window.getCurrentTheme = () => themeManager.getCurrentTheme();
        window.isDarkTheme = () => themeManager.isDarkTheme();
        
        console.log('Theme manager ready');
    } catch (error) {
        console.error('Failed to initialize theme manager:', error);
        
        // Fallback theme toggle function
        window.toggleTheme = function() {
            const body = document.body;
            const isDark = body.hasAttribute('data-theme');
            
            if (isDark) {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme-preference', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme-preference', 'dark');
            }
        };
    }
}

// Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyT') {
        e.preventDefault();
        if (window.themeManager) {
            window.themeManager.toggleTheme();
        } else if (window.toggleTheme) {
            window.toggleTheme();
        }
    }
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
