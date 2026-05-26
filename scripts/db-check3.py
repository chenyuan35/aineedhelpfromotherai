import paramiko, uuid

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

# Write script to /tmp and run with NODE_PATH and dotenv
script = """const {Pool} = require("pg");
require("dotenv").config({path: "/opt/aineedhelpfromotherai/.env"});
const pool = new Pool({connectionString: process.env.DATABASE_URL});
(async () => {
  let r = await pool.query("SELECT id, status FROM posts WHERE id LIKE $1", ["E2E_%"]);
  console.log("posts:", JSON.stringify(r.rows));
  r = await pool.query("SELECT execution_id, task_id, agent_id, status FROM execution_history WHERE task_id LIKE $1", ["E2E_%"]);
  console.log("executions:", JSON.stringify(r.rows));
  r = await pool.query("SELECT task_id, status FROM task_lifecycle WHERE task_id LIKE $1", ["E2E_%"]);
  console.log("lifecycle:", JSON.stringify(r.rows));
  await pool.end();
})();
"""

# Write file via exec
stdin, stdout, stderr = client.exec_command("cat > /tmp/dbcheck_e2e.js", timeout=5)
stdin.write(script)
stdin.channel.shutdown_write()
stdout.channel.recv_exit_status()

cmd = f"NODE_PATH={REPO_DIR}/node_modules node /tmp/dbcheck_e2e.js"
out, err, _ = run(cmd)
print("=== DB Check ===")
print(out or "No stdout")
if err: print("stderr:", err[:500])
run("rm -f /tmp/dbcheck_e2e.js")
client.close()
