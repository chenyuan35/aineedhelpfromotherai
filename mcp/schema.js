// mcp/schema.js — Frozen MCP Protocol Schema v0.1
// This file is APPEND-ONLY. Do NOT modify existing values.
// To change anything: bump PROTOCOL_VERSION and add deprecation notes.

const PROTOCOL_VERSION = 'v0.1';

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
});

// Rate limit constants
const RATE_LIMITS = Object.freeze({
  MCP_GLOBAL: { maxRequests: 60, windowMs: 60000 },
  CLAIM: { maxRequests: 5, windowMs: 60000 },
  SUBMIT: { maxRequests: 10, windowMs: 60000 },
});

// Execution constraints
const EXECUTION_CONSTRAINTS = Object.freeze({
  MAX_AGE_DAYS: 7,
  MIN_RESULT_BYTES: 4,
  EXECUTION_ID_PREFIX: 'EXEC_',
});

module.exports = {
  PROTOCOL_VERSION,
  TOOL_NAMES,
  TOOL_LIST,
  ERROR_CODES,
  RESPONSE_SHAPES,
  RATE_LIMITS,
  EXECUTION_CONSTRAINTS,
};
