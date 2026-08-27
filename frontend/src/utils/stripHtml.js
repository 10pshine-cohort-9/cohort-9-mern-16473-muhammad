// Strips HTML tags/entities from rich-text content — used for card previews and search matching
export const stripHtml = (html) =>
  html
    ?.replace(/<[^>]*>/g, ' ') // replace tags with a space instead of deleting them
    .replace(/&nbsp;/g, ' ') // decode non-breaking space entity
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // collapse multiple spaces into one
    .trim() || '';