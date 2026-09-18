export type ToolCategory = 'phone' | 'reset' | 'relay' | 'utility';

export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  href: string;
  category: ToolCategory;
  categoryLabel: string;
  description: string;
  actionLabel: string;
  keywords: string[];
  featured?: boolean;
}

export const categoryOrder: ToolCategory[] = ['phone', 'reset', 'relay', 'utility'];

export const categoryMeta: Record<ToolCategory, { label: string; heading: string; description: string }> = {
  phone: {
    label: 'Phone Radar',
    heading: 'Keep control of a number your accounts may need again.',
    description: 'Compare routes by acquisition, activation, real-world SMS/OTP practicality, keep-alive cost and recovery path.',
  },
  reset: {
    label: 'AI Reset Radar',
    heading: 'Know when your AI allowance comes back.',
    description: 'Reset timers and burn-rate tools for AI products with changing quotas and billing cycles.',
  },
  relay: {
    label: 'Relay Exit Risk',
    heading: 'Check a relay before you depend on it.',
    description: 'Use public measurements, stored history and time-bounded community signals to understand relay exit risk.',
  },
  utility: {
    label: 'Browser utilities',
    heading: 'Small tools for common calculations and image tasks.',
    description: 'Fast browser-side utilities with no account required.',
  },
};

export const tools: ToolDefinition[] = [
  {
    slug: 'phone-number-survival-guide',
    title: 'Phone Number Survival Guide',
    shortTitle: 'Phone Radar',
    href: '/tools/phone-number-survival-guide/',
    category: 'phone',
    categoryLabel: 'Phone number survival',
    description: 'Compare long-term SMS/OTP numbers, data SIM/eSIM routes and temporary SMS platforms, then open the practical guide you need.',
    actionLabel: 'Open Phone Radar',
    keywords: ['phone number', 'sim', 'esim', 'sms', 'otp', 'verification', 'keep alive', 'recovery', 'account access'],
    featured: true,
  },
  {
    slug: 'cursor-usage-reset',
    title: 'Cursor Usage Reset Calculator',
    shortTitle: 'Cursor Reset',
    href: '/tools/cursor-usage-reset/',
    category: 'reset',
    categoryLabel: 'AI usage tracker',
    description: 'Track Cursor monthly included-usage reset timing and calculate a safe remaining usage pace.',
    actionLabel: 'Open tool',
    keywords: ['cursor', 'usage limit', 'reset', 'monthly usage'],
    featured: true,
  },
  {
    slug: 'claude-code-limit-reset',
    title: 'Claude Code Limit Reset Calculator',
    shortTitle: 'Claude Reset',
    href: '/tools/claude-code-limit-reset/',
    category: 'reset',
    categoryLabel: 'AI usage tracker',
    description: 'Track Claude Code session and weekly reset times using the reset timestamps shown by Claude.',
    actionLabel: 'Open tool',
    keywords: ['claude code', 'limit reset', 'weekly limit', 'session reset'],
    featured: true,
  },
  {
    slug: 'github-copilot-credits-reset',
    title: 'GitHub Copilot AI Credits Reset Timer',
    shortTitle: 'Copilot Reset',
    href: '/tools/github-copilot-credits-reset/',
    category: 'reset',
    categoryLabel: 'AI usage tracker',
    description: 'Track the next Copilot AI Credits reset and estimate whether the current credit pace will last.',
    actionLabel: 'Open tool',
    keywords: ['github copilot', 'ai credits', 'reset', 'quota'],
  },
  {
    slug: 'manus-credits-reset',
    title: 'Manus Credits Reset Timer',
    shortTitle: 'Manus Reset',
    href: '/tools/manus-credits-reset/',
    category: 'reset',
    categoryLabel: 'AI usage tracker',
    description: 'See the next Manus credit refresh in local time with a live countdown and simple use planner.',
    actionLabel: 'Open tool',
    keywords: ['manus', 'credits', 'reset', 'daily credits'],
  },
  {
    slug: 'replit-usage-reset',
    title: 'Replit Usage Reset Timer',
    shortTitle: 'Replit Reset',
    href: '/tools/replit-usage-reset/',
    category: 'reset',
    categoryLabel: 'AI usage tracker',
    description: 'Track the next Replit usage reset with a local countdown and saved reset anchor.',
    actionLabel: 'Open tool',
    keywords: ['replit', 'usage reset', 'free mode', 'limit'],
  },
  {
    slug: 'bolt-tokens-reset',
    title: 'Bolt Tokens Reset Calculator',
    shortTitle: 'Bolt Reset',
    href: '/tools/bolt-tokens-reset/',
    category: 'reset',
    categoryLabel: 'AI usage tracker',
    description: 'Track Bolt token resets and estimate a daily token budget from the remaining allowance.',
    actionLabel: 'Open tool',
    keywords: ['bolt', 'tokens', 'reset', 'usage'],
  },
  {
    slug: 'ai-credit-burn-rate-calculator',
    title: 'AI Credit Burn Rate Calculator',
    shortTitle: 'Credit Burn Rate',
    href: '/tools/ai-credit-burn-rate-calculator/',
    category: 'reset',
    categoryLabel: 'AI cost calculator',
    description: 'Calculate a daily AI credit budget, expected depletion date and remaining-task estimate before reset.',
    actionLabel: 'Open tool',
    keywords: ['ai credits', 'burn rate', 'budget', 'depletion'],
  },
  {
    slug: 'relay-exit-risk-checker',
    title: 'AI Relay Exit Risk Checker',
    shortTitle: 'Relay Exit Risk',
    href: '/tools/relay-exit-risk-checker/',
    category: 'relay',
    categoryLabel: 'Relay risk',
    description: 'Combine public measurements, daily history and a 90-day community forecast into an Exit Risk Index.',
    actionLabel: 'Check relay risk',
    keywords: ['relay', 'exit risk', 'api middleman', 'shutdown', 'reliability'],
    featured: true,
  },
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    shortTitle: 'Percentage',
    href: '/tools/percentage-calculator/',
    category: 'utility',
    categoryLabel: 'Math calculator',
    description: 'Calculate common percentage questions, reverse percentages and percentage change.',
    actionLabel: 'Open calculator',
    keywords: ['percentage', 'percent', 'math', 'calculator'],
  },
  {
    slug: 'percentage-increase-calculator',
    title: 'Percentage Increase Calculator',
    shortTitle: 'Percentage Change',
    href: '/tools/percentage-increase-calculator/',
    category: 'utility',
    categoryLabel: 'Math calculator',
    description: 'Calculate percentage increase or decrease, absolute difference and change multiplier.',
    actionLabel: 'Open calculator',
    keywords: ['percentage increase', 'decrease', 'change', 'math'],
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    shortTitle: 'Discount',
    href: '/tools/discount-calculator/',
    category: 'utility',
    categoryLabel: 'Shopping calculator',
    description: 'Calculate sale price, savings, stacked discounts and effective discount percentage.',
    actionLabel: 'Open calculator',
    keywords: ['discount', 'sale', 'savings', 'price'],
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator',
    shortTitle: 'Age',
    href: '/tools/age-calculator/',
    category: 'utility',
    categoryLabel: 'Date calculator',
    description: 'Calculate exact age, total days and weeks lived, and time until the next birthday.',
    actionLabel: 'Open calculator',
    keywords: ['age', 'birthday', 'date', 'calculator'],
  },
  {
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator',
    shortTitle: 'Date Difference',
    href: '/tools/date-difference-calculator/',
    category: 'utility',
    categoryLabel: 'Date calculator',
    description: 'Calculate the number of days and weeks between two dates and optionally count both endpoints.',
    actionLabel: 'Open calculator',
    keywords: ['date difference', 'days between dates', 'weeks', 'calendar'],
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    shortTitle: 'Resize Image',
    href: '/tools/image-resizer/',
    category: 'utility',
    categoryLabel: 'Image tool',
    description: 'Resize JPG, PNG and WebP images to exact dimensions directly in the browser.',
    actionLabel: 'Open tool',
    keywords: ['image resize', 'jpg', 'png', 'webp', 'dimensions'],
  },
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    shortTitle: 'Compress Image',
    href: '/tools/image-compressor/',
    category: 'utility',
    categoryLabel: 'Image tool',
    description: 'Compress JPG, PNG and WebP images locally with adjustable quality and optional resizing.',
    actionLabel: 'Open tool',
    keywords: ['image compress', 'jpg', 'png', 'webp', 'file size'],
  },
];

export const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
