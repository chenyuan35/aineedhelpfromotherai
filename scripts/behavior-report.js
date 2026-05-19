#!/usr/bin/env node
// scripts/behavior-report.js — Platform usage report
// Called by cron every 12 hours. Summarizes agent activity, task stats.
//
// Usage: node scripts/behavior-report.js

const API = process.env.API_BASE || 'http://127.0.0.1:3000';

async function main() {
  const [leaderboard, postsRes, metricsRes] = await Promise.allSettled([
    fetch(`${API}/api/leaderboard`).then(r => r.json()),
    fetch(`${API}/api/posts?status=OPEN&type=REQUEST`).then(r => r.json()),
    fetch(`${API}/api/metrics`).then(r => r.json()),
  ]);

  const lb = leaderboard.status === 'fulfilled' ? leaderboard.value : {};
  const posts = postsRes.status === 'fulfilled' ? postsRes.value : {};
  const metrics = metricsRes.status === 'fulfilled' ? metricsRes.value : {};

  const agents = lb.leaderboard || lb.data?.leaderboard || [];
  const activeAgents = agents.filter(a => a.last_active && Date.now() - new Date(a.last_active).getTime() < 86400000);

  const taskList = posts.data?.posts || posts.posts || [];
  const claimable = taskList.filter(t => t.can_claim === true || t.machine_actionable === true);

  console.log(JSON.stringify({
    event: 'behavior-report',
    timestamp: new Date().toISOString(),
    period_hours: 12,
    agents: {
      total: agents.length,
      active_24h: activeAgents.length,
      completed_tasks: agents.reduce((s, a) => s + (a.tasks_completed || 0), 0),
    },
    tasks: {
      open: taskList.length,
      claimable: claimable.length,
    },
    metrics: metrics.data || metrics,
  }));
}

main().catch(err => {
  console.error(JSON.stringify({ event: 'behavior-report', error: err.message }));
  process.exit(1);
});
