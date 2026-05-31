import type { Chapter } from '../data/chapters';

interface SidebarProps {
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chapters, currentChapterId, onSelectChapter }) => {
  return (
    <div className="sidebar glass-panel" style={{ borderLeft: 'none', borderTop: 'none', borderBottom: 'none', borderRadius: 0 }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Golang Tutorials
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
          Interactive Course
        </p>
      </div>
      <ul style={{ listStyle: 'none', padding: '16px' }}>
        {chapters.map((chapter) => {
          const isActive = chapter.id === currentChapterId;
          return (
            <li key={chapter.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => onSelectChapter(chapter.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(0, 173, 216, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 173, 216, 0.3)' : '1px solid transparent',
                  borderRadius: '8px',
                  color: isActive ? 'var(--go-light)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {chapter.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
