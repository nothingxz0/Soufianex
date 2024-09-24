const profileImage = document.getElementById('profile-image');

let rotation = 0;

function rotateImage() {
    rotation += 1;
    profileImage.style.transform = `rotate(${rotation}deg)`;
    if (rotation === 360) {
        rotation = 0;
    }
}

setInterval(rotateImage, 16); // 16ms = 60fps