import { updateDailyActivity } from './db_conn.js';
import { fetchAndUpdateRandomPuzzle, logAllPuzzles } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    let currentCorrectAnswer = 'FRIDAY'; // Correct answer for the initial puzzle
    let initialHint1 = "Hint 1: Break down the sentence into smaller parts to make it more simple."; // hint1 for the initial puzzle
    let initialHint2 = 'Hint 2: Think of "the day before tomorrow" as "today".'; // hint2 for the initial puzzle

    // Setup hint buttons with initial hints, before any new puzzles are loaded
    document.getElementById('hint1').onclick = () => alert(initialHint1);
    document.getElementById('hint2').onclick = () => alert(initialHint2);

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
        const username = sessionStorage.getItem('username');
        const puzzleType = 'riddle';
        let status = '';
        let score = 0;
    
        if (answer.trim().toLowerCase() === currentCorrectAnswer.toLowerCase()) {
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

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        updateRiddleQuestion();
        console.log("updating riddle questions")
        logAllPuzzles("riddle_puzzles")
    });

    // Check if update is needed for this puzzle type, if user is not on this page when countdown finished
    if (localStorage.getItem('updateRiddlePuzzle') === 'true') {
        updateRiddleQuestion(); // Fetch and display new puzzle
        localStorage.setItem('updateRiddlePuzzle', 'false'); // Reset flag
    }


    function updateRiddleQuestion() {
        fetchAndUpdateRandomPuzzle('riddle_puzzles').then(puzzle => {
            // Update UI with the fetched puzzle details
            const riddleQuestion = document.getElementById('riddle-question');
            if (riddleQuestion) {
                riddleQuestion.textContent = puzzle.puzzle_string; // Update the question text
            }

            // Update the global correct answer variable
            currentCorrectAnswer = puzzle.answer;

            // Optionally, set up hint buttons or text based on fetched puzzle
            document.getElementById('hint1').onclick = () => alert(puzzle.hint1);
            document.getElementById('hint2').onclick = () => alert(puzzle.hint2);
        }).catch(error => {
            console.error("Error fetching/updating riddle puzzle:", error);
        });        
    }



});
