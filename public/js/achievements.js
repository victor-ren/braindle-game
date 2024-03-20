// achievements.js
// Define boolean flags for each achievement button
let is7days = false;
let is30days = false;
let is75days = false;
let is180days = false;
let is365days = false;
let is100riddles = false;
let is100patterns = false;
let is100math = false;

// Example of setting data-unlocked attribute based on boolean flag
const unlockedFlags = [is7days, is30days, is75days, is180days, is365days, is100riddles, is100patterns, is100math]; 
const buttons = document.querySelectorAll('.achievement-button');
buttons.forEach((button, index) => {
    button.setAttribute('data-unlocked', unlockedFlags[index]);
});
