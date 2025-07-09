# Floor Manager Discord Bot

[![Discord](https://img.shields.io/discord/1328881859597307987?color=7289da&logo=discord&logoColor=white)](https://discord.gg/9Fpt5wm84V)
[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/wwidjaja0/floor-manager)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A Discord bot for managing the "floor" for the Poker Tritons Discord server at UC San Diego.

## 🌟 Features

- Table Management
- Ledgers
- Payment Verification
- Host Accountability

See the [design document](doc/design.md) for full design details.

## 📖 Commands

### Slash Commands

| Command | Description      | Usage |
| ------- | ---------------- | ----- |
| help    | See all commands | /help |

### Admin Commands

| Command | Description | Required Role |
| ------- | ----------- | ------------- |
| N/A     | N/A         | N/A           |

## 🚀 Quick Start (Run Locally)

### Prerequisites

- Node.js version 22 or higher
- npm (Node Package Manager)

### 🔧 Configuration

The bot requires the following permissions:

TODO

Database Setup

TODO

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/wwidjaja0/floor-manager.git
    ```

2. Navigate into the project source directory:

    ```bash
    cd floor-manager/src/
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the `src/` directory and add your Discord bot token and database connection string.

    ```env
    DISCORD_TOKEN=your_discord_bot_token
    DATABASE_URL=your_database_connection_string
    ```

   Replace `your_discord_bot_token` and `your_database_connection_string` with your actual values.

5. Start the bot:

    ```bash
    npm start
    ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 🐛 Issues and Support

For bug reports, feature requests, or more, please go to the [GitHub Issues](https://github.com/wwidjaja0/floor-manager/issues). For further support, join the [Poker Tritons Discord server](https://discord.gg/9Fpt5wm84V).

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - The Discord API library
- [Node.js](https://nodejs.org/) - Runtime environment

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- markdownlint-disable no-inline-html -->
<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/wwidjaja0">wwidjaja0</a></sub>
</div>
