# Relay Exit Risk methodology

Status: production-candidate methodology, version `2026-09-14-v1`.

## What the number means

The Exit Risk Index is a 0–100 evidence index. It is not a calibrated probability that an operator will disappear, commit fraud, become insolvent, or stop service.

The current index combines only observable signals with explicit provenance:

- recent third-party availability measurements;
- pricing-sustainability signals when a source has enough comparable models;
- a recent 90-day community survival score after a minimum sample exists;
- a current non-stale third-party `dead` status as a decisive status signal.

Missing evidence lowers confidence. It is never filled with a synthetic neutral 50.

## Third-party source policy

Prefer explicit open-data feeds or documented public APIs. Store normalized summary fields, source URL, source timestamp, fetch timestamp and daily snapshots rather than cloning a third party's full database.

The first ingested source is Sinan Compute's published `data_v2.json`. Sources whose robots or terms block API collection remain outbound cross-check links unless permission or an approved feed becomes available.

## Freshness and history

Source snapshots older than 36 hours are marked stale and their availability/pricing weights are reduced. A stale `dead` flag cannot force the index to 95.

Daily source snapshots are retained so future versions can use trends rather than only the latest measurement. This follows the same broad engineering principle used by open-source uptime systems such as Gatus and Upptime: repeated observations are more useful when the historical record is durable and auditable.

## Community forecasts

The question is time-bounded: whether the relay will still be operating normally in 90 days. Current aggregation uses only forecasts updated in the last 30 days, so an old forecast does not remain a vote about "90 days from now" forever.

The UI maps `Yes`, `Unsure`, and `No` to 100, 50, and 0 only to form a transparent community survival score. That score is not a probability estimate.

Each submission is also appended to `relay_risk_forecast_events` with its target date while the current-vote table is updated. This preserves an audit trail for later outcome evaluation without double-counting a browser's current vote.

## Calibration roadmap

Do not label the index as a probability until there is enough resolved history to test calibration. Academic work on forecast aggregation shows that simple weighted pooling can be miscalibrated even when component forecasts are individually calibrated.

If a later UI elicits explicit numeric probabilities, evaluate forecaster calibration with proper scoring rules such as the Brier score. Do not apply Brier scoring to the current categorical Yes/Unsure/No choices as if users had supplied probabilities.

Once enough relay lifecycle events exist, estimate empirical survival with right-censoring rather than treating still-operating relays as failures. Kaplan–Meier is an appropriate non-parametric baseline for that future cohort analysis. It is not part of the current index.

## References informing the design

- Gneiting & Ranjan, *Combining Probability Forecasts*, JRSS B (2010): aggregation and recalibration.
- Proper scoring-rule literature, including Brier scoring, for future probability calibration.
- Kaplan–Meier survival analysis for future censored lifecycle data.
- `TwiN/gatus`: repeated active checks, response-time conditions and persisted monitoring history.
- `upptime/upptime`: scheduled uptime checks with durable response-time and incident history.

These references inform architecture and future validation. They are not evidence about any particular relay operator.
