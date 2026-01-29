import { useState } from 'react';
import { useGenerateDescription } from '../../hooks/useGenerateDescription';
import { Loader2, Wand2, Briefcase, User, AlignLeft, Check, Sparkles } from 'lucide-react';
import './Generator.css';
import './GeneratorOverlay.css'; // Add the new styles

const Generator = () => {
    const { generate, loading, error, streamingText } = useGenerateDescription();
    const [formData, setFormData] = useState({
        description: '',
        tone: 'Professional',
        audience: 'Recruiters',
        length: 'Medium',
        include_keywords: false,
        achievement_focused: false
    });

    const tones = ['Professional', 'Casual', 'Confident', 'Persuasive', 'Friendly'];

    const handleSubmit = (e) => {
        e.preventDefault();
        generate(formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="generator-container animate-fade-in-up">
            {loading ? (
                <div className="generating-overlay glass-card">
                    <div className="generating-content">
                        <div className="ai-icon-wrapper">
                            <Sparkles size={48} className="ai-pulse-icon" />
                        </div>
                        <h3>Crafting your story...</h3>
                        <div className="streaming-container">
                            <p className="streaming-text">
                                {streamingText}
                                <span className="cursor-blink">|</span>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card generator-card">
                    <div className="generator-header">
                        <h2><Wand2 className="inline-icon" /> Generate Description</h2>
                        <p>Describe your experience and let AI handle the rest.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <AlignLeft size={16} className="inline-icon-sm" /> Describe your project / role
                        </label>
                        <textarea 
                            name="description"
                            required
                            className="form-input form-textarea"
                            placeholder="e.g. Led a team of 5 developers to build a fintech app using React and Python..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label"><Sparkles size={16} className="inline-icon-sm" /> Tone</label>
                        <div className="tone-selector">
                            {tones.map((tone) => (
                                <button
                                    key={tone}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, tone }))}
                                    className={`tone-btn ${formData.tone === tone ? 'active' : ''}`}
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label className="form-label"><User size={16} className="inline-icon-sm" /> Audience</label>
                            <div className="select-wrapper">
                                <select 
                                    name="audience" 
                                    className="form-input form-select"
                                    value={formData.audience}
                                    onChange={handleChange}
                                >
                                    <option value="Recruiters">Recruiters</option>
                                    <option value="Founders">Founders</option>
                                    <option value="Clients">Clients</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group half">
                            <label className="form-label"><Briefcase size={16} className="inline-icon-sm" /> Length</label>
                            <div className="select-wrapper">
                                <select 
                                    name="length" 
                                    className="form-input form-select"
                                    value={formData.length}
                                    onChange={handleChange}
                                >
                                    <option value="Short">Short</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Long">Long</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="options-row">
                        <label className="checkbox-label">
                            <input 
                                type="checkbox" 
                                name="include_keywords"
                                checked={formData.include_keywords}
                                onChange={handleChange}
                            />
                            <span className="checkbox-custom"><Check size={12} /></span>
                            <span>Add optimized keywords</span>
                        </label>
                        <label className="checkbox-label">
                            <input 
                                type="checkbox" 
                                name="achievement_focused"
                                checked={formData.achievement_focused}
                                onChange={handleChange}
                            />
                            <span className="checkbox-custom"><Check size={12} /></span>
                            <span>Make it achievement-focused</span>
                        </label>
                    </div>

                    {error && <div className="error-message-inline">{error}</div>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary btn-block"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Generate Description'}
                    </button>
                </form>
            </div>
            )}
        </div>
    );
};

export default Generator;
