// api-handlers/reality-pipeline.js — Reality Pipeline REST endpoints

const pipeline = require('../lib/reality-pipeline');
const harvester = require('../lib/reality-harvester');
const converter = require('../lib/reality-to-eval');
const adversarial = require('../lib/adversarial-generator');
const evalHarness = require('../lib/eval-harness');

async function handleRunPipeline(req, res) {
  try {
    const sections = req.body?.sections || ['harvest', 'convert', 'adversarial', 'eval'];
    const result = await pipeline.runFullPipeline();
    res.setHeader('Cache-Control', 'no-cache');
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

function handlePipelineHealth(req, res) {
  try {
    const health = pipeline.getPipelineHealth();
    res.json({ success: true, health });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

function handlePipelineHistory(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = pipeline.getPipelineHistory(limit);
    res.json({ success: true, history, count: history.length });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleHarvestOnly(req, res) {
  try {
    const result = await harvester.runHarvest();
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

function handleConvertHarvest(req, res) {
  try {
    const latest = harvester.loadLatestHarvest();
    if (!latest) return res.status(404).json({ success: false, error: 'No harvest data. Run harvest first.' });
    const result = converter.convertHarvest(latest);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

function handleGenerateAdversarial(req, res) {
  try {
    const result = adversarial.generateFullSet();
    const ingest = adversarial.ingestIntoGoldenSet();
    res.json({
      success: true,
      generated: result.total,
      by_type: result.by_type,
      ingested_into_golden: ingest.ingested,
      variant_ids: result.variant_ids,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

function handleGetHarvest(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const latest = harvester.loadLatestHarvest();
    if (!latest) return res.json({ success: true, items: [], total: 0 });
    res.json({
      success: true,
      harvested_at: latest.harvested_at,
      total: latest.items.length,
      summary: {
        by_category: latest.summary?.by_category || {},
        by_breakage: latest.summary?.by_breakage || {},
      },
      items: latest.items.slice(-limit).reverse(),
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

function handleGetMemorySeeds(req, res) {
  try {
    const seeds = converter.loadMemorySeeds();
    const limit = parseInt(req.query.limit) || 50;
    res.json({ success: true, total: seeds.length, seeds: seeds.slice(-limit).reverse() });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}

module.exports = {
  handleRunPipeline, handlePipelineHealth, handlePipelineHistory,
  handleHarvestOnly, handleConvertHarvest, handleGenerateAdversarial,
  handleGetHarvest, handleGetMemorySeeds,
};
