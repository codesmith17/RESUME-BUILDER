// BibTeX Parsing and Citation Management Engine

export function parseBibtex(bibtexString) {
  if (!bibtexString) return [];

  const entries = [];
  const entryRegex = /@([a-zA-Z]+)\s*\{\s*([^,]+),([\s\S]*?)(?=\n@|\n*$)/g;
  let match;

  while ((match = entryRegex.exec(bibtexString)) !== null) {
    const type = match[1].toLowerCase();
    const key = match[2].trim();
    const body = match[3];

    const fields = {};
    const fieldRegex = /([a-zA-Z0-9_-]+)\s*=\s*[\{"]([^"\}]+)[\}"]/g;
    let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(body)) !== null) {
      fields[fieldMatch[1].toLowerCase()] = fieldMatch[2].trim();
    }

    entries.push({
      type,
      key,
      title: fields.title || 'Untitled',
      author: fields.author || 'Unknown',
      year: fields.year || '',
      journal: fields.journal || fields.booktitle || '',
      doi: fields.doi || '',
      url: fields.url || '',
      raw: match[0]
    });
  }

  return entries;
}

export function formatBibtexEntry(entry) {
  return `@${entry.type || 'article'}{${entry.key},
  author    = {${entry.author}},
  title     = {${entry.title}},
  journal   = {${entry.journal || ''}},
  year      = {${entry.year || new Date().getFullYear()}},
  doi       = {${entry.doi || ''}}
}`;
}
