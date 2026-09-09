// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyD7lOBSLOZmx8RTA-VRfR5HpMaxKQD02Ys",

    authDomain:
        "startup-failure-predictor.firebaseapp.com",

    databaseURL:
        "https://startup-failure-predictor-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "startup-failure-predictor",

    storageBucket:
        "startup-failure-predictor.firebasestorage.app",

    messagingSenderId:
        "12145976790",

    appId:
        "1:12145976790:web:291eae3b0482f080ce3077"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


console.log(
    "Firebase initialized successfully"
);


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const loginButton =
    document.getElementById("loginBtn");


const passwordToggle =
    document.getElementById("passwordToggle");


// ==========================================
// LOGIN FUNCTION
// ==========================================

async function login() {

    console.log("Login button clicked");


    // Get user input

    const email =
        emailInput.value
            .trim()
            .toLowerCase();


    const password =
        passwordInput.value;

    const emailPattern =
    /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;


    // ======================================
    // VALIDATION
    // ======================================

    if (!email) {

        alert(
            "Please enter your email address."
        );

        emailInput.focus();
        

        return;

    }


    if (!password) {

        alert(
            "Please enter your password."
        );

        passwordInput.focus();

        return;

    }

    const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{12,}$/;


// Check Password Pattern

if (!passwordPattern.test(password)) {

    alert(
        "Password does not meet the security requirements!\n\n" +
        "Password must contain:\n" +
        "• At least 12 characters\n" +
        "• At least 1 uppercase letter\n" +
        "• At least 1 lowercase letter\n" +
        "• At least 1 number\n" +
        "• At least 1 special character (@#$%^&*!)\n\n" +
        "Example: Startup@2026!"
    );

    passwordInput.focus();

    return;

}


    // ======================================
    // BUTTON LOADING
    // ======================================

    loginButton.disabled = true;


    loginButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Logging in...</span>
    `;


    try {

        console.log(
            "Attempting Firebase login..."
        );


        // ==================================
        // FIREBASE LOGIN
        // ==================================

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        console.log(
            "Login successful!"
        );


        console.log(
            "User:",
            user
        );


        // ==================================
        // SAVE USER DATA
        // ==================================

        const userData = {

            uid:
                user.uid,

            email:
                user.email,

            displayName:
                user.displayName || "User"

        };


        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );


        localStorage.setItem(
            "loggedIn",
            "true"
        );


        console.log(
            "User saved to localStorage:",
            userData
        );


        // ==================================
        // SUCCESS
        // ==================================

        alert(
            "Login successful!"
        );


        // ==================================
        // DASHBOARD REDIRECT
        //
        // dashboard.html is in the same
        // login-page folder
        // ==================================

        window.location.href =
            "dashboard.html";

    }


    // ======================================
    // ERROR HANDLING
    // ======================================

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        console.error(
            "ERROR CODE:",
            error.code
        );


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            alert(
                "Incorrect email or password."
            );

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            alert(
                "No account found with this email address."
            );

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            alert(
                "Incorrect password."
            );

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            alert(
                "Please enter a valid email address."
            );

        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            alert(
                "Too many login attempts. Please try again later."
            );

        }

        else {

            alert(
                "Login failed: " +
                error.message
            );

        }

    }


    // ======================================
    // RESET BUTTON
    // ======================================

    finally {

        loginButton.disabled =
            false;


        loginButton.innerHTML = `
            <i class="fa-solid fa-right-to-bracket"></i>
            <span>Login</span>
        `;

    }

}


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

function togglePassword() {

    if (
        passwordInput.type ===
        "password"
    ) {

        passwordInput.type =
            "text";


        passwordToggle.innerHTML =
            `<i class="fa-solid fa-eye-slash"></i>`;

    }

    else {

        passwordInput.type =
            "password";


        passwordToggle.innerHTML =
            `<i class="fa-solid fa-eye"></i>`;

    }

}


// ==========================================
// BUTTON EVENT LISTENERS
// ==========================================

loginButton.addEventListener(
    "click",
    login
);


passwordToggle.addEventListener(
    "click",
    togglePassword
);


// ==========================================
// ENTER KEY LOGIN
// ==========================================

passwordInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            login();

        }

    }
);