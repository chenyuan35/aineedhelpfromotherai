# Phone PH/TR/AE/VN batch-J identity / provenance reconciliation — 2026-09-29

Scope: `ph-tr-ae-vn-directory-batch-j.json` only. Publication/indexability is out of scope.

## Result

**PASS / four exact-parity backstage HOLD migrations.** Canonical becomes 49 routes / 27 markets / 46 brands / 32 networks / 167 sources. Comparison remains 135 routes; overlap becomes 38 and legacy-only becomes 97. Explicit indexability remains 3.

## Route decisions

### Globe Prepaid — `globe-prepaid-1yr-2026`

The old “~PHP10/year for a foreign user” framing was materially misleading. Current Globe terms still contain a one-year regular-load rule for ordinary registered prepaid lines, but foreign tourists are explicitly different: tourist SIM/eSIM registration automatically expires after 30 days. Globe also confirms free incoming texts while prepaid roaming is active. Decision: **HOLD** for the target foreign-user long-term retention job; use the 30-day tourist cap, not the ordinary one-year load rule.

Sources: `https://www.globe.com.ph/prepaid/sim-terms`, `https://www.globe.com.ph/prepaid/local-esim-terms`, `https://www.globe.com.ph/help/sim-registration-act`, `https://www.globe.com.ph/help/international/prepaid-roaming`.

### Turkcell Tourist SIM — `turkcell-tourist-90d-blocker-2026`

The route ID is legacy, but the old fixed 90-day passport/YKN shutdown rule is no longer current. BTK Decision 2026/IK-THD/125 removed the old technical clauses effective 2026-06-25. Current Turkcell Tourist SIM supports passport-based online application and eSIM self-activation with biometric-passport/NFC/liveness checks, but activation/use remains Türkiye-centered and a current long-term inactivity/number-retention rule plus overseas OTP path was not established. Decision: **HOLD / avoid-route**, explicitly marking the historical 90-day blocker as repealed rather than repeating it as current fact.

Sources: `https://www.turkcell.com.tr/prepaid-tourist-sim-turkey`, `https://www.btk.gov.tr/kurul-kararlari` (Decision 2026/IK-THD/125).

### du Tourist/Prepaid — `du-prepaid-ae-2026`

Current du material establishes a 90-day Tourist SIM. du support documents an AED5 renewal/extension action during the 90-day validity, but this is not evidence of an indefinitely repeatable annual keep-number route. Tourist identity is tied to valid UAE visitor documentation and long-term overseas OTP evidence is missing. Decision: **HOLD**.

Sources: `https://www.du.ae/personal/mobile/prepaid-plans/tourist-sim/plan-details/plan-information`, `https://www.du.ae/support-articledetail?artid=PROD-8773&lang=en-GB&userType=business&version=2.0`, `https://www.du.ae/support-articledetail?artid=PROD-89276&lang=en-GB&userType=business&version=2.0`.

### Viettel VTVANG — `viettel-vtvang-keepnumber-2026`

A current February-2026 Viettel specialist source reports VTVANG at VND50,000 for 12 months of number retention on eligible prepaid lines. A first-party VTVANG product page was not located in this review, so the keep product remains specialist-reported. Current Viettel first-party guidance also shows stronger subscriber identity enforcement and confirms roaming must be active to receive OTP while abroad. Foreign-user acquisition/KYC and independent long-term OTP reliability remain unresolved. Decision: **HOLD**.

Sources: `https://3gviettel.com.vn/gia-tang-thoi-gian-giu-sim-viettel-voi-goi-vt-vang.html`, `https://www.vietteltelecom.vn/tin-tuc/chi-tiet/thong-bao-thue-bao-viettel-bi-chan-do-chua-xac-thuc-thong-tin-huong-dan-cach-xu-ly/15333972`.

## Migration / publication boundary

All four reviewed rows reproduce the corrected comparison rows by exact generic-adapter deep equality. No route was promoted, no standalone route/market page was created, no sitemap/indexability state changed, and the 135-route comparison surface remains authoritative.

Next bounded cohort: `ie-pl-pt-hr-directory-batch-k.json` only.
