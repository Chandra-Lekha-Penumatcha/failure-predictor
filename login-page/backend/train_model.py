import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# Startup-Failure-Predictor
PROJECT_ROOT = os.path.dirname(
    os.path.dirname(BASE_DIR)
)

# Dataset
DATASET_PATH = os.path.join(
    PROJECT_ROOT,
    "data",
    "startup_failure_dataset_1000.csv"
)

# Model directory
MODEL_DIR = os.path.join(
    PROJECT_ROOT,
    "model"
)

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)

# Model files
MODEL_PATH = os.path.join(
    MODEL_DIR,
    "trained_model.pkl"
)

FEATURE_COLUMNS_PATH = os.path.join(
    MODEL_DIR,
    "feature_columns.pkl"
)

SCALER_PATH = os.path.join(
    MODEL_DIR,
    "scaler.pkl"
)


# =========================================================
# DISPLAY PATHS
# =========================================================

print("==================================================")
print("STARTUP FAILURE PREDICTOR - MODEL TRAINING")
print("==================================================")

print("\nDataset:")
print(DATASET_PATH)

print("\nModel directory:")
print(MODEL_DIR)

print("\nModel path:")
print(MODEL_PATH)


# =========================================================
# CHECK DATASET
# =========================================================

if not os.path.exists(DATASET_PATH):
    raise FileNotFoundError(
        f"Dataset not found at:\n{DATASET_PATH}"
    )

print("\nDataset found successfully.")


# =========================================================
# LOAD DATASET
# =========================================================

print("\nLoading dataset...")

df = pd.read_csv(
    DATASET_PATH
)

print("Dataset loaded successfully.")
print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\nColumns:")
print(df.columns.tolist())


# =========================================================
# REMOVE EMPTY ROWS
# =========================================================

df = df.dropna()

print(
    "\nRows after removing missing values:",
    len(df)
)


# =========================================================
# TARGET COLUMN
# =========================================================

target_column = "Status"

if target_column not in df.columns:
    raise ValueError(
        f"{target_column} column not found in dataset."
    )


# =========================================================
# FEATURES
# =========================================================

features = [

    "Industry",

    "Startup_Age",

    "Funding_Amount",

    "Number_of_Founders",

    "Founder_Experience",

    "Employees_Count",

    "Revenue",

    "Burn_Rate",

    "Market_Size",

    "Business_Model",

    "Product_Uniqueness_Score",

    "Customer_Retention_Rate",

    "Marketing_Expense"

]


# =========================================================
# CHECK FEATURES
# =========================================================

missing_features = [

    column

    for column in features

    if column not in df.columns

]

if missing_features:

    raise ValueError(
        f"Missing columns: {missing_features}"
    )


# =========================================================
# X AND Y
# =========================================================

X = df[features]

y = df[target_column].astype(int)


print("\nTarget values:")

print(
    y.value_counts().sort_index()
)


print("\nTarget meaning:")

print("0 = Failed")

print("1 = Successful")


# =========================================================
# CATEGORICAL FEATURES
# =========================================================

categorical_features = [

    "Industry",

    "Market_Size",

    "Business_Model"

]


# =========================================================
# NUMERICAL FEATURES
# =========================================================

numerical_features = [

    "Startup_Age",

    "Funding_Amount",

    "Number_of_Founders",

    "Founder_Experience",

    "Employees_Count",

    "Revenue",

    "Burn_Rate",

    "Product_Uniqueness_Score",

    "Customer_Retention_Rate",

    "Marketing_Expense"

]


# =========================================================
# PREPROCESSING
# =========================================================

preprocessor = ColumnTransformer(

    transformers=[

        (

            "categorical",

            OneHotEncoder(
                handle_unknown="ignore"
            ),

            categorical_features

        ),

        (

            "numerical",

            StandardScaler(),

            numerical_features

        )

    ]

)


# =========================================================
# RANDOM FOREST
# =========================================================

model = RandomForestClassifier(

    n_estimators=300,

    max_depth=12,

    min_samples_split=4,

    min_samples_leaf=2,

    random_state=42,

    class_weight="balanced"

)


# =========================================================
# PIPELINE
# =========================================================

pipeline = Pipeline(

    steps=[

        (

            "preprocessor",

            preprocessor

        ),

        (

            "classifier",

            model

        )

    ]

)


# =========================================================
# TRAIN / TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)


print(
    "\nTraining samples:",
    len(X_train)
)

print(
    "Testing samples:",
    len(X_test)
)


# =========================================================
# TRAIN MODEL
# =========================================================

print(
    "\nTraining Random Forest model..."
)

pipeline.fit(

    X_train,

    y_train

)

print(
    "Model training completed."
)


# =========================================================
# PREDICTION
# =========================================================

y_pred = pipeline.predict(
    X_test
)


# =========================================================
# ACCURACY
# =========================================================

accuracy = accuracy_score(

    y_test,

    y_pred

)


print("\n===================================")
print("MODEL ACCURACY")
print("===================================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)


# =========================================================
# CLASSIFICATION REPORT
# =========================================================

print("\nClassification Report:")

print(
    classification_report(

        y_test,

        y_pred

    )
)


# =========================================================
# SAVE MODEL
# =========================================================

joblib.dump(

    pipeline,

    MODEL_PATH

)


# =========================================================
# SAVE FEATURE COLUMNS
# =========================================================

joblib.dump(

    features,

    FEATURE_COLUMNS_PATH

)


# =========================================================
# SAVE SCALER
# =========================================================

# Scaling is already handled by the pipeline.
# This separate scaler is saved because the backend expects it.

scaler = StandardScaler()

scaler.fit(
    df[numerical_features]
)

joblib.dump(

    scaler,

    SCALER_PATH

)


# =========================================================
# VERIFY
# =========================================================

trained_model = pipeline.named_steps[
    "classifier"
]

print("\nModel classes:")

print(
    trained_model.classes_
)


# =========================================================
# VERIFY FILES
# =========================================================

print("\n===================================")
print("CHECKING SAVED FILES")
print("===================================")

print(
    "trained_model.pkl:",
    os.path.exists(MODEL_PATH)
)

print(
    "feature_columns.pkl:",
    os.path.exists(FEATURE_COLUMNS_PATH)
)

print(
    "scaler.pkl:",
    os.path.exists(SCALER_PATH)
)


# =========================================================
# FINAL
# =========================================================

print("\n===================================")
print("MODEL SAVED SUCCESSFULLY")
print("===================================")

print(
    "Model:",
    MODEL_PATH
)

print(
    "Feature columns:",
    FEATURE_COLUMNS_PATH
)

print(
    "Scaler:",
    SCALER_PATH
)

print("\n===================================")
print("TRAINING COMPLETED")
print("===================================")