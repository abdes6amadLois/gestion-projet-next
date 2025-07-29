'use client';

import { useState, useEffect } from 'react';
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
import { Task, User } from '@/types';
import { userService } from '@/services/userService';

interface EditTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, task: Partial<Task>) => void;
  task: Task | null;
}

export const EditTaskDialog = ({ isOpen, onClose, onSubmit, task }: EditTaskDialogProps) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    statut: 'Future' as 'Future' | 'retard' | 'Schedule'| 'Terminé',
    assigner_a: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setFormData({
        titre: task.titre,
        description: task.description || '',
        statut: task.statut,
        assigner_a: task.assigner_a || '',
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    setIsLoading(true);
    
    try {
      await onSubmit(task.id, formData);
    } finally {
      setIsLoading(false);
    }
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
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details and assignment.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Task Title</Label>
              <Input
                id="titre"
                placeholder="Implement user authentication"
                value={formData.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statut">Status</Label>
              <Select value={formData.statut} onValueChange={(value) => handleChange('statut', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Future">Future</SelectItem>
                  <SelectItem value="retard">retard</SelectItem>
                  <SelectItem value="Schedule">Schedule</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the task requirements..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigner_a">Assign To</Label>
            <Select value={formData.assigner_a} onValueChange={(value) => handleChange('assigner_a', value)}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select team member"} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingUsers}>
              {isLoading ? 'Updating...' : 'Update Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};