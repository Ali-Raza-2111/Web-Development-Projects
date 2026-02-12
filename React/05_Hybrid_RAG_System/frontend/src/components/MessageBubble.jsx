import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { cn } from '../utils/cn';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const sources = message.sources || [];

  return (
    <div
      className={cn(
        'flex w-full mt-2 space-x-3 max-w-3xl',
        isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <Bot size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
      )}

      <div
        className={cn(
          'relative px-4 py-2 text-sm rounded-lg shadow-sm max-w-[80%] transition-colors prose prose-sm max-w-none break-words',
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none prose-invert'
            : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-blue-50 rounded-tl-none dark:prose-invert'
        )}
      >
        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>

        {!isUser && sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-600">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sources:</p>
            <div className="flex flex-wrap gap-1">
              {sources.map((src, i) => (
                <span
                  key={i}
                  className="inline-flex items-center text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
          <User size={18} className="text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
