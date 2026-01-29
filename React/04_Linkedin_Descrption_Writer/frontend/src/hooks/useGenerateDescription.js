import { useState } from 'react';
import { generateDescription, refineDescription } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const useGenerateDescription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [streamingText, setStreamingText] = useState('');
    const navigate = useNavigate();

    const generate = async (formData) => {
        setLoading(true);
        setError(null);
        setStreamingText('');
        
        try {
            const response = await fetch('http://localhost:8000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate description');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                fullText += chunk;
                setStreamingText(prev => prev + chunk);
            }

            // Navigate after stream completes
            navigate('/result', { state: { result: fullText, originalParams: formData } });

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to generate description');
        } finally {
            setLoading(false);
            setStreamingText('');
        }
    };

    const refine = async (originalParams, currentText, instruction) => {
         setLoading(true);
         setError(null);
         try {
             const result = await refineDescription({
                 original_description: originalParams.description,
                 current_text: currentText,
                 instruction: instruction
             });
             return result.refined_text;
         } catch (err) {
             setError(err.response?.data?.detail || 'Failed to refine description');
             return null;
         } finally {
             setLoading(false);
         }
    };

    return { generate, refine, loading, error, streamingText };
};
