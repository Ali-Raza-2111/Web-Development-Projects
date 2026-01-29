import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGenerateDescription } from '../../hooks/useGenerateDescription';
import { Copy, RefreshCw, ArrowLeft, Send, Check } from 'lucide-react';
import './Generator.css';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Redirect if no state
    if (!location.state?.result) {
        navigate('/generate');
        return null;
    }

    const { result, originalParams } = location.state;
    const [text, setText] = useState(result);
    const [instruction, setInstruction] = useState('');
    const { refine, loading } = useGenerateDescription();
    const [copySuccess, setCopySuccess] = useState(false);

    const handleRefine = async () => {
        if (!instruction) return;
        const refinedText = await refine(originalParams, text, instruction);
        if (refinedText) {
            setText(refinedText);
            setInstruction('');
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="generator-container animate-fade-in">
             <button onClick={() => navigate('/generate')} className="btn-back">
                <ArrowLeft size={16} /> Back to Generator
            </button>

            <div className="result-layout">
                <div className="glass-card result-main">
                    <div className="result-header">
                        <h2>Generated Content</h2>
                        <span className="char-count">{text.length} characters</span>
                    </div>
                    
                    <div className="editor-wrapper">
                        <textarea 
                            className="result-textarea"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    <div className="result-actions">
                        <button onClick={copyToClipboard} className="btn btn-primary">
                            {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                            {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <button onClick={() => navigate('/generate')} className="btn btn-outline">
                            <RefreshCw size={18} /> Start Over
                        </button>
                    </div>
                </div>

                <div className="glass-card refine-panel">
                    <h3>Refine Result</h3>
                    <p className="refine-desc">Not quite right? specific instructions to improve the text.</p>
                    
                    <div className="refine-input-group">
                        <textarea 
                            className="form-input refine-textarea"
                            placeholder="e.g. Make it more formal, remove emojis..."
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                        />
                        <button 
                            onClick={handleRefine}
                            disabled={!instruction || loading}
                            className="btn btn-secondary w-full"
                        >
                            {loading ? 'Refining...' : <>Refine <Send size={16} /></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
