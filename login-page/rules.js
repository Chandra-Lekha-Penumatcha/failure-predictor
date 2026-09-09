document.addEventListener("DOMContentLoaded", function () {

    console.log("RULES.JS LOADED");

    loadRules();

    setupLogout();

});


/* =========================
   LOAD LATEST ANALYSIS
========================= */

function loadRules() {

    const noAnalysis =
        document.getElementById("noAnalysis");

    const rulesContent =
        document.getElementById("rulesContent");


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
        !record.startupData
    ) {

        noAnalysis.classList.remove("hidden");

        rulesContent.classList.add("hidden");

        return;

    }


    noAnalysis.classList.add("hidden");

    rulesContent.classList.remove("hidden");


    const startup =
        record.startupData;


    const companyName =
        startup.startupName || "Startup";


    const industry =
        startup.industry || "Technology";


    const foundedYear =
        startup.foundedYear || "-";


    const startupStage =
        startup.startupStage || "Startup";


    const location =
        startup.location || "India";


    const businessModel =
        startup.businessModel || "Not specified";


    /* =========================
       STARTUP INFORMATION
    ========================= */

    document.getElementById(
        "startupName"
    ).textContent =
        companyName;


    document.getElementById(
        "startupInfo"
    ).textContent =
        `${industry} • Founded ${foundedYear} • ${businessModel}`;


    /* =========================
       INDUSTRY COMPLIANCE
    ========================= */

    const industryCompliance =
        document.getElementById(
            "industryCompliance"
        );


    const industryChecklist =
        document.getElementById(
            "industryChecklist"
        );


    const industryRules =
        getIndustryRules(industry);


    industryCompliance.textContent =
        industryRules.description;


    industryChecklist.textContent =
        `${industry} industry-specific requirements reviewed`;


    /* =========================
       REGULATION LIST
    ========================= */

    displayRegulations(
        industry,
        startupStage,
        location,
        businessModel
    );

}


/* =========================
   INDUSTRY RULES
========================= */

function getIndustryRules(industry) {

    const value =
        String(industry).toLowerCase();


    if (
        value.includes("health") ||
        value.includes("medical") ||
        value.includes("healthcare")
    ) {

        return {

            description:
                "Healthcare businesses should review applicable healthcare, patient-data, licensing and sector-specific requirements."

        };

    }


    if (
        value.includes("fintech") ||
        value.includes("finance") ||
        value.includes("banking")
    ) {

        return {

            description:
                "Financial technology businesses should review applicable financial, payment, cybersecurity and regulatory requirements."

        };

    }


    if (
        value.includes("food") ||
        value.includes("restaurant") ||
        value.includes("beverage")
    ) {

        return {

            description:
                "Food businesses should review food safety, licensing, labeling, taxation and local regulatory requirements."

        };

    }


    if (
        value.includes("education") ||
        value.includes("edtech")
    ) {

        return {

            description:
                "Education businesses should review applicable education-sector, consumer protection and data privacy requirements."

        };

    }


    if (
        value.includes("ecommerce") ||
        value.includes("e-commerce") ||
        value.includes("retail")
    ) {

        return {

            description:
                "E-commerce businesses should review consumer protection, taxation, online transactions, privacy and marketplace requirements."

        };

    }


    if (
        value.includes("technology") ||
        value.includes("software") ||
        value.includes("saas") ||
        value.includes("it")
    ) {

        return {

            description:
                "Technology businesses should review data protection, intellectual property, online terms, taxation and cybersecurity requirements."

        };

    }


    return {

        description:
            "Review regulations, licensing, taxation, data protection and other requirements applicable to your specific industry."

    };

}


/* =========================
   REGULATION LIST
========================= */

function displayRegulations(
    industry,
    startupStage,
    location,
    businessModel
) {

    const container =
        document.getElementById(
            "regulationList"
        );


    container.innerHTML = "";


    const regulations = [

        {
            title: "Business Registration",
            text:
                "Maintain the appropriate business structure and required registrations for operating the startup."
        },

        {
            title: "Tax & GST",
            text:
                "Review applicable tax registration, GST requirements, invoicing and statutory filing obligations."
        },

        {
            title: "Intellectual Property",
            text:
                "Identify important intellectual property and consider appropriate trademark, copyright or patent protection."
        },

        {
            title: "Data Protection",
            text:
                "Review how customer and employee data is collected, processed, stored and protected."
        },

        {
            title: "Employment Compliance",
            text:
                "Maintain appropriate employee documentation and review applicable employment and labour requirements."
        },

        {
            title: `${industry} Industry Requirements`,
            text:
                getIndustryRules(industry).description
        },

        {
            title: "Business Model Review",
            text:
                `For a ${businessModel} business, review customer agreements, terms of service, privacy policies and applicable commercial obligations.`
        },

        {
            title: "Location-Specific Review",
            text:
                `Review applicable requirements for operating in ${location}. Local requirements may vary by business activity and jurisdiction.`
        }

    ];


    regulations.forEach(function (item) {

        const div =
            document.createElement("div");


        div.className =
            "regulation-item";


        div.innerHTML = `

            <h3>
                ${escapeHTML(item.title)}
            </h3>

            <p>
                ${escapeHTML(item.text)}
            </p>

        `;


        container.appendChild(div);

    });

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