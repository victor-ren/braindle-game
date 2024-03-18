
import { checkLoginStatus } from './db_conn.js';
console.log(checkLoginStatus());

if (checkLoginStatus() == "true"){
    console.log("already logged");
}
else{
    console.log("here");
    window.location.href = "../login.html";
}

// sessionStorage.clear();

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('signout-btn').addEventListener('click', function() {
        // getting variable inputs
        sessionStorage.clear();
        window.location.href = "../login.html";
    });

});