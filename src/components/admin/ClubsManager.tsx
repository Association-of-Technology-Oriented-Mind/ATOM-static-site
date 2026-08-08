import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription as CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, X, ArrowLeft, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { clubs as defaultClubs } from '@/constants/clubs';
import { useQueryClient } from '@tanstack/react-query';
import { useClubs } from '@/hooks/useContent';
import { replaceCollection } from '@/utils/dataService';
import { COLLECTIONS } from '@/lib/firebase';
import { ThreeDIconPresets } from '../ThreeDIcons';

interface ClubsManagerProps {
  onBackToDashboard: () => void;
}

interface ClubCoordinator {
  name: string;
  role: string;
  image: string;
  isMain: boolean;
  bio?: string;
  linkedin?: string;
}

interface ClubProject {
  name: string;
  description: string;
  github?: string;
}

interface Club {
  id: number;
  name: string;
  icon: string | React.ComponentType;
  description: string;
  objectives: string;
  extraInfo: string;
  coordinators: ClubCoordinator[];
  projects: ClubProject[];
  gallery: string[];
}

const ClubsManager: React.FC<ClubsManagerProps> = ({ onBackToDashboard }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState<Partial<Club>>({});

  const { data: storedClubs } = useClubs();
  const queryClient = useQueryClient();

  useEffect(() => {
    setClubs((storedClubs ?? defaultClubs) as Club[]);
  }, [storedClubs]);

  const saveClubs = async (newClubs: Club[]) => {
    const previous = clubs;
    setClubs(newClubs);
    try {
      // `icon` may hold a React component from the bundled defaults, which
      // Firestore cannot serialise; the UI resolves icons by club id anyway.
      const serialisable = newClubs.map(({ icon, ...rest }) => ({
        ...rest,
        icon: typeof icon === 'string' ? icon : '',
      }));
      await replaceCollection(COLLECTIONS.clubs, serialisable, 'id');
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    } catch (error) {
      console.error('Failed to save clubs:', error);
      setClubs(previous);
      toast.error('Could not save clubs', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setFormData({ ...club });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newClubs = clubs.map(c => c.id === editingClub!.id ? { ...formData } as Club : c);
    saveClubs(newClubs);
    toast.success('Club updated successfully');
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: keyof Club, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Coordinator management
  const addCoordinator = () => {
    const newCoordinator: ClubCoordinator = {
      name: '',
      role: '',
      image: '',
      isMain: false,
      bio: '',
      linkedin: ''
    };
    setFormData(prev => ({
      ...prev,
      coordinators: [...(prev.coordinators || []), newCoordinator]
    }));
  };

  const updateCoordinator = (index: number, field: keyof ClubCoordinator, value: string | boolean) => {
    const updatedCoordinators = [...(formData.coordinators || [])];
    updatedCoordinators[index] = { ...updatedCoordinators[index], [field]: value };
    setFormData(prev => ({ ...prev, coordinators: updatedCoordinators }));
  };

  const removeCoordinator = (index: number) => {
    const updatedCoordinators = (formData.coordinators || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, coordinators: updatedCoordinators }));
  };

  // Project management
  const addProject = () => {
    const newProject: ClubProject = {
      name: '',
      description: '',
      github: ''
    };
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  };

  const updateProject = (index: number, field: keyof ClubProject, value: string) => {
    const updatedProjects = [...(formData.projects || [])];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const removeProject = (index: number) => {
    const updatedProjects = (formData.projects || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
  };

  // Gallery management
  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), '']
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    const updatedGallery = [...(formData.gallery || [])];
    updatedGallery[index] = value;
    setFormData(prev => ({ ...prev, gallery: updatedGallery }));
  };

  const removeGalleryImage = (index: number) => {
    const updatedGallery = (formData.gallery || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, gallery: updatedGallery }));
  };

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
        <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30 px-4 py-2 flex items-center gap-2">
          <Building className="w-4 h-4" />
          Total Clubs: {clubs.length}
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
            Clubs Management
          </h1>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Manage your club information, coordinators, and projects
          </p>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <ThreeDIconPresets.Globe size={24} />
              All Clubs
            </h3>
            <Button 
              onClick={() => handleEdit(clubs[0])}
              className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Clubs
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-glass-border">
            <Table>
              <TableHeader>
                <TableRow className="border-glass-border bg-glass/20">
                  <TableHead className="text-foreground font-semibold py-4 px-6">Name</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Description</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Coordinators</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Projects</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Gallery</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map((club, index) => (
                  <motion.tr
                    key={club.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-glass-border hover:bg-glass/20 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-4 px-6">{club.name}</TableCell>
                    <TableCell className="text-foreground-secondary max-w-xs truncate py-4 px-6">{club.description}</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30">
                        {club.coordinators.length} Members
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-electric/20 text-electric border-electric/30">
                        {club.projects.length} Projects
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-atom-metallic/20 text-atom-metallic border-atom-metallic/30">
                        {club.gallery.length} Images
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(club)}
                        className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Edit Club</DialogTitle>
            <DialogDescription className="text-foreground-secondary">
              Modify club details, coordinators, projects, and gallery.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-glass/30 border-glass-border">
              <TabsTrigger value="basic" className="text-foreground data-[state=active]:bg-atom-primary data-[state=active]:text-white">Basic Info</TabsTrigger>
              <TabsTrigger value="coordinators" className="text-foreground data-[state=active]:bg-atom-primary data-[state=active]:text-white">Coordinators</TabsTrigger>
              <TabsTrigger value="projects" className="text-foreground data-[state=active]:bg-atom-primary data-[state=active]:text-white">Projects</TabsTrigger>
              <TabsTrigger value="gallery" className="text-foreground data-[state=active]:bg-atom-primary data-[state=active]:text-white">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Name *</Label>
                  <Input
                    id="name"
                    className="glass-card border-glass-border bg-glass/30 text-foreground"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="icon" className="text-foreground">Icon URL</Label>
                  <Input
                    id="icon"
                    className="glass-card border-glass-border bg-glass/30 text-foreground"
                    value={typeof formData.icon === 'string' ? formData.icon : ''}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-foreground">Description *</Label>
                  <Textarea
                    id="description"
                    className="glass-card border-glass-border bg-glass/30 text-foreground"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="objectives" className="text-foreground">Objectives</Label>
                  <Textarea
                    id="objectives"
                    className="glass-card border-glass-border bg-glass/30 text-foreground"
                    value={formData.objectives || ''}
                    onChange={(e) => handleInputChange('objectives', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="extraInfo" className="text-foreground">Extra Info</Label>
                  <Textarea
                    id="extraInfo"
                    className="glass-card border-glass-border bg-glass/30 text-foreground"
                    value={formData.extraInfo || ''}
                    onChange={(e) => handleInputChange('extraInfo', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coordinators" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-foreground">Coordinators</h4>
                <Button 
                  onClick={addCoordinator} 
                  size="sm"
                  className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coordinator
                </Button>
              </div>
              <div className="space-y-4">
                {(formData.coordinators || []).map((coordinator, index) => (
                  <Card key={index} className="glass-card border-glass-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm text-foreground">Coordinator {index + 1}</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeCoordinator(index)}
                        className="bg-glass/30 border-glass-border text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Name"
                          className="glass-card border-glass-border bg-glass/30 text-foreground"
                          value={coordinator.name}
                          onChange={(e) => updateCoordinator(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Role"
                          className="glass-card border-glass-border bg-glass/30 text-foreground"
                          value={coordinator.role}
                          onChange={(e) => updateCoordinator(index, 'role', e.target.value)}
                        />
                      </div>
                      <Input
                        placeholder="Image URL"
                        className="glass-card border-glass-border bg-glass/30 text-foreground"
                        value={coordinator.image}
                        onChange={(e) => updateCoordinator(index, 'image', e.target.value)}
                      />
                      <Textarea
                        placeholder="Bio"
                        className="glass-card border-glass-border bg-glass/30 text-foreground"
                        value={coordinator.bio || ''}
                        onChange={(e) => updateCoordinator(index, 'bio', e.target.value)}
                        rows={2}
                      />
                      <Input
                        placeholder="LinkedIn URL"
                        className="glass-card border-glass-border bg-glass/30 text-foreground"
                        value={coordinator.linkedin || ''}
                        onChange={(e) => updateCoordinator(index, 'linkedin', e.target.value)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-foreground">Projects</h4>
                <Button 
                  onClick={addProject} 
                  size="sm"
                  className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <div className="space-y-4">
                {(formData.projects || []).map((project, index) => (
                  <Card key={index} className="glass-card border-glass-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm text-foreground">Project {index + 1}</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeProject(index)}
                        className="bg-glass/30 border-glass-border text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Input
                        placeholder="Project Name"
                        className="glass-card border-glass-border bg-glass/30 text-foreground"
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                      />
                      <Textarea
                        placeholder="Description"
                        className="glass-card border-glass-border bg-glass/30 text-foreground"
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        rows={2}
                      />
                      <Input
                        placeholder="GitHub URL"
                        className="glass-card border-glass-border bg-glass/30 text-foreground"
                        value={project.github || ''}
                        onChange={(e) => updateProject(index, 'github', e.target.value)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-foreground">Gallery Images</h4>
                <Button 
                  onClick={addGalleryImage} 
                  size="sm"
                  className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.gallery || []).map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Image URL"
                      className="glass-card border-glass-border bg-glass/30 text-foreground flex-1"
                      value={image}
                      onChange={(e) => updateGalleryImage(index, e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeGalleryImage(index)}
                      className="bg-glass/30 border-glass-border text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ThreeDIconPresets.Globe size={16} className="mr-2" />
              Update Club
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClubsManager;
