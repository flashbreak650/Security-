import { useState, useEffect } from 'react';
import { Server, Settings, Search, LayoutTemplate, HelpCircle, X, Search as SearchIcon, AlertTriangle } from 'lucide-react';
import { Project } from './types';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('codehost-projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: generateId(),
        name: 'My First Web App',
        status: 'deployed',
        createdAt: Date.now(),
        domain: 'my-first-webapp.codehost.app',
        files: {
          html: `<div class="container">\n  <h1>স্বাগতম CodeHost-এ! 👋</h1>\n  <p>আপনার প্রথম রিয়েল-টাইম হোস্টেড ওয়েবসাইট তৈরি করুন।</p>\n</div>`,
          css: `body {\n  font-family: system-ui, sans-serif;\n  background: #f8fafc;\n  color: #1e293b;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\n\n.container {\n  background: white;\n  padding: 3rem;\n  border-radius: 1rem;\n  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);\n  text-align: center;\n}`,
          js: `console.log("Welcome to your new CodeHost site!");`
        }
      }
    ];
  });
  
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    localStorage.setItem('codehost-projects', JSON.stringify(projects));
  }, [projects]);

  const handleNewProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: 'Untitled Project',
      status: 'draft',
      createdAt: Date.now(),
      files: {
        html: '<div id="app">Hello World!</div>',
        css: 'body { font-family: sans-serif; }',
        js: '// Add JS here'
      }
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const handleDeploy = (projectToDeploy: Project) => {
    const deployedProject = {
      ...projectToDeploy,
      status: 'deployed' as const,
      deployedAt: Date.now(),
      domain: projectToDeploy.domain || `${projectToDeploy.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${generateId().slice(0, 4)}.codehost.app`
    };
    handleUpdateProject(deployedProject);
    alert(`সফলভাবে ডেপ্লয় হয়েছে! লাইভ ডোমেইন: ${deployedProject.domain}`);
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="flex h-screen bg-[#0a0a0c] font-sans text-slate-200">
      {/* Main Sidebar */}
      <aside className="w-16 flex-shrink-0 border-r border-white/10 flex flex-col items-center py-4 bg-[#0d0d0f] z-20 hidden md:flex">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 mb-6">
          <Server className="w-6 h-6" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-3 w-full px-2">
          <button 
            onClick={() => setActiveProjectId(null)}
            className={`p-3 rounded-xl flex justify-center transition-colors ${!activeProjectId ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
            title="Dashboard"
          >
            <LayoutTemplate className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-3 rounded-xl flex justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors" title="Search">
            <Search className="w-5 h-5" />
          </button>
        </nav>
        
        <div className="flex flex-col gap-3 w-full px-2 mt-auto">
          <button onClick={() => setIsHelpOpen(true)} className="p-3 rounded-xl flex justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors" title="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-3 rounded-xl flex justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      {activeProject ? (
        <Editor 
          project={activeProject} 
          onUpdate={handleUpdateProject} 
          onBack={() => setActiveProjectId(null)}
          onDeploy={handleDeploy}
        />
      ) : (
        <Dashboard 
          projects={projects}
          onNewProject={handleNewProject}
          onOpenProject={setActiveProjectId}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] px-4">
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-slate-400" />
              <input 
                autoFocus
                type="text" 
                placeholder="প্রজেক্ট খুঁজুন..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-slate-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredProjects.length > 0 ? filteredProjects.map(p => (
                <button 
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center justify-between group transition-colors"
                >
                  <span className="text-slate-200 group-hover:text-indigo-400 transition-colors font-medium">{p.name}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${p.status === 'deployed' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-slate-400'}`}>
                    {p.status === 'deployed' ? 'Deployed' : 'Draft'}
                  </span>
                </button>
              )) : (
                <div className="p-8 text-center text-slate-500">
                  <LayoutTemplate className="w-8 h-8 opacity-50 mx-auto mb-3" />
                  কোনো প্রজেক্ট পাওয়া যায়নি
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">সেটিংস</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">ডেটা ম্যানেজমেন্ট</h3>
                <p className="text-sm text-slate-400 mb-4">
                  আপনার সমস্ত প্রোজেক্ট আপনার ব্রাউজারের লোকাল স্টোরেজে সেভ করা থাকে। 
                  আপনি চাইলে যেকোনো সময় সব ডেটা মুছে ফেলতে পারেন।
                </p>
                <button 
                  onClick={() => {
                    if (confirm('আপনি কি নিশ্চিত? সব প্রজেক্ট মুছে যাবে!')) {
                      setProjects([]);
                      setActiveProjectId(null);
                      setIsSettingsOpen(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors font-medium"
                >
                  <AlertTriangle className="w-5 h-5" />
                  সমস্ত ডেটা মুছুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">সাহায্য (Help)</h2>
              <button onClick={() => setIsHelpOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-slate-300 space-y-4">
              <p>
                <strong>CodeHost</strong> হলো একটি সিমুলেটেড ইন-ব্রাউজার কোডিং ও হোস্টিং এনভায়রনমেন্ট। 
              </p>
              <ul className="list-disc pl-5 space-y-3 text-sm text-slate-400">
                <li>নতুন প্রজেক্ট তৈরি করতে ড্যাশবোর্ড থেকে <strong>"নতুন প্রজেক্ট"</strong> বাটনে ক্লিক করুন।</li>
                <li>কোড এডিটরে HTML, CSS এবং JS লেখার সাথে সাথেই ডানপাশে লাইভ প্রিভিউ দেখতে পাবেন।</li>
                <li>আপনার সাইটকে লাইভ করতে <strong>Deploy</strong> বাটনে ক্লিক করুন।</li>
                <li>আপনার সমস্ত ডেটা আপনার ব্রাউজারের লোকাল স্টোরেজে সেভ থাকে, তাই রিফ্রেশ করলেও হারাবে না।</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

