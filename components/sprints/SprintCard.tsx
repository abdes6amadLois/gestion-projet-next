'use client';

import { Sprint, Task } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, MoreHorizontal, Clock, CheckCircle2, Users, Plus } from 'lucide-react';
import { getSprintTimeInfo, getSprintStatusBadgeProps } from '@/utils/sprintUtils';
import { hasPermission } from '@/utils/permissions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SprintCardProps {
  sprint: Sprint;
  onEdit: (sprint: Sprint) => void;
  onDelete: (sprint: Sprint) => void;
  onCreateTask: (sprintId: number) => void;
  onEditTask: (task: Task) => void;
  isActive?: boolean;
}

export const SprintCard = ({ 
  sprint, 
  onEdit, 
  onDelete, 
  onCreateTask, 
  onEditTask, 
  isActive = false 
}: SprintCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'planned':
        return <Target className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const totalTasks = sprint.tasks?.length || 0;
  const completedTasks = sprint.tasks?.filter(task => task.statut === 'Terminé').length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const timeInfo = getSprintTimeInfo(sprint.date_debut, sprint.date_fin);
  const statusProps = getSprintStatusBadgeProps(sprint.status || 'planned');
  
  const timeProgress = sprint.status === 'active' ? timeInfo.timeProgress : 
                     sprint.status === 'completed' ? 100 : 0;
  
  const startDate = new Date(sprint.date_debut);
  const endDate = new Date(sprint.date_fin);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isActive ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {sprint.nom}
            {isActive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </CardTitle>
          <CardDescription>{sprint.description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusProps.className}>
            {getStatusIcon(sprint.status || 'planned')}
            <span className="ml-1">{(sprint.status || 'planned').replace('_', ' ')}</span>
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {hasPermission('cree tasks') && (<DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCreateTask(sprint.id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(sprint)}>
                Edit Sprint
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(sprint)}>
                Delete Sprint
              </DropdownMenuItem>
            </DropdownMenuContent>)}
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Task Progress</span>
            <span className="text-gray-600">
              {completedTasks}/{totalTasks} ({Math.round(progress)}%)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {sprint.status === 'active' && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Time Progress</span>
                <span className={`text-gray-600 ${timeInfo.isOverdue ? 'text-red-600 font-medium' : ''}`}>
                  {timeInfo.isOverdue ? 'Overdue' : `${timeInfo.daysRemaining} days remaining`}
                </span>
              </div>
              <Progress 
                value={timeProgress} 
                className={`h-2 ${timeInfo.isOverdue ? '[&>div]:bg-red-500' : ''}`} 
              />
            </>
          )}
        </div>

        {/* Tasks List */}
        {sprint.tasks && sprint.tasks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Tasks</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {sprint.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => onEditTask(task)}
                >
                  <span className="truncate">{task.titre}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      task.statut === 'Terminé' ? 'bg-green-100 text-green-800' :
                      task.statut === 'Schedule' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {task.statut.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sprint Details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <div>
              <p className="font-medium">Start Date</p>
              <p>{startDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <div>
              <p className="font-medium">End Date</p>
              <p>{endDate.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Task Summary */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="mr-2 h-4 w-4" />
            <span>{sprint.tasks?.length || 0} tasks</span>
          </div>
          {hasPermission('cree tasks') && (<Button 
            size="sm" 
            variant="outline" 
            onClick={() => onCreateTask(sprint.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>)}
        </div>

        {/* Velocity Indicator */}
        {sprint.status === 'active' && (
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Velocity</span>
              <span className={`font-medium ${
                progress >= timeProgress ? 'text-green-600' : 'text-red-600'
              }`}>
                {progress >= timeProgress ? 'On Track' : 'Behind Schedule'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};