// Default = latest canonical evidence. 'historical' only reproduces a frozen
// legacy admission fixture; never use it for live/current route decisions.
export function buildCanonicalComparisonRoute({ routes, markets, snapshots }, routeId, {historical = false} = {}) {
  const route = routes.find((row) => row.id === routeId);
  if (!route) throw new Error(`canonical route missing: ${routeId}`);
  const market = markets.find((row) => row.id === route.marketId);
  if (!market) throw new Error(`canonical market missing for ${routeId}: ${route.marketId}`);
  const profiles = snapshots.filter((row) => row.routeId === routeId && row.kind === 'current-profile')
    .sort((a, b) => String(b.checkedAt || '').localeCompare(String(a.checkedAt || '')) || String(b.id || '').localeCompare(String(a.id || '')));
  const profile = historical ? profiles.at(-1) : profiles[0];
  if (!profile) throw new Error(`current-profile missing for ${routeId}`);
  const data = profile.data || {};
  return {
    ...data,
    id: route.id,
    brandId: route.brandId,
    sourceIds: [...(data.sourceIds || route.sourceIds || [])],
    marketName: market.name,
  };
}
