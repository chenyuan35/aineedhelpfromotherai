// api-handlers/case-studies.js — Case study records from PG execution_history
// Platform is a marketplace — these are records of AI agents executing tasks,
// NOT the platform doing execution itself.

const path = require('path');
const fs = require('fs');
const { queryExecutions, getExecution } = require('../lib/execution-history');

const CASES_DIR = path.join(__dirname, '..', 'data', 'case-studies');

function formatCaseStudy(exec) {
  return {
    id: `CASE_${exec.execution_id || exec.execution_id}`,
    title: `AI Agent Execution: ${exec.task_type || 'task'} — ${exec.agent_id || 'unknown'}`,
    execution_id: exec.execution_id,
    task_id: exec.task_id,
    agent_id: exec.agent_id,
    task_type: exec.task_type,
    status: exec.status,
    timeline: {
      created_at: exec.created_at,
      claimed_at: exec.claimed_at || null,
      completed_at: exec.completed_at || null,
      duration_ms: exec.duration_ms || null
    },
    result_summary: exec.result ? (typeof exec.result === 'string' ? exec.result.substring(0, 200) : JSON.stringify(exec.result).substring(0, 200)) : null,
    tokens_used: exec.tokens_used || null,
    platform_note: 'Marketplace — platform does NOT execute tasks. AI agents execute independently.'
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Try PG first, fall back to file-based case studies
    let caseStudies = [];

    try {
      const pgExecs = await queryExecutions({ status: 'completed', limit: 20 });
      if (pgExecs && pgExecs.length > 0) {
        caseStudies = pgExecs.map(formatCaseStudy);
      }
    } catch (pgErr) {
      // PG query failed, fall through to file-based
      console.warn('PG query failed, falling back to file-based case studies:', pgErr.message);
    }

    // If PG returned nothing, try file-based
    if (caseStudies.length === 0) {
      try {
        if (!fs.existsSync(CASES_DIR)) {
          fs.mkdirSync(CASES_DIR, { recursive: true });
        }
        const files = fs.readdirSync(CASES_DIR).filter(f => f.endsWith('.json'));
        caseStudies = files.map(f => {
          try {
            return JSON.parse(fs.readFileSync(path.join(CASES_DIR, f), 'utf8'));
          } catch { return null; }
        }).filter(Boolean);
      } catch (dirErr) {
        console.warn('File-based case studies unavailable:', dirErr.message);
      }
    }

    // Single case study by ID
    const requestedId = req.params && req.params.path;
    if (requestedId) {
      const match = caseStudies.find(cs =>
        cs.id === requestedId || cs.execution_id === requestedId
      );
      if (!match) {
        return res.status(404).json({ success: false, error: 'Case study not found' });
      }
      return res.status(200).json({ success: true, data: match });
    }

    res.status(200).json({
      success: true,
      data: {
        case_studies: caseStudies,
        total: caseStudies.length,
        source: caseStudies.length > 0 && caseStudies[0].timeline ? 'execution_history (PG)' : 'file-based'
      },
      meta: {
        endpoint: '/api/case-studies',
        description: 'Real AI-to-AI execution case studies. Platform records tasks — AI agents execute independently.'
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
