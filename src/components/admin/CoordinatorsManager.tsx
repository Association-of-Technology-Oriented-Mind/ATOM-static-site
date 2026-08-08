import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { coordinators as defaultCoordinators } from '@/constants/coordinators';
import { ThreeDIconPresets } from '../ThreeDIcons';

interface Coordinator {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin: string;
}

interface CoordinatorsManagerProps {
  onBackToDashboard: () => void;
}

const CoordinatorsManager: React.FC<CoordinatorsManagerProps> = ({ onBackToDashboard }) => {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState<Coordinator | null>(null);
  const [formData, setFormData] = useState<Partial<Coordinator>>({});

  useEffect(() => {
    // Load coordinators from localStorage or defaults
    const stored = localStorage.getItem('cms_coordinators');
    if (stored) {
      setCoordinators(JSON.parse(stored));
    } else {
      setCoordinators(defaultCoordinators);
    }
  }, []);

  const saveCoordinators = (newCoordinators: Coordinator[]) => {
    setCoordinators(newCoordinators);
    localStorage.setItem('cms_coordinators', JSON.stringify(newCoordinators));
  };

  const handleAdd = () => {
    setEditingCoordinator(null);
    setFormData({
      id: Date.now(),
      name: '',
      role: '',
      image: '',
      bio: '',
      linkedin: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (coordinator: Coordinator) => {
    setEditingCoordinator(coordinator);
    setFormData({ ...coordinator });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const newCoordinators = coordinators.filter(c => c.id !== id);
    saveCoordinators(newCoordinators);
    toast.success('Coordinator deleted successfully');
  };

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.bio) {
      toast.error('Please fill in all required fields');
      return;
    }

    let newCoordinators;
    if (editingCoordinator) {
      newCoordinators = coordinators.map(c => c.id === editingCoordinator.id ? { ...formData } as Coordinator : c);
      toast.success('Coordinator updated successfully');
    } else {
      newCoordinators = [...coordinators, { ...formData } as Coordinator];
      toast.success('Coordinator added successfully');
    }

    saveCoordinators(newCoordinators);
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: keyof Coordinator, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <Button 
          onClick={handleAdd}
          className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <ThreeDIconPresets.Target size={16} />
          Add Coordinator
        </Button>
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
            Coordinators Management
          </h1>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Manage your team coordinators and their information
          </p>
          <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30 px-4 py-2 inline-flex items-center gap-2">
            <Users className="w-4 h-4" />
            Total Coordinators: {coordinators.length}
          </Badge>
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
              <ThreeDIconPresets.Users size={24} />
              All Coordinators
            </h3>
            <Button 
              onClick={handleAdd} 
              variant="outline" 
              size="sm"
              className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-glass-border">
            <Table>
              <TableHeader>
                <TableRow className="border-glass-border bg-glass/20">
                  <TableHead className="text-foreground font-semibold py-4 px-6">Name</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Role</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Bio</TableHead>
                  <TableHead className="text-foreground font-semibold py-4 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinators.map((coordinator, index) => (
                  <motion.tr
                    key={coordinator.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-glass-border hover:bg-glass/20 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-4 px-6">{coordinator.name}</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30">
                        {coordinator.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground-secondary max-w-xs truncate py-4 px-6">{coordinator.bio}</TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(coordinator)}
                          className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(coordinator.id)}
                          className="bg-destructive/20 backdrop-blur-xl border-destructive/30 hover:bg-destructive/40 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      {/* Dialog for Add/Edit Coordinator */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-card border-glass-border">
          <DialogHeader>
            <DialogTitle className="gradient-text">{editingCoordinator ? 'Edit Coordinator' : 'Add Coordinator'}</DialogTitle>
            <DialogDescription className="text-foreground-secondary">
              Fill in the coordinator details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="role" className="text-foreground">Role *</Label>
                <Input
                  id="role"
                  className="glass-card border-glass-border bg-glass/30 text-foreground"
                  value={formData.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image" className="text-foreground">Image URL</Label>
              <Input
                id="image"
                className="glass-card border-glass-border bg-glass/30 text-foreground"
                value={formData.image || ''}
                onChange={(e) => handleInputChange('image', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bio" className="text-foreground">Bio *</Label>
              <Textarea
                id="bio"
                className="glass-card border-glass-border bg-glass/30 text-foreground"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className="text-foreground">LinkedIn URL</Label>
              <Input
                id="linkedin"
                className="glass-card border-glass-border bg-glass/30 text-foreground"
                value={formData.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-atom-primary to-electric hover:from-atom-primary/90 hover:to-electric/90 text-white"
            >
              {editingCoordinator ? 'Update' : 'Add'} Coordinator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoordinatorsManager;
