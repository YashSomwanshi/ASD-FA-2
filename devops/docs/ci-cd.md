# CI/CD Documentation — ShopEasy Angular Frontend

> This document describes the GitHub Actions CI/CD pipeline for the
> **ShopEasy** Angular 17 e-commerce frontend project.

---

## Table of Contents

1. [Project Configuration Summary](#1-project-configuration-summary)
2. [PR Pipeline — `pr.yml`](#2-pr-pipeline--pryml)
3. [Main Pipeline — `main.yml`](#3-main-pipeline--mainyml)
4. [Running Checks Locally](#4-running-checks-locally)
5. [Required GitHub Secrets](#5-required-github-secrets)
6. [Deployment](#6-deployment)
7. [Recommended Branch Protection Rules](#7-recommended-branch-protection-rules)
8. [Assumptions & Design Decisions](#8-assumptions--design-decisions)

---

## 1. Project Configuration Summary

| Property            | Value                                                      |
|---------------------|------------------------------------------------------------|
| **Angular version** | 17.3.x                                                     |
| **Node.js version** | 20 LTS (minimum 18.13 required by Angular 17)              |
| **Package manager** | npm (lockfile version 3, `package-lock.json`)              |
| **Test framework**  | Karma 6.4 + Jasmine 5.1 (headless Chrome in CI)           |
| **Linting**         | No ESLint configured — Angular CLI lint target not present |
| **Formatting**      | No Prettier configured — `.editorconfig` is the style ref |
| **Component style** | Standalone components (`bootstrapApplication` pattern)     |
| **Build output**    | `frontend/dist/frontend/`                                  |
| **Deployment**      | None configured — placeholder in `main.yml`                |

---

## 2. PR Pipeline — `pr.yml`

**Trigger**: Any Pull Request targeting `main` that modifies `frontend/**`.

### Jobs

| Job | Purpose | Fails CI if… |
|-----|---------|--------------|
| **Install Dependencies** | Runs `npm ci` and saves `node_modules` to the cache | `npm ci` fails (lockfile mismatch, registry error) |
| **Unit Tests** | Runs Karma/Jasmine tests in ChromeHeadless | Any test fails |
| **Production Build** | Runs `ng build` in production mode | TypeScript errors, budget violations, compiler errors |
| **Dependency Security Audit** | Runs `npm audit --audit-level=high --omit=dev` | Any **high** or **critical** vulnerability in production deps |
| **GitHub Dependency Review** | Scans PR diff for newly introduced vulnerable packages | Any **high+** severity package is introduced |
| **CodeQL Security Analysis** | Static analysis of JS/TS source for security vulnerabilities | CodeQL finds a security issue |

### Artifacts Produced

- `pr-coverage-report` — Karma code coverage HTML report (retained 14 days)

---

## 3. Main Pipeline — `main.yml`

**Trigger**: Any push/merge to `main` that modifies `frontend/**`.

### Jobs

| Job | Purpose | Depends on |
|-----|---------|------------|
| **Install Dependencies** | `npm ci` + cache `node_modules` | — |
| **Unit Tests** | ChromeHeadless Karma tests | Install |
| **Dependency Security Audit** | `npm audit --audit-level=high` | Install |
| **Production Build** | `ng build` (production) + upload artifact | Tests + Audit |
| **CodeQL Security Analysis** | Full JS/TS static analysis | — (parallel) |
| **Deploy (Placeholder)** | Not active — see §6 | Build |

### Artifacts Produced

- `shopeasy-production-build-<git-sha>` — Compiled `dist/frontend/` directory (retained 30 days)
- `main-coverage-report` — Karma code coverage report (retained 30 days)

---

## 4. Running Checks Locally

Use these commands from inside the `frontend/` directory to replicate what CI does.

### Prerequisites

```bash
# Node.js 20 LTS must be installed.
node --version   # should print v20.x.x
npm --version    # should print 10.x.x
```

### Install dependencies

```bash
cd frontend
npm ci
```

### Run unit tests (standard, with browser window)

```bash
npm test
```

### Run unit tests (CI-equivalent: headless, single run)

```bash
npm test -- --watch=false --browsers=ChromeHeadless --no-progress
```

> **Note**: ChromeHeadless requires Google Chrome or Chromium to be installed locally.
> On Ubuntu: `sudo apt-get install -y chromium-browser`
> On macOS: Chrome is installed via the standard `.dmg`.

### Build for production

```bash
npm run build
# Output will be in: frontend/dist/frontend/
```

### Security audit

```bash
# Check only production dependencies, fail on high+
npm audit --audit-level=high --omit=dev

# Full audit (including devDependencies) — informational only
npm audit
```

### TypeScript compiler check (without building)

```bash
npx tsc --noEmit
```

---

## 5. Required GitHub Secrets

> These must be added under:
> **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

### Always Required

| Secret | Description | Required for |
|--------|-------------|--------------|
| *(none)* | The basic CI pipeline uses only `GITHUB_TOKEN` which is automatically available. | PR checks, build, CodeQL |

### Deployment Secrets (choose one provider)

#### Firebase Hosting

| Secret | Description |
|--------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | JSON key for a Firebase service account with Hosting deploy permission |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID (e.g. `shopeasy-prod`) |

#### AWS S3 + CloudFront

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key with S3 write + CloudFront invalidation permissions |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `AWS_S3_BUCKET` | Target S3 bucket name (e.g. `shopeasy-frontend-prod`) |
| `AWS_CLOUDFRONT_DIST_ID` | CloudFront distribution ID for cache invalidation |
| `AWS_REGION` | AWS region (e.g. `ap-south-1`) |

#### Vercel

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

#### GitHub Pages

No additional secrets required — deployment uses the automatic `GITHUB_TOKEN`.
Requires enabling GitHub Pages in repository settings (source: GitHub Actions).

---

## 6. Deployment

### Current Status

**Deployment is not yet configured.** The `deploy` job in `main.yml` is defined but disabled (`if: false`) as a clearly marked placeholder.

### How to Enable Deployment

1. **Choose a hosting provider** (Firebase, AWS S3, Vercel, GitHub Pages, etc.)
2. **Add the required GitHub Secrets** listed in §5.
3. **Edit `main.yml`**: Remove the `if: false` line from the `deploy` job and uncomment the relevant deployment option block.
4. **Configure `base-href`** if the app is deployed to a sub-path:
   ```bash
   npm run build -- --base-href="/your-sub-path/"
   ```
5. **Create a `production` GitHub Environment** under Settings → Environments with any required approval gates.

### Angular Build Artifact

The compiled Angular app (`dist/frontend/`) is a set of static files that can be served by any static hosting service. The artifact is attached to every successful `main` run as:

```
shopeasy-production-build-<git-sha>
```

It can be downloaded from the GitHub Actions run summary page or consumed by the `deploy` job.

---

## 7. Recommended Branch Protection Rules

> Configure these under:
> **GitHub Repository → Settings → Branches → Add branch protection rule → Branch name pattern: `main`**

### Recommended Settings

| Setting | Value | Reason |
|---------|-------|--------|
| **Require a pull request before merging** | ✅ Enabled | Prevents direct pushes to main |
| **Require approvals** | 1+ approvers | Four-eyes principle |
| **Dismiss stale pull request approvals when new commits are pushed** | ✅ Enabled | Forces re-review after updates |
| **Require status checks to pass before merging** | ✅ Enabled | Gates merges on CI results |
| **Require branches to be up to date before merging** | ✅ Enabled | Prevents integration bugs |
| **Do not allow bypassing the above settings** | ✅ Enabled | Applies to admins too |
| **Restrict who can push to matching branches** | Configure as needed | Limits who can merge |

### Required Status Checks

Add these as **required** status checks (the exact job names as they appear in GitHub):

| Status Check Name | Why Required |
|-------------------|--------------|
| `Unit Tests` | Prevents broken code from merging |
| `Production Build` | Ensures the app compiles and meets bundle budgets |
| `Dependency Security Audit` | Blocks high/critical vulnerabilities |
| `GitHub Dependency Review` | Blocks newly introduced vulnerable packages |
| `CodeQL Security Analysis` | Static security analysis |

> **Note**: ESLint and Prettier checks are **not** required because this project does not currently have ESLint or Prettier configured. If they are added later, include `Lint` and `Format Check` as required status checks.

---

## 8. Assumptions & Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Node 20 LTS** chosen | Angular 17 requires Node ≥ 18.13. Node 20 LTS is the most recent LTS fully compatible with Angular 17 and has long-term support. |
| **No ESLint step added** | `@angular-eslint` is not in `devDependencies` and there is no `lint` script in `package.json`. Adding ESLint without configuration would be a false check. |
| **No Prettier step added** | Prettier is not installed or configured in the project. The `.editorconfig` file defines style rules but is enforced by editors, not CI. |
| **`npm audit --omit=dev`** | Dev-only packages (Karma, Jasmine, TypeScript) are not shipped to users. Only production dependency vulnerabilities gate CI. |
| **`--audit-level=high`** | `moderate` vulnerabilities in Angular toolchain are common and often unfixable without upgrading the framework itself. `high`/`critical` are actionable. |
| **`ChromeHeadless` for Karma** | `karma-chrome-launcher` is already a devDependency. GitHub-hosted runners include Chromium. No extra setup is required. |
| **Workflow path filter** | `paths: frontend/**` ensures the CI only triggers when frontend code changes, not on unrelated root-level changes. |
| **Deployment placeholder disabled** | No deployment provider credentials or configuration exist in this repository. Leaving a live-but-failing deploy step would block every merge. |
| **`node_modules` cache strategy** | The cache key is the hash of `package-lock.json`. An exact match restores the cache; a miss triggers a fresh `npm ci`. This avoids stale dependencies. |
| **`lockfileVersion: 3`** | Confirms npm 7+ is in use. `npm ci` with lockfile v3 is deterministic and appropriate for CI. |
| **Workflows placed in `.github/workflows/`** | GitHub Actions only recognises workflows in `.github/workflows/` at the repository root. The `devops/` folder contains the documentation. The actual `.yml` files must live in `.github/workflows/`. |
