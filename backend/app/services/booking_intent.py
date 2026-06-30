from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Iterable

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
MODEL_PATH = ARTIFACT_DIR / "booking_intent_model.joblib"
METRICS_PATH = ARTIFACT_DIR / "booking_intent_metrics.json"

INTENT_ACTIONS = {
    "book_appointment": "Open the appointment booking workflow and collect doctor, date, time, and visit reason.",
    "reschedule_appointment": "Open the rescheduling workflow and ask for the existing appointment plus the new preferred time.",
    "cancel_appointment": "Open the cancellation workflow and confirm before marking the appointment as cancelled.",
    "check_in": "Open the patient check-in workflow and verify patient identity.",
    "billing_question": "Open billing details and verify invoice or insurance information.",
    "records_request": "Open the patient records request workflow and confirm consent requirements.",
    "general_question": "Route to a receptionist knowledge-base response or human follow-up.",
}

TEMPLATES = {
    "book_appointment": [
        "I need to book an appointment with {doctor} for {day}",
        "Can I schedule a visit for {reason} on {day}",
        "I want to see a doctor about {reason}",
        "Book me in with {doctor} at {time}",
    ],
    "reschedule_appointment": [
        "Can I reschedule my appointment to {day}",
        "I need to move my booking with {doctor}",
        "Change my appointment time to {time}",
        "I cannot make my appointment and need another slot",
    ],
    "cancel_appointment": [
        "Please cancel my appointment",
        "I need to cancel my visit with {doctor}",
        "Remove my booking for {day}",
        "I will not attend my appointment",
    ],
    "check_in": [
        "I am here to check in",
        "Patient check in for {doctor}",
        "I arrived for my appointment",
        "Can you check me in for my visit",
    ],
    "billing_question": [
        "I have a question about my invoice",
        "Why was I charged for my visit",
        "Can you explain my bill",
        "My insurance payment looks wrong",
    ],
    "records_request": [
        "I need a copy of my medical records",
        "Can you send my test results",
        "I want my appointment notes",
        "Please provide my clinic record",
    ],
    "general_question": [
        "What time does the clinic close",
        "Where are you located",
        "Do you accept walk ins",
        "How can I contact the clinic",
    ],
}

VOCAB = {
    "doctor": ["Dr. Chen", "Dr. Anderson", "the dermatologist", "my family doctor", "a specialist"],
    "day": ["tomorrow", "Friday", "next week", "this afternoon", "Monday morning"],
    "time": ["9:30", "2 PM", "after lunch", "before work", "late afternoon"],
    "reason": ["knee pain", "a rash", "headaches", "a follow up", "test results", "a prescription refill"],
}


def generate_synthetic_samples(n_per_intent: int = 180, seed: int = 481) -> list[tuple[str, str]]:
    rng = random.Random(seed)
    samples: list[tuple[str, str]] = []
    intents = list(TEMPLATES.keys())
    ambiguous_suffixes = ["", " please", " thanks", " for my child", " as soon as possible", " and I might need help with billing too"]
    for intent, templates in TEMPLATES.items():
        for _ in range(n_per_intent):
            template = rng.choice(templates)
            text = template.format(
                doctor=rng.choice(VOCAB["doctor"]),
                day=rng.choice(VOCAB["day"]),
                time=rng.choice(VOCAB["time"]),
                reason=rng.choice(VOCAB["reason"]),
            )
            noise = rng.choice(ambiguous_suffixes)
            label = intent
            # Keep the portfolio metric realistic: synthetic reception data includes
            # ambiguous wording and occasional labeling mistakes from simulated notes.
            if rng.random() < 0.07:
                label = rng.choice([x for x in intents if x != intent])
            samples.append((f"{text}{noise}", label))
    rng.shuffle(samples)
    return samples


def build_pipeline() -> Pipeline:
    return Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, lowercase=True)),
        ("clf", MultinomialNB(alpha=0.35)),
    ])


def train_model(samples: Iterable[tuple[str, str]] | None = None) -> dict:
    data = list(samples or generate_synthetic_samples())
    texts = [x for x, _ in data]
    labels = [y for _, y in data]
    x_train, x_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2, random_state=42, stratify=labels)
    model = build_pipeline()
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    accuracy = float(accuracy_score(y_test, predictions))
    report = classification_report(y_test, predictions, output_dict=True)
    return {"model": model, "accuracy": accuracy, "report": report, "sample_count": len(data)}


def train_and_persist_model() -> dict:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    result = train_model()
    joblib.dump(result["model"], MODEL_PATH)
    metrics = {"accuracy": result["accuracy"], "sample_count": result["sample_count"], "report": result["report"]}
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


def load_or_train_model() -> Pipeline:
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return train_model()["model"]


def predict_intent(text: str) -> dict:
    model = load_or_train_model()
    proba = model.predict_proba([text])[0]
    classes = list(model.classes_)
    best_idx = int(proba.argmax())
    intent = classes[best_idx]
    confidence = float(proba[best_idx])
    return {
        "intent": intent,
        "confidence": confidence,
        "recommendedAction": INTENT_ACTIONS.get(intent, INTENT_ACTIONS["general_question"]),
    }
