# Contributing to Floor Manager

THIS PAGE IS A WORK IN PROGRESS

## Table of Contents

- [Contributing to Floor Manager](#contributing-to-floor-manager)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
  - [Setting Up the Environment](#setting-up-the-environment)
  - [File Structure](#file-structure)
  - [Development Setup](#development-setup)
  - [Running the Bot](#running-the-bot)
  - [Testing the Bot](#testing-the-bot)
  - [Building the Bot](#building-the-bot)

## Pre-requisites

- Node.js version 22 or higher
- npm (Node Package Manager)
- Git
- A Discord bot token
- A database (e.g., MongoDB, PostgreSQL)
- A Discord server to test the bot
- A code editor (e.g., Visual Studio Code)

## Setting Up the Environment

1. Ensure you have Node.js version 22 or higher installed.
2. Clone the repository: `git clone https://github.com/wwidjaja0/floor-manager.git`
3. Navigate into the project source directory: `cd floor-manager/src/`
4. Install dependencies: `npm install` (or `yarn install` if you prefer Yarn)

## File Structure

```text
floor-manager/
├── doc/           # Slash commands
├── src/           # Discord.js event handlers
├── .gitignore       # 
├── LICENSE       # 
└── README.md         # This file
```

## Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Running the Bot

```bash
npm start
# or
yarn start
```

1. Create a `.env` file in the root directory and add your Discord bot token and database connection string.
2. Start the bot: `npm start` (or `yarn start`)

## Testing the Bot

```bash
npm test
# or
yarn test
```

## Building the Bot

```bash
npm run build
# or
yarn build
```
