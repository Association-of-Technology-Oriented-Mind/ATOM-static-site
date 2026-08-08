import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload, ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { events as defaultEvents, Event as EventType } from '@/constants/events';
import { useQueryClient } from '@tanstack/react-query';
import { useEvents } from '@/hooks/useContent';
import { replaceCollection } from '@/utils/dataService';
import { COLLECTIONS } from '@/lib/firebase';
import { ThreeDIconPresets } from '../ThreeDIcons';
import ImageUpload from './ImageUpload';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface EventsManagerProps {
  onBackToDashboard: () => void;
}

const EventsManager: React.FC<EventsManagerProps> = ({ onBackToDashboard }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [formData, setFormData] = useState<Partial<EventType>>({});
  const [showImageUpload, setShowImageUpload] = useState(false);

  const { data: storedEvents = defaultEvents } = useEvents();
  const queryClient = useQueryClient();

  useEffect(() => {
    setEvents(storedEvents);
  }, [storedEvents]);

  const handleSaveEvents = async (newEvents: EventType[]) => {
    const previous = events;
    setEvents(newEvents);
    try {
      await replaceCollection(COLLECTIONS.events, newEvents, 'id');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    } catch (error) {
      console.error('Failed to save events:', error);
      setEvents(previous);
      toast.error('Could not save events', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      id: Date.now(),
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '',
      status: 'upcoming',
      category: '',
      registrationLink: '',
      eventType: 'free'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: EventType) => {
    setEditingEvent(event);
    setFormData({ ...event });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const newEvents = events.filter(e => e.id !== id);
    handleSaveEvents(newEvents);
    toast.success('Event deleted successfully');
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    let newEvents;
    if (editingEvent) {
      newEvents = events.map(e => e.id === editingEvent.id ? { ...formData } as EventType : e);
      toast.success('Event updated successfully');
    } else {
      newEvents = [...events, { ...formData } as EventType];
      toast.success('Event added successfully');
    }

    handleSaveEvents(newEvents);
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: keyof EventType, value: string | number | boolean) => {
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
          <ThreeDIconPresets.Rocket size={16} />
          Add Event
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
            Events Management
          </h1>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
            Manage your events, workshops, and competitions
          </p>
          <Badge className="bg-atom-primary/20 text-atom-primary border-atom-primary/30 px-4 py-2 inline-flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Total Events: {events.length}
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
                <ThreeDIconPresets.Target size={24} />
                All Events
              </h3>
              <Button 
                onClick={handleAdd} 
                variant="outline" 
                size="sm"
                className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-glass-border">
                    <TableHead className="text-foreground font-semibold">Title</TableHead>
                    <TableHead className="text-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold">Category</TableHead>
                    <TableHead className="text-foreground font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-glass-border hover:bg-glass/20 transition-colors"
                    >
                      <TableCell className="font-medium text-foreground">{event.title}</TableCell>
                      <TableCell className="text-foreground-secondary">{event.date}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`${
                            event.status === 'upcoming' 
                              ? 'bg-gradient-to-r from-atom-primary/20 to-electric/20 text-atom-primary border-atom-primary/30' 
                              : 'bg-atom-metallic/20 text-atom-metallic border-atom-metallic/30'
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground-secondary">{event.category}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(event)}
                            className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(event.id)}
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

        {/* Dialog for Add/Edit Event */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-glass-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold gradient-text">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <DialogDescription className="text-foreground-secondary">
                Fill in the event details below to {editingEvent ? 'update' : 'create'} the event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-foreground font-semibold">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-input border-border text-foreground"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-foreground font-semibold">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="bg-input border-border text-foreground"
                    placeholder="e.g., Workshop, Seminar, Competition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-foreground font-semibold">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-foreground font-semibold">Time</Label>
                  <Input
                    id="time"
                    value={formData.time || ''}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="bg-input border-border text-foreground"
                    placeholder="e.g., 10:00 AM"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location" className="text-foreground font-semibold">Location *</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-input border-border text-foreground"
                  placeholder="e.g., DSCS Gallery Hall"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-foreground font-semibold">Description (Markdown) *</Label>
                <div data-color-mode="dark">
                  <MDEditor
                    value={formData.description || ''}
                    onChange={(value) => handleInputChange('description', value || '')}
                    preview="edit"
                    hideToolbar={false}
                    visibleDragbar={false}
                    height={200}
                    className="bg-input border border-border rounded-md"
                  />
                </div>
                <p className="text-xs text-foreground-secondary mt-2">
                  Use Markdown for rich formatting: **bold**, *italic*, `code`, lists, links, etc.
                </p>
              </div>
              
              <div className="space-y-4">
                <Label className="text-foreground font-semibold">Event Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image" className="text-sm text-foreground-secondary">Image URL</Label>
                    <Input
                      id="image"
                      placeholder="Enter image URL or upload below"
                      value={formData.image || ''}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                      className="bg-glass/30 backdrop-blur-xl border-glass-border hover:bg-glass/50 text-foreground w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {showImageUpload ? 'Hide Upload' : 'Upload Image'}
                    </Button>
                  </div>
                </div>

                {showImageUpload && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-4"
                  >
                    <ImageUpload
                      onImagesUploaded={(images) => {
                        if (images.length > 0) {
                          handleInputChange('image', images[0]);
                          setShowImageUpload(false);
                        }
                      }}
                      maxFiles={1}
                      maxSizeMB={5}
                      existingImages={[]}
                    />
                  </motion.div>
                )}

                {formData.image && (
                  <div className="mt-4">
                    <Label className="text-sm text-foreground-secondary">Preview</Label>
                    <div className="mt-2 w-32 h-20 bg-glass/20 rounded-xl border-glass-border overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-foreground font-semibold">Status</Label>
                  <Select value={formData.status || 'upcoming'} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="eventType" className="text-foreground font-semibold">Event Type</Label>
                  <Select value={formData.eventType || 'free'} onValueChange={(value) => handleInputChange('eventType', value)}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="registrationLink" className="text-foreground font-semibold">Registration Link</Label>
                <Input
                  id="registrationLink"
                  value={formData.registrationLink || ''}
                  onChange={(e) => handleInputChange('registrationLink', e.target.value)}
                  className="bg-input border-border text-foreground"
                  placeholder="https://forms.google.com/..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
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
                <ThreeDIconPresets.Rocket size={16} className="mr-2" />
                {editingEvent ? 'Update' : 'Add'} Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default EventsManager;
