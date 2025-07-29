'use client';

import { useState , useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { roleService } from '@/services/roleService';import {
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
import { AddUser , Role } from '@/types';

  

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Partial<AddUser>) => void;
}

export const AddTeamMemberDialog = ({ isOpen, onClose, onSubmit }: AddTeamMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    telephone: '',
    matricule: '',
    poste: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);


  useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await roleService.getRoles();
          setRoles(response.roles);
        } catch (error) {
          console.error('Failed to load roles:', error);
        }
      };

      fetchRoles();
    }, []);

  // const availableRoles: Role[] = [
  //   { id: 1, name: 'developpeur' },
  //   { id: 2, name: 'client' },
  //   { id: 3, name: 'consultant' },
  //   {id:4,name:'user'},
  //   {id:5,name:'testeur'},
  //   {id:6,name:'devops'}
  //   ];

    
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        await 
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        telephone: '',
        matricule: '',
        poste: '',
        role: '',
      });
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

  const handleChangeR = (field: string, value: string) => {
  const selectedRole = roles.find(role => role.name === value);
  if (!selectedRole) return;

  setRole(selectedRole);

  setFormData(prev => ({
    ...prev,
    [field]: [selectedRole], 
  }));
};

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team. They will receive login credentials via email.
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
              <Label htmlFor="password">Temporary Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Temporary password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telephone">Phone (Optional)</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricule">Employee ID (Optional)</Label>
              <Input
                id="matricule"
                placeholder="EMP001"
                value={formData.matricule}
                onChange={(e) => handleChange('matricule', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="poste">Job Title</Label>
              <Input
                id="poste"
                placeholder="Software Developer"
                value={formData.poste}
                onChange={(e) => handleChange('poste', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
            >
                <SelectTrigger>
                <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length === 0 ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
                </SelectContent>
            </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};