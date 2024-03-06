const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());


app.use(express.static('public'));


const dailyPuzzles = {
    math: { question: "What is the value of 1/2 of 2/3 of 3/4 of 4/5 of 5/6 of 6/7 of 7/8 of 8/9 of 9/10 of 1,000?", answer: "100" },
    riddle: { question: "The day before two days after the day before tomorrow is Saturday. What day is it today?", answer: "Friday" },
    pattern: { question: "What is the next number in the sequence? 3, 8, 18, 38, 78, 158...", answer: "318" }
};


app.get('/puzzles', (req, res) => {
    res.json(dailyPuzzles);
});


app.post('/submit', (req, res) => {
    const userAnswers = req.body;
    let score = 0;


    score += userAnswers.math === dailyPuzzles.math.answer ? 1 : 0;
    score += userAnswers.riddle.toLowerCase() === dailyPuzzles.riddle.answer ? 1 : 0;
    score += userAnswers.pattern === dailyPuzzles.pattern.answer ? 1 : 0;

    res.json({ score: score });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
