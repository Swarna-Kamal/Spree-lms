import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from './Button';

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  maxSizeBytes?: number;
  allowedExtensions?: string[];
  label?: string;
  helperText?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  selectedFile,
  maxSizeBytes = 1024 * 1024, // 1 MB
  allowedExtensions = ['.pdf', '.doc', '.docx'],
  label = 'Upload document',
  helperText = 'Supported formats: PDF, DOC, DOCX (Max: 1 MB)',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage('');

    // Check size
    if (file.size > maxSizeBytes) {
      setErrorMessage(
        `File exceeds maximum allowed size of 1 MB (Current: ${formatFileSize(file.size)})`
      );
      onFileSelect(null);
      return;
    }

    // Check extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setErrorMessage(
        `Invalid file format "${extension}". Only ${allowedExtensions.join(', ')} are supported.`
      );
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    onFileSelect(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-primary bg-blue-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-primary/60 hover:bg-slate-50/80 bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-3 shadow-sm">
              <UploadCloud className="w-6 h-6 stroke-[1.75]" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Drag & drop your file here, or{' '}
              <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">{helperText}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-blue-50/40 border border-blue-200/80 rounded-2xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{selectedFile.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-medium">
                  {formatFileSize(selectedFile.size)}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <CheckCircle2 className="w-3 h-3" /> Ready to upload
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs"
            >
              Change
            </Button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-2.5 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
