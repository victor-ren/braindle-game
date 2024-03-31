import { fetchAndUpdateRandomPuzzle } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    let currentCorrectAnswer = ''; // To hold the current puzzle's correct answer

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
        if (answer === currentCorrectAnswer) {
            alert('Correct!');
        } else {
            alert('Incorrect.');
        }
        document.getElementById('math-answer').value = '';
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        updateMathQuestion();
    });

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
