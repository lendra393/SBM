
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onFileUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
        setFileName(file.name);
        onFileUpload(file);
      } else {
        alert("Please upload a valid Excel file (.xlsx, .xls)");
      }
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [onFileUpload]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <label 
        htmlFor="file-upload" 
        className={`flex justify-center w-full h-48 px-4 transition bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none ${isDragging ? 'border-primary-500' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <span className="flex flex-col items-center justify-center text-center space-y-2">
          <UploadIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {isLoading ? 'Menganalisis file...' : 
              fileName ? `File: ${fileName}` : 
              <>
                <span className="text-primary-600 dark:text-primary-400">Pilih file</span> atau tarik dan lepas
              </>
            }
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isLoading ? 'Harap tunggu, AI sedang bekerja...' : 'Hanya file .xlsx atau .xls'}
          </p>
        </span>
        <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="hidden" 
          accept=".xlsx, .xls"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={isLoading}
        />
      </label>
      {isLoading && (
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-4">
          <div className="bg-primary-600 h-2.5 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
