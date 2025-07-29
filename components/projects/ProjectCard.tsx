'use client';

import { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MoreHorizontal, AlarmClock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  // onViewTasks: (project: Project) => void;
  onViewSprints: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard = ({ project, onViewSprints, onEdit, onDelete }: ProjectCardProps) => {
  const totalTasks = project.sprints?.flatMap(sprint => sprint.tasks || []).length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_cours':
        return 'bg-green-100 text-green-800';
      case 'termine':
        return 'bg-blue-100 text-blue-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">{project.nom}</CardTitle>
          <CardDescription className="mt-1">{project.description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewSprints(project)}>
              View Sprints
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(project)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(project)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(project.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {totalTasks || 0} tasks
            </div>
            <div className="flex items-center">
              <AlarmClock className="mr-1 h-4 w-4" />
              {project.sprints?.length || 0} sprints
            </div>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
        <div className="mt-4">
          <Button onClick={() => onViewSprints(project)} className="w-full">
            View Sprints
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};