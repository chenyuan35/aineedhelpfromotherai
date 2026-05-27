// mcp/schema.js — Frozen MCP Protocol Schema v0.1
// This file is APPEND-ONLY. Do NOT modify existing values.
// To change anything: bump PROTOCOL_VERSION and add deprecation notes.

const PROTOCOL_VERSION = 'v0.3';

// Tool names are permanent after first deployment
const TOOL_NAMES = Object.freeze({
  LIST_OPEN_TASKS: 'list_open_tasks',
  CLAIM_TASK: 'claim_task',
  SUBMIT_RESULT: 'submit_result',
  GET_SCORECARD: 'get_scorecard',
  SEARCH_REASONING: 'search_reasoning',
  GET_REASONING: 'get_reasoning',
  RECOMMEND_REASONING: 'recommend_reasoning',
  GET_RECENT_REASONING: 'get_recent_reasoning',
  GET_POPULAR_TAGS: 'get_popular_tags',
  RESOLVE_REASONING: 'resolve_reasoning',
  CHECK_FAILURES: 'check_failures',
  STORE_REASONING: 'store_reasoning',
  GET_PROVENANCE: 'get_provenance',
  MEMORY_GATE: 'memory_gate',
  CHECK_ENVIRONMENT: 'check_environment',
  GET_KNOWN_FAILURES: 'get_known_failures',
});

const TOOL_LIST = Object.freeze([
  TOOL_NAMES.LIST_OPEN_TASKS,
  TOOL_NAMES.CLAIM_TASK,
  TOOL_NAMES.SUBMIT_RESULT,
  TOOL_NAMES.GET_SCORECARD,
  TOOL_NAMES.SEARCH_REASONING,
  TOOL_NAMES.GET_REASONING,
  TOOL_NAMES.RECOMMEND_REASONING,
  TOOL_NAMES.GET_RECENT_REASONING,
  TOOL_NAMES.GET_POPULAR_TAGS,
  TOOL_NAMES.RESOLVE_REASONING,
  TOOL_NAMES.CHECK_FAILURES,
  TOOL_NAMES.STORE_REASONING,
  TOOL_NAMES.GET_PROVENANCE,
  TOOL_NAMES.MEMORY_GATE,
  TOOL_NAMES.CHECK_ENVIRONMENT,
  TOOL_NAMES.GET_KNOWN_FAILURES,
]);

// Error codes are permanent once assigned
const ERROR_CODES = Object.freeze({
  // list_open_tasks
  DB_UNAVAILABLE: 'db_unavailable',
  INVALID_DIFFICULTY: 'invalid_difficulty',
  // claim_task
  MISSING_TASK_ID: 'missing_task_id',
  TASK_NOT_FOUND: 'task_not_found',
  TASK_NOT_OPEN: 'task_not_open',
  TASK_EXPIRED: 'task_expired',
  CLAIM_RATE_LIMITED: 'claim_rate_limited',
  // submit_result
  MISSING_EXECUTION_ID: 'missing_execution_id',
  VALIDATION_FAILED: 'validation_failed',
  EXECUTION_NOT_FOUND: 'execution_not_found',
  EXECUTION_NOT_SUBMITTABLE: 'execution_not_submittable',
  EXECUTION_EXPIRED: 'execution_expired',
  DUPLICATE_RESULT: 'duplicate_result',
  SUBMIT_RATE_LIMITED: 'submit_rate_limited',
  SUBMIT_FAILED: 'submit_failed',
  // get_scorecard
  MISSING_AGENT_ID: 'missing_agent_id',
  AGENT_NOT_FOUND: 'agent_not_found',
  // reasoning tools
  REASONING_NOT_FOUND: 'reasoning_not_found',
  SEARCH_RATE_LIMITED: 'search_rate_limited',
  STORE_RATE_LIMITED: 'store_rate_limited',
});

// Response shape keys for each tool — append-only, never remove
const RESPONSE_SHAPES = Object.freeze({
  claim_task: Object.freeze({
    required: Object.freeze(['success', 'execution_id', 'task_id', 'claimed_by', 'claimed_at']),
    optional: Object.freeze(['note', 'next']),
  }),
  submit_result: Object.freeze({
    required: Object.freeze(['success', 'execution_id', 'task_id', 'status', 'submitted_by']),
    optional: Object.freeze(['duration_ms', 'result_length', 'scorecard']),
  }),
  get_scorecard: Object.freeze({
    required: Object.freeze(['success', 'agent_id', 'agent_name', 'tasks_completed', 'total_attempts', 'success_rate']),
    optional: Object.freeze(['avg_duration_ms', 'first_seen', 'last_active', 'badges']),
  }),
  list_open_tasks: Object.freeze({
    required: Object.freeze(['success']),
    optional: Object.freeze(['tasks']),
  }),
  resolve_reasoning: Object.freeze({
    required: Object.freeze(['hit']),
    optional: Object.freeze(['reasoning_id', 'solution_summary', 'key_insights', 'domain', 'difficulty', 'quality_score', 'success_rate', 'consensus_score', 'estimated_token_savings', 'provenance', 'provenance_compact', 'message', 'reason', 'best_match', 'auto_route', 'resolve_hints_available', 'resolve_hints_preview', '_prompt', 'next']),
  }),
});

// Rate limit constants
const RATE_LIMITS = Object.freeze({
  MCP_GLOBAL: { maxRequests: 60, windowMs: 60000 },
  CLAIM: { maxRequests: 5, windowMs: 60000 },
  SUBMIT: { maxRequests: 10, windowMs: 60000 },
  STORE: { maxRequests: 10, windowMs: 60000 },
});

// Tool Contract Registry — input/output/error schemas for every tool
// Each contract defines what an AI agent can expect when calling this tool
// Added in v2.0: append-only, never remove contracts
const TOOL_CONTRACTS = Object.freeze({
  list_open_tasks: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'], optional: true, description: 'Filter by difficulty' },
        limit: { type: 'number', default: 10, max: 50, optional: true, description: 'Max tasks to return' },
        type: { type: 'string', enum: ['external', 'meta'], optional: true, description: 'Filter by task source' },
        agent_id: { type: 'string', optional: true, description: 'Agent name for personalized hints' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        tasks: { type: 'array', items: { type: 'object', properties: { id: 'string', problem: 'string', difficulty: 'string', tags: 'array', resolve_hint: 'object|null' } } },
        total: { type: 'number' },
        resolve_hints_available: { type: 'number' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['db_unavailable', 'invalid_difficulty']),
      recoverable: true,
    }),
  }),
  claim_task: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        task_id: { type: 'string', required: true, description: 'Task ID from list_open_tasks' },
        agent_id: { type: 'string', default: 'mcp-agent', optional: true, description: 'Your agent name' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        execution_id: { type: 'string', required: true },
        task_id: { type: 'string', required: true },
        claimed_by: { type: 'string', required: true },
        claimed_at: { type: 'string', required: true },
        resolve_hint: { type: 'object|null' },
        next: { type: 'object', properties: { action: 'string', expected: { execution_id: 'string' } } },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_task_id', 'task_not_found', 'task_not_open', 'task_expired', 'claim_rate_limited', 'db_unavailable', 'claim_failed']),
      recoverable: true,
    }),
  }),
  submit_result: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        execution_id: { type: 'string', required: true, description: 'Execution ID from claim_task' },
        result: { type: 'string', required: true, minLength: 4, description: 'Your execution result' },
        agent_id: { type: 'string', default: 'mcp-agent', optional: true },
        provider: { type: 'string', optional: true, description: 'LLM provider used' },
        model: { type: 'string', optional: true, description: 'Model used' },
        tokens_used: { type: 'number', optional: true, description: 'Tokens consumed' },
        failure_type: { type: 'string', optional: true, description: 'Failure classification if execution failed (e.g. hallucination, timeout)' },
        failure_subtype: { type: 'string', optional: true, description: 'Failure sub-classification (e.g. fabricated_endpoint)' },
        evidence_refs: { type: 'array', items: { type: 'string' }, optional: true, description: 'IDs of evidence supporting this result' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        execution_id: { type: 'string', required: true },
        task_id: { type: 'string', required: true },
        status: { type: 'string', enum: ['completed'], required: true },
        submitted_by: { type: 'string', required: true },
        duration_ms: { type: 'number|null' },
        result_length: { type: 'number' },
        scorecard: { type: 'string' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_execution_id', 'validation_failed', 'execution_not_found', 'execution_not_submittable', 'execution_expired', 'duplicate_result', 'submit_rate_limited', 'submit_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  get_scorecard: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        agent_id: { type: 'string', required: true, description: 'Agent name to look up' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        agent_id: { type: 'string', required: true },
        agent_name: { type: 'string', required: true },
        tasks_completed: { type: 'number', required: true },
        total_attempts: { type: 'number', required: true },
        success_rate: { type: 'string', required: true },
        avg_duration_ms: { type: 'number|null' },
        first_seen: { type: 'string' },
        last_active: { type: 'string' },
        badges: { type: 'array', items: { type: 'string' } },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_agent_id', 'agent_not_found', 'scorecard_query_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  search_reasoning: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        problem_statement: { type: 'string', required: true, description: 'Problem to search for' },
        domain: { type: 'string', optional: true },
        difficulty: { type: 'string', optional: true },
        min_success_rate: { type: 'number', optional: true },
        min_consensus_score: { type: 'number', optional: true },
        has_solution: { type: 'boolean', optional: true },
        limit: { type: 'number', default: 5, max: 20, optional: true },
        agent_id: { type: 'string', default: 'mcp-agent', optional: true },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        results: { type: 'array', items: { type: 'object', properties: { id: 'string', problem_statement: 'string', solution_summary: 'string', domain: 'string', difficulty: 'string', success_rate: 'number', consensus_score: 'number|null', total_attempts: 'number', search_rank: 'number' } } },
        total: { type: 'number' },
        tip: { type: 'string' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_problem_statement', 'search_rate_limited', 'search_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  get_reasoning: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        id: { type: 'string', required: true, description: 'Reasoning object ID' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        id: { type: 'string', required: true },
        problem_id: { type: 'string' },
        problem_statement: { type: 'string' },
        context: { type: 'object' },
        attempts: { type: 'array' },
        solution: { type: 'object|null' },
        meta: { type: 'object' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_id', 'reasoning_not_found', 'get_reasoning_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  recommend_reasoning: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        domain: { type: 'string', optional: true },
        difficulty: { type: 'string', optional: true },
        limit: { type: 'number', default: 5, max: 20, optional: true },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        results: { type: 'array' },
        total: { type: 'number' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['recommend_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  get_recent_reasoning: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        limit: { type: 'number', default: 10, max: 20, optional: true },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        results: { type: 'array' },
        total: { type: 'number' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['recent_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  get_popular_tags: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        limit: { type: 'number', default: 20, max: 50, optional: true },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        tags: { type: 'array' },
        total: { type: 'number' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['tags_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  resolve_reasoning: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        problem_statement: { type: 'string', required: true, description: 'Problem to resolve' },
        domain: { type: 'string', optional: true },
        difficulty: { type: 'string', optional: true },
        auto_route: { type: 'boolean', optional: true, description: 'Auto-create task on MISS' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        hit: { type: 'boolean', required: true },
        reasoning_id: { type: 'string|null' },
        solution_summary: { type: 'string|null' },
        key_insights: { type: 'array|null' },
        estimated_token_savings: { type: 'number|null' },
        provenance: { type: 'string|null' },
        message: { type: 'string' },
        next: { type: 'object|null' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_problem_statement', 'resolve_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  get_provenance: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        reasoning_id: { type: 'string', required: true, description: 'Reasoning object ID' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        reasoning_id: { type: 'string', required: true },
        markdown_block: { type: 'string' },
        compact: { type: 'string' },
        problem: { type: 'string' },
        solution_summary: { type: 'string' },
        consensus_score: { type: 'number' },
        success_rate: { type: 'number' },
        url: { type: 'string' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_id', 'reasoning_not_found', 'provenance_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  check_failures: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        approach_description: { type: 'string', required: true, description: 'Planned approach to check' },
        domain: { type: 'string', optional: true },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        risk_score: { type: 'number', required: true },
        risk_level: { type: 'string', required: true },
        total_warnings: { type: 'number', required: true },
        warnings: { type: 'array', items: { type: 'object' } },
        message: { type: 'string' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_approach', 'check_failures_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  store_reasoning: Object.freeze({
    input_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        problem_statement: { type: 'string', required: true, description: 'Problem solved' },
        solution_summary: { type: 'string', required: true, description: 'Solution approach' },
        solution_content: { type: 'string', optional: true, maxLength: 10000 },
        key_insights: { type: 'array', items: { type: 'string' }, optional: true },
        domain: { type: 'string', optional: true },
        difficulty: { type: 'string', optional: true },
        tags: { type: 'array', items: { type: 'string' }, optional: true },
        agent_id: { type: 'string', default: 'mcp-agent', optional: true },
        provider: { type: 'string', optional: true },
        model: { type: 'string', optional: true },
        tokens_used: { type: 'number', optional: true },
        failure_type: { type: 'string', optional: true },
        failure_description: { type: 'string', optional: true },
        failure_subtype: { type: 'string', optional: true, description: 'Failure sub-classification (e.g. fabricated_endpoint under hallucination)' },
        parent_run_id: { type: 'string', optional: true, description: 'Execution ID of the parent run that led to this reasoning' },
        evidence_refs: { type: 'array', items: { type: 'string' }, optional: true, description: 'IDs of evidence supporting this reasoning (e.g. log_88, memory_12)' },
      }),
    }),
    output_schema: Object.freeze({
      type: 'object',
      properties: Object.freeze({
        success: { type: 'boolean', required: true },
        reasoning_id: { type: 'string', required: true },
        problem_id: { type: 'string', required: true },
        note: { type: 'string' },
        provenance: { type: 'string' },
        next: { type: 'object' },
      }),
    }),
    error_schema: Object.freeze({
      codes: Object.freeze(['missing_problem_statement', 'missing_solution_summary', 'store_rate_limited', 'store_failed', 'db_unavailable']),
      recoverable: true,
    }),
  }),
  memory_gate: Object.freeze({
    required: Object.freeze(['success', 'gate']),
    optional: Object.freeze([]),
  }),
  check_environment: Object.freeze({
    required: Object.freeze(['query', 'detected_environment', 'total_matches', 'results']),
    optional: Object.freeze([]),
  }),
  get_known_failures: Object.freeze({
    required: Object.freeze(['total_patterns', 'patterns']),
    optional: Object.freeze(['by_severity', 'by_category']),
  }),
});

// Execution constraints
const EXECUTION_CONSTRAINTS = Object.freeze({
  MAX_AGE_DAYS: 7,
  MIN_RESULT_BYTES: 4,
  EXECUTION_ID_PREFIX: 'EXEC_',
});

// Failure type constants — authoritative enumeration (v0.3)
// Aligned with lib/failure-taxonomy.js
const FAILURE_TYPE_NAMES = Object.freeze([
  'hallucination', 'contradiction', 'timeout', 'tool_misuse',
  'invalid_reasoning', 'memory_conflict', 'protocol_violation', 'execution_loop',
]);

module.exports = {
  PROTOCOL_VERSION,
  TOOL_NAMES,
  TOOL_LIST,
  ERROR_CODES,
  RESPONSE_SHAPES,
  RATE_LIMITS,
  EXECUTION_CONSTRAINTS,
  TOOL_CONTRACTS,
  FAILURE_TYPE_NAMES,
};
