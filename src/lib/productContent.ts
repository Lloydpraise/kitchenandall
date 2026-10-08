// Turns a product row into structured page content.
// 1) Uses the structured `content` column when it exists (written by the SEO engine).
// 2) Otherwise parses the plain-text description the engine (or an older version) saved,
//    so every product renders properly even before it is re-published.

export interface Spec { label: string; value: string }
export interface Faq { q: string; a: string }
export interface Section { heading: string; body: string }
export interface PageContent {
  intro: string;
  features: string[];
  sections: Section[];
  specs: Spec[];
  faqs: Faq[];
  structured: boolean;
}
export type Block = { t: 'p'; text: string } | { t: 'ul'; items: string[] };

const BULLET = /^[-\u2022*]\s+(.*)/;

/** Text -> paragraphs and "- " bullet lists. */
export function toBlocks(text: string): Block[] {
  const out: Block[] = [];
  let list: { t: 'ul'; items: string[] } | null = null;
  for (const line of String(text || '').split(/\n+/).map((x) => x.trim()).filter(Boolean)) {
    const m = line.match(BULLET);
    if (m) {
      if (!list) { list = { t: 'ul', items: [] }; out.push(list); }
      list.items.push(m[1]);
    } else {
      list = null;
      out.push({ t: 'p', text: line });
    }
  }
  return out;
}

const empty = (): PageContent => ({ intro: '', features: [], sections: [], specs: [], faqs: [], structured: false });
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
// A heading is a short single line that is not a sentence. Questions are allowed ("What is a deep fryer?").
const isHeading = (line: string) =>
  line.length <= 90 && !/[.!:,;]$/.test(line) && !BULLET.test(line) && line.split(/\s+/).length <= 12;

function fromStructured(raw: any): PageContent | null {
  let c = raw;
  if (typeof c === 'string') { try { c = JSON.parse(c); } catch { return null; } }
  if (!c || typeof c !== 'object') return null;
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  const out = empty();
  out.intro = str(c.intro);
  out.features = arr(c.key_features).map(str).filter(Boolean);
  out.sections = arr(c.sections).map((s: any) => ({ heading: str(s && s.heading), body: str(s && s.body) })).filter((s) => s.body);
  out.specs = arr(c.specs).map((s: any) => ({ label: str(s && s.label), value: str(s && s.value) })).filter((s) => s.label && s.value);
  out.faqs = arr(c.faqs).map((f: any) => ({ q: str(f && f.q), a: str(f && f.a) })).filter((f) => f.q && f.a);
  const any = out.intro || out.features.length || out.sections.length || out.specs.length || out.faqs.length;
  if (!any) return null;
  out.structured = true;
  return out;
}

/** Parses the engine's plain-text format and ordinary free-text descriptions. */
export function parseText(description: string): PageContent {
  const out = empty();
  const blocks = String(description || '').replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  let faqMode = false;
  let current: Section | null = null;
  for (const b of blocks) {
    const lines = b.split('\n').map((l) => l.trim()).filter(Boolean);
    const first = lines[0].toLowerCase();
    if (first === 'key features') { out.features = lines.slice(1).map((l) => l.replace(BULLET, '$1')); current = null; continue; }
    if (first === 'specifications') {
      for (const l of lines.slice(1)) { const m = l.match(/^([^:]{1,60}):\s*(.+)$/); if (m) out.specs.push({ label: m[1].trim(), value: m[2].trim() }); }
      current = null; continue;
    }
    if (first === 'frequently asked questions') { faqMode = true; current = null; continue; }
    if (faqMode) { if (lines.length >= 2) out.faqs.push({ q: lines[0], a: lines.slice(1).join(' ') }); continue; }
    if (lines.length > 1 && isHeading(lines[0])) { current = { heading: lines[0], body: lines.slice(1).join('\n') }; out.sections.push(current); continue; }
    const text = lines.join('\n');
    if (current) current.body += '\n' + text;
    else if (!out.intro) out.intro = text;
    else { current = { heading: '', body: text }; out.sections.push(current); }
  }
  return out;
}

export function parseContent(product: { description?: string | null; content?: unknown }): PageContent {
  const s = fromStructured(product.content);
  if (s) {
    if (!s.intro) s.intro = parseText(product.description || '').intro;
    return s;
  }
  return parseText(product.description || '');
}