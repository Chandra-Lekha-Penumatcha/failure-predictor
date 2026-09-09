from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "model",
    "trained_model.pkl"
)

# ============================================================
# LOAD MODEL
# ============================================================

print("=" * 60)
print("STARTUP FAILURE PREDICTOR")
print("=" * 60)

print("MODEL PATH:", MODEL_PATH)
print("MODEL EXISTS:", os.path.exists(MODEL_PATH))

try:
    model = joblib.load(MODEL_PATH)

    print("ML MODEL LOADED SUCCESSFULLY")
    print("MODEL STATUS: LOADED")

except Exception as e:
    model = None

    print("MODEL STATUS: NOT LOADED")
    print("MODEL ERROR:", e)

print("=" * 60)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "success",
        "modelLoaded": model is not None
    })


# ============================================================
# ANALYZE
# ============================================================

@app.route("/api/analyze", methods=["POST"])
def analyze():

    try:

        print("\n" + "=" * 60)
        print("ANALYSIS REQUEST RECEIVED")
        print("=" * 60)

        if model is None:

            return jsonify({
                "status": "error",
                "message": "ML model is not loaded."
            }), 500

        data = request.get_json()

        print("Received data:")
        print(data)

        if not data:

            return jsonify({
                "status": "error",
                "message": "No startup data received."
            }), 400

        # ====================================================
        # EXACT FEATURES USED DURING TRAINING
        # ====================================================

        model_input = pd.DataFrame([{

            "Industry":
                str(data.get("industry", "")),

            "Startup_Age":
                float(data.get("startupAge", 0)),

            "Funding_Amount":
                float(data.get("fundingAmount", 0)),

            "Number_of_Founders":
                int(data.get("numberOfFounders", 0)),

            "Founder_Experience":
                float(data.get("founderExperience", 0)),

            "Employees_Count":
                int(data.get("employeesCount", 0)),

            "Revenue":
                float(data.get("revenue", 0)),

            "Burn_Rate":
                float(data.get("burnRate", 0)),

            "Market_Size":
                str(data.get("marketSize", "")),

            "Business_Model":
                str(data.get("businessModel", "")),

            "Product_Uniqueness_Score":
                float(data.get("productUniquenessScore", 0)),

            "Customer_Retention_Rate":
                float(data.get("customerRetentionRate", 0)),

            "Marketing_Expense":
                float(data.get("marketingExpense", 0))

        }])

        print("\nMODEL INPUT:")
        print(model_input)

        # ====================================================
        # PREDICTION
        # ====================================================

        prediction = int(
            model.predict(model_input)[0]
        )

        probabilities = model.predict_proba(
            model_input
        )[0]

        classes = model.classes_

        success_probability = 0
        failure_probability = 0

        for i, class_value in enumerate(classes):

            probability = float(
                probabilities[i] * 100
            )

            if int(class_value) == 1:

                success_probability = probability

            elif int(class_value) == 0:

                failure_probability = probability

        success_probability = round(
            success_probability,
            2
        )

        failure_probability = round(
            failure_probability,
            2
        )

        # ====================================================
        # LABEL
        # ====================================================

        if prediction == 1:

            prediction_label = "Successful"

        else:

            prediction_label = "Failure"

        # ====================================================
        # HEALTH SCORE
        # ====================================================

        health_score = round(
            success_probability,
            2
        )

        # ====================================================
        # RISK
        # ====================================================

        if failure_probability >= 70:

            risk_level = "High Risk"

        elif failure_probability >= 40:

            risk_level = "Moderate Risk"

        else:

            risk_level = "Low Risk"

        # ====================================================
        # INPUT VALUES
        # ====================================================

        revenue = float(
            data.get("revenue", 0)
        )

        burn_rate = float(
            data.get("burnRate", 0)
        )

        funding = float(
            data.get("fundingAmount", 0)
        )

        retention = float(
            data.get("customerRetentionRate", 0)
        )

        founder_experience = float(
            data.get("founderExperience", 0)
        )

        employees = int(
            data.get("employeesCount", 0)
        )

        uniqueness = float(
            data.get("productUniquenessScore", 0)
        )

        marketing = float(
            data.get("marketingExpense", 0)
        )

        # ====================================================
        # RISK FACTORS
        # ====================================================

        risk_factors = []

        if burn_rate > revenue:

            risk_factors.append(
                "Burn rate is higher than current revenue."
            )

        if burn_rate > 0:

            runway = funding / burn_rate

            if runway < 6:

                risk_factors.append(
                    "Funding provides less than 6 months of runway."
                )

            elif runway < 12:

                risk_factors.append(
                    "Funding provides less than 12 months of runway."
                )

        if retention < 40:

            risk_factors.append(
                "Customer retention rate is low."
            )

        elif retention < 70:

            risk_factors.append(
                "Customer retention needs improvement."
            )

        if founder_experience < 2:

            risk_factors.append(
                "Founder experience is relatively low."
            )

        if employees < 2:

            risk_factors.append(
                "Very small team may create operational risk."
            )

        if uniqueness < 5:

            risk_factors.append(
                "Product uniqueness score is low."
            )

        if revenue > 0 and marketing > revenue:

            risk_factors.append(
                "Marketing expense is high compared with revenue."
            )

        if failure_probability >= 70:

            risk_factors.append(
                "Model indicates a high probability of startup failure."
            )

        elif failure_probability >= 40:

            risk_factors.append(
                "Model indicates a moderate probability of startup failure."
            )

        if not risk_factors:

            risk_factors.append(
                "No major risk factors identified."
            )

        # ====================================================
        # RECOMMENDATIONS
        # ====================================================

        recommendations = []

        if burn_rate > revenue:

            recommendations.append(
                "Reduce burn rate and prioritize essential expenses."
            )

        if burn_rate > 0:

            runway = funding / burn_rate

            if runway < 6:

                recommendations.append(
                    "Increase financial runway by reducing expenses or securing additional funding."
                )

            elif runway < 12:

                recommendations.append(
                    "Aim to maintain at least 12 months of financial runway."
                )

        if retention < 40:

            recommendations.append(
                "Focus on customer retention and improving customer experience."
            )

        elif retention < 70:

            recommendations.append(
                "Improve customer engagement and retention."
            )

        if founder_experience < 2:

            recommendations.append(
                "Consider experienced mentors or advisors."
            )

        if employees < 2:

            recommendations.append(
                "Strengthen the core startup team."
            )

        if uniqueness < 5:

            recommendations.append(
                "Improve product differentiation and competitive advantage."
            )

        if revenue > 0 and marketing > revenue:

            recommendations.append(
                "Review marketing ROI and reduce inefficient spending."
            )

        if not recommendations:

            recommendations.append(
                "Maintain financial discipline and sustainable growth."
            )

        # ====================================================
        # RISK CATEGORIES
        # ====================================================

        if burn_rate > revenue:

            financial_risk = "High"

        elif burn_rate > 0 and funding / burn_rate < 12:

            financial_risk = "Medium"

        else:

            financial_risk = "Low"

        if retention < 40:

            market_risk = "High"

        elif retention < 70:

            market_risk = "Medium"

        else:

            market_risk = "Low"

        if founder_experience < 2:

            team_risk = "High"

        elif founder_experience < 5:

            team_risk = "Medium"

        else:

            team_risk = "Low"

        if employees < 2:

            operational_risk = "High"

        elif employees < 5:

            operational_risk = "Medium"

        else:

            operational_risk = "Low"

        if failure_probability >= 70:

            business_environment_risk = "High"

        elif failure_probability >= 40:

            business_environment_risk = "Medium"

        else:

            business_environment_risk = "Low"

        # ====================================================
        # RESULT
        # ====================================================

        result = {

            "status": "success",

            "prediction": prediction,

            "predictionLabel":
                prediction_label,

            "successProbability":
                success_probability,

            "failureProbability":
                failure_probability,

            "healthScore":
                health_score,

            "riskLevel":
                risk_level,

            "overallRisk":
                failure_probability,

            "financialRisk":
                financial_risk,

            "marketRisk":
                market_risk,

            "teamRisk":
                team_risk,

            "operationalRisk":
                operational_risk,

            "operationsRisk":
                operational_risk,

            "businessEnvironmentRisk":
                business_environment_risk,

            "riskFactors":
                risk_factors,

            "recommendations":
                recommendations

        }

        print("\n" + "=" * 60)
        print("STARTUP ANALYSIS RESULT")
        print("=" * 60)

        print("Prediction:", prediction_label)
        print("Success Probability:", success_probability, "%")
        print("Failure Probability:", failure_probability, "%")
        print("Health Score:", health_score, "/100")
        print("Risk Level:", risk_level)

        print("=" * 60)

        return jsonify(result)

    except Exception as e:

        import traceback

        print("\nANALYSIS ERROR:")
        traceback.print_exc()

        return jsonify({

            "status": "error",

            "message": "Startup analysis failed.",

            "error": str(e)

        }), 500


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )