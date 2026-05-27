// lib/failure-taxonomy.js — AI Behavioral Failure Taxonomy
// Purpose: Authoritative classification of AI agent failure modes
// Philosophy: "AI reliability" is fundamentally failure pattern science
// This is NOT a logging utility — it's the vocabulary the system uses to understand behavior

const FAILURE_TYPES = Object.freeze({
  hallucination: Object.freeze({
    label: 'Hallucination',
    severity: 'critical',
    description: 'Agent produces fabricated information presented as fact',
    subtypes: Object.freeze({
      fabricated_endpoint: 'Fabricated API endpoint',
      fake_stacktrace: 'Invented error trace',
      invented_dependency: 'Non-existent package or module',
      false_claim: 'Unsupported factual claim',
    }),
  }),
  contradiction: Object.freeze({
    label: 'Contradiction',
    severity: 'high',
    description: 'Agent output conflicts with prior output or provided context',
    subtypes: Object.freeze({
      self_contradict: 'Agent contradicts own prior output',
      context_conflict: 'Output conflicts with provided context',
    }),
  }),
  timeout: Object.freeze({
    label: 'Timeout',
    severity: 'medium',
    description: 'Operation exceeded time constraints',
    subtypes: Object.freeze({
      execution_timeout: 'Task execution exceeded time limit',
      api_timeout: 'External API call timeout',
    }),
  }),
  tool_misuse: Object.freeze({
    label: 'Tool Misuse',
    severity: 'high',
    description: 'Agent uses tools incorrectly or invents tool capabilities',
    subtypes: Object.freeze({
      wrong_arguments: 'Incorrect tool arguments',
      missing_required_param: 'Required parameter omitted',
      invalid_flag: 'Non-existent flag or option',
    }),
  }),
  invalid_reasoning: Object.freeze({
    label: 'Invalid Reasoning',
    severity: 'high',
    description: 'Logical errors in agent reasoning chain',
    subtypes: Object.freeze({
      logical_fallacy: 'Invalid logical inference',
      circular_reasoning: 'Conclusion used as premise',
      unsupported_conclusion: 'Conclusion not derived from evidence',
    }),
  }),
  memory_conflict: Object.freeze({
    label: 'Memory Conflict',
    severity: 'medium',
    description: 'Cached or stored memories cause incorrect behavior',
    subtypes: Object.freeze({
      stale_memory: 'Using outdated cached result',
      conflicting_memories: 'Two memories contradict each other',
    }),
  }),
  protocol_violation: Object.freeze({
    label: 'Protocol Violation',
    severity: 'medium',
    description: 'Agent does not follow expected workflow or protocol',
    subtypes: Object.freeze({
      wrong_sequence: 'Called tools in wrong order',
      missing_step: 'Skipped required workflow step',
      invalid_state: 'Operation on resource in wrong state',
    }),
  }),
  execution_loop: Object.freeze({
    label: 'Execution Loop',
    severity: 'high',
    description: 'Agent repeats same failing action without making progress',
    subtypes: Object.freeze({
      retry_loop: 'Repeatedly retrying same failing action',
      reasoning_loop: 'Circular reasoning without progress',
    }),
  }),
});

// Validate a failure type + subtype combination
function validateFailureType(type, subtype) {
  if (!type) return { valid: false, error: 'failure_type is required' };

  const typeDef = FAILURE_TYPES[type];
  if (!typeDef) {
    return {
      valid: false,
      error: `Unknown failure_type "${type}". Valid types: ${Object.keys(FAILURE_TYPES).join(', ')}`,
    };
  }

  if (subtype) {
    if (!typeDef.subtypes[subtype]) {
      return {
        valid: false,
        error: `Unknown subtype "${subtype}" for type "${type}". Valid subtypes: ${Object.keys(typeDef.subtypes).join(', ')}`,
      };
    }
  }

  return {
    valid: true,
    severity: typeDef.severity,
    label: typeDef.label,
    subtype_label: subtype ? typeDef.subtypes[subtype] : null,
  };
}

// Return the full taxonomy tree
function getFailureTaxonomy() {
  return {
    version: '1.0.0',
    total_types: Object.keys(FAILURE_TYPES).length,
    types: Object.fromEntries(
      Object.entries(FAILURE_TYPES).map(([key, def]) => [
        key,
        {
          label: def.label,
          severity: def.severity,
          description: def.description,
          total_subtypes: Object.keys(def.subtypes).length,
          subtypes: Object.fromEntries(
            Object.entries(def.subtypes).map(([sk, sv]) => [sk, sv])
          ),
        },
      ])
    ),
  };
}

// Simple keyword-based failure classifier
// Given an error description, suggest the most likely failure_type + subtype
function classifyFailure(description) {
  if (!description || typeof description !== 'string') {
    return { type: null, subtype: null, confidence: 0 };
  }

  const lower = description.toLowerCase();

  // Keyword patterns → failure classification
  const patterns = [
    // Hallucination patterns
    { keywords: ['not found', 'does not exist', "doesn't exist", 'no such', 'nonexistent'], type: 'hallucination', subtype: 'fabricated_endpoint' },
    { keywords: ['fake', 'fabricated', 'invented', 'made up'], type: 'hallucination', subtype: 'false_claim' },
    { keywords: ['stack trace', 'stacktrace', 'error trace', 'traceback'], type: 'hallucination', subtype: 'fake_stacktrace' },
    { keywords: ['package', 'module', 'dependency', 'install'], type: 'hallucination', subtype: 'invented_dependency' },

    // Contradiction patterns
    { keywords: ['contradict', 'conflict', 'inconsistent', 'disagree'], type: 'contradiction', subtype: 'self_contradict' },
    { keywords: ['context', 'provided info', 'given context'], type: 'contradiction', subtype: 'context_conflict' },

    // Timeout patterns
    { keywords: ['timeout', 'timed out', 'time limit', 'deadline exceeded'], type: 'timeout', subtype: 'execution_timeout' },
    { keywords: ['api timeout', 'request timeout', 'connection timeout'], type: 'timeout', subtype: 'api_timeout' },

    // Tool misuse patterns
    { keywords: ['wrong argument', 'invalid argument', 'bad parameter'], type: 'tool_misuse', subtype: 'wrong_arguments' },
    { keywords: ['missing parameter', 'required param', 'missing required'], type: 'tool_misuse', subtype: 'missing_required_param' },
    { keywords: ['invalid flag', 'unknown flag', 'unknown option', 'unrecognized option'], type: 'tool_misuse', subtype: 'invalid_flag' },

    // Invalid reasoning patterns
    { keywords: ['logical error', 'fallacy', 'invalid inference'], type: 'invalid_reasoning', subtype: 'logical_fallacy' },
    { keywords: ['circular', 'begging the question', 'tautology'], type: 'invalid_reasoning', subtype: 'circular_reasoning' },
    { keywords: ['unsupported', 'unjustified', 'no evidence', 'baseless'], type: 'invalid_reasoning', subtype: 'unsupported_conclusion' },

    // Memory conflict patterns
    { keywords: ['stale', 'outdated', 'old cache', 'cached version'], type: 'memory_conflict', subtype: 'stale_memory' },
    { keywords: ['conflicting memory', 'memory mismatch', 'contradictory cache'], type: 'memory_conflict', subtype: 'conflicting_memories' },

    // Protocol violation patterns
    { keywords: ['wrong order', 'out of sequence', 'wrong sequence'], type: 'protocol_violation', subtype: 'wrong_sequence' },
    { keywords: ['skipped step', 'missing step', 'incomplete workflow'], type: 'protocol_violation', subtype: 'missing_step' },
    { keywords: ['wrong state', 'invalid state', 'not in correct state'], type: 'protocol_violation', subtype: 'invalid_state' },

    // Execution loop patterns
    { keywords: ['retry', 'repeated', 'trying again', 'keep failing'], type: 'execution_loop', subtype: 'retry_loop' },
    { keywords: ['loop', 'stuck', 'spinning', 'no progress'], type: 'execution_loop', subtype: 'reasoning_loop' },
  ];

  let bestMatch = { type: null, subtype: null, confidence: 0, matched: 0 };

  for (const pattern of patterns) {
    const matched = pattern.keywords.filter(kw => lower.includes(kw)).length;
    if (matched > bestMatch.matched) {
      bestMatch = {
        type: pattern.type,
        subtype: pattern.subtype,
        confidence: Math.min(matched / pattern.keywords.length, 1),
        matched,
      };
    }
  }

  // Clean up internal fields
  delete bestMatch.matched;
  return bestMatch;
}

// Get severity level for a failure type
function getSeverity(type) {
  const typeDef = FAILURE_TYPES[type];
  return typeDef ? typeDef.severity : 'unknown';
}

// Get all type names as a flat array
function getTypeNames() {
  return Object.keys(FAILURE_TYPES);
}

module.exports = {
  FAILURE_TYPES,
  validateFailureType,
  getFailureTaxonomy,
  classifyFailure,
  getSeverity,
  getTypeNames,
};
