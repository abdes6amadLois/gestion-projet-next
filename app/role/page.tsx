'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Role, Privilege } from '@/types';
import { roleService } from '@/services/roleService';
import { toast } from 'sonner';
import { AddRoleDialog } from '@/components/roles/AddRoleDialog';
import { EditRoleDialog } from '@/components/roles/EditRoleDialog';
import { AssignPrivilegeDialog } from '@/components/roles/AssignPrivilegeDialog';

export default function RolesPage() {
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role >();

  const [roles, setRoles] = useState<Role[]>([]);
  
  
    const fetchRoles = async () => {
  try {
    const response = await roleService.getRoles();
    setRoles(response.roles);
  } catch (error) {
    console.error('Failed to load roles:', error);
  }
};

useEffect(() => {
  fetchRoles(); 
}, []);
  const handleAddRole = async (newRole: Partial<Role>) => {
    try {
      const created = await roleService.createRole(newRole);
      setRoles(prev => [...prev, created]);
      toast.success('Role added successfully');
      setIsAddDialogOpen(false);
    } catch {
      toast.error('Failed to add role');
    }
  };

  const assignePermissions = async (id: number,ids:number[]) => {
    try {
      const assign = await roleService.assignPerm(id,ids);
      toast.success('Permissions assigne successfully');
      setIsAssignDialogOpen(false);
      fetchRoles();
    } catch {
      toast.error('Failed to assign permission ');
    }
  };


  const handleEditRole = async (updatedRole: Partial<Role>) => {
    if (!selectedRole) return;
    try {
      const updated = await roleService.updateRole(selectedRole.id, updatedRole);
      setRoles(prev => prev.map(role => (role.id === updated.id ? updated : role)));
      toast.success('Role updated successfully');
      setIsEditDialogOpen(false);
      setSelectedRole(null);
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await roleService.deleteRole(roleId);
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast.success('Role deleted successfully');
    } catch {
      toast.error('Failed to delete role');
    }
  };
  

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Rôles</h1>
          <p className="text-gray-500">Ajoutez, modifiez ou supprimez des rôles et leurs privilèges</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rôle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des rôles</CardTitle>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <p className="text-gray-500">Aucun rôle trouvé.</p>
          ) : (
            <div className="space-y-2">
              {roles.map(role => (
                <div key={role.id} className="flex justify-between items-center border p-4 rounded">
                    
                  <div>
                    <h4 className="font-semibold">{role.name}</h4>
                    <p className="text-sm text-gray-500">
                      {role.permissions?.length || 0} privilège(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      setSelectedRole(role);
                      setIsAssignDialogOpen(true);
                    }}>
                      <Shield className="w-4 h-4 mr-1" /> Privilèges
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => {
                      setSelectedRole(role);
                      setIsEditDialogOpen(true);
                    }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddRoleDialog 
      isOpen={isAddDialogOpen} 
      onClose={() => setIsAddDialogOpen(false)} 
      onSubmit={(newRole)=> handleAddRole(newRole)} />
        {selectedRole && (
        <EditRoleDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSubmit={(role) => handleEditRole({ name: role.name })}
            role={selectedRole}
        />
        )}
      <AssignPrivilegeDialog 
      isOpen={isAssignDialogOpen} 
      onClose={() => setIsAssignDialogOpen(false)} 
      onSubmit={(roleId,privileges)=> assignePermissions(roleId,privileges)}
      role={selectedRole}
      //fetchRoles={ fetchRoles()} 
       />
    </DashboardLayout>
  );
}
