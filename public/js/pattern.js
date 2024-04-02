import { updateDailyActivity } from './db_conn.js';
import { fetchAndUpdateRandomPuzzle, logAllPuzzles } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    // Attempt to load puzzle details from localStorage, or use default values
    let currentCorrectAnswer = localStorage.getItem('currentPatternAnswer') || '318'; // Fallback to '318' if not found
    let initialHint1 = localStorage.getItem('patternHint1') || "Hint 1: Observe the pattern carefully. Each number is generated in a specific way from its predecessor."; // Fallback hint
    let initialHint2 = localStorage.getItem('patternHint2') || "Hint 2: Try to determine the rule governing the sequence. It might involve arithmetic or geometric operations."; // Fallback hint
    let puzzleString = localStorage.getItem('patternPuzzleString') || "What is the next number in the sequence? 3, 8, 18, 38, 78, 158..."; // Set your default puzzle string
    let startTime = Date.now();

    // Update the puzzle display and hints with either the stored values or the initial values
    document.getElementById('pattern-question').textContent = puzzleString; // Set puzzle string
    document.getElementById('hint1').onclick = () => alert(initialHint1);
    document.getElementById('hint2').onclick = () => alert(initialHint2);

    // fetch('/puzzles')
    //     .then(response => response.json())
    //     .then(puzzles => {
    //         document.getElementById('pattern-question').textContent = puzzles.pattern.question;
    //     });

    document.querySelectorAll('#keyboard .key').forEach(function(key) {
        key.addEventListener('click', function() {
            const keyValue = this.textContent.trim();
            const inputField = document.getElementById('pattern-answer');
            if (keyValue === 'DEL') {
                inputField.value = inputField.value.slice(0, -1);
            } else if (keyValue === 'ENTER') {
                submitAnswerPattern(inputField.value);
            } else {
                inputField.value += keyValue;
            }
        });
    });

    document.getElementById('pattern-answer').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitAnswerPattern(this.value);
        }
    });

    function submitAnswerPattern(answer) {
        const username = sessionStorage.getItem('username');
        const puzzleType = 'pattern';
        const baseScore = 100;
        let status = '';
        let score = 0;
    
        if (answer.trim() === currentCorrectAnswer) {
            const finalScore = calculatePatternScore(baseScore, startTime);
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
    
        document.getElementById('pattern-answer').value = '';
    }

    function calculatePatternScore(baseScore, startTime) {
        const endTime = Date.now();
        const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds
        const timePenalty = Math.floor(timeTaken / 15); // 1 point deducted every 15 seconds
        const finalScore = Math.max(baseScore - timePenalty, 50); // Ensure score doesn't go below 50
        return finalScore;
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        //updatePatternQuestion(); //deprecated
        console.log("updating pattern questions")
        logAllPuzzles("pattern_puzzles")
    });

    // Check if update is needed for this puzzle type, if user is not on this page when countdown finished
    if (localStorage.getItem('updatePatternPuzzle') === 'true') {
        updatePatternQuestion(); // Fetch and display new puzzle
        localStorage.setItem('updatePatternPuzzle', 'false'); // Reset flag
    }

    function updatePatternQuestion() {
        fetchAndUpdateRandomPuzzle('pattern_puzzles').then(puzzle => {
            // Update UI with the fetched puzzle details
            const patternQuestion = document.getElementById('pattern-question');
            if (patternQuestion) {
                patternQuestion.textContent = puzzle.puzzle_string; // Update the question text
            }
    
            // Update the global correct answer variable and store new puzzle details in localStorage
            currentCorrectAnswer = puzzle.answer;
            localStorage.setItem('currentPatternAnswer', puzzle.answer);
            localStorage.setItem('patternHint1', puzzle.hint1);
            localStorage.setItem('patternHint2', puzzle.hint2);
            localStorage.setItem('patternPuzzleString', puzzle.puzzle_string);
    
            // Setup hint buttons with new hints
            document.getElementById('hint1').onclick = () => alert(puzzle.hint1);
            document.getElementById('hint2').onclick = () => alert(puzzle.hint2);
        }).catch(error => {
            console.error("Error fetching/updating pattern puzzle:", error);
        });
    }
    



});
