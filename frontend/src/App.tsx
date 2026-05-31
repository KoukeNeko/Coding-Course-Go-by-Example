import { useState, useEffect } from 'react';
import { Play, Code2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { Terminal } from './components/Terminal';
import { ChapterContent } from './components/ChapterContent';
import { chapters } from './data/chapters';

function App() {
  const [currentChapterId, setCurrentChapterId] = useState(chapters[0].id);
  const [code, setCode] = useState(chapters[0].initialCode);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const currentChapter = chapters.find(c => c.id === currentChapterId) || chapters[0];

  useEffect(() => {
    setCode(currentChapter.initialCode);
    setOutput('');
    setError(undefined);
  }, [currentChapterId]);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('');
    setError(undefined);

    try {
      const response = await fetch('http://localhost:8080/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
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
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        chapters={chapters} 
        currentChapterId={currentChapterId} 
        onSelectChapter={setCurrentChapterId} 
      />
      
      <main className="main-content">
        <header className="top-bar glass-panel" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderRadius: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Code2 color="var(--go-light)" size={24} />
            <h1 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{currentChapter.title}</h1>
          </div>
          <button 
            className="btn-run" 
            onClick={handleRunCode}
            disabled={isExecuting}
            style={{ opacity: isExecuting ? 0.7 : 1, cursor: isExecuting ? 'not-allowed' : 'pointer' }}
          >
            <Play size={16} fill="currentColor" />
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </header>
        
        <div className="workspace">
          <section className="lesson-panel glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderBottom: 'none' }}>
            <ChapterContent chapter={currentChapter} />
          </section>
          
          <section className="editor-panel">
            <CodeEditor code={code} onChange={(v) => setCode(v || '')} />
            <Terminal output={output} isExecuting={isExecuting} error={error} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
