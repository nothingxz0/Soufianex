// Cache DOM elements for better performance
const profileImage = document.getElementById('profile-image');
const audio = document.getElementById('background-music');
const playPauseBtn = document.getElementById('play-pause');
const volumeSlider = document.getElementById('volume-slider');
const timeDisplay = document.getElementById('current-time');
const fogContainer = document.querySelector('.fog-container');

// Animation and state variables
let rotation = 0;
let isPlaying = false;
let animationFrameId = null;

// Smooth rotation function using requestAnimationFrame for better performance
function rotateImage() {
    rotation = (rotation + 0.1) % 360; // Use modulo to prevent number from growing too large
    profileImage.style.transform = `rotate(${rotation}deg)`;
    animationFrameId = requestAnimationFrame(rotateImage);
}

// Start the animation
animationFrameId = requestAnimationFrame(rotateImage);

// Music controls with error handling
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.querySelector('i').className = 'fas fa-play';
        fogContainer.classList.remove('visible');
    } else {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playPauseBtn.querySelector('i').className = 'fas fa-pause';
                fogContainer.classList.add('visible');
            }).catch(error => {
                console.error('Playback failed:', error);
            });
        }
    }
    isPlaying = !isPlaying;
});

// Handle music ending
audio.addEventListener('ended', () => {
    if (!audio.loop) {
        isPlaying = false;
        playPauseBtn.querySelector('i').className = 'fas fa-play';
        fogContainer.classList.remove('visible');
    }
});

// Optimized volume control with debouncing
let volumeTimeout;
volumeSlider.addEventListener('input', (e) => {
    clearTimeout(volumeTimeout);
    volumeTimeout = setTimeout(() => {
        audio.volume = e.target.value / 100;
    }, 10);
});

// Set initial volume
audio.volume = volumeSlider.value / 100;

// Timestamp update with performance optimization
function formatDate(date) {
    const pad = (num) => String(num).padStart(2, '0');
    
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function updateTimestamp() {
    timeDisplay.textContent = formatDate(new Date());
}

// Update time every second with RAF for better performance
let lastTimestampUpdate = 0;
function updateLoop(timestamp) {
    if (timestamp - lastTimestampUpdate >= 1000) {
        updateTimestamp();
        lastTimestampUpdate = timestamp;
    }
    requestAnimationFrame(updateLoop);
}

// Start the timestamp update loop
requestAnimationFrame(updateLoop);

// Initial timestamp update
updateTimestamp();

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    clearTimeout(volumeTimeout);
});

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    // Space bar for play/pause
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        playPauseBtn.click();
    }
    // Up/Down arrows for volume
    else if (e.code === 'ArrowUp') {
        e.preventDefault();
        volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
        audio.volume = volumeSlider.value / 100;
    }
    else if (e.code === 'ArrowDown') {
        e.preventDefault();
        volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
        audio.volume = volumeSlider.value / 100;
    }
});

// Handle visibility change to pause animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    } else if (!document.hidden && !animationFrameId) {
        animationFrameId = requestAnimationFrame(rotateImage);
    }
});

// Preload fog images for smoother appearance
window.addEventListener('load', () => {
    const fogImages = [
        'https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog1.png',
        'https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/fog2.png'
    ];
    
    fogImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});