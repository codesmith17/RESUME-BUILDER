import React, { useState } from 'react';
import { 
  Folder, 
  Plus, 
  FileText, 
  Trash2, 
  Check, 
  Edit2, 
  X, 
  Clock, 
  Layers, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { RESUME_LATEX_SOURCE } from '../../services/resumeSource';

export default function ProjectsModal({
  isOpen,
  onClose,
  projects = [],
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onRenameProject
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('resume');
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  if (!isOpen) return null;

  const TEMPLATES = [
    {
      id: 'resume',
      name: 'Modular Resume Template',
      desc: 'Multi-file resume with modular sections/ folder (education.tex, skills.tex) and references.bib.',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      tag: 'Recommended'
    },
    {
      id: 'blank',
      name: 'Blank LaTeX Document',
      desc: 'Minimal single-file article template with clean preamble, ready for any LaTeX document.',
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      tag: 'Minimal'
    },
    {
      id: 'paper',
      name: 'Academic Research Paper',
      desc: 'Two-column IEEE/ACM style paper with abstract, sections, equation styling, and references.bib.',
      icon: <BookOpen className="w-5 h-5 text-amber-400" />,
      tag: 'Academic'
    }
  ];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const title = newProjectName.trim() || 'Untitled Project';

    let initialFiles = [];
    let initialFolders = [];

    if (selectedTemplate === 'resume') {
      initialFolders = ['sections'];
      initialFiles = [
        {
          id: `f-${Date.now()}-1`,
          name: 'resume.tex',
          folder: '',
          isMain: true,
          content: RESUME_LATEX_SOURCE
        },
        {
          id: `f-${Date.now()}-2`,
          name: 'education.tex',
          folder: 'sections',
          content: `% Education Section\n\\section{Education}\n\\vspace{2pt}\n\\resumeSubHeadingList\n  \\resumeSubheading\n      {Indian Institute of Information Technology, Nagpur}{December 2021 to May 2025}\n      {Bachelor of Technology in Computer Science and Engineering}{Nagpur, India}\n\\resumeSubHeadingListEnd\n`
        },
        {
          id: `f-${Date.now()}-3`,
          name: 'skills.tex',
          folder: 'sections',
          content: `% Technical Skills Section\n\\section{Technical Skills}\n\\resumeSubHeadingList\n\\setlength{\\itemsep}{-0.1em}\n  \\vspace{2pt}\n  \\resumeItem{\\textbf{Languages}: Python, \\href{https://www.hackerrank.com/certificates/4171e19e0102}{\\textcolor{blue}{Go}}, \\href{https://www.hackerrank.com/certificates/11b1622e500c}{\\textcolor{blue}{JavaScript}}, TypeScript, C++, Java, SQL, Rust (Basics)}\n  \\resumeItem{\\textbf{Backend \\& Integrations}: FastAPI, \\href{https://www.hackerrank.com/certificates/6e8ecca5e137}{\\textcolor{blue}{REST APIs}}, Node.js, Express.js, Microservices, MCP}\n  \\resumeItem{\\textbf{Testing}: Jest, JUnit, Cypress, Go unit and HTTP testing, Echo (Labstack)}\n  \\resumeItem{\\textbf{Frontend/UX}: \\href{https://www.hackerrank.com/certificates/0b56202716e8}{\\textcolor{blue}{React}}, Next.js, \\href{https://www.hackerrank.com/certificates/443970b2b086}{\\textcolor{blue}{CSS}}, SCSS, Figma}\n  \\resumeItem{\\textbf{Databases}: PostgreSQL, YugabyteDB, MongoDB, BigQuery, pgvector}\n  \\resumeItem{\\textbf{Cloud/Infrastructure}: AWS S3, SQS, Lambda, Cognito, GCS, Docker, Jenkins, Linux}\n\\resumeSubHeadingListEnd\n`
        },
        {
          id: `f-${Date.now()}-4`,
          name: 'references.bib',
          folder: '',
          content: `@article{sample2026,\n  author = {Tripathi, Krishna},\n  title = {Modern Microservice Architecture},\n  year = {2026}\n}`
        }
      ];
    } else if (selectedTemplate === 'paper') {
      initialFolders = ['sections'];
      initialFiles = [
        {
          id: `f-${Date.now()}-1`,
          name: 'main.tex',
          folder: '',
          isMain: true,
          content: `\\documentclass[journal,10pt]{IEEEtran}\n\\usepackage{amsmath,graphicx,hyperref}\n\n\\title{${title}}\n\\author{Author Name}\n\n\\begin{document}\n\\maketitle\n\n\\begin{abstract}\nThis paper presents an overview of modern systems.\n\\end{abstract}\n\n\\section{Introduction}\nIntroduction content goes here.\n\n\\bibliographystyle{IEEEtran}\n\\bibliography{references}\n\\end{document}\n`
        },
        {
          id: `f-${Date.now()}-2`,
          name: 'references.bib',
          folder: '',
          content: `@article{sample2026,\n  author = {Doe, John},\n  title = {Advances in Systems},\n  journal = {IEEE Transactions},\n  year = {2026}\n}`
        }
      ];
    } else {
      // Blank template
      initialFolders = [];
      initialFiles = [
        {
          id: `f-${Date.now()}-1`,
          name: 'main.tex',
          folder: '',
          isMain: true,
          content: `\\documentclass[11pt]{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage{hyperref}\n\n\\title{${title}}\n\\author{Author}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{Introduction}\nStart writing your LaTeX document here.\n\n\\end{document}\n`
        }
      ];
    }

    onCreateProject({
      name: title,
      folders: initialFolders,
      files: initialFiles
    });

    setNewProjectName('');
    setIsCreating(false);
  };

  const startRename = (proj, e) => {
    e.stopPropagation();
    setRenamingId(proj.id);
    setRenameValue(proj.name);
  };

  const submitRename = (projId, e) => {
    e?.stopPropagation();
    if (renameValue.trim()) {
      onRenameProject(projId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Projects Manager
              </h2>
              <p className="text-xs text-slate-400">
                Switch between documents or create an independent project.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Create Project Form */}
          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className="bg-slate-950/70 border border-indigo-500/40 rounded-xl p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Create New Project</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer Resume or Academic CV"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-2">
                  Choose Starter Architecture
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {TEMPLATES.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                        selectedTemplate === tpl.id
                          ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          {tpl.icon}
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                            tpl.id === 'resume' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {tpl.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 pt-1">
                          {tpl.name}
                        </h4>
                        <p className="text-[10.5px] text-slate-400 leading-snug">
                          {tpl.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
                >
                  <span>Create Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Search projects */}
              {projects.length > 3 && (
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}

              {/* Projects List */}
              <div className="space-y-2">
                {filteredProjects.map((proj) => {
                  const isActive = proj.id === activeProjectId;
                  const isRenaming = renamingId === proj.id;
                  const fileCount = (proj.files || []).length;
                  const folderCount = (proj.folders || []).length;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        onSelectProject(proj.id);
                        onClose();
                      }}
                      className={`group flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/30'
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                        }`}>
                          <Folder className="w-4 h-4" />
                        </div>

                        <div className="min-w-0 flex-1 pr-3">
                          {isRenaming ? (
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') submitRename(proj.id);
                                  if (e.key === 'Escape') setRenamingId(null);
                                }}
                                className="bg-slate-900 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={(e) => submitRename(proj.id, e)}
                                className="p-1 text-emerald-400 hover:text-emerald-300"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                                {proj.name}
                              </h3>
                              {isActive && (
                                <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded text-[9.5px] font-mono font-bold">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center space-x-3 text-[10.5px] text-slate-400 mt-0.5">
                            <span>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
                            {folderCount > 0 && <span>• {folderCount} folder{folderCount !== 1 ? 's' : ''}</span>}
                            <span>• Created {new Date(proj.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex items-center space-x-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {!isRenaming && (
                          <button
                            onClick={(e) => startRename(proj, e)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Rename Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {projects.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete project "${proj.name}"? This cannot be undone.`)) {
                                onDeleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onSelectProject(proj.id);
                            onClose();
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-slate-800 text-slate-300 pointer-events-none'
                              : 'bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-xs'
                          }`}
                        >
                          {isActive ? 'Current' : 'Open'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>{projects.length} project{projects.length !== 1 ? 's' : ''} saved locally</span>
          <span>100% Offline • Independent Files & Folders</span>
        </div>
      </div>
    </div>
  );
}

