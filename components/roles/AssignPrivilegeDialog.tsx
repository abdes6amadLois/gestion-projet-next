'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Role, Privilege } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { permissionsService } from '@/services/permissionService';
import { roleService } from '@/services/roleService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AssignPrivilegeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number;
  availablePrivileges: Privilege[]; // fallback initial
  assignedPrivileges: number[];
  onSubmit: (roleId: number, privileges: number[]) => void;
  role : Role ;
  fetchRoles :any;
}

export const AssignPrivilegeDialog = ({
  isOpen,
  onClose,
  roleId,
  role,
  availablePrivileges,
  assignedPrivileges,
  fetchRoles,
  onSubmit,
}: AssignPrivilegeDialogProps) => {
  const [selected, setSelected] = useState<number[]>(assignedPrivileges);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedPrivileges, setFetchedPrivileges] = useState<Privilege[]>([]);

  
  useEffect(() => {
    if (role?.permissions) {
        setSelected(role.permissions.map((p) => p.id)); 
    } else {
        setSelected([]); 
    }
    }, [role, isOpen]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await permissionsService.getPermissions();
        setFetchedPrivileges(response.permissions);
      } catch (error) {
        console.error('Failed to load privileges:', error);
      }
    };

    fetchPermissions();
  }, []);

  const togglePrivilege = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(role.id, selected);
      onClose(); 
    } finally {
      setIsLoading(false);
    }
  };

  const privilegesToRender = fetchedPrivileges.length > 0 ? fetchedPrivileges : availablePrivileges;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Privileges</DialogTitle>
          <DialogDescription>Select the privileges to assign to this role.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {Array.isArray(privilegesToRender) && privilegesToRender.map((priv) => (
            <div
              key={priv.id}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => togglePrivilege(priv.id)}
            >
              <Checkbox checked={Array.isArray(selected) && selected.includes(priv.id)} />
              <Label className="ml-2">{priv.name}</Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
