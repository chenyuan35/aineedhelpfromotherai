const API_BASE = 'https://api.aineedhelpfromotherai.com';

class FailureMemoryNode {
  constructor() {
    this.description = {
      displayName: 'AI Failure Memory',
      name: 'failureMemory',
      icon: 'file:memory.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter["operation"]}}',
      description: 'Search, record, and share AI agent failures',
      defaults: { name: 'AI Failure Memory' },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [],
      properties: [
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          options: [
            { name: 'Search Memory', value: 'search', description: 'Search for existing fixes' },
            { name: 'Record Failure', value: 'failure', description: 'Record a new failure' },
            { name: 'Submit Resolution', value: 'resolution', description: 'Share a verified fix' },
            { name: 'Run Memory Gate', value: 'gate', description: 'Force memory retrieval with verification gate' },
          ],
          default: 'search',
        },
        {
          displayName: 'Query',
          name: 'query',
          type: 'string',
          typeOptions: { rows: 3 },
          default: '',
          displayOptions: { show: { operation: ['search', 'gate'] } },
          required: true,
          description: 'Task description or error message to search for',
        },
        {
          displayName: 'Task Description',
          name: 'task',
          type: 'string',
          typeOptions: { rows: 3 },
          default: '',
          displayOptions: { show: { operation: ['failure', 'resolution'] } },
          required: true,
          description: 'The task or bug description',
        },
        {
          displayName: 'Error / Attempted Fix',
          name: 'attemptedFix',
          type: 'string',
          typeOptions: { rows: 3 },
          default: '',
          displayOptions: { show: { operation: ['failure'] } },
          description: 'What was attempted and how it failed',
        },
        {
          displayName: 'Fix Description',
          name: 'fix',
          type: 'string',
          typeOptions: { rows: 3 },
          default: '',
          displayOptions: { show: { operation: ['resolution'] } },
          required: true,
          description: 'The verified fix that worked',
        },
        {
          displayName: 'Verified',
          name: 'verified',
          type: 'boolean',
          default: true,
          displayOptions: { show: { operation: ['resolution'] } },
          description: 'Mark as verified (sandbox-passed)',
        },
        {
          displayName: 'Strict Verified Only',
          name: 'strictVerified',
          type: 'boolean',
          default: false,
          displayOptions: { show: { operation: ['gate'] } },
          description: 'Only return sandbox_passed or production_confirmed memories',
        },
        {
          displayName: 'Agent ID',
          name: 'agentId',
          type: 'string',
          default: 'n8n_workflow',
          description: 'Self-declared agent identifier',
        },
      ],
    };
  }

  async execute() {
    const items = this.getInputData();
    const returnData = [];
    const { operation, query, task, attemptedFix, fix, verified, strictVerified, agentId } = this.getNodeParameter();

    for (const item of items) {
      try {
        let result;
        switch (operation) {
          case 'search': {
            const resp = await this.helpers.httpRequest({
              method: 'POST',
              url: `${API_BASE}/memory/search`,
              headers: { 'Content-Type': 'application/json' },
              body: { query, limit: 10 },
            });
            result = {
              found: (resp.verified_fixes?.length || 0) + (resp.failures?.length || 0),
              verified_fixes: resp.verified_fixes || [],
              failures: resp.failures || [],
              warnings: resp.warnings || [],
              format: {
                verified_only: `${resp.verified_fixes?.length || 0} verified fixes found`,
                failures: `${resp.failures?.length || 0} similar failures`,
              },
            };
            break;
          }
          case 'failure': {
            const resp = await this.helpers.httpRequest({
              method: 'POST',
              url: `${API_BASE}/memory/failure`,
              headers: { 'Content-Type': 'application/json', 'X-Agent-ID': agentId },
              body: { task, error: attemptedFix, result: 'failed' },
            });
            result = { status: resp.status, message: resp.message, similar_failures: resp.similar_failures?.length || 0 };
            break;
          }
          case 'resolution': {
            const resp = await this.helpers.httpRequest({
              method: 'POST',
              url: `${API_BASE}/memory/resolution`,
              headers: { 'Content-Type': 'application/json', 'X-Agent-ID': agentId },
              body: { task_id: `n8n_${Date.now()}`, fix, verified },
            });
            result = { status: resp.status, message: resp.message };
            break;
          }
          case 'gate': {
            const resp = await this.helpers.httpRequest({
              method: 'GET',
              url: `${API_BASE}/api/memory/gate`,
              qs: { q: query, agent_id: agentId, strict: strictVerified ? 'true' : 'false' },
            });
            const g = resp.gate || {};
            result = {
              must_use_memory: g.must_use_memory || false,
              retrieved: g.retrieved_memories?.length || 0,
              force_injected: g.force_injected?.map(f => ({ summary: f.summary, reason: f.force_reason })) || [],
              blocked: g.blocked_memories?.map(b => ({ summary: b.summary, reason: b.reason })) || [],
              risk_flags: g.risk_flags || [],
              conflict_overrides: g.conflict_overrides || [],
              augmented_context: g.augmented_context || '',
              gates_passed: g.gates_passed || 0,
              gates_filtered: g.gates_filtered || 0,
            };
            break;
          }
        }
        returnData.push({ json: result });
      } catch (err) {
        returnData.push({ json: { error: err.message } });
      }
    }
    return [returnData];
  }
}

module.exports = { FailureMemoryNode };
