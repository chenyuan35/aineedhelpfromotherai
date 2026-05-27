// lib/runtime-guard.js
// Runtime protection utilities for long-running low-memory AI agent servers.

const DEFAULTS = {
  maxHeapMb: parseInt(process.env.RUNTIME_MAX_HEAP_MB || '700', 10),
  warningHeapMb: parseInt(process.env.RUNTIME_WARNING_HEAP_MB || '512', 10),
  checkIntervalMs: parseInt(process.env.RUNTIME_MEMORY_CHECK_INTERVAL_MS || '30000', 10),
};

let intervalHandle = null;

function getMemorySnapshot() {
  const usage = process.memoryUsage();

  return {
    rssMb: Math.round(usage.rss / 1024 / 1024),
    heapTotalMb: Math.round(usage.heapTotal / 1024 / 1024),
    heapUsedMb: Math.round(usage.heapUsed / 1024 / 1024),
    externalMb: Math.round(usage.external / 1024 / 1024),
  };
}

function startRuntimeGuard(logger = console) {
  if (intervalHandle) {
    return intervalHandle;
  }

  intervalHandle = setInterval(() => {
    const memory = getMemorySnapshot();

    if (memory.heapUsedMb >= DEFAULTS.warningHeapMb) {
      logger.warn?.('[runtime-guard] high memory usage detected', memory);
    }

    if (memory.heapUsedMb >= DEFAULTS.maxHeapMb) {
      logger.error?.('[runtime-guard] heap limit exceeded, exiting for PM2 restart', memory);

      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }, DEFAULTS.checkIntervalMs);

  intervalHandle.unref();

  return intervalHandle;
}

function stopRuntimeGuard() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

function attachProcessHandlers(logger = console) {
  process.on('unhandledRejection', (err) => {
    logger.error?.('[runtime-guard] unhandled rejection', err);
  });

  process.on('uncaughtException', (err) => {
    logger.error?.('[runtime-guard] uncaught exception', err);

    setTimeout(() => process.exit(1), 1000);
  });

  const gracefulShutdown = (signal) => {
    logger.warn?.(`[runtime-guard] received ${signal}, shutting down gracefully`);

    stopRuntimeGuard();

    setTimeout(() => process.exit(0), 500);
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

module.exports = {
  startRuntimeGuard,
  stopRuntimeGuard,
  attachProcessHandlers,
  getMemorySnapshot,
};