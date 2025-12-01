import React, { useState } from 'react';
import axios from 'axios';
import Button from './common/Button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface CSVUploaderProps {
  onUploadSuccess: () => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setUploading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/trades/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSuccessMessage(response.data.message || 'Upload successful!');
      onUploadSuccess(); // Callback to refresh the parent component's data
    } catch (err: any) {
      setError(err.response?.data?.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Import from CSV</h2>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 dark:text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-primary-50 file:text-primary-700
                     dark:file:bg-primary-700 dark:file:text-primary-100
                     hover:file:bg-primary-100 dark:hover:file:bg-primary-600"
        />
        <Button onClick={handleUpload} disabled={uploading || !selectedFile} variant="secondary">
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {successMessage && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{successMessage}</p>}
    </div>
  );
};

export default CSVUploader;
