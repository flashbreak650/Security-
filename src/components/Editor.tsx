import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { Play, Code, Layout, Settings, Globe, ArrowLeft, Save, Check } from 'lucide-react';

interface EditorProps {
  project: Project;
  onUpdate: (project: Project) => void;
  onBack: () => void;
  onDeploy: (project: Project) => void;
}

export default function Editor({ project, onUpdate, onBack, onDeploy }: EditorProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [files, setFiles] = useState(project.files);
  const [projectName, setProjectName] = useState(project.name);
  const [srcDoc, setSrcDoc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update srcDoc for iframe to render "hosted" code
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${files.css}</style>
          </head>
          <body>
            ${files.html}
            <script>${files.js}</script>
          </body>
        </html>
      `);
      
      // Auto-save
      onUpdate({ ...project, files, name: projectName });
    }, 500);

    return () => clearTimeout(timeout);
  }, [files, projectName]);

  const handleManualSave = () => {
    onUpdate({ ...project, files, name: projectName });
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <div className="flex flex-col h-full flex-1 bg-[#0a0a0c]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0d0d0f] border-b border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="font-medium text-lg bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-2 -ml-2 text-slate-50"
          />
          
          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
            project.status === 'deployed' 
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}>
            {project.status === 'deployed' ? 'Deployed' : 'Draft'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {project.domain && (
            <a 
              href={`https://${project.domain}`} 
              target="_blank"
              onClick={(e) => {
                e.preventDefault();
                alert(`লাইভ লিংক: ${project.domain}\n(এটি একটি সিমুলেটেড ডেপ্লয়মেন্ট এনভায়রনমেন্ট)`);
              }}
              className="text-sm text-slate-500 hover:text-indigo-400 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {project.domain}
            </a>
          )}
          <button 
            onClick={handleManualSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors border border-transparent ${isSaving ? 'text-green-400 bg-green-500/10' : 'text-slate-300 hover:bg-white/10'}`}
          >
            {isSaving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saved!' : 'Save'}
          </button>
          <button 
            onClick={() => onDeploy({ ...project, files, name: projectName })}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Play className="w-4 h-4" />
            Deploy
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-[#0a0a0c]">
        {/* Editor Pane */}
        <div className="flex-1 flex flex-col border-r border-white/10 overflow-hidden bg-[#111114]">
          <div className="flex items-center px-4 bg-[#0d0d0f] border-b border-white/10">
            {(['html', 'css', 'js'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                  activeTab === tab 
                    ? 'text-indigo-400 border-indigo-500' 
                    : 'text-slate-500 hover:text-slate-300 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <textarea
              value={files[activeTab]}
              onChange={(e) => setFiles({ ...files, [activeTab]: e.target.value })}
              className="w-full h-full bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed"
              spellCheck="false"
              placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
            />
          </div>
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-[#0a0a0c]">
          <div className="px-6 py-4 border-b border-white/10 text-[10px] font-bold tracking-widest text-slate-500 bg-[#0d0d0f] uppercase flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-400" />
              Live Preview
            </div>
            {project.status === 'deployed' && (
              <div className="flex items-center gap-2 text-indigo-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 absolute" />
                <span className="ml-1 relative z-10">Live on edge</span>
              </div>
            )}
          </div>
          <div className="flex-1 relative bg-white m-0 rounded-none border-0 lg:rounded-bl-none overflow-hidden">
            {/* The absolute positioning combined with w-full h-full prevents iframe overflow issues */}
            <iframe
              title="live-preview"
              srcDoc={srcDoc}
              className="absolute inset-0 w-full h-full border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
