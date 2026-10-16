'use strict';

/**
 * Format a number with k/M suffixes for compact display.
 * 523 → "523", 4500 → "4.5k", 15000 → "15k", 1200000 → "1.2M".
 * Returns '' for null/≤0 (callers that want "0" should coalesce).
 *
 * Single source of truth for compact token counts — shared by the statusline
 * renderer (`hooks/statusline.js`) and the session viewer (`bin/sessions.js`)
 * so the same magnitude renders identically in both.
 */
function formatCompact(n) {
  if (n == null || n <= 0) return '';
  if (n < 1000) return String(Math.round(n));
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  if (n < 1000000) return Math.round(n / 1000) + 'k';
  return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

// Dollar amount with cents — shared by every $ chip (renderer) and viewer row so
// figures side by side read at one precision. Only the dim burn rate rounds ≥$100/h.
const money = (v) => '$' + v.toFixed(2);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Unicode has no small capital for q, x or digits; those pass through unchanged.
const SMALL_CAPS = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ',
  n: 'ɴ', o: 'ᴏ', p: 'ᴘ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', y: 'ʏ', z: 'ᴢ',
};
const toSmallCaps = (text) => [...text].map((c) => SMALL_CAPS[c.toLowerCase()] || c).join('');

module.exports = { formatCompact, money, toSmallCaps, MONTHS };
