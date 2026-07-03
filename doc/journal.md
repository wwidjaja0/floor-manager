# development journal and changelog by wwidjaja0

## table of contents

- [development journal and changelog by wwidjaja0](#development-journal-and-changelog-by-wwidjaja0)
  - [table of contents](#table-of-contents)
  - [july 2025](#july-2025)
    - [7.7.25](#7725)
    - [7.9.25](#7925)
    - [7.21.25](#72125)
    - [7.22.25](#72225)
  - [july 2026](#july-2026)
    - [7.3.26](#7326)

## july 2025

### 7.7.25

- project setup and design documents drafted
  - initialized readme and contributing files
  - created initial project structure
- came up with basic features
  - table management
  - ledger management
  - external linking
- initialized env and added required js packages

### 7.9.25

how will we keep hosts accountable for payments? these are proposed (preventative solutions only)

- link venmo + verify payments in-house
- security deposit
- digital signed contract
- require other information as collateral before hosting
- when game ends, regular pings made to host until verified payments are made

- fleshed out readme and contributing files
  - added detailed setup instructions
  - cleaned up formatting and consistency
- refined design document
  - added sections for user personas and flow diagrams
  - continued documenting planned features and got project ready for adrs writeups
- removed `/.vscode/` from git tracking
- figured out which permissions our discord bot needs
- should we use stripe for gov id verification?

next todos:

- [x] figure out what database to use and update contributing md with setup instructions
- [x] create user personas and user flow diagrams
- [ ] create adrs for features

### 7.21.25

- finished the design document and decided to remove adrs for the sake of simplicity
- settled on using firebase functions and firestore for the bot's hosting and backend respectively
- figured out that this will likely be a serverless architecture

next todos:

- [ ] read up on documentation to figure out how firebase and firestore work
- [x] setup repository on github to get ready to push code
  - [x] create branches: main for production and dev for development
  - [x] create a pull request template
  - [x] create a issues template
  - [x] set up github actions for ci/cd
    - [x] set up prettier for code formatting
    - [x] set up testing framework (eg jest) for unit tests

### 7.22.25

- created a pull request template and issues template
- setup a packagejson and package-lockjson
- added jest and prettier as dev dependencies
- created dev branch

## july 2026

### 7.3.26

- added a codeowners file to the repo
- cleaned up documentation
- marked design.md as requiring a rework
- will simply work on email verification feature for now and will add other features later
