import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  AlertCircle, 
  CheckCircle,
  CloudUpload,
  Trash2
} from 'lucide-react';
import AppLayout from '../../Components/Layout/AppLayout';
import { useUpload } from '../../context/uploadContext';
import { formatFileSize } from '../../utils/formatters';
import LoadingSpinner from '../../Components/common/LoadingSpinner/LoadingSpinner';
import './Upload.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  
  const {
    files,
    uploadProgress,
    uploadStatus,
    error,
    maxFiles,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    startAnalysis,
  } = useUpload();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const result = addFiles(droppedFiles);
    
    if (!result.success) {
      setUploadErrors(result.errors || []);
    } else {
      setUploadErrors([]);
    }
  }, [addFiles]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    const result = addFiles(selectedFiles);
    
    if (!result.success) {
      setUploadErrors(result.errors || []);
    } else {
      setUploadErrors([]);
    }
    
    // Reset input
    e.target.value = '';
  }, [addFiles]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (fileName) => {
    removeFile(fileName);
    setUploadErrors([]);
  };

  const handleSubmit = async () => {
    const uploadResult = await uploadFiles();
    
    if (uploadResult.success) {
      const analysisResult = await startAnalysis(uploadResult.uploadIds);
      
      if (analysisResult.success) {
        navigate('/processing', { 
          state: { analysisId: analysisResult.analysis.id } 
        });
      }
    }
  };

  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'processing';

  return (
    <AppLayout title="New Analysis">
      <div className="upload-page">
        <div className="upload-container">
          {/* Header */}
          <div className="upload-header animate-fade-in">
            <h1 className="upload-title">Upload Bank Statements</h1>
            <p className="upload-subtitle">
              Upload up to {maxFiles} PDF bank statements to analyze your tax health
            </p>
          </div>

          {/* Drop Zone */}
          <div 
            className={`drop-zone glass-card animate-fade-in-up ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={files.length === 0 ? handleUploadClick : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileSelect}
              className="file-input"
              disabled={isUploading}
            />
            
            {files.length === 0 ? (
              <div className="drop-zone-empty">
                <div className="drop-icon">
                  <CloudUpload size={48} />
                </div>
                <h3 className="drop-title">
                  {isDragging ? 'Drop your files here' : 'Drag & Drop your PDF files'}
                </h3>
                <p className="drop-subtitle">or click to browse</p>
                <div className="drop-info">
                  <span>PDF only</span>
                  <span>•</span>
                  <span>Max 10MB each</span>
                  <span>•</span>
                  <span>Up to {maxFiles} files</span>
                </div>
              </div>
            ) : (
              <div className="files-container">
                <div className="files-header">
                  <span className="files-count">{files.length} of {maxFiles} files</span>
                  {!isUploading && (
                    <button 
                      className="add-more-btn btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadClick();
                      }}
                      disabled={files.length >= maxFiles}
                    >
                      <UploadIcon size={16} />
                      Add More
                    </button>
                  )}
                </div>
                
                <div className="files-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-icon">
                        <FileText size={24} />
                      </div>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                      {!isUploading && (
                        <button 
                          className="file-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.name);
                          }}
                        >
                          <X size={18} />
                        </button>
                      )}
                      {isUploading && (
                        <CheckCircle size={18} className="text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Errors */}
          {(uploadErrors.length > 0 || error) && (
            <div className="upload-errors animate-fade-in">
              {uploadErrors.map((err, index) => (
                <div key={index} className="error-item">
                  <AlertCircle size={16} />
                  <span>{err}</span>
                </div>
              ))}
              {error && (
                <div className="error-item">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className="upload-progress animate-fade-in">
              <div className="progress-header">
                <span>{uploadStatus === 'uploading' ? 'Uploading files...' : 'Processing...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="upload-actions animate-fade-in-up delay-100">
            {files.length > 0 && !isUploading && (
              <button 
                className="btn btn-ghost"
                onClick={clearFiles}
              >
                <Trash2 size={18} />
                Clear All
              </button>
            )}
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  Analyze Statements
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="upload-info animate-fade-in-up delay-200">
            <div className="info-card glass-card">
              <div className="info-icon">
                <CheckCircle size={20} />
              </div>
              <div className="info-content">
                <h4>Supported Banks</h4>
                <p>Access, GTB, Zenith, First Bank, UBA, Sterling, Stanbic, Fidelity, and more</p>
              </div>
            </div>
            <div className="info-card glass-card">
              <div className="info-icon">
                <FileText size={20} />
              </div>
              <div className="info-content">
                <h4>Multiple Accounts</h4>
                <p>Upload statements from different banks for a complete financial picture</p>
              </div>
            </div>
            <div className="info-card glass-card">
              <div className="info-icon secure">
                <AlertCircle size={20} />
              </div>
              <div className="info-content">
                <h4>Secure & Private</h4>
                <p>Files are encrypted and automatically deleted within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
