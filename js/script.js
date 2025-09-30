const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('bgVideo');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawVideo() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(drawVideo);
}

video.oncanplay = function() {
    drawVideo();
};
