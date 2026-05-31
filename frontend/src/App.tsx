import { useState, useEffect, useCallback } from 'react';
import { Play, GraduationCap, LayoutDashboard, Settings, TerminalSquare, BookOpen, ChevronRight } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { Terminal } from './components/Terminal';
import { ChapterContent } from './components/ChapterContent';
import { getCookie } from './utils/cookies';
import { themes } from './utils/editorThemes';
import { SettingsModal } from './components/SettingsModal';
import type { Chapter } from './data/chapters';

function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [terminalHeight, setTerminalHeight] = useState<number>(250);
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
        if (data.length > 0) {
          setCurrentChapterId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const currentChapterIndex = chapters.findIndex(c => c.id === currentChapterId);
  const currentChapter = chapters[currentChapterIndex];
  const progress = chapters.length > 0 ? Math.round((completedChapters.length / chapters.length) * 100) : 0;

  useEffect(() => {
    localStorage.setItem('completedChapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  useEffect(() => {
    if (currentChapter) {
      setCode(currentChapter.initialCode);
      setOutput('');
      setError(undefined);
    }
  }, [currentChapterId, currentChapter]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = window.innerHeight - moveEvent.clientY;
      setTerminalHeight(Math.max(100, Math.min(newHeight, window.innerHeight - 200)));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleEditorBeforeMount = (monaco: any) => {
    Object.keys(themes).forEach(themeName => {
      monaco.editor.defineTheme(themeName, themes[themeName]);
    });
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterId(chapters[currentChapterIndex + 1].id);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterId(chapters[currentChapterIndex - 1].id);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>Loading Courses...</div>;
  }

  if (!currentChapter) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--accent-error)' }}>Failed to load course content.</div>;
  }

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('');
    setError(undefined);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, chapterId: currentChapterId })
      });

      if (!response.ok) {
        if (response.status === 408) {
          throw new Error('Execution timeout: Code took too long to run. (Infinite loop?)');
        }
        const errText = await response.text();
        throw new Error(`Server error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      setOutput(data.output);
      
      if (data.success) {
        if (!completedChapters.includes(currentChapterId)) {
          setCompletedChapters([...completedChapters, currentChapterId]);
        }
      } else {
        setError('Verification failed. Check the output tab for details.');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="slim-nav">
        <div style={{ height: '56px', borderBottom: '1px solid var(--border-color)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GraduationCap color="var(--accent-cyan)" size={28} />
        </div>
        <div className="slim-nav-icon active" title="Course">
          <BookOpen size={20} />
        </div>
        <div className="slim-nav-icon" title="Dashboard">
          <LayoutDashboard size={20} />
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
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', letterSpacing: '0.5px' }}>Golang Tutorials</strong>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span>lessons</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{currentChapter.title}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {completedChapters.length}/{chapters.length} complete
              </span>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: `conic-gradient(var(--accent-cyan) ${progress}%, var(--border-color) 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                  {progress}%
                </div>
              </div>
            </div>

            <button 
              className="btn-run" 
              onClick={handleRunCode}
              disabled={isExecuting}
              style={{ opacity: isExecuting ? 0.7 : 1, cursor: isExecuting ? 'not-allowed' : 'pointer' }}
            >
              <Play size={16} fill="currentColor" strokeWidth={1} />
              {isExecuting ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </header>

        <div className="workspace-flex">
          <Sidebar 
            chapters={chapters} 
            currentChapterId={currentChapterId} 
            onSelectChapter={setCurrentChapterId} 
            completedChapters={completedChapters}
            progress={progress}
          />
          
          <section className="lesson-panel">
            <header className="panel-tab">
              <BookOpen size={16} color="var(--text-muted)" />
              LESSON.md
            </header>
            <div className="lesson-content">
              <ChapterContent chapter={currentChapter} />
            </div>
            <div className="floating-nav-container">
              <button 
                className="btn-floating" 
                onClick={goToPrevChapter} 
                disabled={currentChapterIndex === 0}
              >
                Previous
              </button>
              <button 
                className="btn-floating" 
                onClick={goToNextChapter} 
                disabled={currentChapterIndex === chapters.length - 1}
              >
                Next lesson <ChevronRight size={16} />
              </button>
            </div>
          </section>
          
          <section className="editor-terminal-panel">
            <div className="editor-container">
              <header className="panel-tab">
                <span style={{ color: 'var(--text-muted)' }}>&lt;&gt;</span>
                main.go
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-warning)', marginLeft: '8px' }}></div>
              </header>
              <CodeEditor 
                code={code} 
                onChange={(v) => setCode(v || '')} 
                theme={editorTheme}
                fontSize={editorFontSize}
                beforeMount={handleEditorBeforeMount}
              />
            </div>

            <div className="resizer-horizontal" onMouseDown={startResizing} />

            <div className="terminal-container" style={{ height: `${terminalHeight}px` }}>
              <header className="panel-tab" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TerminalSquare size={16} color="var(--accent-cyan)" />
                  TERMINAL
                </div>
                {output && !error && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ✓ PASS
                  </div>
                )}
                {error && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-error)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    × ERROR
                  </div>
                )}
              </header>
              <div className="terminal-content">
                <Terminal output={output} isExecuting={isExecuting} error={error} />
              </div>
            </div>
          </section>
        </div>
      </div>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={editorTheme}
        currentFontSize={editorFontSize}
        onThemeChange={setEditorTheme}
        onFontSizeChange={setEditorFontSize}
      />
    </div>
  );
}

export default App;
