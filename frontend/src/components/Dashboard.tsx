import React, { useMemo } from 'react';
import type { Chapter } from '../data/chapters';
import { Play, ArrowRight, Check, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  chapters: Chapter[];
  completedChapters: string[];
  progress: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  chapters,
  completedChapters,
  progress
}) => {
  const navigate = useNavigate();

  const nextChapterIndex = useMemo(() => {
    const idx = chapters.findIndex(c => !completedChapters.includes(c.id));
    return idx === -1 ? 0 : idx;
  }, [chapters, completedChapters]);

  const nextChapter = chapters[nextChapterIndex] || null;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        
        {/* HERO SECTION */}
        <div className="hero-section">
          <div className="hero-left">
            <div className="hero-tag">
              <div className="dot"></div>
              INTERACTIVE COURSE • {chapters.length} LESSONS
            </div>
            <h1 className="hero-title">用真實程式碼<br />學會 Go 語言</h1>
            <p className="hero-desc">
              在瀏覽器裡直接撰寫、執行、驗證 Go 程式。每一課都<br />
              是一個可動手的小任務，從 Hello World 一路到函式。
            </p>
            <div className="hero-actions">
              <button 
                className="btn-primary-cyan"
                onClick={() => navigate(`/lesson/${nextChapter?.id || chapters[0]?.id}`)}
              >
                <Play size={16} fill="currentColor" />
                開始學習
              </button>
            </div>
          </div>

          {nextChapter && (
            <div className="hero-right">
              <div className="up-next-card" onClick={() => navigate(`/lesson/${nextChapter.id}`)}>
                <div className="card-top-row">
                  <span className="up-next-label">從這裡開始</span>
                  <span className="chapter-index-label">{String(nextChapterIndex + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="card-main-title">{nextChapter.title}</h3>
                <p className="card-small-desc">
                  {nextChapter.description.replace(/[#*`\n]/g, ' ').substring(0, 45)}...
                </p>
                <div className="card-bottom-row">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                  <button className="btn-circle-arrow">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STATS SECTION */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>Progress</span>
              <div className="progress-ring"></div>
            </div>
            <div className="stat-value">{progress}%</div>
            <div className="stat-sub">{completedChapters.length} / {chapters.length} lessons</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>Completed</span>
              <Check size={16} color="var(--text-muted)" />
            </div>
            <div className="stat-value">{completedChapters.length}/{chapters.length}</div>
            <div className="stat-sub">lessons done</div>
          </div>
        </div>

        {/* LESSONS SECTION */}
        <div className="section-header">
          <div className="section-title-wrap">
            <BookOpen size={18} color="var(--accent-cyan)" />
            <h2>Lessons</h2>
          </div>
          <div className="section-count">
            {completedChapters.length}/{chapters.length} complete
          </div>
        </div>
        <div className="lessons-grid">
          {chapters.map((chapter, idx) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isNext = idx === nextChapterIndex;
            const statusClass = isCompleted ? 'completed' : isNext ? 'up-next' : 'locked';

            return (
              <div 
                key={chapter.id} 
                className={`lesson-box ${statusClass}`}
                onClick={() => navigate(`/lesson/${chapter.id}`)}
              >
                <div className="lesson-box-header">
                  <div className="lesson-num">{String(idx + 1).padStart(2, '0')}</div>
                  {isNext && <div className="badge-upnext">Up next</div>}
                  {!isNext && !isCompleted && <div className="badge-notstarted">Not started</div>}
                  {isCompleted && <div className="badge-completed">Completed</div>}
                </div>
                <h3 className="lesson-title">{chapter.title}</h3>
                <p className="lesson-desc">
                  {chapter.description.replace(/[#*`\n]/g, ' ').trim().substring(0, 40)}...
                </p>
                <div className="lesson-footer" style={{ justifyContent: 'flex-end' }}>
                  <div className="lesson-action">
                    {isCompleted ? 'Review' : isNext ? 'Resume' : 'Start'} <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER SECTION */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-left">
              <span className="footer-brand">Golang Interactive Course</span>
              <span className="footer-copyright">© 2026. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
