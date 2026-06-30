# ML Model Card — Booking Intent Classifier

## Purpose

The booking-intent model classifies front-desk phone/chat requests into operational intents so Healo can route reception workflows faster.

## Model

- Pipeline: `TfidfVectorizer` + `MultinomialNB`
- Library: scikit-learn
- Training data: generated synthetic clinic request samples
- Sample count: 1,200+

## Intents

- `book_appointment`
- `reschedule_appointment`
- `cancel_appointment`
- `check_in`
- `billing_question`
- `records_request`
- `general_question`

## Example inputs

```txt
I need to book an appointment with a doctor for tomorrow morning.
Can I move my appointment with Dr. Chen to next Friday?
I have a question about the invoice from my last visit.
```

## Why Naïve Bayes?

Naïve Bayes is fast, transparent, and appropriate as an early baseline for short receptionist-style utterances. It is easy to train, easy to explain in interviews, and strong enough for a credible placeholder while the real product evolves.

## Limitations

- Synthetic data can overestimate performance.
- The classifier should be used as an assistant, not the final decision maker.
- Real clinic deployment would require consent, privacy review, human override, PHI handling, and monitoring for false positives.

## Next improvements

- Replace synthetic data with de-identified real utterances.
- Add confidence thresholds and fallback to human receptionist.
- Add entity extraction for doctor, date, time, patient, and appointment type.
- Evaluate latency, precision/recall per intent, and failure modes.
