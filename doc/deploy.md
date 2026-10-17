# Deploy (Tailscale / user systemd)

Matches how other Node apps on this host run (`terminal-talk-*`): clone under
`$HOME`, env file next to the app, user-level systemd unit with lingering.

## Requirements

- Node.js 22+ (nvm path used in the unit file)
- Secrets in `/home/wwidjaja0/floor-manager/.env` (see `.env.example`)

## Install

```bash
git clone https://github.com/wwidjaja0/floor-manager.git ~/floor-manager
cd ~/floor-manager
npm ci
cp .env.example .env   # fill secrets; do not commit
npm run deploy-commands
```

## systemd (user)

```bash
mkdir -p ~/.config/systemd/user
cp deploy/floor-manager.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now floor-manager
journalctl --user -u floor-manager -f
```

Confirm lingering so the unit survives logout: `loginctl show-user "$USER" -p Linger`.

## Smoke

1. In Discord: `/add-domain domain:ucsd.edu` (if not passed on `/verify`)
2. `/verify role:@Verified domain:ucsd.edu` — posts embed + button
3. Click button → email modal → OTP email → Enter Code → roles granted
