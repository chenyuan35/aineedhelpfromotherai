import paramiko
HOST = "108.61.220.98"; USER = "root"; PASSWORD = "{Q9yZ@dar8z.ii+y"
REPO_DIR = "/opt/aineedhelpfromotherai"
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, look_for_keys=False, allow_agent=False, timeout=10)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(f"cd {REPO_DIR} && {cmd}", timeout=20)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    return out, err

# Check file permissions
out, err = run("ls -la data/resolve-cache.json")
print("File:", out)

# Test reading with node
out, err = run("node -e \"const c=require('./lib/resolve-cache');const h=c.getAllHints();console.log('hints:',Object.keys(h).length);console.log('sample:',JSON.stringify(Object.values(h)[0]||'none').slice(0,200))\"")
print("Node test:", out)
if err: print("Err:", err[:200])

# Also test what the file actually contains
out, err = run("head -c 300 data/resolve-cache.json")
print("File content:", out[:200])

client.close()
