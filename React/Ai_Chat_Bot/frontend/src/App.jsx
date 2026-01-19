import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    error,
    sendMessage,
    loadConversation,
    startNewConversation,
    deleteConversation,
  } = useChat();

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={loadConversation}
        onNewConversation={startNewConversation}
        onDeleteConversation={deleteConversation}
      />
      <ChatWindow
        messages={messages}
        currentConversation={currentConversation}
        isLoading={isLoading}
        error={error}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

export default App;
