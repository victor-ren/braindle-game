import { getUserData, request } from './db_conn.js';

// Define boolean flags for each achievement button
let is7days = false;
let is30days = false;
let is75days = false;
let is180days = false;
let is365days = false;
let is100riddles = false;
let is100patterns = false;
let is100math = false;

// Function to update achievement flags based on user data
async function updateAchievementFlags() {
    const loggedIn = sessionStorage.getItem("logedin");
    if (loggedIn) {
        const username = sessionStorage.getItem("username"); // Retrieve the username from session storage
        if (username) {
            try {
                // Call getUserData function passing the username and request
                const userData = await getUserData(username, request);
                if (userData) {
                    const maxStreak = userData.max_streak;
                    const riddlesSolved = userData.riddles_solved;
                    const patternsSolved = userData.patterns_solved;
                    const mathSolved = userData.maths_solved;

                    // Update achievement flags based on user data
                    is7days = maxStreak >= 7;
                    is30days = maxStreak >= 30;
                    is75days = maxStreak >= 75;
                    is180days = maxStreak >= 180;
                    is365days = maxStreak >= 365;
                    is100riddles = riddlesSolved >= 100;
                    is100patterns = patternsSolved >= 100;
                    is100math = mathSolved >= 100;

                    // Update data-unlocked attribute based on boolean flags
                    const unlockedFlags = [is7days, is30days, is75days, is180days, is365days, is100riddles, is100patterns, is100math];
                    const buttons = document.querySelectorAll('.achievement-button');
                    buttons.forEach((button, index) => {
                        button.setAttribute('data-unlocked', unlockedFlags[index]);
                    });
                } else {
                    console.log("User data not found");
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        } else {
            console.error("Username not found in session storage");
        }
    } else {
        console.error("User not logged in");
    }
}

// Call the function to update achievement flags when the page loads or when appropriate
updateAchievementFlags();
