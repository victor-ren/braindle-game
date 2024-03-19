
import { signup } from './db_conn.js';
import { login } from './db_conn.js';

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('login-submit').addEventListener('click', function() {
        // getting variable inputs
        let input_username = document.getElementById("username-answer").value;
        let input_password = document.getElementById(`password-answer`).value;
        
        // connect to database
        login(input_username, input_password);


    });

    document.getElementById('signup-submit').addEventListener('click', function() {


        let input_username = document.getElementById("username-answer").value;
        let input_password = document.getElementById(`password-answer`).value;
        signup(input_username, input_password);
        
        
    });
});
