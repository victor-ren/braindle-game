import { updateDailyActivity } from './db_conn.js';
import { fetchAndUpdateRandomPuzzle } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    // Attempt to load puzzle details from localStorage, or use default values
    let currentCorrectAnswer = localStorage.getItem('currentMathAnswer') || '100'; // Fallback to '100' if not found
    let initialHint1 = localStorage.getItem('mathHint1') || "Hint 1: Start with 1000 and break down the problem one step at a time. 9/10 of 1000 is 900, 8/9 of 900 is 800, etc."; // Fallback hint
    let initialHint2 = localStorage.getItem('mathHint2') || 'Hint 2: Alternatively, work with the fractions and cancel all of the like numerators and denominators until you have a simple calculation remaining.'; // Fallback hint
    let puzzleString = localStorage.getItem('mathPuzzleString') || "What is the value of 1/2 of 2/3 of 3/4 of 4/5 of 5/6 of 6/7 of 7/8 of 8/9 of 9/10 of 1,000?"; // Fallback puzzle string
    let startTime = Date.now();

    // Update the puzzle display and hints with either the stored values or the initial values
    document.getElementById('math-question').textContent = puzzleString; // Set puzzle string
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

    // Listen for the countdownFinished event, deprecated
    document.addEventListener('countdownFinished', function() {
        //updateMathQuestion();
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
    
            // Update the global correct answer variable and store new puzzle details in localStorage
            currentCorrectAnswer = puzzle.answer;
            localStorage.setItem('currentMathAnswer', puzzle.answer);
            localStorage.setItem('mathHint1', puzzle.hint1);
            localStorage.setItem('mathHint2', puzzle.hint2);
            localStorage.setItem('mathPuzzleString', puzzle.puzzle_string);
    
            // Setup hint buttons with new hints
            document.getElementById('hint1').onclick = () => alert(puzzle.hint1);
            document.getElementById('hint2').onclick = () => alert(puzzle.hint2);
        }).catch(error => {
            console.error("Error fetching/updating math puzzle:", error);
        });
    }
    
});
