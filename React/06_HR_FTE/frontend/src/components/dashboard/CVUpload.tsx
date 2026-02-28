import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";

interface CVUploadProps {
  onCVUploaded: (file: File) => void;
  isProcessing: boolean;
}

export function CVUpload({ onCVUploaded, isProcessing }: CVUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const validExtensions = [".pdf", ".doc", ".docx"];
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (!validTypes.includes(file.type) || !validExtensions.includes(ext)) {
        alert("Only CV files are accepted (PDF, DOC, DOCX). Other documents are not supported.");
        return;
      }
      setUploadedFile(file);
      onCVUploaded(file);
    },
    [onCVUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    setUploadedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Upload Your CV</h2>
          <p className="text-xs text-muted-foreground">
            Drop your CV to start the AI analysis pipeline
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/40 hover:bg-secondary/30"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleInputChange}
              className="hidden"
            />
            <Upload
              className={`h-8 w-8 mx-auto mb-3 transition-colors ${
                dragOver ? "text-primary" : "text-muted-foreground/50"
              }`}
            />
            <p className="text-sm font-medium text-foreground mb-1">
              {dragOver ? "Drop your CV here" : "Drag & drop your CV"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse • PDF, DOC, DOCX
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-lg p-4 border transition-all ${
              isProcessing
                ? "bg-primary/5 border-primary/20"
                : "bg-success/5 border-success/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  isProcessing ? "bg-primary/10" : "bg-success/10"
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isProcessing
                    ? "Agents analyzing your CV..."
                    : "Analysis complete — pipeline finished"}
                </p>
              </div>
              {!isProcessing && (
                <button
                  onClick={handleClear}
                  className="h-7 w-7 rounded-md bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
