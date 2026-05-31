import React, { useState, useEffect } from 'react';
import { setCookie } from '../utils/cookies';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  currentFontSize: number;
  onThemeChange: (theme: string) => void;
  onFontSizeChange: (size: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentFontSize,
  onThemeChange,
  onFontSizeChange,
}) => {
  const [theme, setTheme] = useState(currentTheme);
  const [fontSize, setFontSize] = useState(currentFontSize);

  // Sync state if props change when opened
  useEffect(() => {
    if (isOpen) {
      setTheme(currentTheme);
      setFontSize(currentFontSize);
    }
  }, [isOpen, currentTheme, currentFontSize]);

  if (!isOpen) return null;

  const handleSave = () => {
    setCookie('editor-theme', theme);
    setCookie('editor-font-size', fontSize.toString());
    onThemeChange(theme);
    onFontSizeChange(fontSize);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="settings-group">
            <label htmlFor="theme-select">Editor Theme</label>
            <select 
              id="theme-select" 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="settings-select"
            >
              <option value="github-light-default">GitHub Light Default</option>
              <option value="github-light-high-contrast">GitHub Light High Contrast ✨ new ✨</option>
              <option value="github-light-colorblind">GitHub Light Colorblind ✨ new ✨</option>
              <option value="github-dark-default">GitHub Dark Default</option>
              <option value="github-dark-high-contrast">GitHub Dark High Contrast</option>
              <option value="github-dark-colorblind">GitHub Dark Colorblind ✨ new ✨</option>
              <option value="github-dark-dimmed">GitHub Dark Dimmed</option>
              <option value="vs-dark">VS Dark</option>
              <option value="vs">VS Light</option>
            </select>
          </div>

          <div className="settings-group">
            <label htmlFor="fontsize-select">Editor Font Size</label>
            <select 
              id="fontsize-select" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="settings-select"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
            </select>
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Note:</strong> "GitHub Dark" and "GitHub Light" themes are derived from <a href="https://github.com/primer/github-vscode-theme" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>primer/github-vscode-theme</a> (MIT License) and adapted for Monaco by <a href="https://github.com/brijeshb42/monaco-themes" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>brijeshb42/monaco-themes</a>.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};
