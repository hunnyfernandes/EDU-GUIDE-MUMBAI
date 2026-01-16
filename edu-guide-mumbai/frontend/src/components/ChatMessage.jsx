import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  UserIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon,
  ArrowPathIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/outline';

const ChatMessage = ({ 
  message, 
  isLoading = false,
  onRegenerate,
  onEdit,
  messageIndex,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(message.liked || false);
  const [disliked, setDisliked] = useState(message.disliked || false);

  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const handleCopy = async () => {
    if (message.content) {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  // Custom renderer for markdown components
  const markdownComponents = {
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && match ? (
        <div className="my-2 rounded-lg overflow-hidden">
          <div className="bg-neutral-800 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">{language}</span>
            <button
              onClick={() => navigator.clipboard.writeText(String(children))}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Copy
            </button>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={language || 'text'}
            PreTag="div"
            className="!m-0 !rounded-b-lg"
            customStyle={{ margin: 0, borderRadius: '0 0 8px 8px' }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    // Links - convert internal links to React Router Links
    a({ node, href, children, ...props }) {
      if (href && (href.startsWith('/') || href.startsWith('#'))) {
        return (
          <Link
            to={href}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium"
            {...props}
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline font-medium"
          {...props}
        >
          {children}
        </a>
      );
    },
    // Headings
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
    // Lists
    ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-2 space-y-1" {...props} />,
    li: ({ node, ...props }) => <li className="ml-4" {...props} />,
    // Paragraph
    p: ({ node, ...props }) => <p className="my-2" {...props} />,
    // Blockquote
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 my-2 italic text-neutral-600 dark:text-neutral-400" {...props} />
    ),
    // Strong/Bold
    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
    // Emphasis/Italic
    em: ({ node, ...props }) => <em className="italic" {...props} />,
  };

  return (
    <div
      className={`group relative flex gap-4 mb-6 transition-opacity duration-200 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
      style={{
        animation: 'fadeIn 0.3s ease-in',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
          }`}
        >
          {isUser ? (
            <UserIcon className="w-5 h-5" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Message Header with Actions */}
        {hovered && !isLoading && (
          <div className={`flex gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            {!isUser && onRegenerate && (
              <button
                onClick={() => onRegenerate(messageIndex)}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Regenerate response"
              >
                <ArrowPathIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            )}
            {isUser && onEdit && (
              <button
                onClick={() => onEdit(message.content, messageIndex)}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Edit message"
              >
                <PencilIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            )}
            {message.content && (
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-success" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
            isUser
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          {isLoading && !message.content ? (
            <div className="flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></span>
              <span
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></span>
            </div>
          ) : message.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>

        {/* Timestamp and Feedback */}
        {!isLoading && (
          <div className={`flex items-center gap-3 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {timestamp}
            </span>
            {!isUser && message.content && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleLike}
                  className={`p-1 rounded transition-colors ${
                    liked
                      ? 'text-success bg-success/10'
                      : 'text-neutral-500 hover:text-success hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  title="Helpful"
                >
                  <HandThumbUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDislike}
                  className={`p-1 rounded transition-colors ${
                    disliked
                      ? 'text-error bg-error/10'
                      : 'text-neutral-500 hover:text-error hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  title="Not helpful"
                >
                  <HandThumbDownIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Suggested Pages / Quick Actions */}
        {message.suggestedPages && message.suggestedPages.length > 0 && !isLoading && !isUser && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestedPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                className="text-xs px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors border border-primary-200 dark:border-primary-800"
              >
                {page.label} →
              </Link>
            ))}
          </div>
        )}

        {/* Suggested Follow-up Questions */}
        {message.suggestions && message.suggestions.length > 0 && !isLoading && !isUser && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">💡 Suggested follow-up:</p>
            <div className="flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="text-xs px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 hover:scale-105 transition-all cursor-pointer border border-neutral-200 dark:border-neutral-600"
                  onClick={(e) => {
                    e.preventDefault();
                    // This will be handled by parent component
                    if (window.chatbotSuggestClick) {
                      window.chatbotSuggestClick(suggestion);
                    }
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
