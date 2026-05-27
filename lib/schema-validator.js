// lib/schema-validator.js — Runtime Tool Contract Validation
// Validates MCP tool call inputs/outputs against TOOL_CONTRACTS at runtime.
// Catches malformed requests before they reach tool handlers.

const { TOOL_CONTRACTS, ERROR_CODES: SCHEMA_ERRORS } = require('../mcp/schema');

function validateToolInput(toolName, args) {
  const contract = TOOL_CONTRACTS[toolName];
  if (!contract) {
    return { valid: false, error: 'unknown_tool', message: `No contract for tool: ${toolName}` };
  }

  const schema = contract.input_schema;
  if (!schema || !schema.properties) {
    return { valid: true };
  }

  const errors = [];
  const props = schema.properties;
  const provided = args || {};

  for (const [key, def] of Object.entries(props)) {
    const val = provided[key];
    const isRequired = def.required === true;

    if (isRequired && (val === undefined || val === null)) {
      errors.push({ field: key, reason: 'required', message: `${key} is required` });
      continue;
    }

    if (val === undefined || val === null) continue;

    if (def.type === 'string' && typeof val !== 'string') {
      errors.push({ field: key, reason: 'type_mismatch', message: `${key} must be a string` });
    }

    if (def.type === 'number' && typeof val !== 'number') {
      errors.push({ field: key, reason: 'type_mismatch', message: `${key} must be a number` });
    }

    if (def.type === 'boolean' && typeof val !== 'boolean') {
      errors.push({ field: key, reason: 'type_mismatch', message: `${key} must be a boolean` });
    }

    if (def.enum && !def.enum.includes(val)) {
      errors.push({ field: key, reason: 'invalid_enum', message: `${key} must be one of: ${def.enum.join(', ')}` });
    }

    if (def.minLength && typeof val === 'string' && val.length < def.minLength) {
      errors.push({ field: key, reason: 'min_length', message: `${key} min length is ${def.minLength}` });
    }

    if (def.maxLength && typeof val === 'string' && val.length > def.maxLength) {
      errors.push({ field: key, reason: 'max_length', message: `${key} max length is ${def.maxLength}` });
    }

    if (def.min !== undefined && typeof val === 'number' && val < def.min) {
      errors.push({ field: key, reason: 'min_value', message: `${key} min value is ${def.min}` });
    }

    if (def.max !== undefined && typeof val === 'number' && val > def.max) {
      errors.push({ field: key, reason: 'max_value', message: `${key} max value is ${def.max}` });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: 'input_validation_failed',
      message: `Tool ${toolName} input validation failed`,
      errors,
    };
  }

  return { valid: true };
}

function validateToolOutput(toolName, result) {
  const contract = TOOL_CONTRACTS[toolName];
  if (!contract) return { valid: true };

  const schema = contract.output_schema;
  if (!schema || !schema.properties) return { valid: true };

  const errors = [];
  const props = schema.properties;

  for (const [key, def] of Object.entries(props)) {
    const isRequired = def.required === true;
    const val = result?.[key];

    if (isRequired && (val === undefined || val === null)) {
      errors.push({ field: key, reason: 'missing_required', message: `${key} is required in output` });
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: 'output_validation_failed',
      message: `Tool ${toolName} output missing required fields`,
      errors,
    };
  }

  return { valid: true };
}

function getToolContract(toolName) {
  return TOOL_CONTRACTS[toolName] || null;
}

function getAllContracts() {
  return TOOL_CONTRACTS;
}

module.exports = {
  validateToolInput,
  validateToolOutput,
  getToolContract,
  getAllContracts,
};
