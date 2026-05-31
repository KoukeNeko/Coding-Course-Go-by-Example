import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Settings, GraduationCap } from 'lucide-react';
import { getCookie } from './utils/cookies';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './pages/Workspace';
import type { Chapter } from './data/chapters';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editorTheme, setEditorTheme] = useState('github-dark');
  const [editorFontSize, setEditorFontSize] = useState(16);
  
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedChapters');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const savedTheme = getCookie('editor-theme');
    const savedFontSize = getCookie('editor-font-size');
    if (savedTheme) setEditorTheme(savedTheme);
    if (savedFontSize) setEditorFontSize(parseInt(savedFontSize, 10));

    const fetchChapters = async () => {
      try {
        const response = await fetch('/api/chapters');
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data: Chapter[] = await response.json();
        setChapters(data);
      } catch (err) {
        console.error('Failed to load chapters:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const progress = useMemo(() => {
    if (chapters.length === 0) return 0;
    return Math.round((completedChapters.length / chapters.length) * 100);
  }, [completedChapters]);

  const isDashboard = location.pathname === '/';
  const isWorkspace = location.pathname.startsWith('/lesson');

  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-primary)' }}>Loading Courses...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="slim-nav">
        <div style={{ height: '56px', borderBottom: '1px solid var(--border-color)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GraduationCap color="var(--accent-cyan)" size={28} />
        </div>
        <div 
          className={`slim-nav-icon ${isDashboard ? 'active' : ''}`} 
          title="Dashboard"
          onClick={() => navigate('/')}
        >
          <LayoutDashboard size={20} />
        </div>
        <div 
          className={`slim-nav-icon ${isWorkspace ? 'active' : ''}`} 
          title="Course Workspace"
          onClick={() => {
            // Default to first chapter or last uncompleted chapter if clicking the icon directly
            if (!isWorkspace) {
              const nextChap = chapters.find((c: any) => !completedChapters.includes(c.id)) || chapters[0];
              navigate(`/lesson/${nextChap.id}`);
            }
          }}
        >
          <BookOpen size={20} />
        </div>
        <div 
          className="slim-nav-icon" 
          style={{ marginTop: 'auto', marginBottom: '16px' }} 
          title="Settings"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings size={20} />
        </div>
      </nav>

      <div className="main-wrapper">
        <Routes>
          <Route path="/" element={
            <Dashboard 
              chapters={chapters}
              completedChapters={completedChapters}
              progress={progress}
            />
          } />
          <Route path="/lesson/:chapterId" element={
            <Workspace 
              chapters={chapters}
              completedChapters={completedChapters}
              setCompletedChapters={setCompletedChapters}
              progress={progress}
              editorTheme={editorTheme}
              editorFontSize={editorFontSize}
            />
          } />
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Dashboard chapters={chapters} completedChapters={completedChapters} progress={progress} />} />
        </Routes>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={editorTheme}
        onThemeChange={setEditorTheme}
        currentFontSize={editorFontSize}
        onFontSizeChange={setEditorFontSize}
      />
    </div>
  );
}

export default App;
