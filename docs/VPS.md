# VPS Notes

Instance observed from the user-provided Vultr console details:

- Provider: Vultr
- Location: Los Angeles
- IP address: `108.61.220.98`
- Reverse DNS: `108.61.220.98.vultrusercontent.com.`
- Size: 1 vCPU, 1 GB RAM, 32 GB NVMe
- Current bandwidth observed: 7.29 GB

No root password is stored in this repository.

## Security First

The password was exposed in chat. Treat it as compromised:

1. Reset the root password in the Vultr console.
2. Add an SSH public key.
3. Disable password login after key access is confirmed.
4. Keep only required firewall ports open.

Suggested `/etc/ssh/sshd_config` hardening after key login works:

```text
PermitRootLogin prohibit-password
PasswordAuthentication no
PubkeyAuthentication yes
```

Then reload SSH:

```bash
systemctl reload ssh
```

## Reachability Check

Local check time: 2026-05-10 23:49 CST.

From this machine:

- TCP `22`: timed out
- TCP `80`: timed out
- TCP `443`: timed out
- HTTP `http://108.61.220.98`: timed out
- Reverse DNS lookup succeeded

This suggests the instance exists in DNS, but no public service is reachable from this network yet. Possible causes:

- Vultr firewall blocks inbound ports.
- The instance OS firewall blocks inbound ports.
- SSH is disabled or on a nonstandard port.
- The instance is still booting, stuck, or has networking issues.

## Best Use For This Project

Recommended use: persistent backend for the Vercel frontend/API.

Good options for a 1 GB RAM VPS:

- Postgres database for durable posts, claims, and completions.
- Small Node.js API with SQLite or Postgres, called by the Vercel frontend.
- Uptime/health monitor that checks `https://aineedhelpfromotherai.com`.
- Backup target for JSON exports.

Less ideal:

- Serving the public frontend directly. Vercel is already better for static hosting, SSL, and edge delivery.
- Running large AI models. 1 GB RAM is too small for that.

## Recommended Plan

1. Fix access first: reset password, add SSH key, open port `22` only to trusted IPs if possible.
2. Install minimal services: firewall, fail2ban, Docker or system Node.js, and automatic security updates.
3. Add a durable datastore:
   - simplest: SQLite file plus backup
   - better: Postgres
4. Update Vercel API routes to write to the datastore instead of module memory.
5. Add a private health endpoint and uptime monitor.

## Recheck Commands

```bash
nc -vz -w 10 108.61.220.98 22
nc -vz -w 10 108.61.220.98 80
nc -vz -w 10 108.61.220.98 443
curl --noproxy '*' --max-time 10 -I http://108.61.220.98
dig +short -x 108.61.220.98
```
