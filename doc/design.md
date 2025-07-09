# Floor Manager Bot Design Doc and Roadmap

The main design document for the Floor Manager Discord bot.

## Table of Contents

- [Floor Manager Bot Design Doc and Roadmap](#floor-manager-bot-design-doc-and-roadmap)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [User Personas and Diagrams](#user-personas-and-diagrams)
    - [User Flow Diagram](#user-flow-diagram)
  - [Features and ADRs](#features-and-adrs)
    - [Table Management](#table-management)
    - [Ledger Management](#ledger-management)
    - [External Linking](#external-linking)
  - [Other Technical Requirements](#other-technical-requirements)
  - [Roadmap](#roadmap)

## Purpose

what is the bot for (purpose?)

## User Personas and Diagrams

consideration of users, target audience
There are three main kinds of users considered in our design:

- Hosts: Users who create and manage poker tables.
- Players: Users who join and play at poker tables.
- Administrators: Users who manage the bot and its features or permissions.

### User Flow Diagram

diagrams and feature maps and such (how these users might use the bot and interact with it)

## Features and ADRs

main features
secondary features

### Table Management

Poker tables are the core of our application. They allow hosts to create and manage a game through Discord and allows players to join those games. Each table will have a unique ID, a host, and various features for accountability, player protection, and reservation management.

Hosts

- [ ] **Create a Table**: Allow hosts to create new poker tables.
- [ ] **Table Announcements**: Allow hosts to make announcements to players at the table.
- [ ] **Table Settings**: Allow hosts to customize table settings, such as game type, buy-in amounts, and player limits.

Players

- [ ] **Join a Table**: Enable players to join existing tables.
- [ ] **View a Table**: Allow players to view information about a table.
- [ ] **Table Chat**: Allow players to chat with each other and the host until the table is automatically or manually closed by the host.
- [ ] **Table Feedback**: Allow players to provide anonymous feedback about their table.
- [ ] **Table Report**: Allow players to report issues or concerns about a table or its host.
- [ ] **Leave a Table**: Allow players to leave tables they are registered for.

Admins

- [ ] **End a Table**: Allow admins to end a table session and automatic closure after a certain timeframe, DO NOT allow anyone else to end one to keep accountability.
- [ ] **Table History**: Implement a history feature to view past games and results. (This will likely only be available to admins.)

### Ledger Management

Poker tables will have a ledger to track the flow of money and player balances. This is crucial for accountability and ensuring that all transactions are transparent and verifiable. This will be enforced by a smart contract where both sides must confirm the transaction went through to register into our system. Players will have a personal ledger attached to their account to track their poker-related finances.

Hosts

- [ ] **Table Ledger**: Allow hosts to manage the ledger for each table, including tracking player balances and transactions.
- [ ] **Ledger Statistics**: Provide statistics for each table, such as total buy-ins and payouts.

Players

- [ ] **Player Ledger**: Allow players to view their personal ledger for each table, including tracking their balances and transactions.

Admins

- [ ] **Ledger History**: Provide the history for table ledgers including transactional analytics and statistics.

### External Linking

The bot will link to external apps to allow players to more conveniently speed up transactions.

- [ ] **External Links**: Allow players to go to external apps through links provided by the bot, if they choose to do so. Otherwise, they can navigate to the apps themselves.

## Other Technical Requirements

- how will data be stored and managed in the bot
- where the bot will be hosted
- technologies and tools to use
- specifics about response times and such

## Roadmap

move this to a project board or something and link it

Phase 1: Core Features

- Table Creation and Management
- Table Joining and Leaving
- Table Announcements
- Table Chat

Phase 2: Other Features

- External Linking
- Table Ledger
- Table Feedback and Reporting
- Table History
- Player Ledger

Phase 3: Polishing and Optimization

- User Feedback and Iteration
- Performance Optimization
- Documentation and Support
