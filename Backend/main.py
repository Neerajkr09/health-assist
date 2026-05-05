
# # #uvicorn main:app --reload --port 8000
#python -m uvicorn main:app --reload --port 8000

from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from difflib import get_close_matches

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API working"}

# ---------------------------
# Load Model
# ---------------------------
with open("disease_model2.pkl", "rb") as f:
    data = pickle.load(f)

model = data["model"]
symptoms_dict = data["symptoms_dict"]
diseases_list = data["diseases_list"]

# ---------------------------
# Request Schema
# ---------------------------
class SymptomsRequest(BaseModel):
    symptoms: str

# ---------------------------
# Load Extra Data - FINAL FIXED VERSION
# ---------------------------
print("=== LOADING disease-desc.csv ===")

# Read the file without assuming header or structure
desc_df = pd.read_csv("disease-desc.csv", encoding='utf-8-sig', dtype=str, header=None)

print("Raw Shape:", desc_df.shape)
print("First 5 Raw Rows:\n", desc_df.head())

# Handle different possible structures
if desc_df.shape[1] == 1:
    # Data is in single column - split by first comma
    print("Single column detected - splitting by comma...")
    desc_df = desc_df[0].str.split(',', n=1, expand=True)
    desc_df.columns = ['diseases', 'description']
elif desc_df.shape[1] >= 2:
    desc_df = desc_df.iloc[:, :2]
    desc_df.columns = ['diseases', 'description']

# Clean the data
desc_df['diseases'] = desc_df['diseases'].astype(str).str.strip().str.lower()
desc_df['description'] = desc_df['description'].astype(str).str.strip()

# Remove invalid rows
desc_df = desc_df[
    desc_df['diseases'].notna() &
    (desc_df['diseases'] != 'nan') &
    (desc_df['diseases'] != '') &
    (desc_df['diseases'] != 'diseases') &
    desc_df['description'].notna() &
    (desc_df['description'] != 'nan') &
    (desc_df['description'] != '')
].reset_index(drop=True)

print("\n✅ Final desc_df after cleaning:")
print("First 10 diseases:", desc_df['diseases'].head(10).tolist())
print(f"Total valid diseases loaded: {len(desc_df)}")
print("Sample description (first one):", desc_df['description'].iloc[0][:100] + "..." if not desc_df.empty else "None")
print("=== desc_df LOADING COMPLETED ===\n")

# Load other CSV files
diet_df = pd.read_csv("disease-diet.csv")
med_df = pd.read_csv("disease-medi.csv")
prec_df = pd.read_csv("disease-precaution.csv")
work_df = pd.read_csv("disease-workout.csv")

# Clean disease column in other files
for df in [diet_df, med_df, prec_df, work_df]:
    if 'diseases' in df.columns:
        df['diseases'] = df['diseases'].astype(str).str.strip().str.lower()

# ---------------------------
# Helper Function
# ---------------------------
def helper(disease: str):
    disease = str(disease).strip().lower()
    
    print(f"\n=== HELPER DEBUG ===")
    print(f"Searching for: {repr(disease)}")
    print(f"Total rows in desc_df: {len(desc_df)}")

    # Get Description
    def get_description():
        if len(desc_df) == 0:
            print("❌ desc_df is empty! Using fallback.")
            return "Detailed description for this disease is not available at the moment."

        # Exact match
        match = desc_df[desc_df['diseases'] == disease]
        if not match.empty:
            print("✅ Exact match found")
            return str(match['description'].iloc[0]).strip()

        # Partial match
        match = desc_df[desc_df['diseases'].str.contains(disease, case=False, na=False)]
        if not match.empty:
            print(f"✅ Partial match found: {match['diseases'].iloc[0]}")
            return str(match['description'].iloc[0]).strip()

        # Fuzzy match as last resort
        all_diseases = desc_df['diseases'].tolist()
        close = get_close_matches(disease, all_diseases, n=3, cutoff=0.6)
        if close:
            best = close[0]
            match = desc_df[desc_df['diseases'] == best]
            if not match.empty:
                print(f"✅ Using closest match: {best}")
                return str(match['description'].iloc[0]).strip()

        print("❌ No match found. Using fallback.")
        return "Detailed description for this disease is not available at the moment."

    desc = get_description()

    # Get other lists (precautions, medicines, diet, workout)
    def get_list(df, col_name):
        if df is None or len(df) == 0:
            return []
        match = df[df['diseases'] == disease]
        if match.empty:
            match = df[df['diseases'].str.contains(disease, case=False, na=False)]
        if not match.empty:
            value = match.iloc[0].get(col_name)
            if pd.notna(value) and str(value).strip():
                return [x.strip() for x in str(value).split(",") if x.strip()]
        return []

    pre     = get_list(prec_df, 'precautions')
    med     = get_list(med_df, 'medication')
    diet    = get_list(diet_df, 'diet')
    workout = get_list(work_df, 'workout')

    print(f"Description length: {len(desc)} characters")
    print("=== HELPER DEBUG END ===\n")

    return desc, pre, med, diet, workout

# ---------------------------
# Predict Endpoint
# ---------------------------
@app.post("/predict")
def predict(request: SymptomsRequest):
    try:
        symptoms_input = [s.strip() for s in request.symptoms.split(",") if s.strip()]

        if len(symptoms_input) < 3:
            return {"error": "Please provide at least 3 symptoms"}

        input_vector = np.zeros(len(symptoms_dict))
        for symptom in symptoms_input:
            if symptom in symptoms_dict:
                input_vector[symptoms_dict[symptom]] = 1

        input_df = pd.DataFrame([input_vector], columns=list(symptoms_dict.keys()))

        probs = model.predict_proba(input_df)[0]
        top3_idx = np.argsort(probs)[-3:][::-1]

        top_predictions = [
            {"rank": rank, "disease": diseases_list[idx], "probability": round(float(probs[idx]), 3)}
            for rank, idx in enumerate(top3_idx, start=1)
        ]

        # Top 1 disease
        top_disease = diseases_list[top3_idx[0]].strip()
        top_disease_lower = top_disease.lower()

        print(f"Top predicted disease: {top_disease} (searching as: {top_disease_lower})")

        desc, pre, med, diet, workout = helper(top_disease_lower)

        primary_details = {
            "disease": top_disease,
            "description": desc,
            "precautions": pre,
            "medications": med,
            "diet": diet,
            "workout": workout
        }

        # Debug print
        print("=== FINAL RESPONSE TO FRONTEND ===")
        print({
            "description_found": len(desc) > 20,
            "description_length": len(desc),
            "precautions_count": len(pre),
            "medications_count": len(med)
        })
        print("=================================\n")

        return {
            "top_predictions": top_predictions,
            "primary_details": primary_details
        }

    except Exception as e:
        return {"error": str(e)}