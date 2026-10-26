export const PUBLIC_SHARED_APP_URL =
  'https://ais-pre-7yop2wmdn7lcixfoq5q7zz-780366897587.europe-west2.run.app';

export const PUBLIC_COMIC_COVER_THUMBNAIL_URL = 'https://iili.io/neEghLQ.jpg';

/**
 * Returns the public origin for sharing across WhatsApp, Facebook, Twitter, etc.
 * The AI Studio development instance (ais-dev-*.run.app) is protected behind Google
 * authentication cookies (/cookie_check.html). WhatsApp crawlers cannot access ais-dev.
 * Replacing ais-dev with ais-pre ensures WhatsApp's crawler and external recipients
 * can fetch open graph metadata and load the comic directly without Google login barriers.
 */
export function getShareOrigin(): string {
  if (typeof window === 'undefined') return PUBLIC_SHARED_APP_URL;

  const currentOrigin = window.location.origin;
  if (currentOrigin.includes('ais-dev-')) {
    return currentOrigin.replace('ais-dev-', 'ais-pre-');
  }
  return currentOrigin;
}

export function getComicShareUrl(slug: string = 'send-me-something-small'): string {
  const origin = getShareOrigin();
  return `${origin}/?comic=${encodeURIComponent(slug)}`;
}

export function getStoryShareUrl(slug: string): string {
  const origin = getShareOrigin();
  return `${origin}/?story=${encodeURIComponent(slug)}`;
}

export function getWhatsAppShareText(comic: {
  title: string;
  description: string;
  slug: string;
}): string {
  const shareUrl = getComicShareUrl(comic.slug);
  return `📖 *${comic.title}* (Interactive Comic Book)\n${comic.description}\n\nWhat would you do? Start reading the flippable comic on Uncle Rwamiti: Your Move 👉 ${shareUrl}`;
}
