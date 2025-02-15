// Elements
const profileImage = document.getElementById('profile-image');
const audio = document.getElementById('background-music');
const playPauseBtn = document.getElementById('play-pause');
const volumeSlider = document.getElementById('volume-slider');

// Animation variables
let rotation = 0;

// Music variables
let isPlaying = false;

// Smooth rotation function
function rotateImage(timestamp) {
    rotation += 0.1; // Slower rotation speed
    if (rotation >= 360) {
        rotation = 0;
    }
    profileImage.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(rotateImage);
}

// Start the animation
requestAnimationFrame(rotateImage);

// Music controls
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.querySelector('i').className = 'fas fa-play';
    } else {
        audio.play();
        playPauseBtn.querySelector('i').className = 'fas fa-pause';
    }
    isPlaying = !isPlaying;
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Set initial volume
audio.volume = volumeSlider.value / 100;