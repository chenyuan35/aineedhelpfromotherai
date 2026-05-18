// Lifecycle State Machine — Execution Lifecycle Formalization (P0 #101)
//
// Task states:
//   OPEN → CLAIMED → EXECUTING → SUBMITTED → COMPLETED
//                              → FAILED
//   OPEN → EXPIRED
//   OPEN → STALE
//   Any  → ARCHIVED
//
// Execution states (per execution record):
//   pending → claimed → executing → submitted → completed
//                                   → failed

const TASK_STATES = Object.freeze([
  'OPEN', 'CLAIMED', 'EXECUTING', 'SUBMITTED', 'COMPLETED',
  'FAILED', 'STALE', 'EXPIRED', 'ARCHIVED'
]);

const EXECUTION_STATES = Object.freeze([
  'pending', 'claimed', 'executing', 'submitted', 'completed', 'failed'
]);

// Valid transitions: { from: [to, to, ...] }
const TASK_TRANSITIONS = Object.freeze({
  'OPEN':       ['CLAIMED', 'EXPIRED', 'STALE', 'ARCHIVED'],
  'CLAIMED':    ['EXECUTING', 'COMPLETED', 'FAILED', 'STALE', 'ARCHIVED'],
  'EXECUTING':  ['SUBMITTED', 'FAILED', 'ARCHIVED'],
  'SUBMITTED':  ['COMPLETED', 'FAILED', 'ARCHIVED'],
  'COMPLETED':  ['ARCHIVED'],
  'FAILED':     ['OPEN', 'ARCHIVED'],     // FAILED → OPEN allows reclaim after fix
  'STALE':      ['OPEN', 'EXPIRED', 'ARCHIVED'],
  'EXPIRED':    ['ARCHIVED'],
  'ARCHIVED':   []
});

const EXECUTION_TRANSITIONS = Object.freeze({
  'pending':   ['claimed', 'failed'],
  'claimed':   ['executing', 'submitted', 'completed', 'failed'],
  'executing': ['submitted', 'completed', 'failed'],
  'submitted': ['completed', 'failed'],
  'completed': [],
  'failed':    []
});

function validateTaskTransition(fromState, toState) {
  const allowed = TASK_TRANSITIONS[fromState];
  if (!allowed) {
    return { valid: false, error_code: 'UNKNOWN_STATE', detail: `Unknown task state: ${fromState}` };
  }
  if (!allowed.includes(toState)) {
    return {
      valid: false,
      error_code: 'ILLEGAL_TRANSITION',
      detail: `Cannot transition task from ${fromState} to ${toState}`,
      allowed_transitions: allowed,
      current_state: fromState,
      requested_state: toState
    };
  }
  return { valid: true };
}

function validateExecutionTransition(fromState, toState) {
  const allowed = EXECUTION_TRANSITIONS[fromState];
  if (!allowed) {
    return { valid: false, error_code: 'UNKNOWN_STATE', detail: `Unknown execution state: ${fromState}` };
  }
  if (!allowed.includes(toState)) {
    return {
      valid: false,
      error_code: 'ILLEGAL_EXECUTION_TRANSITION',
      detail: `Cannot transition execution from ${fromState} to ${toState}`,
      allowed_transitions: allowed,
      current_state: fromState,
      requested_state: toState
    };
  }
  return { valid: true };
}

// Check if a transition represents a terminal state
function isTerminalTaskState(state) {
  return ['COMPLETED', 'FAILED', 'EXPIRED', 'ARCHIVED'].includes(state);
}

function isTerminalExecutionState(state) {
  return ['completed', 'failed'].includes(state);
}

module.exports = {
  TASK_STATES,
  EXECUTION_STATES,
  TASK_TRANSITIONS,
  EXECUTION_TRANSITIONS,
  validateTaskTransition,
  validateExecutionTransition,
  isTerminalTaskState,
  isTerminalExecutionState
};
