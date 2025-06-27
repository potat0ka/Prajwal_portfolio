/**
 * 3D Guitar Landing Page JavaScript
 * Handles Three.js guitar model, audio controls, and interactive features
 */

// ===================================
// 3D Guitar Landing Page JavaScript
// Handles 3D scene, audio, and interactions
// ===================================

class LandingPage {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.guitar = null;
        this.controls = null;
        this.audioElement = null;
        this.isPlaying = false;
        this.autoRotate = false;
        this.animationId = null;

        this.init();
    }

    async init() {
        try {
            this.setupAudio();
            this.setupEventListeners();
            this.setup3DScene();
            await this.loadGuitarModel();
            this.startAnimation();
            this.hideLoadingScreen();
            this.initializeTheme();
        } catch (error) {
            console.error('Failed to initialize landing page:', error);
            this.showError('Failed to load the guitar experience. Please refresh the page.');
            this.hideLoadingScreen();
        }
    }

    setupAudio() {
        this.audioElement = document.getElementById('background-audio');
        if (this.audioElement) {
            this.audioElement.volume = 0.3;
            this.audioElement.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlayButton();
            });

            this.audioElement.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
                this.showAudioError();
            });
        }
    }

    setupEventListeners() {
        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Play music button
        const playMusic = document.getElementById('play-music');
        if (playMusic) {
            playMusic.addEventListener('click', () => this.playMusic());
        }

        // Enter portfolio button
        const enterPortfolio = document.getElementById('enter-portfolio');
        if (enterPortfolio) {
            enterPortfolio.addEventListener('click', () => this.enterPortfolio());
        }

        // Guitar controls
        const guitarRotate = document.getElementById('guitar-rotate');
        if (guitarRotate) {
            guitarRotate.addEventListener('click', () => this.toggleAutoRotate());
        }

        const guitarReset = document.getElementById('guitar-reset');
        if (guitarReset) {
            guitarReset.addEventListener('click', () => this.resetCamera());
        }

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setup3DScene() {
        const container = document.getElementById('guitar-scene');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        container.appendChild(this.renderer.domElement);

        // Controls setup
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
            this.controls.enablePan = false;
            this.controls.maxDistance = 8;
            this.controls.minDistance = 2;
            this.controls.maxPolarAngle = Math.PI / 1.5;
            this.controls.minPolarAngle = Math.PI / 4;
            this.controls.autoRotate = this.autoRotate;
            this.controls.autoRotateSpeed = 1;
        }

        // Lighting
        this.setupLighting();

        // Create a simple guitar placeholder
        //this.createGuitarPlaceholder();

        // Handle window resize
        //window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x6366f1, 0.3);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);

        // Rim light
        const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.4);
        rimLight.position.set(0, 5, -5);
        this.scene.add(rimLight);
    }

    createGuitarPlaceholder() {
        // Create a simple 3D guitar shape as placeholder
        const group = new THREE.Group();

        // Guitar body
        const bodyGeometry = new THREE.CylinderGeometry(1.5, 1.2, 0.3, 32);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        group.add(body);

        // Guitar neck
        const neckGeometry = new THREE.BoxGeometry(3, 0.3, 0.1);
        const neckMaterial = new THREE.MeshPhongMaterial({ color: 0xDEB887 });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.x = 2;
        group.add(neck);

        // Guitar strings
        for (let i = 0; i < 6; i++) {
            const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3);
            const stringMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
            const string = new THREE.Mesh(stringGeometry, stringMaterial);
            string.rotation.z = Math.PI / 2;
            string.position.x = 2;
            string.position.y = (i - 2.5) * 0.1;
            string.position.z = 0.06;
            group.add(string);
        }

        this.guitar = group;
        this.scene.add(this.guitar);
    }

    async loadGuitarModel() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();

            loader.load(
                '/static/assets/acoustic_guitar_1750913922231.glb',
                (gltf) => {
                    this.guitar = gltf.scene;

                    // Position and scale the guitar
                    this.guitar.position.set(0, -1, 0);
                    this.guitar.rotation.set(0, Math.PI / 4, 0);
                    this.guitar.scale.setScalar(1.5);

                    // Enable shadows
                    this.guitar.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;

                            // Enhance material properties
                            if (child.material) {
                                child.material.metalness = 0.2;
                                child.material.roughness = 0.8;
                            }
                        }
                    });

                    this.scene.add(this.guitar);
                    this.setupGuitarAnimations();
                    resolve();
                },
                (progress) => {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    this.updateLoadingProgress(percent);
                },
                (error) => {
                    console.error('Error loading guitar model:', error);
                    reject(error);
                }
            );
        });
    }

    setupGuitarAnimations() {
        if (!this.guitar) return;

        // Subtle vibration animation
        this.guitarAnimation = () => {
            if (this.guitar && this.isPlaying) {
                const time = Date.now() * 0.01;
                this.guitar.rotation.z = Math.sin(time) * 0.005;
                this.guitar.position.y = -1 + Math.sin(time * 1.5) * 0.002;
            }
        };
    }

    startAnimation() {
        if (this.renderer && this.scene && this.camera) {
            this.animate();
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.guitar && this.autoRotate) {
            this.guitar.rotation.y += 0.01;
        }

        if (this.guitarAnimation) {
            this.guitarAnimation();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        const container = document.getElementById('guitar-scene');
        if (!container) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    toggleAudio() {
        if (!this.audioElement) return;

        const audioToggle = document.getElementById('audio-toggle');
        const icon = audioToggle.querySelector('i');

        if (this.isPlaying) {
            this.audioElement.pause();
            icon.className = 'fas fa-volume-mute';
            audioToggle.classList.add('muted');
        } else {
            this.audioElement.play();
            icon.className = 'fas fa-volume-up';
            audioToggle.classList.remove('muted');
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');

        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            icon.className = 'fas fa-moon';
        } else {
            body.setAttribute('data-theme', 'dark');
            icon.className = 'fas fa-sun';
        }

        // Save preference
        localStorage.setItem('theme-preference', body.hasAttribute('data-theme') ? 'dark' : 'light');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const isDarkTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);

        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            const icon = document.getElementById('theme-toggle').querySelector('i');
            icon.className = 'fas fa-sun';
        }
    }

    playMusic() {
        if (this.audioElement) {
            this.audioElement.play();
            this.isPlaying = true;

            const audioToggle = document.getElementById('audio-toggle');
            if (audioToggle) {
                const icon = audioToggle.querySelector('i');
                icon.className = 'fas fa-volume-up';
                audioToggle.classList.remove('muted');
            }
        }
        this.updatePlayButton();
        this.startSoundWaves();
    }

    updatePlayButton() {
        const playMusicBtn = document.getElementById('play-music');
        if (!playMusicBtn) return;

        const icon = playMusicBtn.querySelector('i');
        const text = playMusicBtn.querySelector('span');

        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
            text.textContent = 'Pause Music';
        } else {
            icon.className = 'fas fa-play';
            text.textContent = 'Play Music';
        }
    }

    startSoundWaves() {
        this.soundWavesActive = true;
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.animationPlayState = 'running';
        });
    }

    stopSoundWaves() {
        this.soundWavesActive = false;
        const waves = document.querySelectorAll('.wave');
        waves.forEach(wave => {
            wave.style.animationPlayState = 'paused';
        });
    }

    enterPortfolio() {
        // Redirect to main portfolio
        // Add smooth transition effect
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';

        setTimeout(() => {
            window.location.href = '/portfolio';
        }, 500);
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        const button = document.getElementById('guitar-rotate');
        if (this.autoRotate) {
            button.style.background = 'var(--primary-color)';
            button.style.color = 'var(--text-light)';
        } else {
            button.style.background = 'var(--surface-color)';
            button.style.color = 'var(--text-primary)';
        }

        if (this.controls) {
            this.controls.autoRotate = this.autoRotate;
        }
    }

    resetCamera() {
        if (this.camera) {
            this.camera.position.set(0, 0, 5);
            this.camera.lookAt(0, 0, 0);
        }
        if (this.controls) {
            this.controls.reset();
        }

        if (this.guitar) {
            this.guitar.rotation.set(0, Math.PI / 4, 0);
            this.guitar.position.set(0, -1, 0);
        }
    }

    handleKeyboard(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.playMusic();
                break;
            case 'KeyM':
                event.preventDefault();
                this.toggleAudio();
                break;
            case 'KeyR':
                event.preventDefault();
                this.resetCamera();
                break;
            case 'KeyT':
                event.preventDefault();
                this.toggleTheme();
                break;
        }
    }

    updateLoadingProgress(percent) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = `Loading the music experience... ${percent}%`;
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    showError(message) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
            loadingText.style.color = '#ef4444';
        }
    }

    showAudioError() {
        if (document.getElementById('play-music')) {
            const text = document.getElementById('play-music').querySelector('span');
            text.textContent = 'Audio Unavailable';
            document.getElementById('play-music').disabled = true;
            document.getElementById('play-music').style.opacity = '0.5';
        }
    }

    destroy() {
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Stop audio
        if (this.audioElement && this.isPlaying) {
            this.audioElement.pause();
        }

        // Dispose Three.js resources
        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.scene) {
            this.scene.clear();
        }

        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('keydown', (e) => this.handleKeyboard(e));
    }
}

/**
 * Additional utility functions
 */

// Smooth scroll utility
function smoothScrollTo(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'measure') {
                    console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
                }
            });
        });
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for WebGL support
    if (!window.WebGLRenderingContext) {
        document.getElementById('loading-screen').innerHTML = `
            <div class="loading-content">
                <p style="color: #ef4444;">WebGL is not supported in your browser. Please use a modern browser to view this experience.</p>
            </div>
        `;
        return;
    }

    // Initialize the guitar landing page
    window.guitarLandingPage = new LandingPage();

    // Monitor performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        monitorPerformance();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.guitarLandingPage) {
        window.guitarLandingPage.destroy();
    }
});