document.addEventListener("DOMContentLoaded", function () {

    console.log("IMPROVEMENTS.JS LOADED");

    loadLatestAnalysis();

    setupLogout();

});


/* =========================
   LOAD LATEST ANALYSIS
========================= */

function loadLatestAnalysis() {

    const noAnalysis =
        document.getElementById("noAnalysis");

    const improvementContent =
        document.getElementById("improvementContent");


    let record = null;


    try {

        record = JSON.parse(
            localStorage.getItem("lastAnalysis")
        );

    } catch (error) {

        console.error(
            "Unable to read latest analysis:",
            error
        );

    }


    if (
        !record ||
        !record.startupData ||
        !record.result
    ) {

        noAnalysis.classList.remove("hidden");

        improvementContent.classList.add("hidden");

        return;

    }


    noAnalysis.classList.add("hidden");

    improvementContent.classList.remove("hidden");


    const startup =
        record.startupData;

    const result =
        record.result;


    /* =========================
       STARTUP
    ========================= */

    document.getElementById(
        "startupName"
    ).textContent =
        startup.startupName || "Startup";


    document.getElementById(
        "startupInfo"
    ).textContent =
        `${startup.industry || "Unknown Industry"} • Founded ${startup.foundedYear || "-"}`;


    /* =========================
       OVERVIEW
    ========================= */

    document.getElementById(
        "healthScore"
    ).textContent =
        formatPercentage(result.healthScore);


    document.getElementById(
        "successProbability"
    ).textContent =
        formatPercentage(result.successProbability);


    document.getElementById(
        "failureProbability"
    ).textContent =
        formatPercentage(result.failureProbability);


    document.getElementById(
        "overallRisk"
    ).textContent =
        result.overallRisk ||
        result.riskLevel ||
        "-";


    /* =========================
       RISK AREAS
    ========================= */

    document.getElementById(
        "financialRisk"
    ).textContent =
        result.financialRisk || "No significant financial risk identified.";


    document.getElementById(
        "marketRisk"
    ).textContent =
        result.marketRisk || "No significant market risk identified.";


    document.getElementById(
        "teamRisk"
    ).textContent =
        result.teamRisk || "No significant team risk identified.";


    document.getElementById(
        "operationsRisk"
    ).textContent =
        result.operationsRisk || "No significant operational risk identified.";


    document.getElementById(
        "businessEnvironmentRisk"
    ).textContent =
        result.businessEnvironmentRisk ||
        "No significant business environment risk identified.";


    /* =========================
       RISK FACTORS
    ========================= */

    displayRiskFactors(
        result.riskFactors
    );


    /* =========================
       RECOMMENDATIONS
    ========================= */

    displayRecommendations(
        result.recommendations
    );

}


/* =========================
   RISK FACTORS
========================= */

function displayRiskFactors(factors) {

    const container =
        document.getElementById("riskFactors");


    container.innerHTML = "";


    if (!factors) {

        container.innerHTML = `
            <div class="risk-factor">
                No major risk factors were identified.
            </div>
        `;

        return;

    }


    let items = [];


    if (Array.isArray(factors)) {

        items = factors;

    } else {

        items = [factors];

    }


    items.forEach(function (factor) {

        const div =
            document.createElement("div");

        div.className =
            "risk-factor";

        div.textContent =
            typeof factor === "string"
                ? factor
                : JSON.stringify(factor);


        container.appendChild(div);

    });

}


/* =========================
   RECOMMENDATIONS
========================= */

function displayRecommendations(recommendations) {

    const container =
        document.getElementById(
            "recommendations"
        );


    container.innerHTML = "";


    if (!recommendations) {

        container.innerHTML = `
            <div class="recommendation">

                <div class="recommendation-icon">
                    <i class="fa-solid fa-lightbulb"></i>
                </div>

                <div>

                    <h3>Continue Monitoring</h3>

                    <p>
                        Continue monitoring your startup
                        metrics and perform regular risk analyses.
                    </p>

                </div>

            </div>
        `;

        return;

    }


    let items = [];


    if (Array.isArray(recommendations)) {

        items = recommendations;

    } else {

        items = [recommendations];

    }


    items.forEach(function (recommendation, index) {

        const div =
            document.createElement("div");

        div.className =
            "recommendation";


        let text;


        if (typeof recommendation === "string") {

            text = recommendation;

        } else {

            text =
                JSON.stringify(recommendation);

        }


        div.innerHTML = `

            <div class="recommendation-icon">

                <i class="fa-solid fa-lightbulb"></i>

            </div>

            <div>

                <h3>
                    Improvement ${index + 1}
                </h3>

                <p>
                    ${escapeHTML(text)}
                </p>

            </div>

        `;


        container.appendChild(div);

    });

}


/* =========================
   PERCENTAGE
========================= */

function formatPercentage(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "-";
    }


    const number =
        Number(value);


    if (Number.isNaN(number)) {
        return "-";
    }


    return number.toFixed(1) + "%";

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   LOGOUT
========================= */

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "./login.html";

        }
    );

}