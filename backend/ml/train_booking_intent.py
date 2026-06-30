from pathlib import Path
import csv
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from app.services.booking_intent import generate_synthetic_samples, train_and_persist_model

if __name__ == "__main__":
    samples = generate_synthetic_samples()
    out_csv = Path(__file__).resolve().parent / "synthetic_booking_requests.csv"
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["text", "intent"])
        writer.writerows(samples)
    metrics = train_and_persist_model()
    print(f"Generated {len(samples)} synthetic samples at {out_csv}")
    print(f"Validation accuracy: {metrics['accuracy']:.3f}")
