// Person-level reports inside one original discussion are not independent confirmations.
// Source-ID uniqueness is necessary, but reviewers must also check crossposts and authors.
export const gradeServiceEvidence = rows => {
  const uniqueRows = [...new Map(rows.map(x => [x.dedupeKey || `${x.sourceId || ''}:${x.reportedAt || ''}:${x.outcome || ''}`, x])).values()];
  const success = uniqueRows.filter(x => x.outcome === 'success').length;
  const failure = uniqueRows.filter(x => x.outcome === 'failure' || x.outcome === 'non-success').length;
  const mixed = uniqueRows.length - success - failure;
  const n = uniqueRows.length;
  const independentSourceCount = new Set(uniqueRows.map(x => x.sourceId).filter(Boolean)).size;
  let grade = 'insufficient', label = 'Not enough independently sourced data';
  if (n >= 5 && independentSourceCount >= 5 && success / n >= 0.8 && failure <= 1 && mixed === 0) {
    grade = 'A'; label = 'Strong';
  } else if (n >= 2 && independentSourceCount >= 2 && success >= 2 && failure === 0 && mixed === 0) {
    grade = 'B'; label = 'Good';
  } else if (n >= 2 && (failure > 0 || mixed > 0)) {
    grade = 'C'; label = 'Mixed / weak';
  } else if (n >= 2 && success === n && independentSourceCount === 1) {
    label = 'Multiple reports in one original source';
  } else if (n === 1 && success === 1) {
    label = 'One positive report';
  } else if (n === 1) {
    grade = 'C'; label = 'One negative/mixed report';
  }
  const percentageEligible = n >= 5 && independentSourceCount >= 5;
  const successRatePct = percentageEligible ? Math.round((success / n) * 1000) / 10 : null;
  const confidenceBasis = Math.min(n, independentSourceCount);
  const confidence = confidenceBasis >= 5 ? 'high' : confidenceBasis >= 3 ? 'medium' : confidenceBasis >= 2 ? 'low' : 'very-low';
  const dates = uniqueRows.map(x => x.reportedAt).filter(Boolean).sort();
  return { grade, label, confidence, sampleSize: n, independentSourceCount, successCount: success, failureCount: failure, mixedCount: mixed, percentageEligible, successRatePct, firstObservedAt: dates[0] || null, lastObservedAt: dates.at(-1) || null };
};
