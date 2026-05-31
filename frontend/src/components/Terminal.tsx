import { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div ref={terminalRef} style={{ overflowY: 'auto', flex: 1, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
        {isExecuting ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }} className="animate-fade-in">
            <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ opacity: 0.7 }}>$ go run main.go</span>
          </div>
        ) : (output || error) ? (
          <div className="animate-fade-in">
            <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>$ go run main.go</div>
            {output && (
              <div style={{ color: 'var(--text-primary)', marginBottom: error ? '16px' : '0' }}>
                {output}
              </div>
            )}
            {error && (
              <div style={{ color: 'var(--accent-error)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>$ waiting for execution...</div>
        )}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
