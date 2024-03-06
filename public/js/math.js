document.addEventListener('DOMContentLoaded', function () {
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
        const correctAnswer = '100';
        if (answer === correctAnswer) {
            alert('Correct!');
        } else {
            alert('Incorrect.');
        }
        document.getElementById('math-answer').value = '';
    }

    document.getElementById('hint1').addEventListener('click', function() {
        alert('Hint 1: Break down the sentence into smaller parts to make it more simple.');
    });

    document.getElementById('hint2').addEventListener('click', function() {
        alert('Hint 2: Think of "the day before tomorrow" as "today".');
    });
});
