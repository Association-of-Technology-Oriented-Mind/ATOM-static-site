import React, { useState, useCallback, useRef } from 'react';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ThreeDIconPresets } from '@/components/ThreeDIcons';

interface ImageUploadProps {
  onImagesUploaded: (images: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  existingImages?: string[];
  onRemoveExisting?: (index: number) => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxFiles = 10,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  existingImages = [],
  onRemoveExisting
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Max size: ${maxSizeMB}MB`;
    }
    return null;
  };

  // Uploads to Firebase Storage and returns the public download URL.
  // Previously this read files as base64 data URLs into localStorage, which
  // exceeded the ~5MB quota on roughly one photo and threw QuotaExceededError.
  const processFile = async (file: File, onProgress: (pct: number) => void): Promise<string> => {
    if (!storage) throw new Error('Image storage is not configured.');

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectRef = storageRef(storage, `gallery/${Date.now()}-${safeName}`);
    const task = uploadBytesResumable(objectRef, file, { contentType: file.type });

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        snapshot => onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
        reject,
        () => {
          getDownloadURL(task.snapshot.ref).then(resolve).catch(reject);
        },
      );
    });
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => !validateFile(file));

    if (validFiles.length === 0) {
      toast.error('No valid files selected');
      return;
    }

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);

    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Process files
    const processedImages: string[] = [];

    for (let i = 0; i < newUploadedFiles.length; i++) {
      const uploadedFile = newUploadedFiles[i];
      try {
        const processedImage = await processFile(uploadedFile.file, progress => {
          setUploadedFiles(prev =>
            prev.map(f => (f.file === uploadedFile.file ? { ...f, progress } : f))
          );
        });
        processedImages.push(processedImage);

        setUploadedFiles(prev =>
          prev.map(f =>
            f.file === uploadedFile.file
              ? { ...f, status: 'success' as const, progress: 100 }
              : f
          )
        );
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.file === uploadedFile.file
              ? {
                  ...f,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : f
          )
        );
      }
    }

    setIsUploading(false);
    if (processedImages.length > 0) {
      onImagesUploaded(processedImages);
      toast.success(`Successfully uploaded ${processedImages.length} image(s)`);
    }
  }, [uploadedFiles, maxFiles, onImagesUploaded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      URL.revokeObjectURL(removed.preview);
      return newFiles;
    });
  };

  const removeExistingImage = (index: number) => {
    if (onRemoveExisting) {
      onRemoveExisting(index);
      toast.success('Image removed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card
        className={`border-2 border-dashed transition-all duration-300 glass-card ${
          isDragOver
            ? 'border-electric bg-electric/10'
            : 'border-glass-border hover:border-electric/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <motion.div
              animate={{
                scale: isDragOver ? 1.1 : 1,
                rotate: isDragOver ? 5 : 0
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-atom-primary/20 to-electric/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm"
            >
              <ThreeDIconPresets.Rocket className={`w-8 h-8 ${isDragOver ? 'text-electric' : 'text-foreground-secondary'}`} />
            </motion.div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragOver ? 'Drop images here' : 'Upload Images'}
            </h3>

            <p className="text-foreground-secondary mb-4">
              Drag and drop images here, or click to browse
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30">JPEG</Badge>
              <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30">PNG</Badge>
              <Badge className="bg-electric/20 text-electric border-electric/30">WebP</Badge>
              <Badge className="bg-electric/20 text-electric border-electric/30">GIF</Badge>
              <Badge className="bg-glass/30 text-foreground border-glass-border">Max {maxSizeMB}MB each</Badge>
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/80 hover:to-electric/80 text-white border-0 backdrop-blur-xl"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <ThreeDIconPresets.Target size={16} />
              Upload Progress
            </h4>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 p-3 glass-card"
              >
                <div className="w-10 h-10 glass-card rounded border-glass-border overflow-hidden">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-foreground-secondary">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={file.progress} className="h-1" />
                      <p className="text-xs text-electric mt-1">{file.progress}%</p>
                    </div>
                  )}

                  {file.status === 'error' && (
                    <Alert className="mt-2 border-red-500/30 bg-red-500/10 backdrop-blur-sm">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300 text-xs">
                        {file.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {file.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Existing Images
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-square glass-card rounded-lg overflow-hidden border-glass-border">
                  <img
                    src={image}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                {onRemoveExisting && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm"
                    onClick={() => removeExistingImage(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
