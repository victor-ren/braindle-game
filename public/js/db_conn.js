
// connecting to first available data base
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

// error unable to find indexdb
if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}

// database start
export const request = indexedDB.open("Braindle_Database", 1);

// error unable to connect to database
request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

request.onupgradeneeded = function () {
    const db = request.result;
    // const store = db.createObjectStore("data_base", { keyPath: "id" });
    const store = db.createObjectStore("data_base", {keyPath:"username"});
    store.createIndex("logins", "username", ["password"], { unique: true });
    // store.createIndex("scores", "username", ["score1", "score2"], {unique: false}); 
  };

request.onsuccess = function () {
    console.log("Database opened successfully");
};


export function checkLoginStatus(){
    return sessionStorage.getItem("logedin");
}

export function login(input_username, input_password) {
    const db = request.result;
        const transaction = db.transaction("data_base", "readwrite");
        const store = transaction.objectStore("data_base");
        
        // search for username
        const index = store.index("logins");
        const request1 = index.get(input_username);
        request1.onsuccess = function() {
        const matching = request1.result;
        
        // finding username
        if (matching !== undefined) {
            // username found, check password
            if (matching.password == input_password) {
                // Store the logged-in user's username in session storage
                sessionStorage.setItem("logedin", true);
                sessionStorage.setItem("username", input_username); // Set username here
                window.location.href = "../index.html";
            } else {
                alert("Wrong password");
            }
        } else {
            // No match was found.
            console.log("Did not find it");
            alert("There is no account with that username.");
        }
    };

}

export function signup(input_username, input_password) {
    const db = request.result;
    const transaction = db.transaction("data_base", "readwrite");
    const store = transaction.objectStore("data_base");
    
    
    const index = store.index("logins");
    const request1 = index.get(input_username);
    request1.onsuccess = function() {
        const matching = request1.result;
        if (matching !== undefined) {
            // A match was found.
            console.log("HI THERE");
            alert("This username is already taken.");
        } else {
            // No match was found.
            store.put({
                username: input_username, 
                password: input_password,
                // add progress stats for new user
                current_streak: 0,
                max_streak: 0,
                daily_score: 0,
                total_score: 0,
                maths_solved: 0,
                riddles_solved: 0,
                patterns_solved: 0,
                dailyActivities: []
            });
            sessionStorage.setItem("logedin", true);
            sessionStorage.setItem("username", input_username);
            window.location.href = "../index.html";
        }
    };
}

// function to update stats associated with each user
export function updateStats(username, updates) {
    const db = request.result;
    const transaction = db.transaction("data_base", "readwrite");
    const store = transaction.objectStore("data_base");

    const userRequest = store.get(username);
    userRequest.onsuccess = function() {
        const userData = userRequest.result;
        if (userData) {
            // update stats for user
            Object.keys(updates).forEach(key => {
                userData[key] = updates[key];
            });

            // save updated user data to database
            store.put(userData);
        } else {
            console.log("User not found");
        }
    };
}
// function to read/access user data
export function getUserData(username) {
    return new Promise((resolve, reject) => {
        request.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction("data_base", "readonly");
            const store = transaction.objectStore("data_base");
            const getRequest = store.get(username);

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        };

        request.onerror = event => {
            reject(event.error);
        };
    });
}

function getFormattedDate(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}`;
}

export function updateDailyActivity(username, puzzleType, status, score) {
    const db = request.result;
    const transaction = db.transaction("data_base", "readwrite");
    const store = transaction.objectStore("data_base");

    const userRequest = store.get(username);
    userRequest.onsuccess = function() {
        const userData = userRequest.result;
        if (userData) {
            // Update today's activity
            const todayFormatted = getFormattedDate(new Date());
            let todayActivity = userData.dailyActivities.find(activity => activity.date === todayFormatted);
            
            if (!todayActivity) {
                // If today's activity doesn't exist, initialize it
                todayActivity = { date: todayFormatted, math: 'unattempted', riddle: 'unattempted', pattern: 'unattempted', dailyScore: 0 };
                userData.dailyActivities.unshift(todayActivity); // Add to the start of the array
            }
            
            // Update the status and score for the puzzle type
            todayActivity[puzzleType] = status;
            todayActivity.dailyScore += score;
            
            store.put(userData);
        } else {
            console.log("User not found");
        }
    };
}