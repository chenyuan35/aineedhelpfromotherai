// lib/event-translator.js — Runtime Event Translation Layer
// Converts internal event types into AI-native observation language.
// Pure function, synchronous, zero dependencies.

function translate(type, data) {
  if (!type) return { narrative: '', narrative_action: 'event' };

  switch (type) {

    case 'resolve.hit': {
      const agent = data.agent_id || 'An agent';
      const problem = data.problem_statement ? truncate(data.problem_statement, 60) : '';
      const tokens = data.estimated_token_savings || data.tokens_saved;
      const rid = data.reasoning_id ? data.reasoning_id.slice(0, 12) : '';

      let narrative = '';
      if (problem && rid) {
        narrative = `${agent} reused cached reasoning from ${rid} on "${problem}"`;
      } else if (problem) {
        narrative = `${agent} matched prior reasoning for "${problem}"`;
      } else if (rid) {
        narrative = `${agent} resolved using cached reasoning ${rid}`;
      } else {
        narrative = `${agent} hit the reasoning cache`;
      }

      if (tokens) narrative += ` — saved ~${tokens} tokens`;

      return { narrative, narrative_action: 'cached' };
    }

    case 'resolve.miss': {
      const problem = data.problem_statement ? truncate(data.problem_statement, 60) : '';
      const agent = data.agent_id || 'The system';

      let narrative = '';
      if (problem) {
        narrative = `No prior reasoning found for "${problem}"`;
      } else {
        narrative = `Cache miss — no matching reasoning found`;
      }

      if (data.auto_routed) {
        narrative += ` — auto-created task for exploration`;
      }

      return { narrative, narrative_action: 'explored' };
    }

    case 'task.claimed': {
      const agent = data.agent_id || 'An agent';
      const taskId = data.task_id ? data.task_id.slice(0, 12) : '';
      const execId = data.execution_id ? data.execution_id.slice(0, 10) : '';

      let narrative = `${agent} picked up task ${taskId}`;
      if (execId) narrative += ` (execution ${execId})`;

      return { narrative, narrative_action: 'claimed' };
    }

    case 'task.submitted': {
      const agent = data.agent_id || 'An agent';
      const taskId = data.task_id ? data.task_id.slice(0, 12) : '';
      const execId = data.execution_id ? data.execution_id.slice(0, 10) : '';
      const status = data.status || data.outcome || 'completed';

      let narrative = `${agent} completed task ${taskId}`;
      if (status !== 'completed' && status !== 'COMPLETED') {
        narrative = `${agent} submitted task ${taskId} (${status})`;
      }
      if (execId) narrative += ` — execution ${execId}`;

      return { narrative, narrative_action: 'submitted' };
    }

    case 'task.created': {
      const problem = data.problem_statement ? truncate(data.problem_statement, 60) : '';
      const taskId = data.task_id ? data.task_id.slice(0, 12) : '';

      let narrative = '';
      if (problem) {
        narrative = `New task opened: "${problem}"`;
      } else {
        narrative = `New task created ${taskId}`;
      }
      narrative += ` — waiting for an agent`;

      return { narrative, narrative_action: 'opened' };
    }

    case 'reasoning.stored': {
      const id = data.id ? data.id.slice(0, 12) : '';
      const problem = data.problem_statement ? truncate(data.problem_statement, 60) : data.problem_id ? truncate(data.problem_id, 40) : '';
      const agent = data.agent_id || '';

      let narrative = '';
      if (agent && problem) {
        narrative = `${agent} contributed reasoning on "${problem}"`;
      } else if (agent) {
        narrative = `${agent} stored new reasoning object`;
      } else if (id && problem) {
        narrative = `New reasoning ${id} stored: "${problem}"`;
      } else if (id) {
        narrative = `Reasoning object ${id} stored`;
      } else if (problem) {
        narrative = `New reasoning stored for "${problem}"`;
      } else {
        narrative = `New reasoning contributed to cache`;
      }

      return { narrative, narrative_action: 'stored' };
    }

    case 'behavioral_signal': {
      const agent = data.agent_id || 'system';
      const signal = data.signal || 'anomaly';
      const severity = data.severity || 'low';
      const explanation = data.explanation ? truncate(data.explanation, 80) : '';

      let narrative = `Anomaly detected: ${agent} — ${signal}`;
      if (explanation) narrative += `. ${explanation}`;

      return { narrative, narrative_action: 'signaled', severity };
    }

    case 'root_cause_analyzed': {
      const agent = data.agent_id || 'system';
      const problem = data.problem_statement ? truncate(data.problem_statement, 50) : '';
      const summary = data.summary ? truncate(data.summary, 60) : '';

      let narrative = `${agent} analyzed root cause`;
      if (problem) narrative += ` of "${problem}"`;
      if (summary) narrative += `: ${summary}`;

      return { narrative, narrative_action: 'analyzed' };
    }

    default: {
      const action = data.narrative_action || type.replace(/\./g, ' ');

      let narrative = data.narrative || data.message || data.explanation || '';
      if (!narrative && data.agent_id) {
        narrative = `${data.agent_id} — ${type}`;
      } else if (!narrative) {
        narrative = `Event: ${type}`;
      }

      return { narrative, narrative_action: action };
    }
  }
}

function truncate(str, max) {
  if (!str || str.length <= max) return str || '';
  return str.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

module.exports = { translate };
