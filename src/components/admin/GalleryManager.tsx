import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload, Grid, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThreeDIconPresets } from '../ThreeDIcons';
import ImageUpload from './ImageUpload';
import { useGalleryImages } from '@/hooks/useContent';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { replaceCollection } from '@/utils/dataService';
import { COLLECTIONS } from '@/lib/firebase';

interface GalleryManagerProps {
  onBackToDashboard: () => void;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({ onBackToDashboard }) => {
  const { data: storedImages = [] } = useGalleryImages();
  const queryClient = useQueryClient();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    setGalleryImages(storedImages);
  }, [storedImages]);

  const persist = async (updated: string[], previous: string[]) => {
    setGalleryImages(updated);
    try {
      await replaceCollection(
        COLLECTIONS.gallery,
        updated.map(url => ({ id: url, url })),
        'id',
      );
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    } catch (error) {
      console.error('Failed to save gallery:', error);
      setGalleryImages(previous);
      toast.error('Could not save gallery', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleImagesUploaded = (newImages: string[]) =>
    persist([...galleryImages, ...newImages], galleryImages);

  const handleRemoveImage = (index: number) =>
    persist(galleryImages.filter((_, i) => i !== index), galleryImages);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <Button 
          variant="outline" 
          onClick={onBackToDashboard}
          className="bg-glass/50 backdrop-blur-xl border-glass-border hover:bg-glass/70 text-foreground transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <Badge className="bg-electric/20 text-electric border-electric/30 px-4 py-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Total Images: {galleryImages.length}
        </Badge>
      </motion.div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Gallery Management
          </h1>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Manage your website's photo gallery and image uploads
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-glass/30 border-glass-border">
          <TabsTrigger value="upload" className="flex items-center gap-2 text-foreground data-[state=active]:bg-atom-primary data-[state=active]:text-white">
            <Upload className="w-4 h-4" />
            Upload Images
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2 text-foreground data-[state=active]:bg-atom-primary data-[state=active]:text-white">
            <Grid className="w-4 h-4" />
            Manage Gallery
          </TabsTrigger>
        </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card border-glass-border">
                <CardHeader className="p-8">
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <ThreeDIconPresets.Globe size={24} />
                    Upload New Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ImageUpload
                    onImagesUploaded={handleImagesUploaded}
                    maxFiles={20}
                    maxSizeMB={10}
                    existingImages={[]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass-card border-glass-border">
                <CardHeader className="p-8">
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <ThreeDIconPresets.Target size={24} />
                    Gallery Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ImageUpload
                    onImagesUploaded={handleImagesUploaded}
                    existingImages={galleryImages}
                    onRemoveExisting={handleRemoveImage}
                    maxFiles={50}
                    maxSizeMB={10}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default GalleryManager;
