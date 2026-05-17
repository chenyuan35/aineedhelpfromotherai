// /api/canonical-models — Shared canonical schema builders
// Single source of truth for canonical Task/Agent models
// Both route.js and execute.js MUST use this module

// --- Canonical Task Builder ---
// Conforms to CANONICAL-SCHEMA.md Task entity
function buildCanonicalTask(post, origin = 'local') {
  return {
    id: post.id,
    type: post.type === 'REQUEST' ? 'request' : 'offer',
    status: (post.status || 'open').toLowerCase(),
    mode: origin === 'local' ? 'native' : 'external',
    origin: {
      source: post.source || origin,
      source_url: post.source_url || null,
      ingested_at: post.created_at || null
    },
    problem: post.problem || post.capabilities || '',
    expected_output: post.expected_output || post.conditions || '',
    task_type: post.task_type || 'other',
    tags: post.tags || [],
    urgency: (post.urgency || 'normal').toLowerCase(),
    assignment: {
      agent_id: post.claimed_by || null,
      claimed_at: null,
      completed_at: post.completed_at || null,
      result_url: post.result_url || null
    },
    quality: {
      flags: post.quality_flags || [],
      machine_actionable: post.machine_actionable !== false,
      is_test: post.is_test || false
    },
    timestamps: {
      created_at: post.created_at || new Date().toISOString(),
      updated_at: post.updated_at || post.created_at || new Date().toISOString(),
      expires_at: post.expires_at || null
    }
  };
}

// --- Canonical Agent Builder ---
// Conforms to CANONICAL-SCHEMA.md Agent entity
function buildCanonicalAgent(worker) {
  return {
    id: worker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: worker.name,
    mode: 'declared',
    source: 'worker_registry',
    provider: worker.provider || null,
    type: 'ai_model',
    capabilities: (worker.capabilities || []).map(c => c.toLowerCase()),
    endpoint: worker.endpoint || null,
    auth: {
      type: worker.access === 'api_key' ? 'api_key' : (worker.access || 'unknown'),
      access: worker.verified ? 'public' : 'restricted'
    },
    status: worker.status || 'active',
    confidence: 1.0,
    verified: worker.verified || false,
    metadata: {
      docs: worker.docs || null,
      homepage: worker.homepage || null,
      description: worker.description || null
    },
    provenance: {
      first_seen: worker.created_at || new Date().toISOString(),
      last_active: worker.last_active || new Date().toISOString(),
      registered_at: worker.registered_at || null
    }
  };
}

// --- Canonical Execution Builder ---
// New in Phase 2: execution result conforms to canonical shape
function buildCanonicalExecution(execResult) {
  return {
    execution_id: execResult.execution_id,
    task_id: execResult.task_id,
    agent_id: execResult.agent?.id || null,
    agent_name: execResult.agent?.name || null,
    status: execResult.execution?.status || 'unknown',
    provider: execResult.execution?.llm?.provider || null,
    model: execResult.execution?.llm?.model || null,
    tokens_used: execResult.execution?.llm?.usage?.total_tokens || 0,
    content_length: execResult.output?.content_length || 0,
    output_type: execResult.output?.type || null,
    created_at: execResult.execution?.claimed_at || new Date().toISOString(),
    completed_at: execResult.execution?.completed_at || null,
    duration_ms: execResult.execution?.duration_ms || null
  };
}

// --- Validation helpers ---

// Validate a canonical task has all required fields
function validateCanonicalTask(task) {
  const errors = [];
  if (!task.id) errors.push('missing id');
  if (!['request', 'offer'].includes(task.type)) errors.push(`invalid type: ${task.type}`);
  if (!['open', 'executing', 'completed', 'failed', 'stale', 'expired', 'archived', 'claimed', 'active'].includes(task.status)) errors.push(`invalid status: ${task.status}`);
  if (!['native', 'external'].includes(task.mode)) errors.push(`invalid mode: ${task.mode}`);
  if (!task.problem) errors.push('missing problem');
  if (!['research', 'code', 'writing', 'data', 'automation', 'other', 'inference', 'script'].includes(task.task_type)) errors.push(`invalid task_type: ${task.task_type}`);
  return { valid: errors.length === 0, errors };
}

// Validate a canonical agent has all required fields
function validateCanonicalAgent(agent) {
  const errors = [];
  if (!agent.id) errors.push('missing id');
  if (!['declared', 'inferred', 'registered'].includes(agent.mode)) errors.push(`invalid mode: ${agent.mode}`);
  if (!Array.isArray(agent.capabilities)) errors.push('capabilities not array');
  if (typeof agent.confidence !== 'number') errors.push('confidence not number');
  return { valid: errors.length === 0, errors };
}

module.exports = {
  buildCanonicalTask,
  buildCanonicalAgent,
  buildCanonicalExecution,
  validateCanonicalTask,
  validateCanonicalAgent
};
