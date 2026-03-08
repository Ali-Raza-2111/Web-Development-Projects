import { useNavigate } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import './FloatingChat.css';

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="floating-chat-container">
            {isOpen && (
                <div className="chat-window glass-card animate-fade-in-up">
                    <div className="chat-header">
                        <h4>Assistant</h4>
                        <button onClick={() => setIsOpen(false)} className="close-btn"><X size={16} /></button>
                    </div>
                    <div className="chat-body">
                        <div className="chat-message bot">
                            Hello! Need help crafting your description?
                        </div>
                    </div>
                    <div className="chat-input">
                         <input type="text" placeholder="Type a message..." className="form-input" disabled />
                    </div>
                </div>
            )}
            <button className="chat-toggle-btn btn-primary" onClick={() => setIsOpen(!isOpen)}>
                <MessageSquare size={24} />
            </button>
        </div>
    );
};

export default FloatingChat;
