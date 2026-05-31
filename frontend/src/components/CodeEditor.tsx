import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  theme?: string;
  fontSize?: number;
  beforeMount?: (monaco: any) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange,
  theme = 'vs-dark',
  fontSize = 15,
  beforeMount
}) => {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <Editor
        height="100%"
        defaultLanguage="go"
        theme={theme}
        value={code}
        onChange={onChange}
        beforeMount={beforeMount}
        options={{
          minimap: { enabled: false },
          fontSize: fontSize,
          lineHeight: 24,
          padding: { top: 24, bottom: 24 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        }}
      />
    </div>
  );
};
