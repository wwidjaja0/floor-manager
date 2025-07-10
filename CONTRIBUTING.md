# Contributing Guidelines Floor Manager

If you want to contribute to the Floor Manager project, please follow this outline to set up your dev environment, run the bot, and test changes. This guide assumes you have a basic understanding of Node.js and Discord bot development.

## Table of Contents

- [Contributing Guidelines Floor Manager](#contributing-guidelines-floor-manager)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
    - [Discord Bot Permissions](#discord-bot-permissions)
  - [Setting Up the Environment and Running the Bot](#setting-up-the-environment-and-running-the-bot)
  - [File Structure](#file-structure)
  - [Development Workflow](#development-workflow)

## Pre-requisites

- Node.js version 22 or higher
- npm (Node Package Manager)
- git
- Your Discord bot token
- INSERT DATABASE USED HERE
- A Discord server you own or have permission in
- A code editor (e.g., Visual Studio Code)

### Discord Bot Permissions

To allow your bot to function properly, you need to give it the following bot permissions:

- Create Events
- Moderate Members (TODO: See if this is needed)
- Send Messages
- Create Private Threads
- Send Messages in Threads
- Read Message History
- Mention Everyone
- Add Reactions (TODO: See if this is needed)
- Create Polls (TODO: See if this is needed)

## Setting Up the Environment and Running the Bot

### Database Setup

TODO: Add instructions for setting up the database connection. This will depend on the database you choose to use (e.g., MongoDB, PostgreSQL, etc.). Ensure you have the necessary configuration in your `.env` file.

1. Ensure you have Node.js version 22 or higher installed.
2. Clone the repository:

    Using HTTPS:

    ```bash
    git clone https://github.com/wwidjaja0/floor-manager.git
    ```

    Using SSH:

    ```bash
    git clone git@github.com:wwidjaja0/floor-manager.git
    ```

3. Navigate into the project source directory:

    ```bash
    cd floor-manager/src/
    ```

4. Install dependencies:

    ```bash
    npm install
    ```

    or if you prefer Yarn:

    ```bash
    yarn install
    ```

5. Create a `.env` file in the `src/` directory and add your Discord bot token and database connection string:

    ```env
    DISCORD_TOKEN=your_discord_token
    DATABASE_URL=your_database_url
    ```

    Replace `your_discord_token` and `your_database_url` with your actual values.

6. Run the bot:

    ```bash
    npm start
    ```

    or if you prefer Yarn:

    ```bash
    yarn start
    ```

## File Structure

Now that you should have a working instance of the bot, here's a brief overview of the file structure:

```bash
floor-manager/
├── doc/
│   ├── adrs/              -- Architectural Decision Records.
│   ├── branding/          -- Branding assets.
│   ├── design.md          -- Main design document for the bot.
│   └── journal.md         -- Development journal and changelog.
├── src/
│   ├── commands/          -- Command handlers.
│   ├── node_modules/
│   ├── .env
│   ├── index.js           -- Main entry point for the bot.
│   ├── package-lock.json
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes (and add tests)

    To ensure all tests pass, run:

    ```bash
    npm test
    ```

4. Commit your changes:

    ```bash
    git commit -m 'Add feature'
    ```

5. Push to the branch:

    ```bash
    git push origin feature-name
    ```

6. Submit a pull request
