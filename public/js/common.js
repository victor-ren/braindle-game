
document.addEventListener('DOMContentLoaded', function () {
    function updateCountdown() {
        const now = new Date();
        const estOffset = now.getTimezoneOffset() * 60000 + (5 * 3600000);
        const estNow = new Date(now.getTime() + estOffset);

        const targetTime = new Date(estNow);
        targetTime.setUTCDate(estNow.getUTCDate() + (estNow.getUTCHours() >= 5 ? 1 : 0));
        targetTime.setUTCHours(5, 0, 0, 0);

        const timeDifference = targetTime - estNow;

        let hours = Math.floor(timeDifference / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        let seconds = Math.floor((timeDifference / 1000) % 60);

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        const countdownTimer = document.getElementById('countdown-timer');
        if (countdownTimer) {
            countdownTimer.textContent = `${hours}:${minutes}:${seconds}`;
        }

        if (timeDifference <= 0) {
            clearInterval(intervalId);
            if (countdownTimer) {
                countdownTimer.textContent = '00:00:00';
            }
        }
    }

    const intervalId = setInterval(updateCountdown, 1000);

    const music = new Audio('music/music.mp3');
    music.loop = true;
    const musicBtn = document.getElementById('music-btn');
    let isMusicPlaying = false;

    if (musicBtn) {
        musicBtn.addEventListener('click', function() {
            if (isMusicPlaying) {
                music.pause();
            } else {
                music.play();
            }
            isMusicPlaying = !isMusicPlaying;
            musicBtn.innerHTML = isMusicPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-music"></i>';
        });
    }
});
