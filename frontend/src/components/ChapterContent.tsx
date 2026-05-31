import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Chapter } from '../data/chapters';

interface ChapterContentProps {
  chapter: Chapter;
}

export const ChapterContent: React.FC<ChapterContentProps> = ({ chapter }) => {
  return (
    <div className="animate-fade-in markdown-body">
      <ReactMarkdown 
        rehypePlugins={[rehypeRaw]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                customStyle={{ background: 'transparent', margin: 0, padding: 0 }}
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            )
          }
        }}
      >
        {chapter.description}
      </ReactMarkdown>
    </div>
  );
};
