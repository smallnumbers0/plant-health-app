/**
 * Image Upload Component
 *
 * Allows users to upload plant images via:
 * - Camera capture (on mobile devices)
 * - File selection from device
 *
 * Includes preview and drag-and-drop support.
 */

import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useCreatePlant } from '../hooks/usePlants';
import { useAuth } from '../hooks/useAuth';
import './ImageUpload.css';

interface ImageUploadProps {
  onSuccess?: (plantId: string) => void;
}

export function ImageUpload({ onSuccess }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const createPlant = useCreatePlant();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    if (user?.id) {
      setProgress(0);
      createPlant.mutate(
        {
          userId: user.id,
          imageFile: file,
          onProgress: setProgress,
        },
        {
          onSuccess: (data) => {
            onSuccess?.((data as any).id);
            setPreview(null);
            setProgress(0);
          },
          onError: (error: any) => {
            alert(error.message || 'Upload failed');
            setProgress(0);
          },
        }
      );
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isUploading = createPlant.isPending;

  return (
    <div className="image-upload-container">
      {!preview && !isUploading ? (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />

          <div className="upload-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <h3>Upload Plant Image</h3>
          <p className="upload-hint">
            Click to browse or drag and drop
            <br />
            <span className="upload-hint-small">Supports JPG, PNG, WebP</span>
          </p>

          <div className="upload-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Choose File
            </button>
          </div>
        </div>
      ) : isUploading ? (
        <div className="upload-progress-container">
          <div className="upload-preview">
            {preview && <img src={preview} alt="Upload preview" />}
          </div>

          <div className="progress-content">
            <h3>Analyzing Plant...</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{Math.round(progress)}%</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
