# Audit Note — AIPressureWashingExteriorCleaning

Source: `/Users/erolakarsu/projects/_AUDIT/reports/batch_06.md` section #32.

## Original Recommendations

### Gaps — AI Counterparts
- `/equipment-maintenance-predict` (added)
- `/crew-productivity-optimize`
- `/customer-churn-predict` (added)
- `/contract-upsell-opportunity`

### Gaps — Non-AI Features
- Mobile crew app
- Real-time GPS tracking
- Payment processing (Stripe/Square)
- Customer self-service portal
- Accounting integration

### Custom Feature Suggestions
1. Agentic job orchestration (quote→complete→follow-up)
2. Computer vision job estimation
3. Crew mobile companion
4. Seasonal demand forecasting
5. Customer lifecycle optimization

## Implemented (Mechanical)
- `POST /api/ai/equipment-maintenance-predict` — added in `server/routes/ai.js`. Pulls equipment fleet (or single unit), returns next-service windows, at-risk units. Persists to `ai_results`. Listed in `/api/ai` feature index.
- `POST /api/ai/customer-churn-predict` — added in `server/routes/ai.js`. Joins customers/bookings/reviews, returns at-risk customers with churn score + outreach. Persists to `ai_results`. Listed in `/api/ai` feature index.

Both follow the existing `callOpenRouter`/`auth`/`aiRateLimiter`/`ai_results` pattern.

## Backlog (deferred)

### NEEDS-PRODUCT-DECISION
- Crew mobile app (frontend scope is currently 4 pages — major UX undertaking).
- Customer self-service portal.
- `/crew-productivity-optimize` — needs per-crew time/job data model.
- `/contract-upsell-opportunity` — needs contract data shape.

### NEEDS-CREDS / NEW-DEPS
- GPS tracking provider (Samsara, Verizon Connect).
- Stripe/Square payments.
- QuickBooks/FreshBooks accounting integration.

### TOO-RISKY
- Agentic end-to-end orchestration.
- Computer vision job-site estimation.

## Apply pass 3 (frontend)

FE already wired. `client/src/pages/ai/` contains 10 dedicated pages — `QuoteEstimator`, `ChemicalAdvisor`, `WeatherScheduler`, `MarketingGenerator`, `UpsellAdvisor`, `QuoteGenerator`, `RouteOptimizer`, `WeatherSchedule`, `EquipmentMaintenancePredict`, `CustomerChurnPredict` — all imported and routed in `client/src/App.js`. Every backend POST endpoint in `server/routes/ai.js` has a corresponding FE page that uses the shared axios client with Bearer auth. No FE files modified.

## Apply pass 4 (mechanical backlog)

**No new work.** The two remaining `/api/ai/*` items (`/crew-productivity-optimize`, `/contract-upsell-opportunity`) are tagged `NEEDS-PRODUCT-DECISION` in pass-2 (no per-crew time/job model, no contract data shape). All other backlog items are `NEEDS-CREDS` (Samsara/Verizon GPS, Stripe/Square, QuickBooks) or `TOO-RISKY` (agentic orchestration, computer-vision estimation). Per pass-4 constraints (skip credentials / product decisions / risky changes), this project is a no-op for this pass. Pass-2 already implemented `/equipment-maintenance-predict` and `/customer-churn-predict`; FE pages exist for both.
