import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ onImageSelected, hasImage, imagePreview, onCameraOpen }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  }, [onImageSelected]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload-input"
      />

      <AnimatePresence mode="wait">
        {!hasImage ? (
          /* Dropzone */
          <motion.div
            key="dropzone"
            className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
            onClick={openFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            id="image-dropzone"
          >
            <div className="dropzone__icon">📤</div>
            <div className="dropzone__title">Drop your dog's photo here</div>
            <div className="dropzone__subtitle">
              or click to browse — PNG, JPG, WEBP supported
            </div>
          </motion.div>
        ) : (
          /* Image Preview */
          <motion.div
            key="preview"
            className="image-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={imagePreview}
              alt="Selected dog"
              className="image-preview__img"
            />
            <button
              className="image-preview__change"
              onClick={openFilePicker}
              id="change-image-btn"
            >
              ✕ Change Image
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn" onClick={openFilePicker} id="upload-image-btn">
          <span className="btn__icon">📤</span>
          Upload Image
        </button>
        <button className="btn" onClick={onCameraOpen} id="capture-image-btn">
          <span className="btn__icon">📷</span>
          Capture Image
        </button>
      </div>
    </div>
  );
}
