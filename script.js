document.addEventListener('DOMContentLoaded', () => {
    // DOM references
    const profileImage = document.getElementById('profile-image');
    const imageControl = document.getElementById('image-control');
    const overlayIcon = document.getElementById('image-overlay-icon');
    const audio = document.getElementById('background-music');
    const timeDisplay = document.getElementById('current-time');
    const searchForm = document.getElementById('search-form');
    const searchQuestion = document.getElementById('search-question');
    const backgroundEl = document.getElementById('background');

    // State
    let rotation = 0;
    const rotationStep = -0.2;
    let isPlaying = false;
    let animationFrameId = null;
    let vantaEffect = null;

    // Helpers
    function rotateImage() {
        rotation = (rotation + rotationStep + 360) % 360;
        if (profileImage) {
            profileImage.style.transform = `rotate(${rotation}deg)`;
        }
        animationFrameId = requestAnimationFrame(rotateImage);
    }

    function startRotation() {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(rotateImage);
        }
    }

    function stopRotation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function updateTimestamp() {
        const now = new Date();
        const pad = num => String(num).padStart(2, '0');
        const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }

    function updatePlaybackUI(playing) {
        isPlaying = playing;
        if (overlayIcon) {
            overlayIcon.className = playing ? 'fas fa-pause' : 'fas fa-play';
        }
        if (playing) {
            startRotation();
        } else {
            stopRotation();
        }
    }

    function toggleAudio() {
        if (!audio) {
            return;
        }

        if (isPlaying) {
            audio.pause();
            updatePlaybackUI(false);
        } else {
            audio.play().then(() => {
                updatePlaybackUI(true);
            }).catch(err => console.error('Audio playback failed:', err));
        }
    }

    // Audio controls
    if (imageControl && audio) {
        imageControl.addEventListener('click', toggleAudio);
        imageControl.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAudio();
            }
        });
    }

    if (audio) {
        audio.addEventListener('play', () => updatePlaybackUI(true));
        audio.addEventListener('pause', () => updatePlaybackUI(false));
        audio.addEventListener('ended', () => {
            if (!audio.loop) {
                updatePlaybackUI(false);
            }
        });
    }

    if (searchForm && searchQuestion) {
        searchForm.addEventListener('submit', e => {
            e.preventDefault();
            const query = searchQuestion.value.trim();
            if (query) {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(searchUrl, '_blank');
                searchQuestion.value = '';
            }
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopRotation();
        } else if (isPlaying) {
            startRotation();
        }
    });

    // Vanta background
    function initVanta() {
        if (!(window.VANTA && window.VANTA.CLOUDS) || !backgroundEl) {
            console.warn('Vanta.js could not be initialized.');
            return;
        }

        if (vantaEffect) {
            vantaEffect.destroy();
        }

        vantaEffect = window.VANTA.CLOUDS({
            el: backgroundEl,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: window.innerHeight,
            minWidth: window.innerWidth,
            skyColor: 0x050505,
            cloudColor: 0x4a4a55,
            cloudShadowColor: 0x1b1b1f,
            sunColor: 0x0,
            sunGlareColor: 0x0,
            sunlightColor: 0x0,
            textureScale: 1.5,
            speed: 0.35
        });
    }

    initVanta();

    window.addEventListener('resize', () => {
        if (vantaEffect) {
            vantaEffect.resize();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (vantaEffect) {
            vantaEffect.destroy();
            vantaEffect = null;
        }
    });

    // Initial setup
    setInterval(updateTimestamp, 1000);
    updateTimestamp();
    if (audio) {
        audio.volume = 0.7;
    }
});
