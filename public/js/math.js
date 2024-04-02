import { updateDailyActivity } from './db_conn.js';
import { fetchAndUpdateRandomPuzzle } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    let currentCorrectAnswer = '100'; // Correct answer for the initial puzzle
    let initialHint1 = "Hint 1: Start with 1000 and break down the problem one step at a time. 9/10 of 1000 is 900, 8/9 of 900 is 800, etc."; // hint1 for the initial puzzle
    let initialHint2 = 'Hint 2: Alternatively, work with the fractions and cancel all of the like numerators and denominators until you have a simple calculation remaining.'; // hint2 for the initial puzzle
    let startTime = Date.now();

    // Setup hint buttons with initial hints, before any new puzzles are loaded
    document.getElementById('hint1').onclick = () => alert(initialHint1);
    document.getElementById('hint2').onclick = () => alert(initialHint2);

    document.querySelectorAll('.key').forEach(function(key) {
        key.addEventListener('click', function() {
            const keyValue = this.textContent.trim();
            const inputField = document.getElementById('math-answer');
            if (keyValue === 'DEL') {
                inputField.value = inputField.value.slice(0, -1);
            } else if (keyValue === 'ENTER') {
                submitAnswerMath(inputField.value);
            } else {
                inputField.value += keyValue;
            }
        });
    });

    document.getElementById('math-answer').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitAnswerMath(this.value);
        }
    });

    function submitAnswerMath(answer) {
        const username = sessionStorage.getItem('username');
        const puzzleType = 'math';
        const baseScore = 100;
        let status = '';
        let score = 0;

        if (answer === currentCorrectAnswer) {
            const finalScore = calculateMathScore(baseScore, startTime);
            alert(`Correct! Your score is ${finalScore}.`);
            status = 'completed';
            score = finalScore;
        } else {
            alert('Incorrect.');
            status = 'failed';
        }

        if (username) {
            updateDailyActivity(username, puzzleType, status, score);
        }

        document.getElementById('math-answer').value = '';
    }

    function calculateMathScore(baseScore, startTime) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds
        const timePenalty = Math.floor(timeTaken / 30); // 1 point deducted every 30 seconds
        const finalScore = Math.max(baseScore - timePenalty, 50); // Ensure score doesn't go below 50
        return finalScore;
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        updateMathQuestion();
    });

    // Check if update is needed for this puzzle type, if user is not on this page when countdown finished
    if (localStorage.getItem('updateMathPuzzle') === 'true') {
        updateMathQuestion(); // Fetch and display new puzzle
        localStorage.setItem('updateMathPuzzle', 'false'); // Reset flag
    }

    function updateMathQuestion() {
        fetchAndUpdateRandomPuzzle('math_puzzles').then(puzzle => {
            // Update UI with the fetched puzzle details
            const mathQuestion = document.getElementById('math-question');
            if (mathQuestion) {
                mathQuestion.textContent = puzzle.puzzle_string; // Update the question text
            }

            // Update the global correct answer variable
            currentCorrectAnswer = puzzle.answer;

            // Optionally, set up hint buttons or text based on fetched puzzle
            document.getElementById('hint1').onclick = () => alert(puzzle.hint1);
            document.getElementById('hint2').onclick = () => alert(puzzle.hint2);
        }).catch(error => {
            console.error("Error fetching/updating math puzzle:", error);
        });
    }
});
