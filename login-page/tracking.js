document.addEventListener("DOMContentLoaded", function () {

    console.log("TRACKING.JS LOADED");

    loadTrackingData();

    setupLogout();

    setupClearHistory();

});


/* =========================
   LOAD TRACKING DATA
========================= */

function loadTrackingData() {

    const trackingBody =
        document.getElementById("trackingBody");

    const totalAnalyses =
        document.getElementById("totalAnalyses");

    const latestStartup =
        document.getElementById("latestStartup");

    const latestRisk =
        document.getElementById("latestRisk");


    if (!trackingBody) {
        console.error("trackingBody not found.");
        return;
    }


    let history = [];

    try {

        history = JSON.parse(
            localStorage.getItem("analysisHistory") || "[]"
        );

    } catch (error) {

        console.error(
            "Unable to read analysis history:",
            error
        );

        history = [];

    }


    trackingBody.innerHTML = "";


    /* =========================
       NO HISTORY
    ========================= */

    if (history.length === 0) {

        totalAnalyses.textContent = "0";

        latestStartup.textContent = "-";

        latestRisk.textContent = "-";


        trackingBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">

                        <i class="fa-solid fa-chart-line"></i>

                        <h3>No Analysis History</h3>

                        <p>
                            Complete a startup analysis to see
                            your tracking history here.
                        </p>

                    </div>
                </td>
            </tr>
        `;

        return;
    }


    /* =========================
       SUMMARY
    ========================= */

    totalAnalyses.textContent = history.length;


    const latestRecord =
        history[history.length - 1];


    if (latestRecord && latestRecord.startupData) {

        latestStartup.textContent =
            latestRecord.startupData.startupName || "-";

    }


    if (latestRecord && latestRecord.result) {

        latestRisk.textContent =
            latestRecord.result.riskLevel || "-";

    }


    /* =========================
       DISPLAY NEWEST FIRST
    ========================= */

    const reversedHistory =
        [...history].reverse();


    reversedHistory.forEach(function (record) {

        if (!record) {
            return;
        }


        const startup =
            record.startupData || {};

        const result =
            record.result || {};


        const companyName =
            startup.startupName || "Unknown";


        const industry =
            startup.industry || "Unknown";


        const foundedYear =
            startup.foundedYear || "-";


        const successProbability =
            formatPercentage(
                result.successProbability
            );


        const failureProbability =
            formatPercentage(
                result.failureProbability
            );


        const risk =
            result.riskLevel || "Unknown";


        const analysisDate =
            formatDate(record.analyzedAt);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${escapeHTML(companyName)}</strong>
            </td>

            <td>
                ${escapeHTML(industry)}
            </td>

            <td>
                ${escapeHTML(String(foundedYear))}
            </td>

            <td>
                ${successProbability}
            </td>

            <td>
                ${failureProbability}
            </td>

            <td>
                ${createRiskBadge(risk)}
            </td>

            <td>
                ${analysisDate}
            </td>

        `;


        trackingBody.appendChild(row);

    });

}


/* =========================
   FORMAT PERCENTAGE
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
   FORMAT DATE
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "-";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   RISK BADGE
========================= */

function createRiskBadge(risk) {

    const normalizedRisk =
        String(risk).toLowerCase();


    let className =
        "risk-badge";


    if (normalizedRisk.includes("high")) {

        className += " risk-high";

    }
    else if (
        normalizedRisk.includes("moderate")
    ) {

        className += " risk-moderate";

    }
    else if (
        normalizedRisk.includes("low")
    ) {

        className += " risk-low";

    }


    return `
        <span class="${className}">
            ${escapeHTML(risk)}
        </span>
    `;

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
        document.getElementById("logoutBtn");


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("currentUser");

            window.location.href =
                "./login.html";

        }
    );

}


/* =========================
   CLEAR HISTORY
========================= */

function setupClearHistory() {

    const clearHistoryBtn =
        document.getElementById(
            "clearHistoryBtn"
        );


    if (!clearHistoryBtn) {
        return;
    }


    clearHistoryBtn.addEventListener(
        "click",
        function () {

            const history =
                JSON.parse(
                    localStorage.getItem(
                        "analysisHistory"
                    ) || "[]"
                );


            if (history.length === 0) {

                alert(
                    "There is no analysis history to clear."
                );

                return;

            }


            const confirmed =
                confirm(
                    "Are you sure you want to clear all analysis history?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "analysisHistory"
            );


            loadTrackingData();

        }
    );

}