# deploy (Tailscale / systemd host)

There is no Docker/pm2 stack in this repo. Run the bot as a long-lived Node process
under systemd on the Tailscale SSH host (same pattern as a simple Node service).

## prerequisites on the host

- Node.js 22+
- git
- secrets in a repo-root `.env` (never commit it)

Required `.env` keys (see `.env.example`):

- `DISCORD_BOT_TOKEN`
- `DISCORD_CLIENT_ID`
- `DISCORD_GUILD_ID`
- `RESEND_API_KEY` (needed for `/testmail` / email verification)

## install

```bash
sudo mkdir -p /opt/floor-manager
sudo chown "$USER":"$USER" /opt/floor-manager
git clone https://github.com/wwidjaja0/floor-manager.git /opt/floor-manager
cd /opt/floor-manager
npm ci
cp .env.example .env
# edit .env with real secrets
npm run deploy-commands
```

## systemd

```bash
sudo cp deploy/floor-manager.service /etc/systemd/system/floor-manager.service
# edit WorkingDirectory / EnvironmentFile / ExecStart paths if not using /opt/floor-manager
sudo systemctl daemon-reload
sudo systemctl enable --now floor-manager
sudo systemctl status floor-manager
journalctl -u floor-manager -f
```

## update

```bash
cd /opt/floor-manager
git pull
npm ci
npm run deploy-commands
sudo systemctl restart floor-manager
```

## smoke checks after deploy

1. `journalctl -u floor-manager -n 50` shows `bot is ready and logged in as ...`
2. In the target guild: `/user`, `/server`, then `/testmail email:you@ucsd.edu`
3. Confirm the Resend dashboard (or inbox) received the message from `noreply@wwidjaja.com`
