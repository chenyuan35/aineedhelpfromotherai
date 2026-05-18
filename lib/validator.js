// lib/validator.js — AI-oriented task result validation
// Validates result structure and executability, not human aesthetics.
// Platform does NOT execute tasks — validation checks if submitted result
// is structurally valid and machine-consumable.
//
// Validation types by task_type:
//   codegen     → vm sandbox execution, checks for function definition + output
//   analysis    → structured output check (JSON or marked sections)
//   security    → vm sandbox + checks for findings structure
//   writing     → minimum content length + structural markers
//   research    → structured output (citations, findings)
//   summarize   → compression ratio check (result < problem = too short)
//   transform   → JSON.parse + structure validation
//   extract     → JSON.parse + array/object check

const vm = require('vm');
const crypto = require('crypto');

// --- Error codes (machine-readable) ---
const VALIDATION_ERRORS = Object.freeze({
  EMPTY_RESULT: 'empty_result',
  TOO_SHORT: 'too_short',
  SYNTAX_ERROR: 'syntax_error',
  RUNTIME_ERROR: 'runtime_error',
  NO_FUNCTION: 'no_function',
  NO_OUTPUT: 'no_output',
  INVALID_JSON: 'invalid_json',
  WRONG_STRUCTURE: 'wrong_structure',
  TOO_SIMILAR: 'too_similar',
  TIMEOUT: 'execution_timeout',
});

// --- Similarity check (Jaccard on n-grams) ---
function computeSimilarity(a, b) {
  if (!a || !b) return 0;
  const ngramSize = 3;
  const ngrams = (str) => {
    const s = str.toLowerCase().replace(/\s+/g, ' ').trim();
    const grams = new Set();
    for (let i = 0; i <= s.length - ngramSize; i++) {
      grams.add(s.slice(i, i + ngramSize));
    }
    return grams;
  };
  const aGrams = ngrams(a);
  const bGrams = ngrams(b);
  if (aGrams.size === 0 || bGrams.size === 0) return 0;
  let intersection = 0;
  for (const g of aGrams) {
    if (bGrams.has(g)) intersection++;
  }
  return intersection / (aGrams.size + bGrams.size - intersection);
}

// --- Code validation (vm sandbox) ---
function validateCode(result, options = {}) {
  const errors = [];
  const timeout = options.timeout || 3000;

  // Check for function definition
  const hasFunction = /function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*{|def\s+\w+\s*\(/.test(result);
  if (!hasFunction) {
    errors.push({ code: VALIDATION_ERRORS.NO_FUNCTION, message: 'No function definition found in code' });
  }

  // Check for output mechanism
  const hasOutput = /console\.log|console\.error|process\.stdout|print\(|return\s+/.test(result);
  if (!hasOutput) {
    errors.push({ code: VALIDATION_ERRORS.NO_OUTPUT, message: 'No output mechanism found (console.log/print/return)' });
  }

  // Execute in sandbox
  try {
    const sandbox = {
      console: {
        log: () => {},
        error: () => {},
        warn: () => {},
      },
      process: { stdout: { write: () => {} } },
      setTimeout: () => {},
      setInterval: () => {},
      require: undefined,
      module: undefined,
      exports: undefined,
      __dirname: '',
      __filename: '',
    };

    const context = vm.createContext(sandbox);
    vm.runInContext(result, context, { timeout, displayErrors: false });
  } catch (err) {
    if (err.name === 'SyntaxError') {
      errors.push({ code: VALIDATION_ERRORS.SYNTAX_ERROR, message: err.message });
    } else if (err.name === 'Error' || err.name === 'TypeError' || err.name === 'ReferenceError') {
      errors.push({ code: VALIDATION_ERRORS.RUNTIME_ERROR, message: err.message });
    } else if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
      errors.push({ code: VALIDATION_ERRORS.TIMEOUT, message: `Execution exceeded ${timeout}ms timeout` });
    }
  }

  return errors;
}

// --- JSON/Data validation ---
function validateJson(result, expectedStructure = null) {
  const errors = [];

  try {
    const parsed = JSON.parse(result);
    if (expectedStructure) {
      // Check if parsed JSON has expected top-level keys
      if (typeof expectedStructure === 'object' && !Array.isArray(expectedStructure)) {
        const missingKeys = Object.keys(expectedStructure).filter(k => !(k in parsed));
        if (missingKeys.length > 0) {
          errors.push({ code: VALIDATION_ERRORS.WRONG_STRUCTURE, message: `Missing keys: ${missingKeys.join(', ')}` });
        }
      }
      if (Array.isArray(expectedStructure) && !Array.isArray(parsed)) {
        errors.push({ code: VALIDATION_ERRORS.WRONG_STRUCTURE, message: 'Expected array, got object' });
      }
    }
  } catch (err) {
    errors.push({ code: VALIDATION_ERRORS.INVALID_JSON, message: err.message });
  }

  return errors;
}

// --- Text validation (AI-oriented: structure, not aesthetics) ---
function validateText(result, problem = '', options = {}) {
  const errors = [];
  const minLength = options.minLength || 50;

  if (!result || result.trim().length === 0) {
    errors.push({ code: VALIDATION_ERRORS.EMPTY_RESULT, message: 'Result is empty' });
    return errors;
  }

  if (result.trim().length < minLength) {
    errors.push({ code: VALIDATION_ERRORS.TOO_SHORT, message: `Result too short (${result.trim().length} chars, minimum ${minLength})` });
  }

  // Check for structural markers (AI-generated structure, not human markdown)
  const hasStructure =
    /```[\s\S]*```/.test(result) ||           // code blocks
    /\n\s*[-*]\s/.test(result) ||              // list items
    /{\s*"[^"]+"\s*:/.test(result) ||          // inline JSON
    /\n\s*\d+\.\s/.test(result) ||             // numbered lists
    /\[(.*?)\]\((.*?)\)/.test(result) ||       // links/citations
    /===(.*?)===/.test(result) ||              // section dividers
    /\n[A-Z][\w\s]+:\n/.test(result);          // labeled sections

  if (!hasStructure && result.trim().length > 200) {
    // Only flag if result is long enough to have structure
    errors.push({ code: VALIDATION_ERRORS.NO_OUTPUT, message: 'No structural markers found in result' });
  }

  return errors;
}

// --- Research validation (citations, findings structure) ---
function validateResearch(result, problem = '') {
  const errors = [];

  if (!result || result.trim().length < 100) {
    errors.push({ code: VALIDATION_ERRORS.TOO_SHORT, message: 'Research result too short' });
    return errors;
  }

  // Check for citation-like patterns
  const hasCitations =
    /\[.*?\]/.test(result) ||                  // bracket citations
    /https?:\/\//.test(result) ||              // URLs
    /\(.*?\.com.*?\)/.test(result) ||          // parenthetical refs
    /source|reference|citation|ref:/i.test(result);

  if (!hasCitations) {
    errors.push({ code: VALIDATION_ERRORS.NO_OUTPUT, message: 'No citations or references found' });
  }

  return errors;
}

// --- Summarization validation (compression ratio) ---
function validateSummarize(result, problem = '') {
  const errors = [];

  if (!result || result.trim().length === 0) {
    errors.push({ code: VALIDATION_ERRORS.EMPTY_RESULT, message: 'Summary is empty' });
    return errors;
  }

  // Summary should be shorter than problem but not too short
  const problemLen = problem.length;
  const resultLen = result.trim().length;

  if (resultLen > problemLen) {
    errors.push({ code: VALIDATION_ERRORS.WRONG_STRUCTURE, message: `Summary (${resultLen} chars) longer than source (${problemLen} chars)` });
  }

  if (resultLen < Math.max(20, problemLen * 0.1)) {
    errors.push({ code: VALIDATION_ERRORS.TOO_SHORT, message: 'Summary too compressed (< 10% of source)' });
  }

  return errors;
}

// --- Main validation dispatcher ---
function validateResult(result, taskType, taskData = {}) {
  const errors = [];

  // Universal: empty/whitespace check
  if (!result || (typeof result === 'string' && result.trim().length === 0)) {
    return [{ code: VALIDATION_ERRORS.EMPTY_RESULT, message: 'Result is empty' }];
  }

  const resultText = typeof result === 'string' ? result : JSON.stringify(result);

  switch (taskType) {
    case 'codegen':
    case 'script':
      errors.push(...validateCode(resultText, taskData.options));
      break;

    case 'analysis':
    case 'security':
      // Try JSON first, fall back to text structure
      if (resultText.trim().startsWith('{') || resultText.trim().startsWith('[')) {
        errors.push(...validateJson(resultText, taskData.expectedStructure));
      } else {
        errors.push(...validateText(resultText, taskData.problem, { minLength: 100 }));
      }
      break;

    case 'transform':
    case 'extract':
      errors.push(...validateJson(resultText, taskData.expectedStructure));
      break;

    case 'writing':
      errors.push(...validateText(resultText, taskData.problem, { minLength: 200 }));
      break;

    case 'research':
      errors.push(...validateResearch(resultText, taskData.problem));
      break;

    case 'summarize':
      errors.push(...validateSummarize(resultText, taskData.problem || ''));
      break;

    default:
      // Generic: check minimum content
      if (resultText.trim().length < 10) {
        errors.push({ code: VALIDATION_ERRORS.TOO_SHORT, message: 'Result too short (minimum 10 chars)' });
      }
  }

  return errors;
}

module.exports = {
  validateResult,
  validateCode,
  validateJson,
  validateText,
  validateResearch,
  validateSummarize,
  computeSimilarity,
  VALIDATION_ERRORS,
};
