# QA Automation Technical Assessment

**Framework:** Playwright · TypeScript  
**Systems under test:** [Sauce Demo](https://www.saucedemo.com/) (UI) · [ReqRes](https://reqres.in/) (API)

---

## Prerequisites

| Requirement | Minimum version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Git | any |

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-user>/<your-repo>.git
cd <your-repo>

# 2. Install all dependencies
npm install

# 3. Install Playwright browsers (Chromium only is sufficient for the test suite)
npx playwright install --with-deps chromium

# 4. Configure environment variables
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# SauceDemo UI
SAUCEDEMO_BASE_URL=
SAUCEDEMO_STANDARD_USERNAME=
SAUCEDEMO_STANDARD_PASSWORD=
SAUCEDEMO_LOCKED_USERNAME=
SAUCEDEMO_INVALID_USERNAME=
SAUCEDEMO_INVALID_PASSWORD=

# ReqRes API
REQRES_BASE_URL=
REQRES_VALID_EMAIL=
REQRES_VALID_PASSWORD=
REQRES_API_KEY=

# Checkout form
CHECKOUT_FIRST_NAME=
CHECKOUT_LAST_NAME=
CHECKOUT_POSTAL_CODE=
```

> If `REQRES_API_KEY` is not set, all API tests are skipped automatically.

---

## Running Tests

### Full suite (API + UI in parallel)

```bash
npm test
```

### API tests only

```bash
npm run test:api
```

### UI tests only

```bash
npm run test:ui
```

### Checkout tests only (headed mode)

```bash
npm run test:ui:checkout
```

### UI in headed mode (watch the browser)

```bash
npm run test:headed
```

### Open the HTML report

```bash
npm run test:report
```

---

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions — runs API & UI in parallel
│
├── docs/
│   ├── Part_A_Test_Strategy.docx    # Part A — written test strategy
│   └── Part_C_Troubleshooting.docx  # Part C — troubleshooting write-up
│
├── helpers/
│   ├── apiHeaders.ts                # Builds Authorization headers for ReqRes
│   └── regex.ts                     # Shared regex patterns (e.g. price format)
│
├── pages/                           # Page Object Model
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStepOnePage.ts
│   ├── CheckoutStepTwoPage.ts
│   └── CheckoutCompletePage.ts
│
├── scripts/
│   └── generate-docs.ts             # Generates the Word documents above
│
├── test-data/
│   └── index.ts                     # Centralised test data (users, checkout info)
│
├── tests/
│   ├── api/
│   │   └── reqres.spec.ts           # Part B1 — API tests
│   └── ui/
│       ├── login.spec.ts            # Part B2 — Login positive & negative
│       └── checkout.spec.ts         # Part B2 — E2E checkout flow
│
├── .env.example                     # Environment variable template
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

## Test Suites at a Glance

### API — `tests/api/reqres.spec.ts`

| # | Test | Assertions |
|---|------|-----------|
| 1 | POST /login — valid credentials | 200, token present, non-empty string |
| 2 | POST /login — missing password | 400, `error: "Missing password"`, no token |
| 3 | POST /login — missing email | 400, `error: "Missing email or username"`, no token |
| 4 | GET /users?page=2 — schema & pagination | 200, all user fields typed, email format, avatar URL |

### UI Login — `tests/ui/login.spec.ts`

| # | Scenario | Expected |
|---|----------|---------|
| 1 | Valid credentials | Redirect to `/inventory`, list visible |
| 2 | Invalid username / password | Error on page, URL stays at `/` |
| 3 | Locked-out user | Specific locked-out error message |
| 4 | Empty username | "Username is required" error |
| 5 | Empty password | "Password is required" error |

### UI Checkout — `tests/ui/checkout.spec.ts`

| # | Scenario | Expected |
|---|----------|---------|
| 1 | **E2E happy path** — login → add item → cart → fill info → overview → finish | "Thank you for your order!" confirmation |
| 2 | Empty cart → checkout — submit form empty | "First Name is required" inline error |
| 3 | Add item → checkout — submit form empty | "First Name is required" inline error |

---

## Failure Evidence

On any test failure Playwright automatically captures:

- **Screenshot** — saved to `test-results/`
- **Video** — retained in `test-results/`
- **Trace** — open with `npx playwright show-trace test-results/<trace>.zip`

---

## CI / CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main` or `develop`.

### Jobs

```
test-api ──┐
            ├── all-tests-pass   (merge gate)
test-ui  ──┤
            └── deploy-report    (GitHub Pages)
```

| Job | What it does |
|---|---|
| `test-api` | Runs API suite — no browser install, finishes in < 3 min |
| `test-ui` | Installs Chromium, runs UI suite with parallel workers |
| `all-tests-pass` | Blocks merge if either job fails |
| `deploy-report` | Publishes the Playwright HTML report to GitHub Pages |

### Artifacts uploaded per run

| Artifact | Content | Uploaded when |
|---|---|---|
| `api-test-results` | Full `test-results/` folder | Always |
| `api-junit-report` | `test-results/junit.xml` | Always |
| `ui-playwright-report` | Playwright HTML report | Always |
| `ui-failure-artifacts` | Screenshots + traces | On failure only |

### Live report

After each run the HTML report is published at:

```
https://<your-user>.github.io/<your-repo>/
```

### GitHub Secrets required

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `REQRES_API_KEY` | Your ReqRes API key |
| `SAUCEDEMO_BASE_URL` | `https://www.saucedemo.com` |

