import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { Chapter } from '../data/chapters';

interface ChapterContentProps {
  chapter: Chapter;
}

export const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  return (
    <div className="animate-fade-in markdown-body">
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {chapter.description}
      </ReactMarkdown>
    </div>
  );
};
