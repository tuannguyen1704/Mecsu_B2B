import React, { useCallback, useState } from 'react';
import { Image, Video, X, Upload, Film } from 'lucide-react';
import { cn } from '@utils';

interface ReviewMediaUploaderProps {
  media: Array<{ file: File; preview: string; type: 'image' | 'video' }>;
  onChange: (media: Array<{ file: File; preview: string; type: 'image' | 'video' }>) => void;
  maxFiles?: number;
  error?: string;
}

export function ReviewMediaUploader({
  media,
  onChange,
  maxFiles = 5,
  error,
}: ReviewMediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newMedia: Array<{ file: File; preview: string; type: 'image' | 'video' }> = [];

      Array.from(files).forEach((file) => {
        if (newMedia.length + media.length >= maxFiles) return;

        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newMedia.push({
              file,
              preview: e.target?.result as string,
              type: file.type.startsWith('image/') ? 'image' : 'video',
            });
            if (newMedia.length === files.length || newMedia.length + media.length >= maxFiles) {
              onChange([...media, ...newMedia]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [media, maxFiles, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    onChange(newMedia);
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200',
          isDragging
            ? 'border-[#ed6c2d] bg-[#ed6c2d]/5'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100',
          error && 'border-red-400 bg-red-50'
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Image size={24} className="text-[#ed6c2d]" />
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Video size={24} className="text-[#007185]" />
            </div>
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#0F1111]">
              Kéo thả ảnh hoặc video vào đây
            </p>
            <p className="text-[12px] text-[#565959] mt-1">
              hoặc{' '}
              <label className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">
                chọn từ máy tính
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-[11px] text-[#767676] mt-2">
              Tối đa {maxFiles} tệp. Hỗ trợ JPG, PNG, GIF, MP4
            </p>
          </div>
        </div>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {media.map((item, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
            >
              {item.type === 'image' ? (
                <img
                  src={item.preview}
                  alt={`Upload preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                  <Film size={32} className="text-slate-500" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <X size={14} className="text-slate-600 hover:text-red-500" />
              </button>
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                    <Video size={20} className="text-[#007185]" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[13px] text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
