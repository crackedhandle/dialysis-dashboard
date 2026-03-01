\# Dialysis Session Intake \& Anomaly Dashboard — Backend



\## Overview



This backend service provides a minimal but realistic workflow for tracking dialysis sessions and surfacing potentially unsafe clinical situations during a nursing shift.



The system supports:



\- Registering patients with dry weight and demographics

\- Recording dialysis session data (weights, vitals, duration, machine information)

\- Fetching today's schedule per dialysis unit

\- Automatic anomaly detection per session

\- Highlighting patients with potential clinical risk



The design prioritizes clarity, modularity, robustness, and testability over unnecessary complexity.



---



\# Architecture Overview



\## High-Level Flow



Routes → Validation → Services → Models → MongoDB



\## Layer Responsibilities



\### Routes

\- Handle HTTP requests and responses

\- Contain no business logic



\### Validators (Zod)

\- Enforce input shape

\- Prevent malformed data from entering the system



\### Services

\- Contain business rules (anomaly detection)

\- Designed to be pure and testable



\### Models (Mongoose)

\- Define schema and persistence logic



\### Configuration

\- Centralized clinical thresholds

\- No magic numbers inside route handlers



\### Middleware

\- Centralized error handling



This separation ensures another engineer can trace a request clearly from input to persistence.



---



\# Domain Modeling



\## Patient



Fields:

\- firstName

\- lastName

\- age

\- gender

\- dryWeightKg

\- unitId



Represents a chronic dialysis patient assigned to a unit.



---



\## Session



Fields:

\- patientId (reference)

\- unitId

\- scheduledDate

\- startTime

\- endTime

\- preWeightKg

\- postWeightKg

\- systolicBP

\- diastolicBP

\- machineId

\- anomalies (computed and stored)



Anomalies are embedded within the session for efficient retrieval during schedule queries.



---



\## Schedule



Fields:

\- patientId

\- unitId

\- date

\- status (not\_started | in\_progress | completed)



Schedule is modeled separately to allow shift planning independent of session creation.



---



\# Anomaly Detection



Anomaly detection is implemented in:



src/services/anomaly.service.ts



Thresholds are centralized in:



src/config/clinical.config.ts



All thresholds are configurable and not hardcoded inside route handlers.



---



\# Clinical Assumptions and Trade-offs



The assignment intentionally leaves clinical definitions ambiguous. The following assumptions were made:



\## Excess Interdialytic Weight Gain



Threshold: Greater than 5 percent of dry weight.



Reasoning:

\- Clinically, more than 5 percent weight gain between sessions is often concerning.

\- Percentage-based threshold normalizes risk across patients of different sizes.



Trade-off:

\- Percentage used instead of fixed kilogram threshold for better personalization.



---



\## High Post-Dialysis Systolic Blood Pressure



Threshold: Greater than 160 mmHg.



Reasoning:

\- Post-dialysis systolic BP above 160 mmHg may indicate cardiovascular strain or inadequate fluid removal.



Trade-off:

\- Only systolic evaluated for simplicity.

\- Diastolic thresholds could be added in a future iteration.



---



\## Abnormal Session Duration



Target duration: 240 minutes (4 hours)



Flag conditions:

\- Less than 180 minutes (too short)

\- Greater than 300 minutes (too long)



Reasoning:

\- Standard dialysis sessions typically last approximately 4 hours.

\- Significant deviation may indicate early termination or complications.



Trade-off:

\- Duration computed from timestamps instead of accepting manual duration input to ensure consistency.



---



\# Robustness and Error Handling



\- Zod validation prevents malformed input.

\- Centralized error middleware standardizes error responses.

\- Missing or invalid fields return HTTP 400.

\- Anomaly detection safely handles undefined values.

\- Schedule query optimized to avoid N+1 database queries.



---



\# Testing Strategy



\## Unit Test



File:

tests/anomaly.test.ts



Covers:

\- Exact threshold behavior

\- Above-threshold detection

\- Abnormal duration detection



---



\## API Integration Test



File:

tests/schedule.api.test.ts



Verifies:

\- GET /schedule/today returns 200

\- Patients array exists

\- At least one patient is flagged with anomalies



This ensures both business logic and HTTP integration are functioning correctly.



---



\# Database Design Decisions



\## Referencing vs Embedding



\- Sessions reference patients (normalized design).

\- Schedule references patients.

\- Anomalies embedded inside sessions.



Reasoning:

\- Sessions are independent records.

\- Anomalies belong strictly to session context.

\- Embedding avoids recomputation during schedule retrieval.



Common filters:

\- unitId

\- scheduledDate

\- date



---



\# Setup Instructions



\## Install Dependencies



npm install



---



\## Configure Environment



Create a `.env` file:



PORT=5000  

MONGO\_URI=your\_mongodb\_connection\_string  



---



\## Seed Database



npm run seed



---



\## Start Development Server



npm run dev



Server runs at:



http://localhost:5000



---



\# API Endpoints



Register Patient  

POST /patients



Create Session  

POST /sessions



Create Schedule Entry  

POST /schedule



Get Today’s Schedule  

GET /schedule/today?unitId=U1



Health Check  

GET /health



---



\# Known Limitations



\- No authentication

\- No pagination

\- Timezone assumptions based on server

\- No historical anomaly trend analysis

\- No OpenAPI documentation yet



---



\# Future Improvements



\- Add severity scoring for anomalies

\- Add nurse edit audit trail

\- Add OpenAPI documentation

\- Add pagination and filtering

\- Add transactional consistency between schedule and session



---



\# AI Usage Disclosure



AI tools were used for:



\- Boilerplate generation

\- Architecture brainstorming

\- Debugging workflow refinement



All business rules, thresholds, and architectural decisions were manually reviewed and adjusted.



Example refinement:

\- Adjusted session-to-schedule matching logic after identifying ObjectId mismatch caused by populate.



All final code was reviewed for correctness and consistency.



---



\# Design Philosophy



The objective was to:



\- Build the smallest working slice first

\- Make ambiguity explicit

\- Encode assumptions in configuration

\- Keep code modular and testable

\- Avoid over-engineering



Clarity and maintainability were prioritized over complexity.

