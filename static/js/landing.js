/**
 * 3D Guitar Landing Page JavaScript
 * Handles Three.js guitar model, audio controls, and interactive features
 * Enhanced with comprehensive theme support and error handling
 */

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
        this.guitarLoaded = false;
        this.isInitialized = false;

        // Bind methods to preserve context
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.handleKeyboard = this.handleKeyboard.bind(this);

        this.init();
    }

    async init() {
        try {
            this.showLoadingScreen();
            this.setupAudio();
            this.setupEventListeners();
            await this.setup3DScene();
            await this.loadGuitarModel();
            this.startAnimation();
            this.hideLoadingScreen();
            this.initializeTheme();
            this.isInitialized = true;
            console.log('Landing page initialized successfully');
        } catch (error) {
            console.error('Failed to initialize landing page:', error);
            this.showError('Failed to load the guitar experience. Please refresh the page.');
            this.hideLoadingScreen();
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }

    setupAudio() {
        this.audioElement = document.getElementById('background-audio');
        
        if (this.audioElement) {
            this.audioElement.volume = 0.3;
            this.audioElement.loop = true;
            
            this.audioElement.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updateAudioButton();
            });

            this.audioElement.addEventListener('error', (e) => {
                console.error('Audio loading error:', e);
                this.showAudioError();
            });

            this.audioElement.addEventListener('canplaythrough', () => {
                console.log('Audio ready to play');
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
        window.addEventListener('resize', this.onWindowResize);

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard);

        // Visibility change (pause audio when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying && this.audioElement) {
                this.audioElement.pause();
            } else if (!document.hidden && this.isPlaying && this.audioElement) {
                this.audioElement.play().catch(e => console.log('Audio play failed:', e));
            }
        });
    }

    async setup3DScene() {
        const container = document.getElementById('guitar-scene');
        if (!container) {
            throw new Error('Guitar scene container not found');
        }

        // Check for WebGL support
        if (!this.isWebGLAvailable()) {
            throw new Error('WebGL is not supported in this browser');
        }

        try {
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

            // Fallback: Create placeholder if model fails to load
            this.createGuitarPlaceholder();

            console.log('3D scene setup complete');
        } catch (error) {
            console.error('3D scene setup failed:', error);
            throw error;
        }
    }

    isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (
                canvas.getContext('webgl') || 
                canvas.getContext('experimental-webgl')
            ));
        } catch (e) {
            return false;
        }
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
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
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
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B4513,
            shininess: 30
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Guitar neck
        const neckGeometry = new THREE.BoxGeometry(3, 0.3, 0.1);
        const neckMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xDEB887,
            shininess: 10
        });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.x = 2;
        neck.castShadow = true;
        neck.receiveShadow = true;
        group.add(neck);

        // Guitar strings
        for (let i = 0; i < 6; i++) {
            const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 3);
            const stringMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xC0C0C0,
                shininess: 100
            });
            const string = new THREE.Mesh(stringGeometry, stringMaterial);
            string.rotation.z = Math.PI / 2;
            string.position.x = 2;
            string.position.y = (i - 2.5) * 0.1;
            string.position.z = 0.06;
            group.add(string);
        }

        // Sound hole
        const holeGeometry = new THREE.CircleGeometry(0.3, 32);
        const holeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            side: THREE.DoubleSide
        });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.position.x = -0.3;
        hole.position.z = 0.16;
        group.add(hole);

        this.guitar = group;
        this.scene.add(this.guitar);
        
        console.log('Guitar placeholder created');
    }

    async loadGuitarModel() {
        return new Promise((resolve, reject) => {
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.warn('GLTFLoader not available, using placeholder');
                resolve();
                return;
            }

            const loader = new THREE.GLTFLoader();

            loader.load(
                '/static/assets/acoustic_guitar_1750913922231.glb',
                (gltf) => {
                    try {
                        // Remove placeholder
                        if (this.guitar) {
                            this.scene.remove(this.guitar);
                        }

                        this.guitar = gltf.scene;

                        // Position and scale the guitar
                        this.guitar.position.set(0, -1, 0);
                        this.guitar.rotation.set(0, Math.PI / 4, 0);
                        this.guitar.scale.setScalar(1.5);

                        // Enable shadows and enhance materials
                        this.guitar.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;

                                // Enhance material properties
                                if (child.material) {
                                    if (child.material.map) {
                                        child.material.map.encoding = THREE.sRGBEncoding;
                                    }
                                    child.material.metalness = 0.2;
                                    child.material.roughness = 0.8;
                                }
                            }
                        });

                        this.scene.add(this.guitar);
                        this.setupGuitarAnimations();
                        this.guitarLoaded = true;
                        
                        console.log('Guitar model loaded successfully');
                        resolve();
                    } catch (error) {
                        console.error('Error processing guitar model:', error);
                        reject(error);
                    }
                },
                (progress) => {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    this.updateLoadingProgress(percent);
                },
                (error) => {
                    console.error('Error loading guitar model:', error);
                    console.log('Continuing with placeholder guitar');
                    resolve(); // Don't reject, just use placeholder
                }
            );
        });
    }

    updateLoadingProgress(percent) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = `Loading Experience... ${percent}%`;
        }
    }

    setupGuitarAnimations() {
        if (!this.guitar) return;

        // Store original position for animation
        this.guitar.userData.originalPosition = this.guitar.position.clone();
        this.guitar.userData.originalRotation = this.guitar.rotation.clone();

        // Subtle vibration animation when playing music
        this.guitarAnimation = () => {
            if (this.guitar && this.isPlaying) {
                const time = Date.now() * 0.01;
                this.guitar.rotation.z = this.guitar.userData.originalRotation.z + Math.sin(time) * 0.005;
                this.guitar.position.y = this.guitar.userData.originalPosition.y + Math.sin(time * 1.5) * 0.002;
            }
        };
    }

    startAnimation() {
        if (this.renderer && this.scene && this.camera) {
            this.animate();
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate);

        if (this.controls) {
            this.controls.update();
        }

        if (this.guitar && this.autoRotate && !this.controls?.autoRotate) {
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
        if (!container || !this.camera || !this.renderer) return;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    toggleAudio() {
        if (!this.audioElement) {
            this.showAudioError();
            return;
        }

        const audioToggle = document.getElementById('audio-toggle');
        const icon = audioToggle?.querySelector('i');

        if (this.isPlaying) {
            this.audioElement.pause();
            if (icon) icon.className = 'fas fa-volume-mute';
            audioToggle?.classList.add('muted');
        } else {
            this.audioElement.play().catch(e => {
                console.error('Audio play failed:', e);
                this.showAudioError();
            });
            if (icon) icon.className = 'fas fa-volume-up';
            audioToggle?.classList.remove('muted');
        }
        this.isPlaying = !this.isPlaying;
        this.updateAudioButton();
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');

        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            if (icon) icon.className = 'fas fa-moon';
        } else {
            body.setAttribute('data-theme', 'dark');
            if (icon) icon.className = 'fas fa-sun';
        }

        // Save preference
        localStorage.setItem('theme-preference', body.hasAttribute('data-theme') ? 'dark' : 'light');
        
        // Update Three.js scene lighting for theme
        this.updateSceneLighting();
    }

    updateSceneLighting() {
        if (!this.scene) return;

        const isDark = document.body.hasAttribute('data-theme');
        const lights = this.scene.children.filter(child => child.isLight);
        
        lights.forEach(light => {
            if (light.isAmbientLight) {
                light.intensity = isDark ? 0.4 : 0.6;
            } else if (light.isDirectionalLight) {
                light.intensity = isDark ? 0.6 : 0.8;
            }
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme-preference');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const isDarkTheme = savedTheme === 'dark' || (!savedTheme && prefersDark);

        if (isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            const icon = document.getElementById('theme-toggle')?.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }

        this.updateSceneLighting();
    }

    playMusic() {
        if (this.audioElement) {
            this.audioElement.play().catch(e => {
                console.error('Audio play failed:', e);
                this.showAudioError();
                return;
            });
            this.isPlaying = true;

            const audioToggle = document.getElementById('audio-toggle');
            if (audioToggle) {
                const icon = audioToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-volume-up';
                audioToggle.classList.remove('muted');
            }
        }
        this.updateAudioButton();
        this.startSoundWaves();
    }

    updateAudioButton() {
        const playMusicBtn = document.getElementById('play-music');
        if (!playMusicBtn) return;

        const icon = playMusicBtn.querySelector('i');
        const text = playMusicBtn.querySelector('span') || playMusicBtn.childNodes[1];

        if (this.isPlaying) {
            if (icon) icon.className = 'fas fa-pause';
            if (text) text.textContent = ' Pause Music';
        } else {
            if (icon) icon.className = 'fas fa-play';
            if (text) text.textContent = ' Play Music';
        }
    }

    startSoundWaves() {
        const soundWaves = document.getElementById('sound-waves');
        if (soundWaves) {
            soundWaves.classList.add('active');
            
            if (this.isPlaying) {
                setTimeout(() => {
                    soundWaves.classList.remove('active');
                }, 6000); // Remove after animation cycle
            }
        }
    }

    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        
        if (this.controls) {
            this.controls.autoRotate = this.autoRotate;
        }

        const rotateBtn = document.getElementById('guitar-rotate');
        if (rotateBtn) {
            rotateBtn.style.background = this.autoRotate ? 'var(--primary-color)' : '';
            rotateBtn.style.color = this.autoRotate ? 'var(--text-inverse)' : '';
        }
    }

    resetCamera() {
        if (this.controls) {
            this.controls.reset();
        }
        
        if (this.camera) {
            this.camera.position.set(0, 0, 5);
            this.camera.lookAt(0, 0, 0);
        }

        if (this.guitar && this.guitar.userData.originalPosition) {
            this.guitar.position.copy(this.guitar.userData.originalPosition);
            this.guitar.rotation.copy(this.guitar.userData.originalRotation);
        }
    }

    enterPortfolio() {
        // Add transition effect
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0.5';
        
        setTimeout(() => {
            window.location.href = '/portfolio';
        }, 250);
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.toggleAudio();
                break;
            case 'KeyR':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.resetCamera();
                }
                break;
            case 'KeyT':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleTheme();
                }
                break;
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    <i class="fas fa-refresh"></i> Reload Page
                </button>
            </div>
        `;
        
        document.body.appendChild(errorElement);
    }

    showAudioError() {
        console.warn('Audio not available or failed to load');
        
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.style.opacity = '0.5';
            audioToggle.style.cursor = 'not-allowed';
            audioToggle.title = 'Audio not available';
        }

        const playMusicBtn = document.getElementById('play-music');
        if (playMusicBtn) {
            playMusicBtn.style.opacity = '0.5';
            playMusicBtn.style.cursor = 'not-allowed';
            playMusicBtn.title = 'Audio not available';
        }
    }

    destroy() {
        // Clean up resources
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.scene) {
            this.scene.clear();
        }

        window.removeEventListener('resize', this.onWindowResize);
        document.removeEventListener('keydown', this.handleKeyboard);
        
        console.log('Landing page destroyed');
    }
}

// Initialize landing page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the landing page
    if (document.getElementById('guitar-scene')) {
        try {
            window.landingPage = new LandingPage();
        } catch (error) {
            console.error('Failed to initialize landing page:', error);
        }
    }
});

// Clean up when leaving the page
window.addEventListener('beforeunload', function() {
    if (window.landingPage && window.landingPage.destroy) {
        window.landingPage.destroy();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (window.landingPage && window.landingPage.audioElement) {
        if (document.hidden) {
            // Pause audio when tab is hidden
            if (window.landingPage.isPlaying) {
                window.landingPage.audioElement.pause();
            }
        } else {
            // Resume audio when tab is visible again
            if (window.landingPage.isPlaying) {
                window.landingPage.audioElement.play().catch(e => {
                    console.log('Audio resume failed:', e);
                });
            }
        }
    }
});
