# contributing.md

## table of contents

- [contributing.md](#contributingmd)
  - [table of contents](#table-of-contents)
  - [pre-reqs](#pre-reqs)
    - [required discord bot permissions](#required-discord-bot-permissions)
  - [env setup and running the bot](#env-setup-and-running-the-bot)
    - [database setup](#database-setup)
  - [file structure](#file-structure)
  - [contributor workflow](#contributor-workflow)

## pre-reqs

- node.js version 22 or higher
- npm (node package manager)
- git
- a discord bot token
- INSERT DATABASE USED HERE
- a discord server you own or have permission in
- an ide (e.g., vs code)

### required discord bot permissions

- tbd

## env setup and running the bot

### database setup

TODO: Add instructions for setting up the database connection. This will depend on the database you choose to use (e.g., MongoDB, PostgreSQL, etc.). Ensure you have the necessary configuration in your `.env` file.

1. have node.js version 22 or higher installed
2. clone the repository:

    ```bash
    git clone https://github.com/wwidjaja0/floor-manager.git
    ```

3. navigate to the `src/` directory:

    ```bash
    cd floor-manager/src/
    ```

4. install dependencies:

    ```bash
    npm install
    ```

5. create an `.env` file in the `src/` directory from the `.env.example` and fill out required fields
6. run the bot:

    ```bash
    npm start
    ```

## file structure

```bash
floor-manager/
├── doc/                   -- documentation
├── src/                   -- source code
│   ├── commands/          -- command handlers
│   └── index.js           -- main entry point for the bot
```

## contributor workflow

1. fork the github repo
2. create a branch (see [branch naming conventions](https://conventionalbranch.org/)): `git checkout -b branch-name`
3. make changes (and add tests)

    to ensure all tests pass, run:

    ```bash
    npm test
    ```

4. commit changes (see [commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/)):

    ```bash
    git commit -m 'feat: add new feature'
    ```

5. push to the remote branch:

    ```bash
    git push origin branch-name
    ```

6. submit a pull request
