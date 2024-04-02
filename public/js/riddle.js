import { updateDailyActivity } from './db_conn.js';
import { fetchAndUpdateRandomPuzzle, logAllPuzzles } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    // Attempt to load riddle details from localStorage, or use default values
    let currentCorrectAnswer = localStorage.getItem('currentRiddleAnswer') || 'FRIDAY'; // Fallback to 'FRIDAY' if not found
    let initialHint1 = localStorage.getItem('riddleHint1') || "Hint 1: Break down the sentence into smaller parts to make it more simple."; // Fallback hint
    let initialHint2 = localStorage.getItem('riddleHint2') || 'Hint 2: Think of "the day before tomorrow" as "today".'; // Fallback hint
    let puzzleString = localStorage.getItem('riddlePuzzleString') || "The day before two days after the day before tomorrow is Saturday. What day is it today?"; // Set your default riddle string
    let startTime = Date.now();

    // Update the riddle display and hints with either the stored values or the initial values
    document.getElementById('riddle-question').textContent = puzzleString; // Set riddle string
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
        const baseScore = 100;
        let status = '';
        let score = 0;
    
        if (answer.trim().toLowerCase() === currentCorrectAnswer.toLowerCase()) {
            const finalScore = calculateRiddleScore(baseScore, startTime);
            alert(`Correct! Your score is ${finalScore}.`);
            status = 'completed';
            score = finalScore;
        } else {
            alert('Incorrect.');
            status = 'failed';
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

    function calculateRiddleScore(baseScore, startTime) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds
        const timePenalty = Math.floor(timeTaken / 45); // 1 point deducted every 45 seconds
        const finalScore = Math.max(baseScore - timePenalty, 50); // Ensure score doesn't go below 50
        return finalScore;
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        //updateRiddleQuestion(); //deprecated
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
            // Update UI with the fetched riddle details
            const riddleQuestion = document.getElementById('riddle-question');
            if (riddleQuestion) {
                riddleQuestion.textContent = puzzle.puzzle_string; // Update the riddle text
            }
    
            // Update the global correct answer variable and store new riddle details in localStorage
            currentCorrectAnswer = puzzle.answer.toLowerCase(); // Ensuring the answer is in uppercase for comparison
            localStorage.setItem('currentRiddleAnswer', puzzle.answer);
            localStorage.setItem('riddleHint1', puzzle.hint1);
            localStorage.setItem('riddleHint2', puzzle.hint2);
            localStorage.setItem('riddlePuzzleString', puzzle.puzzle_string);
    
            // Setup hint buttons with new hints
            document.getElementById('hint1').onclick = () => alert(puzzle.hint1);
            document.getElementById('hint2').onclick = () => alert(puzzle.hint2);
        }).catch(error => {
            console.error("Error fetching/updating riddle puzzle:", error);
        });
    }
    



});
