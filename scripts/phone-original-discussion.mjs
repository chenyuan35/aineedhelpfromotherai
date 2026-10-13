// A reply, paginated continuation and thread root are one original discussion.
// Two people in one original thread remain separate reports, not sources.
export function originalDiscussionKey(source) {
  if (!source?.id) return null;
  try {
    const url = new URL(source.url);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const path = url.pathname;
    if (host === 'linux.do') {
      const m = path.match(/^\/t\/topic\/(\d+)(?:\/.*)?$/);
      if (m) return 'linux.do:topic:' + m[1];
    }
    if (host === 'reddit.com' || host === 'old.reddit.com' || host === 'new.reddit.com') {
      const m = path.match(/^\/r\/[^/]+\/comments\/([a-z0-9]+)(?:\/.*)?$/i);
      if (m) return 'reddit:thread:' + m[1].toLowerCase();
    }
    if (host === 'nodeseek.com') {
      const m = path.match(/^\/post-(\d+)(?:-\d+)?\/?$/);
      if (m) return 'nodeseek:thread:' + m[1];
    }
  } catch {
    // If we do not know the original discussion, do not combine sources.
  }
  return 'source:' + source.id;
}
