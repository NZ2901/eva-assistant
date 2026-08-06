import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from './CodeBlock';

interface MarkdownMessageProps {
  content: string;
  isStreaming?: boolean;
}

export function MarkdownMessage({
  content,
  isStreaming = false,
}: MarkdownMessageProps) {
  return (
    <div
      className={
        isStreaming
          ? 'streaming-message'
          : ''
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({
            className,
            children,
          }) {
            const match = /language-(\w+)/.exec(
              className || '',
            );

            if (match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, '')}
                />
              );
            }

            return (
              <code
                className="
                  rounded-md
                  bg-[#1B2233]
                  px-1.5
                  py-1
                  text-blue-300
                "
              >
                {children}
              </code>
            );
          },

          h1: ({ children }) => (
            <h1 className="mb-4 text-3xl font-bold">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-2xl font-semibold">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-xl font-semibold">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="leading-8 text-white/90">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6">
              {children}
            </ol>
          ),

          blockquote: ({ children }) => (
            <blockquote
              className="
                my-4
                border-l-4
                border-blue-500
                pl-4
                italic
                text-slate-400
              "
            >
              {children}
            </blockquote>
          ),

          table: ({ children }) => (
            <table
              className="
                my-4
                w-full
                border-collapse
              "
            >
              {children}
            </table>
          ),

          th: ({ children }) => (
            <th
              className="
                border
                border-slate-700
                bg-slate-800
                p-3
                text-left
              "
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td
              className="
                border
                border-slate-700
                p-3
              "
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}