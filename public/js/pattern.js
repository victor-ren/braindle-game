import { fetchAndUpdateRandomPuzzle, logAllPuzzles } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    let currentCorrectAnswer = ''; // To hold the current puzzle's correct answer

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

        if (answer.trim() === currentCorrectAnswer) {
            alert('Correct!');
        } else {
            alert('Incorrect. Please try again.');
        }

        document.getElementById('pattern-answer').value = '';
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        updatePatternQuestion();
        console.log("updating pattern questions")
        logAllPuzzles("pattern_puzzles")
    });

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
