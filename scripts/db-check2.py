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

# Use node to query
script = """
const {Pool} = require('pg');
require('dotenv').config();
const pool = new Pool({connectionString: process.env.DATABASE_URL});
async function q() {
  const r = await pool.query(\"SELECT id, status, claimed_by, claimed_at FROM posts WHERE status = 'CLAIMED' LIMIT 5\");
  console.log('CLAIMED posts:', JSON.stringify(r.rows, null, 2));
  const r2 = await pool.query(\"SELECT execution_id, task_id, agent_id, status FROM execution_history WHERE status = 'claimed' LIMIT 5\");
  console.log('CLAIMED executions:', JSON.stringify(r2.rows, null, 2));
  const r3 = await pool.query(\"SELECT id, status FROM posts WHERE id LIKE 'E2E_%' LIMIT 5\");
  console.log('E2E tasks:', JSON.stringify(r3.rows, null, 2));
  const r4 = await pool.query(\"SELECT execution_id, task_id, status FROM execution_history WHERE task_id LIKE 'E2E_%' LIMIT 5\");
  console.log('E2E executions:', JSON.stringify(r4.rows, null, 2));
  await pool.end();
}
q().catch(e => console.error(e));
"""
out, err, _ = run(f"node -e '{script}'")
print("Query results:")
print(out)
if err: print("Stderr:", err[:500])

client.close()
