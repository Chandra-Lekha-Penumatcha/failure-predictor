document.addEventListener("DOMContentLoaded", function () {
    console.log("DASHBOARD.JS LOADED");

    loadUserName();
    setupLogout();
});


function loadUserName() {

    const userNameElement = document.getElementById("userName");

    if (!userNameElement) {
        console.error("userName element not found");
        return;
    }

    let currentUser = null;

    try {
        const savedUser = localStorage.getItem("currentUser");

        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }

    } catch (error) {
        console.error("Error reading currentUser:", error);
    }


    if (!currentUser) {
        userNameElement.textContent = "User";
        return;
    }


    const name =
        currentUser.name ||
        currentUser.userName ||
        currentUser.username ||
        currentUser.displayName ||
        currentUser.fullName ||
        currentUser.email ||
        "User";


    userNameElement.textContent = name;
}


function setupLogout() {

    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) {
        console.error("logoutBtn element not found");
        return;
    }


    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("currentUser");

        window.location.href = "./login.html";

    });
}