import { fetchAndUpdateRandomPuzzle, logAllPuzzles } from "./puzzles_db.js";

document.addEventListener('DOMContentLoaded', function () {
    let currentCorrectAnswer = ''; // To hold the current puzzle's correct answer

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
        if (answer.trim().toLowerCase() === currentCorrectAnswer.toLowerCase()) {
            alert('Correct!');
        } else {
            alert('Incorrect.');
        }
        document.getElementById('riddle-answer').value = '';
    }

    // Listen for the countdownFinished event
    document.addEventListener('countdownFinished', function() {
        updateRiddleQuestion();
        console.log("updating riddle questions")
        logAllPuzzles("riddle_puzzles")
    });

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
