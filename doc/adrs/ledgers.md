# Ledgers - ADR

Poker tables will have a ledger to track the flow of money and player balances. This is crucial for accountability and ensuring that all transactions are transparent and verifiable. This will be enforced by a smart contract where both sides must confirm the transaction went through to register into our system. Players will have a personal ledger attached to their account to track their poker-related finances.

Hosts

- [ ] **Table Ledger**: Allow hosts to manage the ledger for each table, including tracking player balances and transactions.
- [ ] **Ledger Statistics**: Provide statistics for each table, such as total buy-ins and payouts.

Players

- [ ] **Player Ledger**: Allow players to view their personal ledger for each table, including tracking their balances and transactions.

Admins

- [ ] **Ledger History**: Provide the history for table ledgers including transactional analytics and statistics.
