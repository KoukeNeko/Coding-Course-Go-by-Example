import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, TerminalSquare, BookOpen } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { CodeEditor } from '../components/CodeEditor';
import { Terminal } from '../components/Terminal';
import { ChapterContent } from '../components/ChapterContent';
import type { Chapter } from '../data/chapters';
import { themes } from '../utils/editorThemes';

interface WorkspaceProps {
  chapters: Chapter[];
  completedChapters: string[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<string[]>>;
  progress: number;
  editorTheme: string;
  editorFontSize: number;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  chapters,
  completedChapters,
  setCompletedChapters,
  progress,
  editorTheme,
  editorFontSize
}) => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  // If chapterId is invalid, redirect to dashboard
  const currentChapter = chapters.find((c: any) => c.id === chapterId);
  const currentChapterIndex = chapters.findIndex((c: any) => c.id === chapterId);

  useEffect(() => {
    if (!currentChapter) {
      navigate('/');
    }
  }, [currentChapter, navigate]);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Resizer state
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (currentChapter) {
      setCode(currentChapter.initialCode);
      setOutput('');
      setError('');
    }
  }, [currentChapter]);

  // Persist completed chapters
  useEffect(() => {
    localStorage.setItem('completedChapters', JSON.stringify(completedChapters));
  }, [completedChapters]);

  // Resizer logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY;
      const minHeight = 100;
      const maxHeight = windowHeight - 200;
      if (newHeight > minHeight && newHeight < maxHeight) {
        setTerminalHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleEditorBeforeMount = (monaco: any) => {
    Object.keys(themes).forEach(themeName => {
      monaco.editor.defineTheme(themeName, themes[themeName]);
    });
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      navigate(`/lesson/${chapters[currentChapterIndex + 1].id}`);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      navigate(`/lesson/${chapters[currentChapterIndex - 1].id}`);
    }
  };

  const handleRunCode = async () => {
    if (!currentChapter) return;
    setIsExecuting(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, chapterId: currentChapter.id })
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
        if (!completedChapters.includes(currentChapter.id)) {
          setCompletedChapters([...completedChapters, currentChapter.id]);
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

  if (!currentChapter) return null;

  return (
    <>
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
          currentChapterId={currentChapter.id} 
          onSelectChapter={(id) => navigate(`/lesson/${id}`)} 
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
    </>
  );
};
