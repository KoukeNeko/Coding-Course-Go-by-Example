import { useRef, useEffect } from 'react';
import { Terminal as TermIcon, AlertCircle, Loader2 } from 'lucide-react';

interface TerminalProps {
  output: string;
  isExecuting: boolean;
  error?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ output, isExecuting, error }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isExecuting, error]);

  return (
    <div className="terminal-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
        <TermIcon size={16} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Terminal Output
        </span>
      </div>
      
      <div ref={terminalRef} style={{ overflowY: 'auto', maxHeight: 'calc(100% - 32px)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {isExecuting ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--go-light)' }} className="animate-fade-in">
            <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            Executing safely in Docker sandbox...
          </div>
        ) : error ? (
          <div style={{ color: 'var(--accent-error)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        ) : output ? (
          <div className="animate-fade-in" style={{ paddingLeft: '8px', borderLeft: '2px solid var(--go-light)' }}>
            {output}
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Waiting for execution...</span>
        )}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
