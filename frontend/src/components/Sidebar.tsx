import { Check } from 'lucide-react';
import type { Chapter } from '../data/chapters';

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  completedChapters: string[];
  progress: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ chapters, currentChapterId, onSelectChapter, completedChapters, progress }) => {
  return (
    <div className="sidebar" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Course Header */}
      <div style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>COURSE</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Go 語言入門
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'var(--bg-primary)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>

      {/* Chapter List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <ul style={{ listStyle: 'none' }}>
          {chapters.map((chapter, index) => {
            const isActive = chapter.id === currentChapterId;
            const isCompleted = completedChapters.includes(chapter.id);
            const chapterNum = (index + 1).toString().padStart(2, '0');
            
            // Extract subtitle from the chapter title if possible (e.g. "01 - 入門與 Hello World" -> Subtitle: "HELLO WORLD")
            let title = chapter.title;
            let subtitle = "LESSON";
            const parts = title.split(' - ');
            if (parts.length > 1) {
              title = parts[1];
              // Try to find English words in parentheses for the subtitle
              const englishMatch = title.match(/\\(([A-Za-z\\s]+)\\)/);
              if (englishMatch) {
                subtitle = englishMatch[1].toUpperCase();
                title = title.replace(/\\s*\\([A-Za-z\\s]+\\)/, '');
              } else if (title.includes('Hello World')) {
                subtitle = 'HELLO, GO';
              }
            } else {
              // Handle older format like "18. 方法 (Methods)"
              const dotParts = title.split('. ');
              if (dotParts.length > 1) {
                title = dotParts[1];
                const englishMatch = title.match(/\\(([A-Za-z\\s]+)\\)/);
                if (englishMatch) {
                  subtitle = englishMatch[1].toUpperCase();
                  title = title.replace(/\\s*\\([A-Za-z\\s]+\\)/, '');
                }
              }
            }

            return (
              <li key={chapter.id} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => onSelectChapter(chapter.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px',
                    background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  {/* Number Box */}
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '6px', 
                    background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-primary)',
                    border: isCompleted ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 600,
                    color: isCompleted ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    {isCompleted && isActive ? <Check size={16} strokeWidth={3} /> : chapterNum}
                  </div>
                  
                  {/* Text Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {title}
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px', marginTop: '2px' }}>
                      {subtitle}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
