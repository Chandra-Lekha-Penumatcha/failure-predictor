const loginForm =
    document.getElementById("loginForm");


const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const loginButton =
    document.getElementById("loginBtn");


const passwordToggle =
    document.getElementById("passwordToggle");


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

passwordToggle.addEventListener(
    "click",
    function () {

        if (
            passwordInput.type === "password"
        ) {

            passwordInput.type = "text";

            passwordToggle.textContent = "🙈";

        }

        else {

            passwordInput.type = "password";

            passwordToggle.textContent = "👁";

        }

    }
);


// ==========================================
// LOGIN FORM
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            emailInput.value
                .trim()
                .toLowerCase();


        const password =
            passwordInput.value;


        if (!email || !password) {

            alert(
                "Please enter your email and password."
            );

            return;

        }


        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        try {

            const response =
                await fetch(

                    "/api/login",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                            "application/json"

                        },

                        body: JSON.stringify({

                            email: email,

                            password: password

                        })

                    }

                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Login failed"
                );

                return;

            }


            // SAVE USER

            localStorage.setItem(

                "user",

                JSON.stringify(
                    result.user
                )

            );


            localStorage.setItem(

                "loggedIn",

                "true"

            );


            alert(
                "Login successful!"
            );


            // REDIRECT TO FLASK ROUTE

            window.location.href =
                "/dashboard";

        }


        catch (error) {

            console.error(
                error
            );


            alert(
                "Cannot connect to the server."
            );

        }


        finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Login";

        }

    }
);