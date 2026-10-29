import React, { useState, useEffect, useCallback, useRef } from 'react';
import StudioNavbar from './StudioNavbar';
import ProjectExplorer from './ProjectExplorer';
import LatexEditor from './LatexEditor';
import DocxVisualEditor from './DocxVisualEditor';
import CompiledPdfPreview from './CompiledPdfPreview';
import PrismAiDrawer from './PrismAiDrawer';
import VersionHistoryDrawer from './VersionHistoryDrawer';
import DiagnosticsDrawer from './DiagnosticsDrawer';
import TemplatesDrawer from './TemplatesDrawer';
import SymbolPaletteDrawer from './SymbolPaletteDrawer';
import CitationManagerDrawer from './CitationManagerDrawer';
import ImportExportModal from './ImportExportModal';
import SettingsModal from './SettingsModal';
import FirstTimeSetupOverlay from './FirstTimeSetupOverlay';
import ProjectsModal from './ProjectsModal';
import ApiKeyOnboardingModal from './ApiKeyOnboardingModal';

import { compileLatexToHtml, parseLatexDiagnostics } from '../../services/latexCompiler';
import { htmlToLatex, latexToHtml, exportToDocx } from '../../services/docxConverter';
import { TEMPLATES } from '../../services/templatesData';
import { parseBibtex } from '../../services/bibtexService';

import { RESUME_LATEX_SOURCE } from '../../services/resumeSource';

const INITIAL_PROJECT_FILES = [
  {
    id: 'f-1',
    name: 'resume.tex',
    folder: '', // Project Root
    isMain: true,
    content: RESUME_LATEX_SOURCE
  },
  {
    id: 'f-2',
    name: 'education.tex',
    folder: 'sections',
    content: `% Education Section
\\section{Education}
\\vspace{2pt}
\\resumeSubHeadingList
  \\resumeSubheading
      {Indian Institute of Information Technology, Nagpur}{December 2021 to May 2025}
      {Bachelor of Technology in Computer Science and Engineering}{Nagpur, India}
\\resumeSubHeadingListEnd
`
  },
  {
    id: 'f-3',
    name: 'skills.tex',
    folder: 'sections',
    content: `% Technical Skills Section
\\section{Technical Skills}
\\resumeSubHeadingList
\\setlength{\\itemsep}{-0.1em}
  \\vspace{2pt}
  \\resumeItem{\\textbf{Languages}: Python, \\href{https://www.hackerrank.com/certificates/4171e19e0102}{\\textcolor{blue}{Go}}, \\href{https://www.hackerrank.com/certificates/11b1622e500c}{\\textcolor{blue}{JavaScript}}, TypeScript, C++, Java, SQL, Rust (Basics)}
  \\resumeItem{\\textbf{Backend \\& Integrations}: FastAPI, \\href{https://www.hackerrank.com/certificates/6e8ecca5e137}{\\textcolor{blue}{REST APIs}}, Node.js, Express.js, Microservices, MCP}
  \\resumeItem{\\textbf{Testing}: Jest, JUnit, Cypress, Go unit and HTTP testing, Echo (Labstack)}
  \\resumeItem{\\textbf{Frontend/UX}: \\href{https://www.hackerrank.com/certificates/0b56202716e8}{\\textcolor{blue}{React}}, Next.js, \\href{https://www.hackerrank.com/certificates/443970b2b086}{\\textcolor{blue}{CSS}}, SCSS, Figma}
  \\resumeItem{\\textbf{Databases}: PostgreSQL, YugabyteDB, MongoDB, BigQuery, pgvector}
  \\resumeItem{\\textbf{Cloud/Infrastructure}: AWS S3, SQS, Lambda, Cognito, GCS, Docker, Jenkins, Linux}
\\resumeSubHeadingListEnd
`
  },
  {
    id: 'f-4',
    name: 'references.bib',
    folder: '', // Project Root
    content: `@article{chen2026adaptive,
  author    = {Chen, Alex M. and Vance, Sarah K. and Kumar, Rajesh},
  title     = {Scalable Deep Representation Learning via Adaptive Sparse Transformers},
  journal   = {IEEE Transactions on Knowledge and Data Engineering},
  year      = {2026},
  volume    = {38},
  number    = {2},
  pages     = {112--128}
}`
  }
];

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Krishna Tripathi — Resume',
    createdAt: Date.now() - 86400000,
    folders: ['sections'],
    files: INITIAL_PROJECT_FILES
  }
];

export default function PrismStudio() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('prism_projects_v7');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    const saved = localStorage.getItem('prism_active_project_id_v7');
    return saved || 'proj-1';
  });

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECTS[0];

  const [projectName, setProjectName] = useState(activeProject.name);
  const [mode, setMode] = useState('latex');
  const [folders, setFolders] = useState(activeProject.folders || ['sections']);
  const [files, setFiles] = useState(activeProject.files || INITIAL_PROJECT_FILES);
  const [activeFileId, setActiveFileId] = useState(() => {
    const main = (activeProject.files || []).find(f => f.isMain) || (activeProject.files || [])[0];
    return main ? main.id : 'f-1';
  });

  // Document contents
  const [latexCode, setLatexCode] = useState(() => {
    return RESUME_LATEX_SOURCE;
  });
  const [docxHtml, setDocxHtml] = useState(() => {
    const docxFile = files.find(f => f.name.endsWith('.docx'));
    return docxFile ? docxFile.content : TEMPLATES[0].docxHtml;
  });

  // Compiled live preview state
  const [compiledData, setCompiledData] = useState(() => compileLatexToHtml(latexCode));
  const [compileStatus, setCompileStatus] = useState('idle');
  const [diagnostics, setDiagnostics] = useState(() => parseLatexDiagnostics(latexCode));

  // Version History snapshots (Overleaf Premium feature)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('prism_version_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'snap-init',
        timestamp: Date.now() - 600000,
        label: 'Initial Project Template',
        isLabeled: true,
        code: TEMPLATES[0].latexCode,
        wordCount: 320
      }
    ];
  });

  // Preferences & Modals
  const [fontSize, setFontSize] = useState(14);
  const [autoCompileDelay, setAutoCompileDelay] = useState(400);

  // Full-screen first time setup overlay state
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(() => {
    try {
      return !localStorage.getItem('prism_first_time_setup_done');
    } catch {
      return false;
    }
  });

  // AI Key Onboarding on startup (asks user for key or skips & disables AI)
  const [showAiOnboarding, setShowAiOnboarding] = useState(() => {
    try {
      return !localStorage.getItem('prism_ai_onboarding_done');
    } catch {
      return false;
    }
  });

  const [isAiDisabled, setIsAiDisabled] = useState(() => {
    try {
      return localStorage.getItem('prism_ai_disabled') === 'true';
    } catch {
      return false;
    }
  });

  // Drawer toggles
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSymbolsOpen, setIsSymbolsOpen] = useState(false);
  const [isCitationsOpen, setIsCitationsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);

  // Resizable Split Ratio between Code Editor and Live Preview
  const [splitRatio, setSplitRatio] = useState(() => {
    try {
      const saved = localStorage.getItem('prism_editor_split_ratio');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 20 && val <= 80) return val;
      }
    } catch (e) {}
    return 50;
  });
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const splitContainerRef = useRef(null);

  // Mouse drag handler for split pane resizing
  useEffect(() => {
    if (!isDraggingSplit) return;

    const handleMouseMove = (e) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.max(20, Math.min(80, newRatio));
      setSplitRatio(clamped);
    };

    const handleMouseUp = () => {
      setIsDraggingSplit(false);
      try {
        localStorage.setItem('prism_editor_split_ratio', splitRatio.toFixed(1));
      } catch (e) {}
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplit, splitRatio]);

  const debounceTimerRef = useRef(null);

  // Auto-save projects and active project to localStorage
  useEffect(() => {
    localStorage.setItem('prism_projects_v7', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('prism_active_project_id_v7', activeProjectId);
  }, [activeProjectId]);

  // Sync working files/folders/name into the active project record
  useEffect(() => {
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          name: projectName,
          folders,
          files
        };
      }
      return p;
    }));
  }, [projectName, folders, files, activeProjectId]);

  // Project Switch & Management handlers
  const handleSelectProject = (projId) => {
    const target = projects.find(p => p.id === projId);
    if (!target) return;
    setActiveProjectId(projId);
    setProjectName(target.name);
    setFolders(target.folders || []);
    setFiles(target.files || []);
    const main = (target.files || []).find(f => f.isMain) || (target.files || [])[0];
    if (main) {
      setActiveFileId(main.id);
      setLatexCode(main.content);
      triggerRecompile(main.content);
    }
  };

  const handleCreateProject = ({ name, folders: newFolders, files: newFiles }) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: name || 'Untitled Project',
      createdAt: Date.now(),
      folders: newFolders || [],
      files: newFiles || []
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setProjectName(newProj.name);
    setFolders(newProj.folders);
    setFiles(newProj.files);
    const main = newProj.files.find(f => f.isMain) || newProj.files[0];
    if (main) {
      setActiveFileId(main.id);
      setLatexCode(main.content);
      triggerRecompile(main.content);
    }
  };

  const handleDeleteProject = (projId) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter(p => p.id !== projId);
    setProjects(remaining);
    if (activeProjectId === projId) {
      handleSelectProject(remaining[0].id);
    }
  };

  const handleRenameProject = (projId, newName) => {
    setProjects(prev => prev.map(p => p.id === projId ? { ...p, name: newName } : p));
    if (activeProjectId === projId) {
      setProjectName(newName);
    }
  };

  // Auto-save history to localStorage
  useEffect(() => {
    localStorage.setItem('prism_version_history', JSON.stringify(history.slice(0, 30)));
  }, [history]);

  const [recompileTrigger, setRecompileTrigger] = useState(0);

  // Compile LaTeX code function
  const triggerRecompile = useCallback((codeToCompile = latexCode) => {
    setCompileStatus('compiling');
    setRecompileTrigger(c => c + 1);
    try {
      const bibFile = files.find(f => f.name.endsWith('.bib'));
      const bibContent = bibFile ? bibFile.content : '';
      const parsedCitations = parseBibtex(bibContent);

      const result = compileLatexToHtml(codeToCompile, {
        projectFiles: files,
        citations: parsedCitations
      });
      const diags = parseLatexDiagnostics(codeToCompile);

      setCompiledData(result);
      setDiagnostics(diags);
      setCompileStatus('idle');
    } catch (err) {
      console.error('Compilation error:', err);
      setCompileStatus('error');
    }
  }, [files, latexCode]);

  // Global window shortcut: Ctrl+S / Cmd+S -> Compile & Save (prevents browser dialog)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerRecompile();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [triggerRecompile]);

  // Handle LaTeX Code Change
  const handleLatexChange = (newCode) => {
    setLatexCode(newCode);

    // Update active file content
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));

    // Debounced recompile
    if (autoCompileDelay > 0) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        triggerRecompile(newCode);
      }, autoCompileDelay);
    }
  };

  // Handle DOCX HTML Change
  const handleDocxChange = (newHtml) => {
    setDocxHtml(newHtml);
    setFiles(prev => prev.map(f => f.name.endsWith('.docx') ? { ...f, content: newHtml } : f));

    // Also auto-generate LaTeX representation
    const synthesizedLatex = htmlToLatex(newHtml, projectName);
    setCompiledData(compileLatexToHtml(synthesizedLatex));
  };

  // Sync DOCX to LaTeX
  const handleSyncDocxToLatex = () => {
    const synthesized = htmlToLatex(docxHtml, projectName);
    setLatexCode(synthesized);
    setFiles(prev => prev.map(f => f.isMain ? { ...f, content: synthesized } : f));
    triggerRecompile(synthesized);
    setMode('latex');
  };

  // Periodic Auto-Snapshot (Overleaf feature)
  useEffect(() => {
    const interval = setInterval(() => {
      const words = compiledData?.stats?.words || 0;
      setHistory(prev => [
        {
          id: `snap-${Date.now()}`,
          timestamp: Date.now(),
          label: 'Auto Snapshot',
          isLabeled: false,
          code: latexCode,
          wordCount: words
        },
        ...prev
      ]);
    }, 180000); // every 3 minutes

    return () => clearInterval(interval);
  }, [latexCode, compiledData]);

  // File explorer interactions
  const handleSelectFile = (fileId) => {
    setActiveFileId(fileId);
    const selected = files.find(f => f.id === fileId);
    if (!selected) return;

    if (selected.name.endsWith('.docx')) {
      setMode('docx');
      setDocxHtml(selected.content);
    } else {
      setMode('latex');
      setLatexCode(selected.content);
      triggerRecompile(selected.content);
    }
  };

  const handleCreateFolder = (folderName) => {
    if (!folderName) return;
    setFolders(prev => prev.includes(folderName) ? prev : [...prev, folderName]);
  };

  const handleDeleteFolder = (folderName) => {
    setFolders(prev => prev.filter(f => f !== folderName));
    setFiles(prev => prev.map(f => f.folder === folderName ? { ...f, folder: '' } : f));
  };

  const handleCreateFile = (name, type, targetFolder = '') => {
    let initialContent = '';
    if (type === 'docx') initialContent = '<h1>New Document</h1><p>Start typing...</p>';
    else if (type === 'bib') initialContent = '% BibTeX references\n';
    else if (type === 'sty') initialContent = `\\ProvidesPackage{${name.replace('.sty', '')}}[Custom package]\n`;
    else initialContent = `% ${name}\n`;

    const newFile = {
      id: `f-${Date.now()}`,
      name,
      folder: targetFolder || '',
      content: initialContent
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    if (type === 'docx') {
      setMode('docx');
      setDocxHtml(initialContent);
    } else {
      setMode('latex');
      setLatexCode(initialContent);
      triggerRecompile(initialContent);
    }
  };

  const handleDeleteFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      const remaining = files.filter(f => f.id !== fileId);
      if (remaining.length > 0) {
        handleSelectFile(remaining[0].id);
      }
    }
  };

  // Template Selection (Loads BOTH LaTeX and DOCX)
  const handleSelectTemplate = (tpl) => {
    setProjectName(tpl.name);
    setLatexCode(tpl.latexCode);
    setDocxHtml(tpl.docxHtml);

    setFiles(prev => prev.map(f => {
      if (f.isMain || f.name === 'main.tex') return { ...f, content: tpl.latexCode };
      if (f.name.endsWith('.docx')) return { ...f, content: tpl.docxHtml };
      return f;
    }));

    triggerRecompile(tpl.latexCode);
  };

  // Handle direct file uploads from the File Tree sidebar (single, multi, or .zip)
  const handleUploadFiles = async (fileOrFiles) => {
    const fileList = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    if (!fileList.length) return;

    // Check if a .zip project archive was uploaded
    const zipFile = fileList.find(f => f.name.toLowerCase().endsWith('.zip'));
    if (zipFile && window.JSZip) {
      try {
        const zip = await window.JSZip.loadAsync(zipFile);
        const imported = [];
        for (const [relativePath, entry] of Object.entries(zip.files)) {
          if (entry.dir || relativePath.startsWith('__MACOSX') || relativePath.includes('/.')) continue;
          const name = relativePath.split('/').pop();
          if (!name) continue;

          if (name.match(/\.(png|jpe?g|gif|webp)$/i)) {
            const blob = await entry.async('blob');
            imported.push({
              id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name,
              content: blob
            });
          } else {
            const text = await entry.async('string');
            const isMainCandidate = name === 'cv-llt.tex' || name === 'resume.tex' || name === 'main.tex';
            imported.push({
              id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name,
              content: text,
              isMain: isMainCandidate
            });
          }
        }

        if (imported.length > 0) {
          const mainFile = imported.find(f => f.isMain) || imported.find(f => f.name.endsWith('.tex')) || imported[0];
          mainFile.isMain = true;
          setFiles(imported);
          setActiveFileId(mainFile.id);
          if (typeof mainFile.content === 'string') {
            setLatexCode(mainFile.content);
            triggerRecompile(mainFile.content);
          }
          return;
        }
      } catch (err) {
        console.error('ZIP extraction error:', err);
      }
    }

    // Process list of uploaded files
    const newItems = [];
    for (const file of fileList) {
      if (!file || !file.name) continue;
      const isImg = file.name.match(/\.(png|jpe?g|gif|webp)$/i);
      let content;
      if (isImg) {
        content = file;
      } else {
        content = await file.text();
      }

      const isMainCandidate = file.name === 'cv-llt.tex' || file.name === 'resume.tex' || file.name === 'main.tex';
      newItems.push({
        id: `f-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        content,
        isMain: isMainCandidate
      });
    }

    if (newItems.length > 0) {
      setFiles(prev => {
        const names = new Set(newItems.map(n => n.name));
        const filtered = prev.filter(p => !names.has(p.name));
        return [...filtered, ...newItems];
      });

      const mainCandidate = newItems.find(f => f.isMain) || newItems.find(f => f.name.endsWith('.tex'));
      if (mainCandidate) {
        setActiveFileId(mainCandidate.id);
        if (typeof mainCandidate.content === 'string') {
          setLatexCode(mainCandidate.content);
          triggerRecompile(mainCandidate.content);
        }
      }
    }
  };

  // Import Data (PDF, DOCX, TeX, Bib)
  const handleImportData = ({ type, fileName, title, latexCode: importedLatex, docxHtml: importedDocx, bibtexContent }) => {
    if (title) setProjectName(title);

    if (importedLatex) {
      setLatexCode(importedLatex);
      setFiles(prev => prev.map(f => f.isMain ? { ...f, content: importedLatex } : f));
      triggerRecompile(importedLatex);
    }

    if (importedDocx) {
      setDocxHtml(importedDocx);
      setFiles(prev => prev.map(f => f.name.endsWith('.docx') ? { ...f, content: importedDocx } : f));
    }

    if (bibtexContent) {
      setFiles(prev => {
        const existingBib = prev.find(f => f.name.endsWith('.bib'));
        if (existingBib) {
          return prev.map(f => f.id === existingBib.id ? { ...f, content: `${f.content}\n\n${bibtexContent}` } : f);
        }
        return [...prev, { id: `f-${Date.now()}`, name: 'references.bib', content: bibtexContent }];
      });
    }
  };

  // Export handlers
  const handleExportPdf = () => {
    window.print();
  };

  const handleExportDocx = () => {
    exportToDocx(docxHtml || latexToHtml(latexCode), `${projectName}.docx`);
  };

  const handleExportLatex = () => {
    const blob = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    if (typeof window !== 'undefined' && window.JSZip) {
      const zip = new window.JSZip();
      files.forEach(f => {
        zip.file(f.name, f.content);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}_project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      handleExportLatex();
    }
  };

  // Symbols Palette Insert
  const handleInsertSymbol = (latexSymbol) => {
    if (mode === 'latex') {
      handleLatexChange(`${latexCode} ${latexSymbol}`);
    } else {
      handleDocxChange(`${docxHtml} <span style="font-family:monospace; color:#4f46e5;">$${latexSymbol}$</span>`);
    }
  };

  // Citation Insert
  const handleInsertCitation = (citeTag) => {
    if (mode === 'latex') {
      handleLatexChange(`${latexCode} ${citeTag}`);
    } else {
      handleDocxChange(`${docxHtml} <span style="font-family:serif; color:#4f46e5; font-size:12px;">${citeTag}</span>`);
    }
  };

  const handleAddBibtexEntry = (entrySnippet) => {
    setFiles(prev => {
      const bibFile = prev.find(f => f.name.endsWith('.bib'));
      if (bibFile) {
        return prev.map(f => f.id === bibFile.id ? { ...f, content: `${f.content}\n\n${entrySnippet}` } : f);
      }
      return [...prev, { id: `f-${Date.now()}`, name: 'references.bib', content: entrySnippet }];
    });
  };

  // Label Current Version
  const handleLabelVersion = (label) => {
    const newSnap = {
      id: `snap-${Date.now()}`,
      timestamp: Date.now(),
      label,
      isLabeled: true,
      code: latexCode,
      wordCount: compiledData?.stats?.words || 0
    };
    setHistory(prev => [newSnap, ...prev]);
  };

  // Restore Version
  const handleRestoreVersion = (codeToRestore) => {
    setLatexCode(codeToRestore);
    triggerRecompile(codeToRestore);
    setFiles(prev => prev.map(f => f.isMain ? { ...f, content: codeToRestore } : f));
  };

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const bibFile = files.find(f => f.name.endsWith('.bib'));

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Full-Screen First-Time Setup Blur Overlay (0% to 100%) */}
      {showFirstTimeSetup && (
        <FirstTimeSetupOverlay
          onComplete={() => setShowFirstTimeSetup(false)}
          onPrewarm={() => triggerRecompile()}
        />
      )}

      {/* Top Navbar */}
      <StudioNavbar
        projectName={projectName}
        setProjectName={setProjectName}
        mode={mode}
        setMode={setMode}
        compileStatus={compileStatus}
        onRecompile={() => triggerRecompile()}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenSymbols={() => setIsSymbolsOpen(true)}
        onOpenCitations={() => setIsCitationsOpen(true)}
        onOpenImport={() => setIsImportExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isAiDrawerOpen={isAiDrawerOpen}
        setIsAiDrawerOpen={setIsAiDrawerOpen}
        isAiDisabled={isAiDisabled}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onExportLatex={handleExportLatex}
        onExportZip={handleExportZip}
        diagnosticsCount={diagnostics.length}
      />

      {/* Main Studio Body: File Explorer | Editor (LaTeX or DOCX) | Right Side Live PDF Preview */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Overleaf Project File Tree */}
        <ProjectExplorer
          projectName={projectName}
          onOpenProjects={() => setIsProjectsOpen(true)}
          files={files}
          folders={folders}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDeleteFile={handleDeleteFile}
          onDeleteFolder={handleDeleteFolder}
          onRenameFile={(id, newName) => {
            setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
          }}
          onUploadFile={handleUploadFiles}
          isOpen={isExplorerOpen}
          onToggleOpen={() => setIsExplorerOpen(!isExplorerOpen)}
        />

        {/* Resizable Code Editor & Live Preview Split Container */}
        <div ref={splitContainerRef} className="flex-1 h-full flex overflow-hidden relative">
          {/* Central Editor Area (LaTeX Source OR DOCX Visual WYSIWYG) */}
          <div 
            className="h-full flex flex-col border-r border-slate-800 overflow-hidden shrink-0"
            style={{ width: `${splitRatio}%`, minWidth: '280px' }}
          >
            {mode === 'latex' ? (
              <LatexEditor
                code={latexCode}
                onChange={handleLatexChange}
                onRecompile={() => triggerRecompile()}
                onOpenAiPrompt={() => setIsAiDrawerOpen(true)}
                diagnostics={diagnostics}
                fontSize={fontSize}
                projectFiles={files}
                activeFileName={activeFile?.name}
                splitRatio={splitRatio}
                onSetSplitRatio={(ratio) => {
                  setSplitRatio(ratio);
                  try { localStorage.setItem('prism_editor_split_ratio', ratio.toString()); } catch(e) {}
                }}
              />
            ) : (
              <DocxVisualEditor
                htmlContent={docxHtml}
                onChange={handleDocxChange}
                onSyncToLatex={handleSyncDocxToLatex}
                onOpenAiPrompt={() => setIsAiDrawerOpen(true)}
              />
            )}
          </div>

          {/* Draggable Divider Splitter */}
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingSplit(true);
            }}
            onDoubleClick={() => {
              setSplitRatio(50);
              try { localStorage.setItem('prism_editor_split_ratio', '50'); } catch(e) {}
            }}
            className={`w-2 hover:w-2.5 relative group cursor-col-resize select-none flex items-center justify-center transition-all z-20 shrink-0 ${
              isDraggingSplit ? 'bg-indigo-600 shadow-md shadow-indigo-500/50' : 'bg-slate-900 hover:bg-indigo-500/80 border-x border-slate-800'
            }`}
            title="Drag to resize (Double-click to reset 50:50)"
          >
            {/* Grip handle visual line */}
            <div className={`w-0.5 h-8 rounded-full transition-colors ${
              isDraggingSplit ? 'bg-white' : 'bg-slate-600 group-hover:bg-white'
            }`} />

            {/* Floating Presets Badge on hover */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-full px-2 py-0.5 shadow-xl text-[10px] text-slate-300 flex items-center space-x-1 whitespace-nowrap z-30">
              <button
                onClick={(e) => { e.stopPropagation(); setSplitRatio(50); }}
                className={`hover:text-white px-1 rounded transition-colors ${Math.round(splitRatio) === 50 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
              >
                50:50
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={(e) => { e.stopPropagation(); setSplitRatio(60); }}
                className={`hover:text-white px-1 rounded transition-colors ${Math.round(splitRatio) === 60 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
              >
                60:40
              </button>
              <span className="text-slate-600">·</span>
              <button
                onClick={(e) => { e.stopPropagation(); setSplitRatio(40); }}
                className={`hover:text-white px-1 rounded transition-colors ${Math.round(splitRatio) === 40 ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
              >
                40:60
              </button>
            </div>
          </div>

          {/* Right Side: Live Compiled PDF Preview (OpenAI Prism Canvas) */}
          <div 
            className="h-full flex flex-col overflow-hidden shrink-0"
            style={{ width: `${100 - splitRatio}%`, minWidth: '300px' }}
          >
            <CompiledPdfPreview
              compiledData={compiledData}
              compileStatus={compileStatus}
              onDownloadPdf={handleExportPdf}
              projectName={projectName}
              rawLatexCode={latexCode}
              projectFiles={files}
              activeFile={activeFile}
              activeFileId={activeFileId}
              recompileTrigger={recompileTrigger}
            />
          </div>

          {/* Fullscreen drag overlay to prevent iframe/canvas stealing mouse events during resize */}
          {isDraggingSplit && (
            <div className="fixed inset-0 z-50 cursor-col-resize select-none pointer-events-auto bg-transparent" />
          )}
        </div>

        {/* Sliding Drawers & Sidebars */}
        {/* 1. OpenAI Prism AI Copilot */}
        <PrismAiDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
          currentCode={mode === 'latex' ? latexCode : docxHtml}
          onApplyCode={(newCode) => {
            if (mode === 'latex') handleLatexChange(newCode);
            else handleDocxChange(newCode);
          }}
          mode={mode}
          diagnostics={diagnostics}
          activeFileName={activeFile?.name}
          isAiDisabled={isAiDisabled}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 2. Overleaf Premium Version History & Visual Diff */}
        <VersionHistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          currentCode={latexCode}
          onRestoreVersion={handleRestoreVersion}
          onLabelVersion={handleLabelVersion}
        />

        {/* 3. LaTeX Symbol Palette & Math Cheat Sheet */}
        <SymbolPaletteDrawer
          isOpen={isSymbolsOpen}
          onClose={() => setIsSymbolsOpen(false)}
          onInsertSymbol={handleInsertSymbol}
        />

        {/* 4. BibTeX Citation Manager */}
        <CitationManagerDrawer
          isOpen={isCitationsOpen}
          onClose={() => setIsCitationsOpen(false)}
          bibtexContent={bibFile ? bibFile.content : ''}
          onInsertCitation={handleInsertCitation}
          onAddBibtexEntry={handleAddBibtexEntry}
        />

        {/* 5. Diagnostics Log Console */}
        <DiagnosticsDrawer
          isOpen={isDiagnosticsOpen}
          onClose={() => setIsDiagnosticsOpen(false)}
          diagnostics={diagnostics}
          onFixWithAi={(diag) => {
            setIsAiDrawerOpen(true);
          }}
          onJumpToLine={(line) => {
            // line jump
          }}
        />
      </main>

      {/* Modals */}
      <TemplatesDrawer
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportData={handleImportData}
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onExportLatex={handleExportLatex}
        onExportZip={handleExportZip}
        projectName={projectName}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        autoCompileDelay={autoCompileDelay}
        setAutoCompileDelay={setAutoCompileDelay}
      />

      {/* Overleaf-Style Projects Manager Modal */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onRenameProject={handleRenameProject}
      />

      {/* Startup API Key Onboarding Modal */}
      <ApiKeyOnboardingModal
        isOpen={!showFirstTimeSetup && showAiOnboarding}
        onComplete={({ disabled }) => {
          setShowAiOnboarding(false);
          setIsAiDisabled(!!disabled);
        }}
      />
    </div>
  );
}
