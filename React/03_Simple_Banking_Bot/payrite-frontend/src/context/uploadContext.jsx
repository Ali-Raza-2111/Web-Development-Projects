import { createContext, useContext, useState, useCallback } from 'react';
import { uploadAPI, analysisAPI } from '../services/api';

const UploadContext = createContext(null);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

export const UploadProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [uploadedIds, setUploadedIds] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const addFiles = useCallback((newFiles) => {
    const validFiles = [];
    const errors = [];

    newFiles.forEach((file) => {
      // Check file type
      if (file.type !== 'application/pdf') {
        errors.push(`${file.name}: Only PDF files are allowed`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 10MB limit`);
        return;
      }

      // Check if file already exists
      if (files.some((f) => f.name === file.name)) {
        errors.push(`${file.name}: File already added`);
        return;
      }

      validFiles.push(file);
    });

    // Check max files limit
    const totalFiles = files.length + validFiles.length;
    if (totalFiles > MAX_FILES) {
      errors.push(`Maximum ${MAX_FILES} files allowed. Remove some files first.`);
      return { success: false, errors };
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true };
  }, [files]);

  const removeFile = useCallback((fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setUploadProgress(0);
    setUploadStatus('idle');
    setUploadedIds([]);
    setError(null);
  }, []);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) {
      setError('No files to upload');
      return { success: false, error: 'No files to upload' };
    }

    setUploadStatus('uploading');
    setError(null);
    setUploadProgress(0);

    try {
      const response = await uploadAPI.uploadFiles(files, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedIds(response.data.upload_ids);
      setUploadStatus('completed');
      
      return { success: true, uploadIds: response.data.upload_ids };
    } catch (error) {
      const message = error.response?.data?.detail || 'Upload failed. Please try again.';
      setError(message);
      setUploadStatus('error');
      return { success: false, error: message };
    }
  }, [files]);

  const startAnalysis = useCallback(async (uploadIds = null) => {
    const idsToAnalyze = uploadIds || uploadedIds;
    
    if (idsToAnalyze.length === 0) {
      setError('No uploads to analyze');
      return { success: false, error: 'No uploads to analyze' };
    }

    setUploadStatus('processing');
    setError(null);

    try {
      const response = await analysisAPI.startAnalysis(idsToAnalyze);
      setCurrentAnalysis(response.data);
      setUploadStatus('completed');
      
      return { success: true, analysis: response.data };
    } catch (error) {
      const message = error.response?.data?.detail || 'Analysis failed. Please try again.';
      setError(message);
      setUploadStatus('error');
      return { success: false, error: message };
    }
  }, [uploadedIds]);

  const pollAnalysisStatus = useCallback(async (analysisId) => {
    try {
      const response = await analysisAPI.getAnalysis(analysisId);
      setCurrentAnalysis(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to poll analysis status:', error);
      return null;
    }
  }, []);

  const value = {
    files,
    uploadProgress,
    uploadStatus,
    uploadedIds,
    currentAnalysis,
    error,
    maxFiles: MAX_FILES,
    maxFileSize: MAX_FILE_SIZE,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    startAnalysis,
    pollAnalysisStatus,
    setCurrentAnalysis,
  };

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
};

export default UploadContext;
