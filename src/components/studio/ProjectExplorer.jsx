import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  BookOpen, 
  FilePlus, 
  FolderPlus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Upload, 
  MoreVertical,
  X,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  Edit2,
  Check,
  AlertCircle,
  Layers
} from 'lucide-react';

export default function ProjectExplorer({
  projectName = 'Project',
  onOpenProjects,
  files = [],
  folders = [],
  activeFileId,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onDeleteFolder,
  onRenameFile,
  onUploadFile,
  isOpen,
  onToggleOpen
}) {
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [targetFolder, setTargetFolder] = useState('');
  const [creatingType, setCreatingType] = useState('tex');
  const [unrelatedWarning, setUnrelatedWarning] = useState(null);

  // Expanded folders state
  const [expandedFolders, setExpandedFolders] = useState(() => {
    const initial = {};
    folders.forEach(f => { initial[f] = true; });
    return initial;
  });

  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const handleCreateFileSubmit = (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    let name = newFileName.trim();
    if (!name.includes('.')) {
      name = `${name}.${creatingType}`;
    } else {
      const ext = name.split('.').pop().toLowerCase();
      const validExts = ['tex', 'sty', 'bib', 'cls'];
      if (!validExts.includes(ext)) {
        setUnrelatedWarning(`Unrelated file extension .${ext} rejected. LaTeX projects only support .tex, .sty, .bib, and .cls files.`);
        setTimeout(() => setUnrelatedWarning(null), 5000);
        return;
      }
    }
    onCreateFile(name, creatingType, targetFolder);
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleCreateFolderSubmit = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const cleanName = newFolderName.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '-');
    onCreateFolder(cleanName);
    setExpandedFolders(prev => ({ ...prev, [cleanName]: true }));
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const startRenaming = (file, e) => {
    e.stopPropagation();
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const submitRename = (fileId, e) => {
    e?.stopPropagation();
    if (renameValue.trim()) {
      onRenameFile(fileId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const getFileIcon = (fileName) => {
    const name = (fileName || '').toLowerCase();
    if (name.endsWith('.tex')) {
      return <FileText className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />;
    }
    if (name.endsWith('.sty') || name.endsWith('.cls')) {
      return <FileCode className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />;
    }
    if (name.endsWith('.bib')) {
      return <BookOpen className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />;
    }
    if (name.match(/\.(png|jpe?g|svg|webp)$/i)) {
      return <ImageIcon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />;
    }
    return <FileText className="w-4 h-4 text-slate-400 group-hover:text-white" />;
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="h-full w-9 bg-[#171e2e] border-r border-slate-800 flex flex-col items-center py-3 text-slate-400 hover:text-slate-200 transition-colors select-none"
        title="Open File Tree"
      >
        <ChevronRight className="w-4 h-4 mb-4 text-slate-400" />
        <span className="[writing-mode:vertical-rl] text-[11px] font-semibold text-slate-300 tracking-wider">
          PROJECT FILES
        </span>
      </button>
    );
  }

  // Group files by folder
  const allKnownFolders = Array.from(new Set([
    ...folders,
    ...files.map(f => f.folder).filter(Boolean)
  ]));

  const filesByFolder = {};
  allKnownFolders.forEach(folder => {
    filesByFolder[folder] = files.filter(f => f.folder === folder);
  });
  const rootFiles = files.filter(f => !f.folder);

  const renderFileRow = (file, isInsideFolder = false) => {
    const isActive = file.id === activeFileId;
    const isMain = file.isMain || file.name === 'resume.tex' || file.name === 'cv-llt.tex' || file.name === 'main.tex';
    const isRenaming = renamingId === file.id;

    let itemStyle = 'text-slate-300 hover:bg-slate-800/70 hover:text-white';
    if (isMain && isActive) {
      itemStyle = 'bg-[#186036] text-white font-medium shadow-xs';
    } else if (isActive) {
      itemStyle = 'bg-[#27354f] text-white font-medium ring-1 ring-indigo-500/30';
    } else if (isMain) {
      itemStyle = 'bg-[#186036]/80 text-white hover:bg-[#186036]';
    }

    return (
      <div
        key={file.id}
        onClick={() => onSelectFile(file.id)}
        className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all ${
          isInsideFolder ? 'ml-3.5 pl-3 border-l border-slate-700/60' : ''
        } ${itemStyle}`}
      >
        <div className="flex items-center space-x-2 truncate flex-1 min-w-0">
          {getFileIcon(file.name)}
          {isRenaming ? (
            <div className="flex items-center space-x-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename(file.id, e);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                className="text-[12px] bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-white w-full font-mono outline-none"
              />
              <button 
                onClick={(e) => submitRename(file.id, e)} 
                className="text-emerald-400 hover:text-emerald-300 p-0.5"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="truncate tracking-wide text-[12.5px] font-mono">
              {file.name}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isRenaming && (
            <button
              onClick={(e) => startRenaming(file, e)}
              className="p-1 hover:text-indigo-300 text-slate-400 rounded"
              title="Rename File"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}

          {!isMain && files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${file.name}?`)) {
                  onDeleteFile(file.id);
                }
              }}
              className="p-1 hover:text-rose-400 text-slate-400 rounded"
              title="Delete File"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-64 h-full bg-[#161c28] border-r border-slate-800/80 flex flex-col flex-shrink-0 select-none font-sans">
      {/* Overleaf-Style Header */}
      <div className="h-11 px-3 border-b border-slate-800/80 flex items-center justify-between bg-[#192234]">
        <button
          onClick={onOpenProjects}
          className="flex items-center space-x-1.5 text-slate-200 hover:text-white font-medium text-xs tracking-wide max-w-[125px] truncate group text-left"
          title="Open Projects Manager & Switch Project"
        >
          <Folder className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 shrink-0" />
          <span className="truncate">{projectName}</span>
        </button>

        <div className="flex items-center space-x-1 text-slate-300">
          {/* Projects Switcher */}
          <button
            onClick={onOpenProjects}
            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-300 hover:text-amber-400 transition-colors"
            title="Projects List / New Project"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* New File */}
          <button
            onClick={() => {
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
              setTargetFolder(allKnownFolders[0] || '');
            }}
            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-300 hover:text-emerald-400 transition-colors"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
          </button>

          {/* New Folder */}
          <button
            onClick={() => {
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
            }}
            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-300 hover:text-amber-400 transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4" />
          </button>

          {/* Upload Files or ZIP */}
          <label 
            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-300 hover:text-indigo-400 cursor-pointer transition-colors"
            title="Upload Files or .ZIP Project Archive"
          >
            <Upload className="w-4 h-4" />
            <input 
              type="file" 
              multiple 
              accept=".tex,.sty,.bib,.cls,.dtx,.ins,.png,.jpg,.jpeg,.svg,.pdf,.zip"
              className="hidden" 
              onChange={(e) => {
                if (e.target.files?.length) {
                  const filesArr = Array.from(e.target.files);
                  const validExtPattern = /\.(tex|sty|bib|cls|dtx|ins|png|jpe?g|svg|pdf|eps|zip)$/i;
                  const valid = [];
                  const rejected = [];

                  filesArr.forEach(f => {
                    if (validExtPattern.test(f.name)) {
                      valid.push(f);
                    } else {
                      rejected.push(f.name);
                    }
                  });

                  if (rejected.length > 0) {
                    setUnrelatedWarning(`Excluded unrelated file(s): ${rejected.join(', ')}. LaTeX projects only support .tex, .bib, .sty, and images.`);
                    setTimeout(() => setUnrelatedWarning(null), 5000);
                  }

                  if (valid.length > 0) {
                    onUploadFile(valid);
                  }
                  e.target.value = '';
                }
              }} 
            />
          </label>

          {/* Collapse Panel */}
          <button
            onClick={onToggleOpen}
            className="p-1.5 hover:bg-slate-700/60 rounded text-slate-400 hover:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rejection Warning Toast for Unrelated Files */}
      {unrelatedWarning && (
        <div className="mx-2 my-2 p-2.5 bg-amber-950/90 border border-amber-600/60 rounded-md text-[11px] text-amber-200 flex items-start space-x-2 animate-fadeIn shadow-md">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{unrelatedWarning}</span>
        </div>
      )}

      {/* New Folder Creator Form */}
      {isCreatingFolder && (
        <form onSubmit={handleCreateFolderSubmit} className="p-3 border-b border-slate-800 bg-[#121722] space-y-2">
          <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-medium">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </div>
          <input
            type="text"
            placeholder="e.g. sections or images"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            autoFocus
            className="w-full text-xs bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
          />
          <div className="flex items-center justify-end space-x-1.5">
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-500 font-medium"
            >
              Create Folder
            </button>
          </div>
        </form>
      )}

      {/* New File Creator Form */}
      {isCreatingFile && (
        <form onSubmit={handleCreateFileSubmit} className="p-3 border-b border-slate-800 bg-[#121722] space-y-2">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <FilePlus className="w-3.5 h-3.5" />
            <span>New File</span>
          </div>

          <input
            type="text"
            placeholder="e.g. education.tex or settings.sty"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            autoFocus
            className="w-full text-xs bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Type</label>
              <select
                value={creatingType}
                onChange={(e) => setCreatingType(e.target.value)}
                className="w-full bg-slate-900 text-slate-300 text-[11px] rounded px-2 py-1 border border-slate-700"
              >
                <option value="tex">LaTeX (.tex)</option>
                <option value="sty">Style (.sty)</option>
                <option value="bib">BibTeX (.bib)</option>
                <option value="cls">Class (.cls)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Folder</label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="w-full bg-slate-900 text-slate-300 text-[11px] rounded px-2 py-1 border border-slate-700 truncate"
              >
                <option value="">[Root Directory]</option>
                {allKnownFolders.map(folder => (
                  <option key={folder} value={folder}>📁 {folder}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-1.5 pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-500 font-medium"
            >
              Create File
            </button>
          </div>
        </form>
      )}

      {/* Hierarchical Folder & File Tree */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        
        {/* Render Folders */}
        {allKnownFolders.map(folderName => {
          const isExpanded = expandedFolders[folderName] !== false;
          const folderFiles = filesByFolder[folderName] || [];

          return (
            <div key={folderName} className="space-y-0.5">
              {/* Folder Row */}
              <div 
                onClick={() => toggleFolder(folderName)}
                className="group flex items-center justify-between px-2 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800/60 cursor-pointer font-medium"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}

                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                  )}

                  <span className="truncate text-[12.5px] text-slate-200">{folderName}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] text-slate-400 rounded-full font-mono">
                    {folderFiles.length}
                  </span>

                  {/* Add File directly to this folder */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreatingFile(true);
                      setTargetFolder(folderName);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-emerald-400 text-slate-400 rounded transition-opacity"
                    title={`Add File into ${folderName}`}
                  >
                    <FilePlus className="w-3 h-3" />
                  </button>

                  {/* Delete folder */}
                  {allKnownFolders.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete folder "${folderName}" and all its contents?`)) {
                          onDeleteFolder(folderName);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 text-slate-400 rounded transition-opacity"
                      title="Delete Folder"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Nested Folder Files */}
              {isExpanded && (
                <div className="space-y-0.5">
                  {folderFiles.length === 0 ? (
                    <div className="pl-7 py-1 text-[11px] text-slate-500 italic">
                      Empty folder
                    </div>
                  ) : (
                    folderFiles.map(file => renderFileRow(file, true))
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Root Files (Outside any folder) */}
        {rootFiles.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60 space-y-0.5">
            <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Root Files
            </div>
            {rootFiles.map(file => renderFileRow(file, false))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between bg-[#141a26]">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>Local Workspace</span>
        </span>
        <span className="text-slate-400 font-mono text-[10.5px]">
          {allKnownFolders.length} folders • {files.length} files
        </span>
      </div>
    </aside>
  );
}
