const { saveReasoning } = require('./lib/reasoning-storage');

const entries = [
  {
    "id": "RO_FC_LOCAL_001",
    "problem_id": "PROB_FC_LOCAL_001",
    "problem_statement": "Playwright MCP browser_click requires element parameter but only ref was provided; ref is session-level and stale cross-session, causing 'expected string received undefined'",
    "context": {"domain": "code", "difficulty": "intermediate", "tags": ["playwright-mcp", "browser_click", "stale-ref", "false-assumption-lock", "fc-014"]},
    "attempts": [{"agent_id": "hermes-agent", "outcome": "failure", "failure_type": "false_assumption_lock", "failure_description": "多次尝试用旧 ref 点击，每次报 undefined，每次仍传递同一个 ref"}],
    "solution": {
      "summary": "browser_click 必须包含 element 描述 + 当轮新鲜 ref；优先用 browser_navigate 走稳定 URL；点击后校验落地 URL。ref 从不跨会话复用。",
      "key_insights": ["ref 是 snapshot 级标识，不跨会话/页面复用", "browser_click 缺 element 参数必报 undefined", "点击后需验证导航结果"],
      "consensus_score": 0.95
    },
    "meta": {"total_attempts": 5, "success_rate": 1.0, "tags": ["playwright-mcp", "browser_click", "stale-ref", "false-assumption-lock", "fc-014"]}
  },
  {
    "id": "RO_FC_LOCAL_002",
    "problem_id": "PROB_FC_LOCAL_002",
    "problem_statement": "Playwright MCP connection repeatedly disconnects mid-session; agent blindly retries causing infinite browser tab creation and resource exhaustion",
    "context": {"domain": "code", "difficulty": "intermediate", "tags": ["playwright-mcp", "disconnect", "retry-spiral", "tab-explosion", "circuit-breaker"]},
    "attempts": [{"agent_id": "hermes-agent", "outcome": "failure", "failure_type": "retry_spiral", "failure_description": "反复重连导致几十个头条标签页同时打开"}],
    "solution": {
      "summary": "disconnected 视为熔断信号：停止自动重开，browser_click 复用已有 tab，重连上限 1 次，超限停下报人工；锁定 --extension 单 tab 模式。",
      "key_insights": ["disconnect 是熔断信号不是重试信号", "最多重连 1 次，不行直接报人工", "用 browser_tabs 复用已有标签页"],
      "consensus_score": 0.95
    },
    "meta": {"total_attempts": 8, "success_rate": 1.0, "tags": ["playwright-mcp", "disconnect", "retry-spiral", "tab-explosion", "circuit-breaker"]}
  },
  {
    "id": "RO_FC_LOCAL_003",
    "problem_id": "PROB_FC_LOCAL_003",
    "problem_statement": "Hermes Agent .env file is in C:\\Users\\<user>\\AppData\\Local\\hermes\\.env not in ~/.hermes/.env; NOTION_API_KEY disappears every new session because the wrong path is checked",
    "context": {"domain": "code", "difficulty": "beginner", "tags": ["hermes", "env-path", "appdata", "environment-blindness"]},
    "attempts": [{"agent_id": "hermes-agent", "outcome": "failure", "failure_type": "environment_blindness", "failure_description": "每次新会话 NOTION_API_KEY 消失，反复查 ~/.hermes/.env"}],
    "solution": {
      "summary": "Hermes Desktop 读 AppData\\Local\\hermes\\.env 而非 ~/.hermes/.env；memory 固化这一事实；env 路径知识存 Supermemory。",
      "key_insights": ["Desktop GUI 模式的 config/env 路径在 AppData", "不在 ~/.hermes/ （那是 CLI 模式的路径）"],
      "consensus_score": 0.9
    },
    "meta": {"total_attempts": 3, "success_rate": 1.0, "tags": ["hermes", "env-path", "appdata", "environment-blindness"]}
  },
  {
    "id": "RO_FC_LOCAL_004",
    "problem_id": "PROB_FC_LOCAL_004",
    "problem_statement": "Extension not connected to browser so agent tries multiple connection methods (CDP, Playwright, direct launch) wasting 1 hour on connection roulette",
    "context": {"domain": "code", "difficulty": "beginner", "tags": ["playwright-mcp", "extension", "connection-roulette", "retry-spiral", "circuit-breaker"]},
    "attempts": [{"agent_id": "hermes-agent", "outcome": "failure", "failure_type": "connection_roulette", "failure_description": "Extension 没连时尝试 CDP -> Playwright -> 开新浏览器，循环空耗一小时"}],
    "solution": {
      "summary": "一律用 --extension 连主浏览器，开工先 browser_tabs 复用已有标签绝不新开，看到 disconnected 就停、最多重连 1 次、再不行报用户。",
      "key_insights": ["固定 --extension 单连接方式避免轮盘赌", "先检测浏览器是否活着再重试", "connection_roulette 是浪费时间的重灾区"],
      "consensus_score": 0.9
    },
    "meta": {"total_attempts": 4, "success_rate": 1.0, "tags": ["playwright-mcp", "extension", "connection-roulette", "retry-spiral", "circuit-breaker"]}
  }
];

(async () => {
  let stored = 0;
  for (const e of entries) {
    const result = await saveReasoning(e);
    if (result) {
      console.log('STORED ' + e.id + '  ' + e.problem_statement.slice(0, 60));
      stored++;
    } else {
      console.log('FAIL  ' + e.id);
    }
  }
  console.log('STORED=' + stored + '/' + entries.length);
})();
