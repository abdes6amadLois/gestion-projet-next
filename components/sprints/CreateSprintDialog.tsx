'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sprint } from '@/types';
import { calculateSprintStatus } from '@/utils/sprintUtils';

interface CreateSprintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sprint: Partial<Sprint>) => void;
  projectId: number;
}

export const CreateSprintDialog = ({ isOpen, onClose, onSubmit, projectId }: CreateSprintDialogProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    date_debut: '',
    date_fin: '',
    status: 'planned' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate status based on dates
    const calculatedStatus = calculateSprintStatus(formData.date_debut, formData.date_fin);
    
    const sprintData: Partial<Sprint> = {
      ...formData,
      projet_id: projectId,
      status: calculatedStatus, // Use calculated status instead of form status
    };

    onSubmit(sprintData);
    
    // Reset form
    setFormData({
      nom: '',
      description: '',
      date_debut: '',
      date_fin: '',
      status: 'planned', // This will be overridden by calculation
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Sprint</DialogTitle>
          <DialogDescription>
            Create a new sprint for your project. Define the sprint goals, timeline, and initial story points.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Sprint Name</Label>
              <Input
                id="nom"
                placeholder="Sprint 1 - Foundation"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this sprint will accomplish..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_debut">Start Date</Label>
              <Input
                id="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={(e) => handleChange('date_debut', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_fin">End Date</Label>
              <Input
                id="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={(e) => handleChange('date_fin', e.target.value)}
                required
              />
            </div>
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Sprint</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};