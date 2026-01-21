import React from 'react';
import Layout from './components/layout/Layout';
import ChatArea from './components/chat/ChatArea';
import DocumentUploader from './components/documents/DocumentUploader';
import Settings from './components/settings/Settings';

const App = () => {
  return (
    <Layout>
      {(activeTab) => (
        <>
          {activeTab === 'chat' && <ChatArea />}
          {activeTab === 'documents' && <DocumentUploader />}
          {activeTab === 'settings' && <Settings />}
        </>
      )}
    </Layout>
  );
};

export default App;
