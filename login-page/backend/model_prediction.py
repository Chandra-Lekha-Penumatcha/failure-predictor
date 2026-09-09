# =========================================================
# MODEL PREDICTION
# Startup Failure Predictor
# =========================================================

import os
import joblib
import pandas as pd


# =========================================================
# MODEL PATH
# =========================================================
# =========================================================
# MODEL PATH
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_ROOT = os.path.dirname(BASE_DIR)

MODEL_DIR = os.path.join(
    PROJECT_ROOT,
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "trained_model.pkl"
)

print("===================================")
print("STARTUP PREDICTION")
print("===================================")

print("Looking for model at:")
print(MODEL_PATH)

# =========================================================
# LOAD TRAINED MODEL
# =========================================================

if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(
        f"Model not found at: {MODEL_PATH}"
    )


model = joblib.load(MODEL_PATH)

print("Model loaded successfully.")
print("===================================")


# =========================================================
# PREDICTION FUNCTION
# =========================================================

def predict_startup(data):

    # -----------------------------------------------------
    # CREATE DATAFRAME
    # -----------------------------------------------------

    input_data = pd.DataFrame([{

        "Industry":
            data["Industry"],

        "Startup_Age":
            data["Startup_Age"],

        "Funding_Amount":
            data["Funding_Amount"],

        "Number_of_Founders":
            data["Number_of_Founders"],

        "Founder_Experience":
            data["Founder_Experience"],

        "Employees_Count":
            data["Employees_Count"],

        "Revenue":
            data["Revenue"],

        "Burn_Rate":
            data["Burn_Rate"],

        "Market_Size":
            data["Market_Size"],

        "Business_Model":
            data["Business_Model"],

        "Product_Uniqueness_Score":
            data["Product_Uniqueness_Score"],

        "Customer_Retention_Rate":
            data["Customer_Retention_Rate"],

        "Marketing_Expense":
            data["Marketing_Expense"]

    }])


    # -----------------------------------------------------
    # MAKE PREDICTION
    # -----------------------------------------------------

    prediction = model.predict(
        input_data
    )[0]


    # -----------------------------------------------------
    # GET PROBABILITIES
    # -----------------------------------------------------

    probabilities = model.predict_proba(
        input_data
    )[0]


    # Model classes are:
    # 0 = Failed
    # 1 = Successful

    failure_probability = probabilities[0]
    success_probability = probabilities[1]


    # -----------------------------------------------------
    # CONVERT TO PERCENTAGE
    # -----------------------------------------------------

    success_percentage = round(
        success_probability * 100,
        2
    )

    failure_percentage = round(
        failure_probability * 100,
        2
    )


    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    if prediction == 1:

        status = "Successful"

    else:

        status = "Failure"


    # -----------------------------------------------------
    # HEALTH SCORE
    # -----------------------------------------------------

    health_score = round(
        success_probability * 100,
        2
    )


    # -----------------------------------------------------
    # OVERALL RISK
    # -----------------------------------------------------

    risk_percentage = failure_percentage


    if risk_percentage < 30:

        risk_level = "Low Risk"

    elif risk_percentage < 60:

        risk_level = "Moderate Risk"

    else:

        risk_level = "High Risk"


    # -----------------------------------------------------
    # RETURN RESULT
    # -----------------------------------------------------

    return {

        "prediction": int(prediction),

        "predictionLabel": status,

        "successProbability":
            success_percentage,

        "failureProbability":
            failure_percentage,

        "healthScore":
            health_score,

        "riskPercentage":
            risk_percentage,

        "riskLevel":
            risk_level

    }


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    test_startup = {

        "Startup_Name":
            "Test Startup",

        "Industry":
            "Technology",

        "Startup_Age":
            5,

        "Funding_Amount":
            5000000,

        "Number_of_Founders":
            2,

        "Founder_Experience":
            8,

        "Employees_Count":
            50,

        "Revenue":
            10000000,

        "Burn_Rate":
            500000,

        "Market_Size":
            "Large",

        "Business_Model":
            "B2B",

        "Product_Uniqueness_Score":
            8,

        "Customer_Retention_Rate":
            70,

        "Marketing_Expense":
            500000

    }


    result = predict_startup(
        test_startup
    )


    print("\n===================================")
    print("STARTUP PREDICTION")
    print("===================================")

    print(
        "Prediction:",
        result["predictionLabel"]
    )

    print(
        "Success Probability:",
        str(result["successProbability"]) + "%"
    )

    print(
        "Failure Probability:",
        str(result["failureProbability"]) + "%"
    )

    print(
        "Health Score:",
        str(result["healthScore"]) + "/100"
    )

    print(
        "Risk:",
        str(result["riskPercentage"]) + "%"
    )

    print(
        "Risk Level:",
        result["riskLevel"]
    )

    print("===================================\n")