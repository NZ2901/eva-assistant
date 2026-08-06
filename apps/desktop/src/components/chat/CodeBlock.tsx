import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({
  language,
  code,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div
      className="
        my-6
        overflow-hidden
        rounded-2xl
        border
        border-[#23304F]
        bg-[#0D1117]
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#23304F]
          bg-[#131B2A]
          px-5
          py-3
        "
      >
        <span
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.25em]
            text-blue-300
          "
        >
          {language || 'TEXT'}
        </span>

        <button
          onClick={copyCode}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-sm
            text-slate-400
            transition-all

            hover:bg-blue-500/10
            hover:text-white
          "
        >
          {copied ? (
            <>
              <Check size={16} />
              Copiado
            </>
          ) : (
            <>
              <Copy size={16} />
              Copiar
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: '#0D1117',
          padding: '24px',
          fontSize: '14px',
          borderRadius: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}