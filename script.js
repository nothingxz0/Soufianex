document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const profileImage = document.getElementById('profile-image');
    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause');
    const timeDisplay = document.getElementById('current-time');
    const fogContainer = document.querySelector('.fog-container');
    const searchForm = document.getElementById('search-form');
    const searchQuestion = document.getElementById('search-question');
    const audioProgress = document.getElementById('audio-progress');
    const projectsStat = document.getElementById('projects-stat'); // Clickable stat
    const projectDetails = document.getElementById('project-details'); // Hidden list
    const fogLayers = [
        document.getElementById('foglayer_01'),
        document.getElementById('foglayer_02'),
        document.getElementById('foglayer_03')
    ];
    
    // --- State and Config ---
    let isPlaying = false;
    
    // --- Core Functions ---
    function updateTimestamp() {
        const now = new Date();
        const pad = num => String(num).padStart(2, '0');
        const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        if(timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }
    
    function updateProgress() {
        if (audio && audioProgress && !isNaN(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            audioProgress.style.width = `${progress}%`;
        }
    }
    
    function handleMouseMove(e) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;

        if (fogLayers[0] && fogLayers[1] && fogLayers[2]) {
            fogLayers[0].style.transform = `translate(${x * 15}px, ${y * 10}px)`;
            fogLayers[1].style.transform = `translate(${x * 8}px, ${y * 5}px)`;
            fogLayers[2].style.transform = `translate(${x * 4}px, ${y * 2}px)`;
        }
    }

    // --- Event Listeners ---
    document.addEventListener('mousemove', handleMouseMove);

    // NEW: Click listener for projects
    if(projectsStat && projectDetails) {
        projectsStat.addEventListener('click', () => {
            projectDetails.classList.toggle('visible');
        });
    }

    if(playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                playPauseBtn.querySelector('i').className = 'fas fa-play';
                fogContainer.classList.remove('visible');
            } else {
                audio.play().then(() => {
                    playPauseBtn.querySelector('i').className = 'fas fa-pause';
                    fogContainer.classList.add('visible');
                }).catch(error => console.error("Audio playback failed:", error));
            }
            isPlaying = !isPlaying;
        });
    }

    if(audio) {
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', () => {
            if (!audio.loop) {
                isPlaying = false;
                playPauseBtn.querySelector('i').className = 'fas fa-play';
                fogContainer.classList.remove('visible');
            }
        });
    }

    if(searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchQuestion.value.trim();
            if(query) {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(searchUrl, '_blank');
                searchQuestion.value = '';
            }
        });
    }

    // --- Initializations ---
    setInterval(updateTimestamp, 1000);
    updateTimestamp();
});