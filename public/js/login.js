// 1
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}

// 2
const request = indexedDB.open("Braindle_Database", 1);

request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

request.onupgradeneeded = function () {
    //1
    const db = request.result;
    //2
    // const store = db.createObjectStore("data_base", { keyPath: "id" });
    const store = db.createObjectStore("data_base", {keyPath:"username"});
    //3
    store.createIndex("logins", "username", ["password"], { unique: true });
    // 4
    // store.createIndex("scores", "username", ["score1", "score2"], {unique: false}); 
  };

request.onsuccess = function () {
    console.log("Database opened successfully");
    // const db = request.result;
    // const transaction = db.transaction("logins", "readwrite");
    // const store = transaction.objectStore("logins");
    // const usernames = store.index("username");
    // const datas = store.index("data");
    // store.put({ id: 2, lastlogin: "Rehuhd", somethingelse: "Toyota" });
    // store.put({ id: 3, lastlogin: "something", somethingelse: "hi test" });
  
    const db = request.result;
  
    // 1
    const transaction = db.transaction("data_base", "readwrite");
  
    //2
    const store = transaction.objectStore("data_base");
    // const usernames = store.index("username");
    // const datas = store.index("data");
  
    //3
    // store.put({ id: 1, username: "Hi", password: "Test" });
    // store.put({ id: 2, score1: "Hi", score2: "Test" });
    // store.put({ id: 3, score1: "Hi", score2: "Test" });

  
    // // //4
    const idQuery = store.get(1);
    idQuery.onsuccess = function () {
        console.log('idQuery', idQuery.result);
      };
    // // const usernmameQuery = usernames.getAll(["Red"]);
    // // const dataQuery = datas.get(["Blue", "Honda"]);
  
    // // // 5
    // // idQuery.onsuccess = function () {
    // //   console.log('idQuery', idQuery.result);
    // // };
    // // colourQuery.onsuccess = function () {
    // //   console.log('colourQuery', colourQuery.result);
    // // };
    // // colourMakeQuery.onsuccess = function () {
    // //   console.log('colourMakeQuery', colourMakeQuery.result);
    // // };
  
    // // // 6
    // transaction.oncomplete = function () {
    //   db.close();
    // };
  };




// OLD

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('login-submit').addEventListener('click', function() {
        let username1 = document.getElementById("username-answer").value;
        let password1 = document.getElementById(`password-answer`).value;
        
        const db = request.result;
        const transaction = db.transaction("data_base", "readwrite");
        const store = transaction.objectStore("data_base");
        
        
        const index = store.index("logins");
        const request1 = index.get(username1);
        request1.onsuccess = function() {
        const matching = request1.result;
        if (matching !== undefined) {
            if (matching.password == password1){
                alert("Success.");
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

        // store.put({ id: 5, username: username1, password: password1});

    });

    document.getElementById('signup-submit').addEventListener('click', function() {
        // fs.writeFile("login_info.txt", document.getElementById('username-answer'), (err) =>{
        //     if (err) throw err;
        // })

        let username1 = document.getElementById("username-answer").value;
        let password1 = document.getElementById(`password-answer`).value;
        
        const db = request.result;
        const transaction = db.transaction("data_base", "readwrite");
        const store = transaction.objectStore("data_base");
        
        
        const index = store.index("logins");
        const request1 = index.get(username1);
        request1.onsuccess = function() {
        const matching = request1.result;
        if (matching !== undefined) {
            // A match was found.
            console.log("HI THERE");
            alert("This username is already taken.");
        } else {
            // No match was found.
            console.log("did not find it");
            store.put({username: username1, password: password1});
        }
        };
    });
});
