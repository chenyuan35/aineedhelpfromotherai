// PM2 ecosystem file — optimized for low-memory VPS deployments
// Default mode now targets 1GB servers instead of spawning 24 agents.
// Enable FULL_AGENT_ECOSYSTEM=true only on larger machines.
// Run: pm2 start ecosystem.config.js

const BASE_DIR = __dirname;
const LIGHTWEIGHT_MODE = process.env.FULL_AGENT_ECOSYSTEM !== 'true';

function createAgent(profile, index, options = {}) {
  const suffix = index === 1 ? '' : `-${index}`;

  return {
    name: `resolver-${profile}${suffix}`,
    script: 'scripts/autonomous-resolver.js',
    env: {
      RESOLVER_AGENT_ID: `resolver-${profile}${suffix}`,
      RESOLVER_AGENT_PROFILE: profile,
      RESOLVER_INTERVAL_MS: String(options.interval || 240000),
      RESOLVER_MAX_PER_CYCLE: String(options.perCycle || 1),
      SELF_URL: process.env.SELF_URL || 'http://127.0.0.1:3000',
    },
    error_file: `./logs/resolver-${profile}${suffix}-error.log`,
    out_file: `./logs/resolver-${profile}${suffix}-out.log`,
    merge_logs: true,
    max_memory_restart: '220M',
    max_restarts: 10,
    restart_delay: 10000,
    kill_timeout: 5000,
    autorestart: true,
  };
}

function experimentalConfig(n) {
  const randomSeed = Date.now() + n;
  const rand = (min, max) => Math.round(min + ((randomSeed * (n + 1) * 7) % (max - min + 1)) % (max - min + 1));
  const temps = [0.1, 0.3, 0.5, 0.7];

  return {
    name: `resolver-experimental-${n}`,
    script: 'scripts/autonomous-resolver.js',
    env: {
      RESOLVER_AGENT_ID: `resolver-experimental-${n}`,
      RESOLVER_AGENT_PROFILE: 'experimental',
      RESOLVER_EXPERIMENTAL_MAX_HINTS: String(rand(0, 3)),
      RESOLVER_EXPERIMENTAL_VERIFICATION: String(rand(0, 1) === 1),
      RESOLVER_EXPERIMENTAL_IGNORE_LOW: String(rand(0, 1) === 1),
      RESOLVER_EXPERIMENTAL_TEMPERATURE: String(temps[rand(0, 3)]),
      RESOLVER_INTERVAL_MS: String(rand(4, 10) * 60000),
      RESOLVER_MAX_PER_CYCLE: '1',
      SELF_URL: process.env.SELF_URL || 'http://127.0.0.1:3000',
    },
    error_file: `./logs/resolver-experimental-${n}-error.log`,
    out_file: `./logs/resolver-experimental-${n}-out.log`,
    merge_logs: true,
    max_memory_restart: '220M',
    max_restarts: 5,
    restart_delay: 15000,
  };
}

function buildApps() {
  const apps = [];

  if (LIGHTWEIGHT_MODE) {
    // Safe defaults for 1GB VPS deployments.
    apps.push(
      createAgent('fast', 1, {
        interval: 180000,
        perCycle: 1,
      })
    );

    apps.push(
      createAgent('careful', 1, {
        interval: 300000,
        perCycle: 1,
      })
    );

    apps.push(
      createAgent('minimal', 1, {
        interval: 240000,
        perCycle: 1,
      })
    );

    return { apps };
  }

  // Full ecosystem mode for larger machines.
  for (let i = 1; i <= 4; i++) {
    apps.push(createAgent('fast', i, {
      interval: 120000 + i * 30000,
      perCycle: 2,
    }));
  }

  for (let i = 1; i <= 3; i++) {
    apps.push(createAgent('careful', i, {
      interval: 240000 + i * 60000,
      perCycle: 1,
    }));
  }

  for (let i = 1; i <= 2; i++) {
    apps.push(createAgent('skeptic', i, {
      interval: 300000 + i * 60000,
      perCycle: 1,
    }));
  }

  for (let i = 1; i <= 3; i++) {
    apps.push(experimentalConfig(i));
  }

  return { apps };
}

module.exports = buildApps();