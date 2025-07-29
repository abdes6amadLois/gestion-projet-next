'use client';

import { User, Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  FolderOpen,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMemberCardProps {
  member: User;
  projects: Project[];
  onEdit: (member: User) => void;
  onDelete: (member: User) => void;
}

export const TeamMemberCard = ({ member, projects, onEdit, onDelete }: TeamMemberCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (poste?: string) => {
    if (!poste) return 'bg-gray-100 text-gray-800';
    
    const role = poste.toLowerCase();
    if (role.includes('manager') || role.includes('chef') || role.includes('lead')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (role.includes('developer') || role.includes('développeur') || role.includes('dev')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (role.includes('designer') || role.includes('design')) {
      return 'bg-green-100 text-green-800';
    }
    if (role.includes('tester') || role.includes('qa')) {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const activeProjects = projects.filter(p => p.status === 'en_cours').length;
  const completedProjects = projects.filter(p => p.status === 'termine').length;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{member.name}</CardTitle>
            <CardDescription className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {member.email}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(member)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Member
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(member)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Role and Status */}
        <div className="flex items-center justify-between">
          <Badge className={getRoleColor(member.poste)}>
            <Building className="h-3 w-3 mr-1" />
            {member.poste || 'No role assigned'}
          </Badge>
          <Badge variant={member.email_verified_at ? 'default' : 'secondary'}>
            {member.email_verified_at ? 'Active' : 'Pending'}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 text-sm">
          {member.telephone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{member.telephone}</span>
            </div>
          )}
          {member.roles?.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center text-gray-600">
                {member.roles.map((role, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                    {role.name}
                </Badge>
                ))}
            </div>
            )}
          {member.matricule && (
            <div className="flex items-center text-gray-600">
              <Badge variant="outline" className="text-xs">
                ID: {member.matricule}
              </Badge>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Project Involvement</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-center mb-1">
                <FolderOpen className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{projects.length}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-semibold text-green-900">{activeProjects}</div>
              <div className="text-xs text-green-600">Active</div>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-blue-900">{completedProjects}</div>
              <div className="text-xs text-blue-600">Done</div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div className="pt-2 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Projects</h4>
            <div className="space-y-1">
              {projects.slice(0, 2).map((project) => (
                <div key={project.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-gray-600">{project.nom}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      project.status === 'en_cours' ? 'bg-green-100 text-green-800' :
                      project.status === 'termine' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
              {projects.length > 2 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  +{projects.length - 2} more projects
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onEdit(member)}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.href = `mailto:${member.email}`}
            className="flex-1"
          >
            <Mail className="h-3 w-3 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};