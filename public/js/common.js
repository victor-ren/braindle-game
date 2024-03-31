
//switched countdown to timer instead of based on specific hour
document.addEventListener('DOMContentLoaded', function () {
    function updateCountdown() {
        const now = new Date();

        // Calculate how many milliseconds have passed in the current 30-second block
        const millisecondsPassedInCurrentBlock = now.getTime() % 15000;
        // Calculate the time difference as the remaining milliseconds until reaching the next 5-second block
        const timeDifference = 15000 - millisecondsPassedInCurrentBlock;

        let hours = Math.floor(timeDifference / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        let seconds = Math.floor((timeDifference / 1000) % 60);
        let milliseconds = timeDifference % 1000; // For more precise countdown, if needed

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        milliseconds = milliseconds.toString().padStart(3, '0'); // For displaying milliseconds, if you choose to

        const countdownTimer = document.getElementById('countdown-timer');
        if (countdownTimer) {
            // Optionally include milliseconds in the displayed countdown
            countdownTimer.textContent = `${hours}:${minutes}:${seconds}`; // Remove milliseconds from display if not needed
        }
        // Check if the countdown has reached 0
        if (timeDifference <= 1000) { // Check if we are within the last second of the countdown
            console.log("Countdown over"); // This will log "Countdown over" to the console
            document.dispatchEvent(new CustomEvent('countdownFinished')); //REFRESHES NEW PUZZLES
        }

    }

    const intervalId = setInterval(updateCountdown, 1000); // Run the updateCountdown function every second to update the display

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


// document.addEventListener('DOMContentLoaded', function () {
//     function updateCountdown() {
//         const now = new Date();
//         const estOffset = now.getTimezoneOffset() * 60000 + (5 * 3600000);
//         const estNow = new Date(now.getTime() + estOffset);

//         const targetTime = new Date(estNow);
//         targetTime.setUTCDate(estNow.getUTCDate() + (estNow.getUTCHours() >= 5 ? 1 : 0));
//         targetTime.setUTCHours(5, 0, 0, 0);

//         const timeDifference = targetTime - estNow;

//         let hours = Math.floor(timeDifference / (1000 * 60 * 60));
//         let minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
//         let seconds = Math.floor((timeDifference / 1000) % 60);

//         hours = hours.toString().padStart(2, '0');
//         minutes = minutes.toString().padStart(2, '0');
//         seconds = seconds.toString().padStart(2, '0');

//         const countdownTimer = document.getElementById('countdown-timer');
//         if (countdownTimer) {
//             countdownTimer.textContent = `${hours}:${minutes}:${seconds}`;
//         }

//         if (timeDifference <= 0) {
//             clearInterval(intervalId);
//             if (countdownTimer) {
//                 countdownTimer.textContent = '00:00:00';
//             }
//         }
//     }