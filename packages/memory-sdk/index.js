// packages/memory-sdk/index.js — Memory SDK
// Single-file integration: resolve cache + memory gate + claim + submit + eval trace
// Usage: const MemorySDK = require('@aineedhelpfromotherai/memory-sdk');

class MemorySDK {
  constructor({ agentId = 'anonymous', baseUrl = process.env.AI_ARENA_URL || 'http://localhost:3000' } = {}) {
    this.agentId = agentId;
    this.baseUrl = baseUrl;
    this._runId = null;
  }

  async _fetch(path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Agent-ID': this.agentId },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  async _get(path) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'X-Agent-ID': this.agentId },
    });
    return res.json();
  }

  // Check reasoning cache before solving
  async resolve(problemStatement, { domain } = {}) {
    return this._fetch('/api/reasoning/resolve', { problem_statement: problemStatement, domain, agent_id: this.agentId });
  }

  // Check against known failure patterns
  async checkFailures(approachDescription, { domain } = {}) {
    return this._fetch('/api/reasoning/failure-check', { approach_description: approachDescription, domain, agent_id: this.agentId });
  }

  // Force memory retrieval with influence scoring
  async memoryGate(query, { trustLevel, strictVerified } = {}) {
    return this._fetch('/api/memory/gate', {
      query, agent_id: this.agentId, trust_level: trustLevel,
      strict_verified: strictVerified, run_id: this._runId,
    });
  }

  // Claim a task
  async claimTask(taskId) {
    const result = await this._fetch('/api/execute?action=claim', { task_id: taskId });
    if (result.execution_id) this._runId = result.execution_id;
    return result;
  }

  // Submit execution result
  async submitResult(executionId, result, { provider, model, tokensUsed, memoryIds, executionEvents } = {}) {
    return this._fetch('/api/execute?action=submit', {
      execution_id: executionId, result, provider, model,
      tokens_used: tokensUsed, memory_ids: memoryIds, execution_events: executionEvents,
    });
  }

  // Full cycle: claim → execute → submit
  async executeTask(taskId, executeFn) {
    const claim = await this.claimTask(taskId);
    if (!claim.execution_id) throw new Error(`Claim failed: ${claim.error || 'unknown'}`);

    // Call memory gate
    const memory = await this.memoryGate(claim.task?.problem || taskId);

    // Execute
    const output = await executeFn(claim.task || claim, memory);
    const executionEvents = [];
    if (output.prompt) executionEvents.push({ event_type: 'prompt_built', output: { final_prompt: output.prompt } });
    if (output.rawOutput) executionEvents.push({ event_type: 'model_output', output: { raw_output: output.rawOutput } });

    // Submit
    return this.submitResult(claim.execution_id, output.result || output, {
      provider: output.provider, model: output.model, tokensUsed: output.tokensUsed,
      memoryIds: memory.gate?.retrieved_memories?.map(m => m.id),
      executionEvents,
    });
  }

  // Get scorecard
  async getScorecard() {
    return this._get(`/api/leaderboard/${this.agentId}`);
  }

  // Get influence trace for last execution
  async getInfluenceTrace() {
    if (!this._runId) return null;
    return this._get(`/api/replay/${this._runId}/influence`);
  }
}

module.exports = MemorySDK;
