document.addEventListener('DOMContentLoaded', function () {
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
        const correctAnswer = '318'; 

        if (answer.trim() === correctAnswer) {
            alert('Correct!');
        } else {
            alert('Incorrect. Please try again.');
        }

        document.getElementById('pattern-answer').value = '';
    }

    document.getElementById('hint1').addEventListener('click', function() {
        alert('Hint 1: Observe the pattern carefully. Each number is generated in a specific way from its predecessor.');
    });

    document.getElementById('hint2').addEventListener('click', function() {
        alert('Hint 2: Try to determine the rule governing the sequence. It might involve arithmetic or geometric operations.');
    });
});
