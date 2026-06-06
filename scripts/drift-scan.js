// scripts/drift-scan.js — Periodic drift scan for slow drift detection
// Runs hourly via GitHub Actions cron
// Reads execution_log.jsonl, groups by agent_id, runs drift detection, updates drift-state.json

const fs = require('fs');
const path = require('path');
const { analyze } = require('../lib/drift-detector');

const EXECUTION_LOG_PATH = path.join(__dirname, '..', 'data', 'execution_log.jsonl');
const ALERTS_LOG_PATH = path.join(__dirname, '..', 'data', 'drift-alerts.jsonl');

function parseTimeWindow(window) {
  if (window === '1h') return 1;
  if (window === '24h') return 24;
  if (window === '7d') return 168;
  return 24;
}

function getAgentCalls(logLines, hours = 1) {
  const cutoff = Date.now() - hours * 3600000;
  const agentCalls = {};
  
  for (const line of logLines) {
    try {
      const entry = JSON.parse(line);
      const ts = new Date(entry.timestamp).getTime();
      if (ts < cutoff) continue;
      
      const agentId = entry.agent_id || 'unknown';
      if (!agentCalls[agentId]) agentCalls[agentId] = [];
      agentCalls[agentId].push(entry);
    } catch {}
  }
  
  return agentCalls;
}

function runDriftScan() {
  console.log(`[${new Date().toISOString()}] Starting drift scan...`);
  
  if (!fs.existsSync(EXECUTION_LOG_PATH)) {
    console.log('No execution_log.jsonl found, skipping scan');
    return { scanned: 0, alerts: 0 };
  }
  
  const raw = fs.readFileSync(EXECUTION_LOG_PATH, 'utf8');
  const logLines = raw.split('\n').filter(Boolean);
  
  if (logLines.length === 0) {
    console.log('Empty execution log, skipping scan');
    return { scanned: 0, alerts: 0 };
  }
  
  const agentCalls = getAgentCalls(logLines, 1);
  let totalScanned = 0;
  let totalAlerts = 0;
  
  for (const [agentId, calls] of Object.entries(agentCalls)) {
    if (calls.length < 5) continue; // Need at least 5 calls for meaningful analysis
    
    console.log(`Scanning agent ${agentId}: ${calls.length} calls`);
    totalScanned++;
    
    // Replay calls through drift detector
    for (const call of calls) {
      if (call.method === 'tools/call') {
        const result = analyze({
          tool_name: call.tool || call.params?.name || 'unknown',
          agent_id: agentId,
          success: call.success !== false,
          error: call.error || null,
          duration_ms: call.duration_ms || 0,
          args: call.args || call.params?.arguments || {},
          timestamp: call.timestamp,
        });
        
        if (result.drift_detected && result.severity === 'high') {
          // Write alert
          const alert = {
            timestamp: new Date().toISOString(),
            agent_id: agentId,
            drift_type: result.drift_type,
            severity: result.severity,
            evidence: result.evidence,
            drift_score: result.drift_score,
          };
          
          fs.appendFileSync(ALERTS_LOG_PATH, JSON.stringify(alert) + '\n');
          totalAlerts++;
          console.log(`  ⚠️ ALERT: ${agentId} - ${result.drift_type} (${result.severity})`);
        }
      }
    }
  }
  
  console.log(`[${new Date().toISOString()}] Drift scan complete: ${totalScanned} agents scanned, ${totalAlerts} alerts`);
  return { scanned: totalScanned, alerts: totalAlerts };
}

function cleanupOldAlerts(days = 7) {
  if (!fs.existsSync(ALERTS_LOG_PATH)) return;
  
  const cutoff = Date.now() - days * 24 * 3600000;
  const raw = fs.readFileSync(ALERTS_LOG_PATH, 'utf8');
  const lines = raw.split('\n').filter(Boolean);
  const kept = lines.filter(line => {
    try {
      const alert = JSON.parse(line);
      return new Date(alert.timestamp).getTime() > cutoff;
    } catch {
      return false;
    }
  });
  
  fs.writeFileSync(ALERTS_LOG_PATH, kept.join('\n') + (kept.length > 0 ? '\n' : ''));
  console.log(`Cleaned up old alerts: ${lines.length} -> ${kept.length}`);
}

// Main execution
if (require.main === module) {
  runDriftScan();
  cleanupOldAlerts();
}

module.exports = { runDriftScan, cleanupOldAlerts, getAgentCalls };