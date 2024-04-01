import { updateDailyActivity } from './db_conn.js';

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.riddle-key').forEach(function(key) {
        key.addEventListener('click', function() {
            const keyValue = this.textContent.trim();
            const inputField = document.getElementById('riddle-answer');
            if (keyValue === 'DEL') {
                inputField.value = inputField.value.slice(0, -1);
            } else if (keyValue === 'ENTER') {
                submitAnswerRiddle(inputField.value);
            } else {
                inputField.value += keyValue;
            }
        });
    });

    document.getElementById('riddle-answer').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitAnswerRiddle(this.value);
        }
    });
    function submitAnswerRiddle(answer) {
        const correctAnswer = 'FRIDAY';
        const username = sessionStorage.getItem('username');
        const puzzleType = 'riddle';
        let status = '';
        let score = 0;
    
        if (answer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            alert('Correct!');
            status = 'completed';
            score = 100;
        } else {
            alert('Incorrect.');
            status = 'failed';
            score = 0;
        }
        document.getElementById('riddle-answer').value = '';
    
        if (username) {
            updateDailyActivity(username, puzzleType, status, score)
                .then(() => console.log('Riddle activity updated successfully.'))
                .catch((error) => console.error('Failed to update riddle activity:', error));
        } else {
            console.log('No user is currently logged in.');
        }
    }

    document.getElementById('hint1').addEventListener('click', function() {
        alert('Hint 1: Break down the sentence into smaller parts to make it more simple.');
    });

    document.getElementById('hint2').addEventListener('click', function() {
        alert('Hint 2: Think of "the day before tomorrow" as "today".');
    });
});
