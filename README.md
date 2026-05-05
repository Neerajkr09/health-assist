# Welcome to your Lovable project

🩺 Disease Prediction System 
📌 Overview

This project is a machine learning-based disease prediction system that predicts the top 3 most probable diseases based on user-input symptoms.

It uses multiple classification models and selects the best-performing one based on evaluation metrics.

The system also provides:

📖 Disease description
💊 Medications
🥗 Diet suggestions
🧘 Workout recommendations
⚠️ Precautions
🚀 Features
✅ Predicts Top 3 diseases with probability
✅ Uses multiple ML models:
Random Forest
Naive Bayes
K-Nearest Neighbors (KNN)
Gradient Boosting
✅ Model comparison (Accuracy + Cross-validation)
✅ Data preprocessing & normalization
✅ Clean and structured pipeline
✅ Ready for deployment (pickle model)
📊 Dataset
Contains:
Binary symptom features (0/1)
Disease labels
Preprocessing steps:
Duplicate removal
Missing value handling
Disease normalization
Removal of rare classes

⚠️ Limitation:

No demographic features (age, gender)
No symptom severity
Purely symptom-based prediction
🧠 Models Used
Model	Description
Random Forest	Handles feature interactions
Naive Bayes	Best for binary & independent features
KNN	Distance-based classifier
Gradient Boosting	Ensemble method (limited performance here)
📈 Evaluation Metrics
Accuracy
Cross-validation score
Top-3 Accuracy (important for real-world usage)
🏆 Final Model Selection

👉 Naive Bayes was selected as the final model because:

Best accuracy on dataset
Highest top-3 prediction performance
Works well with binary symptom features
⚠️ Disclaimer (Important)

For security and licensing reasons, the following files are not included in this repository:

❌ Trained model file (disease_model_final.pkl)
❌ Original dataset file (read.csv)

These files may contain:

Proprietary or sensitive data
Large binary artifacts not suitable for version control

👉 To run the project:

Use your own dataset with similar structure
Retrain the model using the provided code pipeline
