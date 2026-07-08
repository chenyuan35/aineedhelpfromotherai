import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const cases = await getCollection('cases');
  cases.sort((a, b) => a.data.id.localeCompare(b.data.id));
  
  return rss({
    title: 'AI Failure Observatory feed',
    description: 'Shared failure memory for AI coding agents — documented failures, verified fixes, and debugging intelligence.',
    site: context.site,
    items: cases.map(c => ({
      title: `${c.data.id} — ${c.data.title}`,
      description: c.data.rootCause.substring(0, 200),
      link: `/cases/${c.data.id.toLowerCase()}/`,
      pubDate: c.data.publishedAt,
    })),
    customData: '<language>en-us</language>',
  });
}