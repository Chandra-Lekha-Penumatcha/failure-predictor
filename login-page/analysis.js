// ======================================
// ANALYSIS PAGE JAVASCRIPT
// ======================================

console.log("ANALYSIS.JS LOADED");


// ======================================
// LOGOUT
// ======================================

const logoutButton =
    document.getElementById("logoutBtn");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            if (
                confirm("Are you sure you want to logout?")
            ) {

                localStorage.removeItem("user");
                localStorage.removeItem("loggedIn");

                window.location.href =
                    "./index.html";
            }
        }
    );
}


// ======================================
// ANALYZE BUTTON
// ======================================

const analyzeButton =
    document.getElementById("analyzeBtn");


if (!analyzeButton) {

    console.error(
        "Analyze button not found."
    );

} else {

    analyzeButton.addEventListener(
        "click",
        analyzeStartup
    );
}


// ======================================
// ANALYZE STARTUP
// ======================================

async function analyzeStartup() {

    console.log(
        "ANALYZE BUTTON CLICKED"
    );


    // ======================================
    // GET VALUES
    // ======================================

    const startupData = {

        startupName:
            document.getElementById(
                "startupName"
            ).value.trim(),

        industry:
            document.getElementById(
                "industry"
            ).value.trim(),


        // ==================================
        // MANUALLY ENTERED FOUNDED YEAR
        // ==================================

        foundedYear:
            Number(
                document.getElementById(
                    "foundedYear"
                ).value
            ),


        startupAge:
            Number(
                document.getElementById(
                    "startupAge"
                ).value
            ),

        numberOfFounders:
            Number(
                document.getElementById(
                    "numberOfFounders"
                ).value
            ),

        founderExperience:
            Number(
                document.getElementById(
                    "founderExperience"
                ).value
            ),

        employeesCount:
            Number(
                document.getElementById(
                    "employeesCount"
                ).value
            ),

        marketSize:
            document.getElementById(
                "marketSize"
            ).value,

        businessModel:
            document.getElementById(
                "businessModel"
            ).value,

        fundingAmount:
            Number(
                document.getElementById(
                    "fundingAmount"
                ).value
            ),

        revenue:
            Number(
                document.getElementById(
                    "revenue"
                ).value
            ),

        burnRate:
            Number(
                document.getElementById(
                    "burnRate"
                ).value
            ),

        marketingExpense:
            Number(
                document.getElementById(
                    "marketingExpense"
                ).value
            ),

        productUniquenessScore:
            Number(
                document.getElementById(
                    "productUniquenessScore"
                ).value
            ),

        customerRetentionRate:
            Number(
                document.getElementById(
                    "customerRetentionRate"
                ).value
            )
    };


    console.log(
        "STARTUP DATA:",
        startupData
    );


    // ======================================
    // VALIDATION
    // ======================================

    for (
        const key in startupData
    ) {

        if (
            key !== "startupName" &&
            key !== "industry" &&
            (
                startupData[key] === null ||
                Number.isNaN(startupData[key])
            )
        ) {

            alert(
                "Please enter valid values for all fields."
            );

            return;
        }
    }


    if (!startupData.startupName) {

        alert(
            "Please enter Startup Name."
        );

        return;
    }


    if (!startupData.industry) {

        alert(
            "Please enter Industry."
        );

        return;
    }


    if (
        !startupData.foundedYear ||
        startupData.foundedYear < 1900 ||
        startupData.foundedYear > 2026
    ) {

        alert(
            "Please enter a valid Founded Year."
        );

        return;
    }


    if (!startupData.marketSize) {

        alert(
            "Please select Market Size."
        );

        return;
    }


    if (!startupData.businessModel) {

        alert(
            "Please select Business Model."
        );

        return;
    }


    // ======================================
    // BUTTON
    // ======================================

    const oldText =
        analyzeButton.innerHTML;

    analyzeButton.disabled = true;

    analyzeButton.innerHTML =
        "Analyzing...";


    try {

        console.log(
            "Sending data to Flask..."
        );


        // ==================================
        // API CALL
        // ==================================

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    // foundedYear is included here.
                    // Flask/model can ignore it.
                    body:
                        JSON.stringify(
                            startupData
                        )
                }
            );


        console.log(
            "Response status:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "RESULT:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Analysis failed."
            );
        }


        if (
            result.status !==
            "success"
        ) {

            throw new Error(
                result.message ||
                "Analysis failed."
            );
        }


        // ==================================
        // DISPLAY RESULT
        // ==================================

        displayResults(result);


        // ==================================
        // CREATE ANALYSIS RECORD
        // ==================================

        const analysisRecord = {

            startupData:
                startupData,

            result:
                result,

            analyzedAt:
                new Date().toISOString()
        };


        // ==================================
        // SAVE LATEST ANALYSIS
        // ==================================

        localStorage.setItem(
            "lastAnalysis",
            JSON.stringify(
                analysisRecord
            )
        );


        // ==================================
        // SAVE ANALYSIS HISTORY
        // ==================================

        const history =
            JSON.parse(
                localStorage.getItem(
                    "analysisHistory"
                ) || "[]"
            );


        history.push(
            analysisRecord
        );


        localStorage.setItem(
            "analysisHistory",
            JSON.stringify(
                history
            )
        );


        console.log(
            "LATEST ANALYSIS SAVED"
        );

        console.log(
            "ANALYSIS HISTORY SAVED",
            history
        );


    } catch (error) {

        console.error(
            "ANALYSIS ERROR:",
            error
        );


        alert(
            "Analysis failed.\n\n" +
            error.message
        );


    } finally {

        analyzeButton.disabled =
            false;

        analyzeButton.innerHTML =
            oldText;
    }
}


// ======================================
// DISPLAY RESULTS
// ======================================

function displayResults(result) {

    console.log(
        "DISPLAYING RESULTS",
        result
    );


    // ======================================
    // SHOW RESULT SECTION
    // ======================================

    const resultSection =
        document.getElementById(
            "resultSection"
        );

    resultSection.style.display =
        "block";


    // ======================================
    // MAIN RESULTS
    // ======================================

    document.getElementById(
        "prediction"
    ).textContent =
        result.predictionLabel;


    document.getElementById(
        "successProbability"
    ).textContent =
        result.successProbability + "%";


    document.getElementById(
        "failureProbability"
    ).textContent =
        result.failureProbability + "%";


    document.getElementById(
        "healthScore"
    ).textContent =
        result.healthScore + "/100";


    document.getElementById(
        "riskLevel"
    ).textContent =
        result.riskLevel;


    // ======================================
    // RISK CATEGORIES
    // ======================================

    document.getElementById(
        "financialRisk"
    ).textContent =
        result.financialRisk;


    document.getElementById(
        "marketRisk"
    ).textContent =
        result.marketRisk;


    document.getElementById(
        "teamRisk"
    ).textContent =
        result.teamRisk;


    document.getElementById(
        "operationsRisk"
    ).textContent =
        result.operationalRisk;


    document.getElementById(
        "businessEnvironmentRisk"
    ).textContent =
        result.businessEnvironmentRisk;


    // ======================================
    // RISK FACTORS
    // ======================================

    const riskFactors =
        document.getElementById(
            "riskFactors"
        );

    riskFactors.innerHTML = "";


    result.riskFactors.forEach(
        function (factor) {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                factor;

            riskFactors.appendChild(
                li
            );
        }
    );


    // ======================================
    // RECOMMENDATIONS
    // ======================================

    const recommendations =
        document.getElementById(
            "recommendations"
        );

    recommendations.innerHTML = "";


    result.recommendations.forEach(
        function (recommendation) {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                recommendation;

            recommendations.appendChild(
                li
            );
        }
    );


    // ======================================
    // SCROLL TO RESULT
    // ======================================

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}