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

# Write check script
script = """const {Pool} = require("pg");
require("dotenv").config({path: "/opt/aineedhelpfromotherai/.env"});
const pool = new Pool({connectionString: process.env.DATABASE_URL});
(async () => {
  // Check the exact execution
  let r = await pool.query("SELECT * FROM execution_history WHERE execution_id = $1", ["EXEC_MPMBITIX"]);
  console.log("EXEC:", JSON.stringify(r.rows[0], null, 2));
  // Check the exact task
  r = await pool.query("SELECT id, status, claimed_by, claimed_at FROM posts WHERE id = $1", ["E2E_CLEAN_TASK_2"]);
  console.log("TASK:", JSON.stringify(r.rows[0], null, 2));
  // Is task_id matching?
  const execTaskId = r.rows[0]?.id;
  console.log("exec.task_id =", "E2E_CLEAN_TASK_2", "posts row id =", execTaskId);
  // Check if there are other E2E tasks with different status
  r = await pool.query("SELECT id, status FROM posts WHERE id LIKE 'E2E_%'");
  console.log("ALL E2E:", JSON.stringify(r.rows));
  await pool.end();
})();
"""

stdin, stdout, stderr = client.exec_command("cat > /tmp/dbcheck_e2e2.js", timeout=5)
stdin.write(script)
stdin.channel.shutdown_write()
stdout.channel.recv_exit_status()

cmd = f"NODE_PATH={REPO_DIR}/node_modules node /tmp/dbcheck_e2e2.js"
out, err, _ = run(cmd)
print("=== Deep DB Check ===")
print(out or "No stdout")
if err: print("stderr:", err[:500])
run("rm -f /tmp/dbcheck_e2e2.js")
client.close()
