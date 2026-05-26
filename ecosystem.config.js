// PM2 ecosystem file — 24-agent competition system
// Profiles: fast(6), careful(4), skeptic(4), minimal(2), experimental(4+)
// Experimental agents have randomized config on each pm2 restart
// Run: pm2 start ecosystem.config.js

const BASE_DIR = __dirname;

// Generate experimental configs with randomization seeds
function experimentalConfig(n) {
  const randomSeed = Date.now() + n;
  const rand = (min, max) => Math.round(min + ((randomSeed * (n + 1) * 7) % (max - min + 1)) % (max - min + 1));
  const maxHints = rand(0, 6);
  const verification = rand(0, 1) === 1;
  const ignoreLow = rand(0, 1) === 1;
  const temps = [0.1, 0.3, 0.5, 0.7, 0.9];
  const temperature = temps[rand(0, 4)];
  const interval = rand(2, 8) * 60000;
  const perCycle = rand(1, 6);

  return {
    name: `resolver-experimental-${n}`,
    script: 'scripts/autonomous-resolver.js',
    env: {
      RESOLVER_AGENT_ID: `resolver-experimental-${n}`,
      RESOLVER_AGENT_PROFILE: 'experimental',
      RESOLVER_EXPERIMENTAL_MAX_HINTS: String(maxHints),
      RESOLVER_EXPERIMENTAL_VERIFICATION: String(verification),
      RESOLVER_EXPERIMENTAL_IGNORE_LOW: String(ignoreLow),
      RESOLVER_EXPERIMENTAL_TEMPERATURE: String(temperature),
      RESOLVER_INTERVAL_MS: String(interval),
      RESOLVER_MAX_PER_CYCLE: String(perCycle),
      SELF_URL: 'http://127.0.0.1:3000',
    },
    error_file: `./logs/resolver-experimental-${n}-error.log`,
    out_file: `./logs/resolver-experimental-${n}-out.log`,
    max_restarts: 20,
    restart_delay: 5000,
  };
}

function buildApps() {
  const apps = [];

  // 6 fast agents with slight variations
  for (let i = 1; i <= 6; i++) {
    const suffix = i === 1 ? '' : `-${i}`;
    apps.push({
      name: `resolver-fast${suffix}`,
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: `resolver-fast${suffix}`,
        RESOLVER_AGENT_PROFILE: 'fast',
        RESOLVER_INTERVAL_MS: String(120000 + i * 30000),
        RESOLVER_MAX_PER_CYCLE: String(3 + (i % 3)),
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: `./logs/resolver-fast${suffix}-error.log`,
      out_file: `./logs/resolver-fast${suffix}-out.log`,
      max_restarts: 20,
      restart_delay: 5000,
    });
  }

  // 4 careful agents
  for (let i = 1; i <= 4; i++) {
    const suffix = i === 1 ? '' : `-${i}`;
    apps.push({
      name: `resolver-careful${suffix}`,
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: `resolver-careful${suffix}`,
        RESOLVER_AGENT_PROFILE: 'careful',
        RESOLVER_INTERVAL_MS: String(240000 + i * 60000),
        RESOLVER_MAX_PER_CYCLE: String(Math.max(1, 3 - i + 1)),
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: `./logs/resolver-careful${suffix}-error.log`,
      out_file: `./logs/resolver-careful${suffix}-out.log`,
      max_restarts: 20,
      restart_delay: 5000,
    });
  }

  // 4 skeptic agents
  for (let i = 1; i <= 4; i++) {
    const suffix = i === 1 ? '' : `-${i}`;
    apps.push({
      name: `resolver-skeptic${suffix}`,
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: `resolver-skeptic${suffix}`,
        RESOLVER_AGENT_PROFILE: 'skeptic',
        RESOLVER_INTERVAL_MS: String(180000 + i * 45000),
        RESOLVER_MAX_PER_CYCLE: String(Math.max(1, 4 - i + 1)),
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: `./logs/resolver-skeptic${suffix}-error.log`,
      out_file: `./logs/resolver-skeptic${suffix}-out.log`,
      max_restarts: 20,
      restart_delay: 5000,
    });
  }

  // 2 minimal agents
  for (let i = 1; i <= 2; i++) {
    const suffix = i === 1 ? '' : `-${i}`;
    apps.push({
      name: `resolver-minimal${suffix}`,
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: `resolver-minimal${suffix}`,
        RESOLVER_AGENT_PROFILE: 'minimal',
        RESOLVER_INTERVAL_MS: String(90000 + i * 30000),
        RESOLVER_MAX_PER_CYCLE: String(6 + i),
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: `./logs/resolver-minimal${suffix}-error.log`,
      out_file: `./logs/resolver-minimal${suffix}-out.log`,
      max_restarts: 20,
      restart_delay: 5000,
    });
  }

  // 8 experimental agents with randomized config
  for (let i = 1; i <= 8; i++) {
    apps.push(experimentalConfig(i));
  }

  return { apps };
}

module.exports = buildApps();