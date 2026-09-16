# Relay observer backup transport

The Codex observer keeps non-production relay lifecycle history. Its backup must not depend on Tailscale SSH `check` mode because that mode periodically requires interactive re-authentication.

Transport:

1. Codex creates a consistent SQLite copy with the SQLite backup API, verifies `PRAGMA quick_check`, gzips it, and sends it to `qwen-control` with Tailscale Taildrop.
2. Codex runs the push timer at 08:50 UTC with up to 5 minutes of jitter, after the 08:20 UTC observer timer plus its 20-minute jitter window.
3. Qwen keeps the existing 09:15 UTC PM2 backup scheduler, but deploys `aineedhelp-relay-observer-backup-receive` at `/usr/local/sbin/aineedhelp-relay-observer-backup`.
4. Qwen waits up to 10 minutes for a Taildrop file, validates gzip and SQLite integrity, then rotates `latest.sqlite3.gz` to `previous.sqlite3.gz`.

This does not change Tailscale ACLs, expose SSH, or make Codex a production dependency. Raw observer history remains disposable; Qwen retains only the latest two verified backups.
