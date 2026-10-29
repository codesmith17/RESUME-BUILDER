import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Download, Printer, AlertCircle } from 'lucide-react';
import { texLogger } from '../../services/texLogger';

function renderManualTextLayer(textContent, container, viewport) {
  if (!textContent || !textContent.items) return;
  const frag = document.createDocumentFragment();

  textContent.items.forEach((item) => {
    if (!item.str || item.str.trim() === '') return;

    // Convert PDF coordinates (origin at bottom-left) to viewport pixel coordinates (origin at top-left)
    const point = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
    const fontHeight = Math.abs(item.transform[3] || item.height || 10) * viewport.scale;

    const span = document.createElement('span');
    span.textContent = item.str;
    span.style.position = 'absolute';
    span.style.left = `${Math.round(point[0])}px`;
    span.style.top = `${Math.round(point[1] - (fontHeight * 0.85))}px`;
    span.style.fontSize = `${Math.max(8, Math.round(fontHeight))}px`;
    span.style.fontFamily = 'sans-serif';
    span.style.lineHeight = '1';
    span.style.whiteSpace = 'pre';
    span.style.cursor = 'text';

    if (item.width) {
      span.style.width = `${Math.round(item.width * viewport.scale)}px`;
    }

    frag.appendChild(span);
  });

  container.appendChild(frag);
}

export default function PdfJsViewer({
  pdfBlob,
  pdfUrl,
  links = [],
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  projectName = 'document'
}) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  // Load PDF document using window.pdfjsLib
  useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      if (!pdfBlob && !pdfUrl) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (typeof window === 'undefined' || !window.pdfjsLib) {
          texLogger.warn('PDF.js', 'window.pdfjsLib not yet available. Waiting for script load.');
          throw new Error('PDF.js library not found on window');
        }

        // Configure PDF.js worker
        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        texLogger.info('PDF.js', 'Initializing PDF.js parser with document stream...');

        let loadingTask;
        if (pdfBlob) {
          const arrayBuffer = await pdfBlob.arrayBuffer();
          texLogger.info('PDF.js', `Parsing PDF binary buffer (${arrayBuffer.byteLength} bytes)...`);
          loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        } else {
          texLogger.info('PDF.js', `Loading PDF from URL: ${pdfUrl.substring(0, 50)}...`);
          loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        }

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          texLogger.success('PDF.js', `Document parsed successfully: ${doc.numPages} page(s) detected.`);
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          texLogger.error('PDF.js', `PDF.js failed to load document: ${err.message}`);
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfBlob, pdfUrl]);

  // Render pages when pdfDoc or zoom changes
  useEffect(() => {
    if (!pdfDoc || !containerRef.current) return;

    let isCancelled = false;
    const container = containerRef.current;
    container.innerHTML = '';

    async function renderAllPages() {
      const dpr = window.devicePixelRatio || 2;
      const baseScale = (zoom / 100) * 1.33; // Standard 96dpi to 72dpi PDF scale

      texLogger.info('PDF.js', `Rendering ${pdfDoc.numPages} page(s) at zoom ${zoom}% (scale: ${baseScale.toFixed(2)}, DPR: ${dpr})...`);

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        if (isCancelled) break;

        const pageStartTime = performance.now();
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: baseScale });

        // Wrapper card for page
        const pageCard = document.createElement('div');
        pageCard.className = 'pdf-page-card bg-white shadow-2xl rounded-sm mb-6 relative overflow-hidden transition-all border border-slate-300';
        pageCard.style.width = `${viewport.width}px`;
        pageCard.style.height = `${viewport.height}px`;
        pageCard.style.position = 'relative';

        // Canvas for high-DPI crisp rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none'; // Allow click events to pass through to links overlay

        const renderContext = {
          canvasContext: context,
          viewport: page.getViewport({ scale: baseScale * dpr })
        };

        pageCard.appendChild(canvas);

        // 1. Text Layer for selectable, copyable text over canvas
        const textLayerDiv = document.createElement('div');
        textLayerDiv.className = 'pdf-text-layer textLayer';
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;

        try {
          const textContent = await page.getTextContent();
          let renderedWithPdfjs = false;

          if (window.pdfjsLib && typeof window.pdfjsLib.renderTextLayer === 'function') {
            try {
              const task = window.pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                textContent: textContent,
                container: textLayerDiv,
                viewport: viewport,
                textDivs: []
              });
              await (task.promise || task);
              renderedWithPdfjs = true;
            } catch (tlErr) {
              renderedWithPdfjs = false;
            }
          }

          if (!renderedWithPdfjs) {
            renderManualTextLayer(textContent, textLayerDiv, viewport);
          }
        } catch (textErr) {
          texLogger.warn('PDF.js', 'Error extracting selectable text: ' + textErr.message);
        }

        pageCard.appendChild(textLayerDiv);

        // Render interactive links container
        const linksOverlay = document.createElement('div');
        linksOverlay.className = 'pdf-links-overlay absolute inset-0';
        linksOverlay.style.position = 'absolute';
        linksOverlay.style.left = '0';
        linksOverlay.style.top = '0';
        linksOverlay.style.width = '100%';
        linksOverlay.style.height = '100%';
        linksOverlay.style.pointerEvents = 'none'; // Only links will have pointer-events: auto
        linksOverlay.style.zIndex = '20';

        // 1. Process Native PDF.js Hyperlink Annotations
        try {
          const annotations = await page.getAnnotations();
          if (annotations && annotations.length > 0) {
            annotations.forEach((annot) => {
              if (annot.subtype === 'Link' && annot.url) {
                const rect = viewport.convertToViewportRectangle(annot.rect);
                const minX = Math.min(rect[0], rect[2]);
                const minY = Math.min(rect[1], rect[3]);
                const width = Math.max(Math.abs(rect[2] - rect[0]), 14);
                const height = Math.max(Math.abs(rect[3] - rect[1]), 14);

                const linkEl = document.createElement('a');
                linkEl.href = annot.url;
                linkEl.target = '_blank';
                linkEl.rel = 'noopener noreferrer';
                linkEl.className = 'absolute cursor-pointer rounded-xs transition-all hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-500/70';
                linkEl.style.position = 'absolute';
                linkEl.style.left = `${minX}px`;
                linkEl.style.top = `${minY}px`;
                linkEl.style.width = `${width}px`;
                linkEl.style.height = `${height}px`;
                linkEl.style.pointerEvents = 'auto';
                linkEl.style.zIndex = '30';
                linkEl.title = annot.url;

                linksOverlay.appendChild(linkEl);
              }
            });
          }
        } catch (err) {
          texLogger.warn('PDF.js', 'Error extracting native annotations: ' + err.message);
        }

        // 2. Process Client Fallback Links if native annotations were not present
        if (links && links.length > 0 && linksOverlay.children.length === 0) {
          links.forEach((lnk) => {
            const linkEl = document.createElement('a');
            linkEl.href = lnk.url;
            linkEl.target = '_blank';
            linkEl.rel = 'noopener noreferrer';
            linkEl.className = 'absolute cursor-pointer rounded-xs transition-all hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-500/70';
            linkEl.style.position = 'absolute';
            linkEl.style.left = `${lnk.xRatio * viewport.width}px`;
            linkEl.style.top = `${lnk.yRatio * viewport.height}px`;
            linkEl.style.width = `${Math.max(lnk.wRatio * viewport.width, 14)}px`;
            linkEl.style.height = `${Math.max(lnk.hRatio * viewport.height, 14)}px`;
            linkEl.style.pointerEvents = 'auto';
            linkEl.style.zIndex = '30';
            linkEl.title = `${lnk.text ? lnk.text + ': ' : ''}${lnk.url}`;

            linksOverlay.appendChild(linkEl);
          });
        }

        pageCard.appendChild(linksOverlay);
        container.appendChild(pageCard);

        await page.render(renderContext).promise;
        const pageDuration = Math.round(performance.now() - pageStartTime);
        texLogger.success('PDF.js', `Page ${pageNum} rendered on canvas in ${pageDuration}ms with ${linksOverlay.children.length} active clickable link(s).`);
      }
    }

    renderAllPages();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, zoom, links]);

  // Fallback: If PDF.js fails or iframe is preferred
  if (error && pdfUrl) {
    return (
      <div className="w-full h-full bg-slate-900">
        <iframe 
          src={pdfUrl}
          className="w-full h-full border-none"
          title="Compiled PDF Document"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/90 overflow-hidden">
      {/* Scrollable Document Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 text-center">
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-300 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-xs font-semibold text-slate-300">Rendering high-resolution vector PDF...</div>
          </div>
        )}

        <div 
          ref={containerRef} 
          className="inline-flex flex-col items-center transition-all duration-200 text-left"
          style={{ minWidth: 'fit-content' }}
        />
      </div>
    </div>
  );
}
