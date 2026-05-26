// PM2 ecosystem file — Multi-agent competition system
// Run: pm2 start ecosystem.config.js
// Each agent has a distinct profile and config

const BASE_DIR = __dirname;

module.exports = {
  apps: [
    {
      name: 'resolver-fast',
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: 'resolver-fast',
        RESOLVER_AGENT_PROFILE: 'fast',
        RESOLVER_INTERVAL_MS: '180000', // 3 min
        RESOLVER_MAX_PER_CYCLE: '4',
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: './logs/resolver-fast-error.log',
      out_file: './logs/resolver-fast-out.log',
      max_restarts: 20,
      restart_delay: 5000,
    },
    {
      name: 'resolver-careful',
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: 'resolver-careful',
        RESOLVER_AGENT_PROFILE: 'careful',
        RESOLVER_INTERVAL_MS: '300000', // 5 min — slower due to verification
        RESOLVER_MAX_PER_CYCLE: '2',
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: './logs/resolver-careful-error.log',
      out_file: './logs/resolver-careful-out.log',
      max_restarts: 20,
      restart_delay: 5000,
    },
    {
      name: 'resolver-skeptic',
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: 'resolver-skeptic',
        RESOLVER_AGENT_PROFILE: 'skeptic',
        RESOLVER_INTERVAL_MS: '240000', // 4 min
        RESOLVER_MAX_PER_CYCLE: '3',
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: './logs/resolver-skeptic-error.log',
      out_file: './logs/resolver-skeptic-out.log',
      max_restarts: 20,
      restart_delay: 5000,
    },
    {
      name: 'resolver-minimal',
      script: 'scripts/autonomous-resolver.js',
      env: {
        RESOLVER_AGENT_ID: 'resolver-minimal',
        RESOLVER_AGENT_PROFILE: 'minimal',
        RESOLVER_INTERVAL_MS: '120000', // 2 min — fast, no hints
        RESOLVER_MAX_PER_CYCLE: '6',
        SELF_URL: 'http://127.0.0.1:3000',
      },
      error_file: './logs/resolver-minimal-error.log',
      out_file: './logs/resolver-minimal-out.log',
      max_restarts: 20,
      restart_delay: 5000,
    },
  ],
};