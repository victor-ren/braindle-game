import { updateDailyActivity } from './db_conn.js';
import { fetchAndUpdateRandomPuzzle, logAllPuzzles } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    let currentCorrectAnswer = '318'; // Correct answer for the initial puzzle
    let initialHint1 = "Hint 1: Observe the pattern carefully. Each number is generated in a specific way from its predecessor."; // hint1 for the initial puzzle
    let initialHint2 = "Hint 2: Try to determine the rule governing the sequence. It might involve arithmetic or geometric operations."; // hint2 for the initial puzzle

    // Setup hint buttons with initial hints, before any new puzzles are loaded
    document.getElementById('hint1').onclick = () => alert(initialHint1);
    document.getElementById('hint2').onclick = () => alert(initialHint2);

    fetch('/puzzles')
        .then(response => response.json())
        .then(puzzles => {
            document.getElementById('pattern-question').textContent = puzzles.pattern.question;
        });

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
        let status = '';
        let score = 0;
    
        if (answer.trim() === currentCorrectAnswer) {
            alert('Correct!');
            status = 'completed';
            score = 100;
        } else {
            alert('Incorrect.');
            status = 'failed';
        }

        if (username) {
            updateDailyActivity(username, puzzleType, status, score);
        }
    
        document.getElementById('pattern-answer').value = '';
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        updatePatternQuestion();
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

            // Update the global correct answer variable
            currentCorrectAnswer = puzzle.answer;

            // Optionally, set up hint buttons or text based on fetched puzzle
            document.getElementById('hint1').onclick = () => alert(puzzle.hint1);
            document.getElementById('hint2').onclick = () => alert(puzzle.hint2);
        }).catch(error => {
            console.error("Error fetching/updating pattern puzzle:", error);
        });
    }



});
