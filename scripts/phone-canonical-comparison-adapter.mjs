export function buildCanonicalComparisonRoute({ routes, markets, snapshots }, routeId) {
  const route = routes.find((row) => row.id === routeId);
  if (!route) throw new Error(`canonical route missing: ${routeId}`);
  const market = markets.find((row) => row.id === route.marketId);
  if (!market) throw new Error(`canonical market missing for ${routeId}: ${route.marketId}`);
  const profile = snapshots.find((row) => row.routeId === routeId && row.kind === 'current-profile');
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
