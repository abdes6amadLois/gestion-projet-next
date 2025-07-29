'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { RolesMultiSelect } from '@/components/team/RolesMultiSelect';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { User, Role } from '@/types';

interface EditTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, member: Partial<User>) => void;
  member: User | null;
  roles: Role[];
}

export const EditTeamMemberDialog = ({ isOpen, onClose, onSubmit, member, roles }: EditTeamMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    matricule: '',
    poste: '',
    roles: [] as Role[],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        telephone: member.telephone || '',
        matricule: member.matricule || '',
        poste: member.poste || '',
        roles: member.roles ? [...member.roles] : [],
      });
    }
  }, [member, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setIsLoading(true);

    try {
      await onSubmit(Number(member.id), formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | Role[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleRole = (role: Role) => {
    const currentRoles = formData.roles;
    const isSelected = currentRoles.some(r => r.id === role.id);

    if (isSelected) {
      handleChange('roles', currentRoles.filter(r => r.id !== role.id));
    } else {
      handleChange('roles', [...currentRoles, role]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update team member information and roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Phone</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="+212 675431254"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricule">Employee ID</Label>
              <Input
                id="matricule"
                placeholder="EMP001"
                value={formData.matricule}
                onChange={(e) => handleChange('matricule', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="poste">Job Title</Label>
            <Input
              id="poste"
              placeholder="Software Developer"
              value={formData.poste}
              onChange={(e) => handleChange('poste', e.target.value)}
            />
          </div>

          {/* Multi-select custom */}
          <div className="space-y-2">
            <Label>Roles</Label>
            <RolesMultiSelect
            roles={roles}               
            selectedRoles={formData.roles} 
            onChange={(newRoles) => handleChange('roles', newRoles)}  
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
