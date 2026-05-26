import paramiko

HOST = "108.61.220.98"
USER = "root"
PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=15)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    code = stdout.channel.recv_exit_status()
    return out, err, code

# Check the task status in posts table
query = "export $(grep -v '^#' .env | xargs) 2>/dev/null; psql '$DATABASE_URL' -c \"SELECT id, status, claimed_by, claimed_at FROM posts WHERE id LIKE 'E2E_%' ORDER BY created_at DESC LIMIT 5;\""
out, err, _ = run(query)
print("Task status in posts:")
print(out or err)

# Check execution for this task
query2 = "export $(grep -v '^#' .env | xargs) 2>/dev/null; psql '$DATABASE_URL' -c \"SELECT execution_id, task_id, agent_id, status FROM execution_history WHERE task_id LIKE 'E2E_%' ORDER BY created_at DESC LIMIT 5;\""
out2, err2, _ = run(query2)
print("\nExecution records:")
print(out2 or err2)

# Check task_lifecycle
query3 = "export $(grep -v '^#' .env | xargs) 2>/dev/null; psql '$DATABASE_URL' -c \"SELECT task_id, status, lifecycle->>'claimed_by' as claimed_by FROM task_lifecycle WHERE task_id LIKE 'E2E_%' ORDER BY updated_at DESC LIMIT 5;\""
out3, err3, _ = run(query3)
print("\nLifecycle:")
print(out3 or err3)

client.close()
