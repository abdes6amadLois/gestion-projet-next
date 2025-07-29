'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { AddTeamMemberDialog } from '@/components/team/AddTeamMemberDialog';
import { EditTeamMemberDialog } from '@/components/team/EditTeamMemberDialog';
import { TeamStatsCard } from '@/components/team/TeamStatsCard';
import { authService } from '@/services/authService';
import { roleService } from '@/services/roleService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User,AddUser ,Role} from '@/types';
import { Plus, Search, Users, UserCheck, UserX, Filter } from 'lucide-react';
import { userService } from '@/services/userService';
import { projectService } from '@/services/projectService';
import { toast } from 'sonner';
import { hasPermission } from '@/utils/permissions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTeamMembers();
  }, [teamMembers, searchTerm, filterRole]);

  const fetchData = async () => {
    try {
      //setIsLoading(true);
      const [membersData, projectsData] = await Promise.all([
        userService.getUsers(),
        projectService.getProjects()
      ]);
      setTeamMembers(membersData);
      setProjects(projectsData.data);
    } catch (error) {
      console.error('Failed to fetch team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeamMembers = () => {
    let filtered = teamMembers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.poste?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role/position
    if (filterRole !== 'all') {
      filtered = filtered.filter(member => {
          return member.roles?.some(role => role.name === filterRole);
      });
    }

    setFilteredMembers(filtered);
  };

  const handleAddMember = async (memberData: Partial<AddUser>) => {
    try {
    //   const newMember = await userService.createUser(memberData);
      const newMember = await authService.registerU(memberData);
      setTeamMembers(prev => [newMember.data, ...prev]);
      setIsAddDialogOpen(false);
      toast.success('Team member added successfully');
    } catch (error) {
      console.error('Failed to add team member:', error);
      toast.error('Failed to add team member');
    }
  };

  const handleEditMember = async (id: number, memberData: Partial<User>) => {
    try {

      const updatedMember = await userService.updateUser(id, memberData);
      setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
      setIsEditDialogOpen(false);
      setSelectedMember(null);
      fetchData();
      toast.success('Team member updated successfully');
    } catch (error) {
      console.error('Failed to update team member:', error);
      toast.error('Failed to update team member');
    }
  };

  const handleDeleteMember = async (member: User) => {
    if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) return;
    
    try {
      await userService.deleteUser(member.id);
      setTeamMembers(prev => prev.filter(m => m.id !== member.id));
      toast.success('Team member removed successfully');
    } catch (error) {
      console.error('Failed to remove team member:', error);
      toast.error('Failed to remove team member');
    }
  };
  

  
  const openEditDialog = (member: User) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  // Calculate team statistics
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m && m.email_verified_at).length;
  const managers = teamMembers.filter(m => 
    m?.poste?.toLowerCase().includes('manager') || 
    m?.poste?.toLowerCase().includes('chef') ||
    m?.poste?.toLowerCase().includes('lead')
   ).length;
  const developers = teamMembers.filter(m => 
    m?.poste?.toLowerCase().includes('developer') || 
    m?.poste?.toLowerCase().includes('développeur') ||
    m?.poste?.toLowerCase().includes('dev')
  ).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Manage your team members and their roles</p>
          </div>
          {hasPermission('ajoute users') && (<Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>)}
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TeamStatsCard
            title="Total Members"
            value={totalMembers}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <TeamStatsCard
            title="Active Members"
            value={activeMembers}
            icon={UserCheck}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <TeamStatsCard
            title="Managers"
            value={managers}
            icon={UserCheck}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <TeamStatsCard
            title="Developers"
            value={developers}
            icon={Users}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, email, position, or matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map((role) => {                              
                        return (
                            <SelectItem value={role.name}>{role.name}</SelectItem>
                        );
                        })}
                    </SelectContent>
                    </Select>
                </div>
            
            {(searchTerm || filterRole !== 'all') && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {filteredMembers.length} of {totalMembers} members
                </span>
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {filterRole !== 'all' && (
                  <Badge variant="secondary">
                    Role: {filterRole}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Members Grid */}
        {filteredMembers.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <UserX className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  {searchTerm || filterRole !== 'all' ? 'No members found' : 'No team members yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterRole !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by adding your first team member'
                  }
                </p>
                {!searchTerm && filterRole === 'all' && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                ) && hasPermission('ajoute users') }
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers
            .filter((member) => member && member.id) 
            .map((member) => (
                <TeamMemberCard
                key={member.id}
                onDelete={handleDeleteMember}
                member={member}
                projects={projects.filter(p => p.chef_projet_id === member.id)}
                onEdit={openEditDialog}
                />
            ))}
          </div>
        )}

        {hasPermission('ajoute users') && (<AddTeamMemberDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddMember}
        />)}

        {hasPermission('ajoute users') && (<EditTeamMemberDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedMember(null);
          }}
          onSubmit={handleEditMember}
          member={selectedMember}
          //fetchData={fetchData}
          roles= {roles}
        />)}
      </div>
    </DashboardLayout>
  );
}