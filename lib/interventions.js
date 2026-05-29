const dynamics = require('./failure-dynamics');

function getAllInterventions() {
  const all = dynamics.getDynamics().dynamics.flatMap(d => 
    (d.interventions || []).map(i => ({
      ...i,
      dynamic_id: d.id,
      dynamic_name: d.name,
      dynamic_short: d.short,
    }))
  );
  return all;
}

function getInterventions(options) {
  const { dynamic_id, type, limit } = options || {};
  let filtered = getAllInterventions();
  if (dynamic_id) filtered = filtered.filter(i => i.dynamic_id === dynamic_id);
  if (type) filtered = filtered.filter(i => i.type === type);
  const total = filtered.length;
  if (limit) filtered = filtered.slice(0, limit);
  return { interventions: filtered, total };
}

function getInterventionsStats() {
  const all = getAllInterventions();
  return {
    total_interventions: all.length,
    by_type: all.reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {}),
    total_applied: all.reduce((s, i) => s + (i.applied_count || 0), 0),
    tracking_pending: all.filter(i => i.effectiveness_tracking === 'pending').length,
  };
}

module.exports = { getInterventions, getInterventionsStats };
