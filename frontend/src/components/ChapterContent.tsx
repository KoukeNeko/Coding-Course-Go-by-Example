import ReactMarkdown from 'react-markdown';
import type { Chapter } from '../data/chapters';

interface ChapterContentProps {
  chapter: Chapter;
}

export const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  return (
    <div className="animate-fade-in markdown-body">
      <ReactMarkdown>{chapter.description}</ReactMarkdown>
    </div>
  );
};
