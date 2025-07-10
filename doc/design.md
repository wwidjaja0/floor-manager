# Floor Manager Bot Design Doc and Roadmap

The main design document for the Floor Manager Discord bot.

## Table of Contents

- [Floor Manager Bot Design Doc and Roadmap](#floor-manager-bot-design-doc-and-roadmap)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [User Personas and Diagrams](#user-personas-and-diagrams)
    - [User Personas](#user-personas)
    - [User Flow Diagram](#user-flow-diagram)
  - [Features and ADRs](#features-and-adrs)
    - [Main Features](#main-features)
    - [Secondary Features](#secondary-features)
  - [Other Technical Requirements](#other-technical-requirements)
    - [Technologies and Tools](#technologies-and-tools)

## Purpose

The Floor Manager bot was an initiative to create a Discord bot that would mitigate ping spamming, unreliable hosts, and enhance the overall experience of starting a live or online poker game on Discord. This bot aims to provided a structured and accountable way for users to create, manage, and participate in poker games while ensuring that all financial transactions are transparent and verifiable.

## User Personas and Diagrams

There are three main kinds of users considered in our design:

- Hosts: Users who create and manage poker tables.
- Players: Users who join and play at poker tables.
- Administrators: Users who manage the bot and its features or permissions.

### User Personas

TODO

### User Flow Diagram

TODO

## Features and ADRs

### Main Features

- [Table Management](./adrs/tables.md)
- [Ledger Management](./adrs/ledgers.md)
- [Transaction Verification](./adrs/transactions.md)

### Secondary Features

TODO

## Other Technical Requirements

### Technologies and Tools

- Discord.js: A powerful library for interacting with the Discord API.
- Node.js: The runtime environment for executing JavaScript code on the server.
- MongoDB: A NoSQL database for storing user and game data.

How will data be stored and managed in the bot?

See [Storage ADR](./adrs/storage.md).

Where will the bot be hosted?

See [Hosting ADR](./adrs/hosting.md).
