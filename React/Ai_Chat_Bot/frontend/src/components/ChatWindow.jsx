import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatWindow.css';

function ChatWindow({ messages, currentConversation, isLoading, error, onSendMessage }) {
  return (
    <div className="chat-window">
      <header className="chat-header">
        <div className="header-info">
          <h2>{currentConversation ? currentConversation.title : 'New Conversation'}</h2>
        </div>
        {currentConversation && (
          <span className="header-meta">
            {messages.length} {messages.length === 1 ? 'exchange' : 'exchanges'}
          </span>
        )}
      </header>
      
      {error && (
        <div className="error-banner">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatWindow;
