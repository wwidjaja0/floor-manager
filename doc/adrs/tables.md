# Tables - ADR

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
