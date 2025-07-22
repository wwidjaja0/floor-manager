# Development Journal and Changelog by wwidjaja0

## Table of Contents

- [Development Journal and Changelog by wwidjaja0](#development-journal-and-changelog-by-wwidjaja0)
  - [Table of Contents](#table-of-contents)
  - [July 2025](#july-2025)
    - [7.7.25](#7725)
    - [7.9.25](#7925)
    - [7.21.25](#72125)

## July 2025

### 7.7.25

- Project setup and design documents drafted.
  - Initialized README and CONTRIBUTING files.
  - Created initial project structure.
- Came up with basic features.
  - Table Management
  - Ledger Management
  - External Linking
- Initialized .env and added required JS packages.

### 7.9.25

How will we keep hosts accountable for payments? These are proposed (Preventative Solutions ONLY).

- Link Venmo + Verify Payments in-house
- Security Deposit
- Digital Signed Contract
- Require Other Information as Collateral before Hosting
- When game ends, regular pings made to host until verified payments are made

- Fleshed out README and CONTRIBUTING files.
  - Added detailed setup instructions.
  - Cleaned up formatting and consistency.
- Refined design document.
  - Added sections for user personas and flow diagrams.
  - Continued documenting planned features and got project ready for ADRs writeups.
- Removed `/.vscode/` from git tracking.
- Figured out which permissions our Discord bot needs.
- Should we use Stripe for gov ID verification?

Next TODOs:

- [x] Figure out what Database to use and update CONTRIBUTING.md with setup instructions.
- [x] Create User Personas and User Flow Diagrams.
- [ ] Create ADRs for features.

### 7.21.25

- Finished the design document and decided to remove ADRs for the sake of simplicity.
- Settled on using Firebase Functions and Firestore for the bot's hosting and backend respectively.
- Figured out that this will likely be a serverless architecture.

Next TODOs:

- [ ] Read up on documentation to figure out how Firebase and Firestore work.
- [x] Setup repository on GitHub to get ready to push code.
  - [x] Create branches: main for production and dev for development.
  - [x] Create a pull request template.
  - [x] Create a issues template.
  - [x] Set up GitHub Actions for CI/CD.
    - [x] Set up Prettier for code formatting.
    - [x] Set up testing framework (e.g., Jest) for unit tests.

### 7.22.25

- Created a pull request template and issues template.
- Setup a package.json and package-lock.json.
- Added Jest and Prettier as dev dependencies.
- Created dev branch.
