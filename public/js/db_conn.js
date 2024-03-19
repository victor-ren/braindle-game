
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
const request = indexedDB.open("Braindle_Database", 1);

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
            if (matching.password == input_password){
                sessionStorage.setItem("logedin", true);
                window.location.href = "../index.html";
            }
            else{
                alert("wrong password");
            }
        } else {
            // No match was found.
            console.log("did not find it");
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
        store.put({username: input_username, password: input_password});
        sessionStorage.setItem("logedin", true);
        window.location.href = "../index.html";
    }
    };
}