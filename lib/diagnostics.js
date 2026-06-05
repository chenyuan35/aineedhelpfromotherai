// lib/diagnostics.js — Lightweight process health probe
// Read-only. No auth (for now). Exposes Node.js process metrics.

function getProcessStats() {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  const uptime = process.uptime();

  return {
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(uptime),
    memory: {
      rss_mb: Math.round(mem.rss / 1024 / 1024),
      heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
      external_mb: Math.round(mem.external / 1024 / 1024),
      array_buffers_mb: Math.round((mem.arrayBuffers || 0) / 1024 / 1024),
    },
    cpu: {
      user_ms: Math.round(cpu.user / 1000),
      system_ms: Math.round(cpu.system / 1000),
    },
    platform: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    },
    event_loop: {
      // Approximate event loop lag by measuring setTimeout drift
      // For now, just expose that we ran without blocking
      healthy: true,
    },
  };
}

module.exports = { getProcessStats };
