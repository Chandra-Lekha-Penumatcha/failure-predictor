```javascript
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

console.log("REGISTER.JS LOADED");


// ============================================
// PASSWORD EYE BUTTON
// ============================================

window.togglePassword = function (inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        console.error("Password input not found:", inputId);
        return;
    }

    if (input.type === "password") {

        input.type = "text";

        button.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        input.type = "password";

        button.innerHTML =
            '<i class="fa-solid fa-eye"></i>';
    }
};


// ============================================
// REGISTER FORM
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM LOADED");

    const registerForm =
        document.getElementById("registerForm");

    const popupLoginBtn =
        document.getElementById("popupLoginBtn");

    const successPopup =
        document.getElementById("successPopup");


    // ========================================
    // CHECK ELEMENTS
    // ========================================

    if (!registerForm) {
        console.error("registerForm NOT FOUND");
        return;
    }

    console.log("registerForm FOUND");


    // ========================================
    // REGISTER
    // ========================================

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("CREATE ACCOUNT BUTTON CLICKED");


        // ========================================
        // GET VALUES
        // ========================================

        const founderNameElement =
            document.getElementById("founderName");

        const emailElement =
            document.getElementById("email");

        const phoneElement =
            document.getElementById("phone");

        const passwordElement =
            document.getElementById("password");

        const confirmPasswordElement =
            document.getElementById("confirmPassword");

        const termsElement =
            document.getElementById("terms");


        // ========================================
        // CHECK INPUT ELEMENTS
        // ========================================

        if (
            !founderNameElement ||
            !emailElement ||
            !phoneElement ||
            !passwordElement ||
            !confirmPasswordElement ||
            !termsElement
        ) {

            console.error("One or more form fields are missing.");

            alert("Registration form error. Please refresh the page.");

            return;
        }


        // ========================================
        // VALUES
        // ========================================

        const founderName =
            founderNameElement.value.trim();

        const email =
            emailElement.value.trim();

        const phone =
            phoneElement.value.trim();

        const password =
            passwordElement.value;

        const confirmPassword =
            confirmPasswordElement.value;

        const terms =
            termsElement.checked;


        // ========================================
        // VALIDATION
        // ========================================

        if (founderName === "") {

            alert("Please enter your name.");

            founderNameElement.focus();

            return;
        }


        if (email === "") {

            alert("Please enter your email.");

            emailElement.focus();

            return;
        }


        if (!/^[0-9]{10}$/.test(phone)) {

            alert("Please enter a valid 10-digit phone number.");

            phoneElement.focus();

            return;
        }


        if (password.length < 6) {

            alert("Password must contain at least 6 characters.");

            passwordElement.focus();

            return;
        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            confirmPasswordElement.focus();

            return;
        }


        if (!terms) {

            alert("Please accept the Terms & Conditions.");

            return;
        }


        // ========================================
        // DISABLE BUTTON WHILE REGISTERING
        // ========================================

        const submitButton =
            registerForm.querySelector('button[type="submit"]');

        const originalButtonText =
            submitButton ? submitButton.innerHTML : "";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML = "Creating Account...";
        }


        // ========================================
        // FIREBASE REGISTRATION
        // ========================================

        try {

            console.log("Creating Firebase account...");


            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            console.log(
                "Firebase account created successfully:",
                user.uid
            );


            // ====================================
            // SAVE FOUNDER NAME
            // ====================================

            await updateProfile(user, {

                displayName: founderName

            });


            console.log("Founder name saved.");


            // ====================================
            // SAVE USER
            // ====================================

            const currentUser = {

                uid: user.uid,

                name: founderName,

                email: email,

                phone: phone

            };


            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );


            console.log("User saved to localStorage.");


            // ====================================
            // SHOW SUCCESS POPUP
            // ====================================

            if (successPopup) {

                console.log("Showing success popup...");

                // Remove any previous class
                successPopup.classList.remove("show");

                // Make popup visible
                successPopup.style.display = "flex";

                // Add class in case your CSS uses .show
                setTimeout(function () {

                    successPopup.classList.add("show");

                }, 10);

            } else {

                console.error(
                    "successPopup element NOT FOUND"
                );

                alert(
                    "Registration successful! Please login."
                );

                window.location.href = "./index.html";
            }


        } catch (error) {

            console.error(
                "REGISTRATION ERROR:",
                error
            );


            // ====================================
            // FIREBASE ERRORS
            // ====================================

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                alert(
                    "This email is already registered. Please login."
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
                "auth/weak-password"
            ) {

                alert(
                    "Password must contain at least 6 characters."
                );

            }

            else {

                alert(
                    "Registration failed: " +
                    error.message
                );
            }


            // ====================================
            // ENABLE BUTTON AGAIN
            // ====================================

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonText;
            }
        }

    });


    // ============================================
    // CONTINUE TO LOGIN
    // ============================================

    if (popupLoginBtn) {

        popupLoginBtn.addEventListener(
            "click",
            function () {

                console.log(
                    "Continue to Login clicked"
                );

                window.location.href =
                    "./index.html";
            }
        );

    } else {

        console.warn(
            "popupLoginBtn NOT FOUND"
        );
    }

});
```
