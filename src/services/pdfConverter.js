// Client-side PDF to LaTeX and DOCX Converter Engine
// Extracts text, headings, and structure from uploaded PDF files entirely in the browser!

export async function parsePdfFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      
      try {
        if (typeof window !== 'undefined' && window.pdfjsLib) {
          // Set worker source if not set
          if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          }

          const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          const pagesText = [];
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageLines = [];
            let currentLine = '';
            let lastY = null;

            textContent.items.forEach(item => {
              if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                if (currentLine.trim()) pageLines.push(currentLine.trim());
                currentLine = '';
              }
              currentLine += item.str + ' ';
              lastY = item.transform[5];
            });
            if (currentLine.trim()) pageLines.push(currentLine.trim());
            pagesText.push(pageLines.join('\n'));
          }

          const fullText = pagesText.join('\n\n');
          const structured = synthesizeLatexAndDocxFromText(fullText, file.name);
          resolve(structured);
        } else {
          // Fallback simple binary text scanner
          const textDecoder = new TextDecoder('utf-8', { fatal: false });
          const raw = textDecoder.decode(arrayBuffer);
          const cleanText = extractReadableTextFromPdfBinary(raw);
          const structured = synthesizeLatexAndDocxFromText(cleanText, file.name);
          resolve(structured);
        }
      } catch (err) {
        console.warn('PDF.js parsing notice, using direct text extraction:', err);
        const textDecoder = new TextDecoder('utf-8', { fatal: false });
        const raw = textDecoder.decode(arrayBuffer);
        const cleanText = extractReadableTextFromPdfBinary(raw);
        const structured = synthesizeLatexAndDocxFromText(cleanText, file.name);
        resolve(structured);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function extractReadableTextFromPdfBinary(binaryString) {
  // Extract readable stream contents / BT...ET text objects
  const textMatches = binaryString.match(/\(([^()]+)\)\s*Tj/g) || [];
  if (textMatches.length > 5) {
    return textMatches
      .map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, ''))
      .join(' ');
  }
  // Fallback: extract ASCII word blocks
  const words = binaryString.match(/[A-Za-z0-9,.:;?!'()\-]{3,}/g) || [];
  return words.slice(0, 800).join(' ');
}

// Convert extracted text into BOTH LaTeX source code and DOCX visual HTML
export function synthesizeLatexAndDocxFromText(text, originalFileName = 'Uploaded Document') {
  const cleanTitle = originalFileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let docTitle = cleanTitle;
  const sections = [];
  let currentSection = { title: 'Overview', items: [] };

  // Heuristic structure identification
  lines.forEach((line, idx) => {
    if (idx === 0 && line.length < 90) {
      docTitle = line;
      return;
    }

    // Check if line looks like a section header (short, capitalized, or numbered)
    const isHeader = (
      /^[0-9]+(\.[0-9]+)*\s+[A-Z]/.test(line) ||
      (/^[A-Z\s]{4,35}$/.test(line) && line.length < 35) ||
      /^(Introduction|Methodology|Abstract|Experience|Education|Skills|Projects|Results|Conclusion|References)/i.test(line)
    );

    if (isHeader) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: line.replace(/^[0-9.]+\s*/, ''), items: [] };
    } else {
      currentSection.items.push(line);
    }
  });

  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  // Generate LaTeX Code
  let latex = `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amsmath,hyperref}\n\n`;
  latex += `\\title{${escapeLatex(docTitle)}}\n\\author{Imported Author}\n\\date{\\today}\n\n\\begin{document}\n\n\\maketitle\n\n`;

  // Generate DOCX HTML
  let docx = `<h1>${escapeHtml(docTitle)}</h1>\n<p><em>Extracted from uploaded PDF: ${escapeHtml(originalFileName)}</em></p>\n`;

  sections.forEach(sec => {
    latex += `\\section{${escapeLatex(sec.title)}}\n`;
    docx += `<h2>${escapeHtml(sec.title)}</h2>\n`;

    const isList = sec.items.some(item => item.startsWith('•') || item.startsWith('-') || item.startsWith('*'));
    if (isList) {
      latex += `\\begin{itemize}\n`;
      docx += `<ul>\n`;
      sec.items.forEach(it => {
        const cleanItem = it.replace(/^[•\-*]\s*/, '');
        latex += `  \\item ${escapeLatex(cleanItem)}\n`;
        docx += `  <li>${escapeHtml(cleanItem)}</li>\n`;
      });
      latex += `\\end{itemize}\n\n`;
      docx += `</ul>\n`;
    } else {
      sec.items.forEach(it => {
        latex += `${escapeLatex(it)}\n\n`;
        docx += `<p>${escapeHtml(it)}</p>\n`;
      });
    }
  });

  latex += `\\end{document}\n`;

  return {
    title: docTitle,
    latexCode: latex,
    docxHtml: docx,
    rawText: text
  };
}

function escapeLatex(str) {
  return (str || '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/_/g, '\\_')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#');
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
