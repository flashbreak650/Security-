import React from 'react';
import { Project } from '../types';
import { Play, Code, Layout, Settings, Globe, Plus, Trash2, ExternalLink, Calendar } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onNewProject: () => void;
  onOpenProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

export default function Dashboard({ projects, onNewProject, onOpenProject, onDeleteProject }: DashboardProps) {
  function formatDate(timestamp: number) {
    return new Date(timestamp).toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  return (
    <div className="flex-1 bg-[#0a0a0c] overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-2">প্রজেক্ট ড্যাশবোর্ড</h1>
            <p className="text-slate-400 text-lg">আপনার সমস্ত ওয়েব হোস্টিং প্রজেক্ট ও কোড এখানে ম্যানেজ করুন।</p>
          </div>
          <button 
            onClick={onNewProject}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-5 h-5" />
            নতুন প্রজেক্ট তৈরি করুন
          </button>
        </header>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-[#111114] rounded-2xl border border-white/5">
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">কোনো প্রজেক্ট নেই</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-8">আপনি এখনও কোনো প্রজেক্ট তৈরি করেননি। শুরু করতে নিচে ক্লিক করুন।</p>
            <button 
              onClick={onNewProject}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              নতুন প্রজেক্ট
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div 
                key={project.id} 
                className="bg-[#111114] rounded-2xl border border-white/5 flex flex-col overflow-hidden hover:border-indigo-500/30 transition-all group relative"
              >
                <div className="p-6 flex-1 cursor-pointer" onClick={() => onOpenProject(project.id)}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Code className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                      project.status === 'deployed' 
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                      {project.status === 'deployed' ? 'Deployed' : 'Draft'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  
                  {project.domain && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 bg-white/5 px-3 py-2 rounded-lg border border-white/5 w-fit">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      {project.domain}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    UPDATED {formatDate(project.createdAt).toUpperCase()}
                  </div>
                </div>

                <div className="border-t border-white/10 p-4 bg-[#0d0d0f] flex justify-end gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProject(project.id);
                    }}
                    className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white transition-colors"
                  >
                    Open Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
