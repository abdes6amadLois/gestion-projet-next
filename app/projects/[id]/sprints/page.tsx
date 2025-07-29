'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SprintCard } from '@/components/sprints/SprintCard';
import { CreateSprintDialog } from '@/components/sprints/CreateSprintDialog';
import { EditSprintDialog } from '@/components/sprints/EditSprintDialog';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sprint, Project, Task } from '@/types';
import { Plus, ArrowLeft, Calendar, Target, TrendingUp } from 'lucide-react';
import { calculateSprintStatus } from '@/utils/sprintUtils';
import { projectService } from '@/services/projectService';
import { sprintService } from '@/services/sprintService';
import { taskService } from '@/services/taskService';
import { toast } from 'sonner';
import { hasPermission } from '@/utils/permissions';


export default function SprintsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const projectId = Number(id);
  
  const [project, setProject] = useState<Project | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateSprintDialogOpen, setIsCreateSprintDialogOpen] = useState(false);
  const [isEditSprintDialogOpen, setIsEditSprintDialogOpen] = useState(false);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSprintForTask, setSelectedSprintForTask] = useState<number>();

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projectData, sprintsData] = await Promise.all([
        projectService.getProject(projectId),
        projectService.getProjectSprints(projectId)
      ]);
      
      setProject(projectData.data);
      
      // Filter sprints for this project and calculate status
      const projectSprints = sprintsData.data
        // .filter(sprint => sprint.projet_id === projectId)
        .map(sprint => ({
          ...sprint,
          status: calculateSprintStatus(sprint.date_debut, sprint.date_fin, sprint.status)
        }));
      
      setSprints(projectSprints);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSprint = async (sprintData: Partial<Sprint>) => {
    try {
      const newSprint = await sprintService.createSprint({
        ...sprintData,
        projet_id: projectId,
      });
      setSprints(prev => [newSprint, ...prev]);
      setIsCreateSprintDialogOpen(false);
      toast.success('Sprint created successfully');
    } catch (error) {
      console.error('Failed to create sprint:', error);
      toast.error('Failed to create sprint');
    }
  };

  const handleEditSprint = async (id: number, sprintData: Partial<Sprint>) => {
    try {
      const updatedSprint = await sprintService.updateSprint(id, sprintData);
      setSprints(prev => prev.map(s => s.id === id ? updatedSprint : s));
      setIsEditSprintDialogOpen(false);
      setSelectedSprint(null);
      toast.success('Sprint updated successfully');
    } catch (error) {
      console.error('Failed to update sprint:', error);
      toast.error('Failed to update sprint');
    }
  };

  const handleDeleteSprint = async (sprint: Sprint) => {
    if (!confirm('Are you sure you want to delete this sprint?')) return;
    
    try {
      await sprintService.deleteSprint(sprint.id);
      setSprints(prev => prev.filter(s => s.id !== sprint.id));
      toast.success('Sprint deleted successfully');
    } catch (error) {
      console.error('Failed to delete sprint:', error);
      toast.error('Failed to delete sprint');
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      // Update the sprint with the new task
      setSprints(prev => prev.map(sprint => 
        sprint.id === taskData.sprint_id 
          ? { ...sprint, tasks: [...(sprint.tasks || []), newTask] }
          : sprint
      ));
      setIsCreateTaskDialogOpen(false);
      setSelectedSprintForTask(0);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleEditTask = async (id: number, taskData: Partial<Task>) => {
    try {
      
      const updatedTask = await taskService.updateTask(id, taskData);
      // Update the task in the sprint
      setSprints(prev => prev.map(sprint => ({
        ...sprint,
        tasks: sprint.tasks?.map(task => task.id === id ? updatedTask : task) || []
      })));
      setIsEditTaskDialogOpen(false);
      setSelectedTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const openEditSprintDialog = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setIsEditSprintDialogOpen(true);
  };

  const openCreateTaskDialog = (sprintId: number) => {
    setSelectedSprintForTask(sprintId);
    setIsCreateTaskDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskDialogOpen(true);
  };

  const activeSprint = sprints.find(sprint => sprint.status === 'active');
  const completedSprints = sprints.filter(sprint => sprint.status === 'completed');
  const plannedSprints = sprints.filter(sprint => sprint.status === 'planned');

  const totalTasks = sprints.reduce((acc, sprint) => acc + (sprint.tasks?.length || 0), 0);
  const completedTasks = sprints.reduce((acc, sprint) => 
    acc + (sprint.tasks?.filter(task => task.statut === 'Terminé').length || 0), 0
  );
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/projects')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project?.nom} - Sprints
            </h1>
            <p className="text-gray-600">{project?.description}</p>
          </div>
          {hasPermission('creer_projet') && (<Button onClick={() => setIsCreateSprintDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Sprint
          </Button>)}
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sprints</p>
                  <p className="text-2xl font-bold text-gray-900">{sprints.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedSprints.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-sm font-bold text-gray-900">{Math.round(overallProgress)}%</p>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Sprint */}
        {activeSprint && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Active Sprint
            </h2>
            <SprintCard
              sprint={activeSprint}
              onEdit={openEditSprintDialog}
              onDelete={handleDeleteSprint}
              onCreateTask={openCreateTaskDialog}
              onEditTask={openEditTaskDialog}
              isActive={true}
            />
          </div>
        )}

        {/* Planned Sprints */}
        {plannedSprints.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Planned Sprints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedSprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  onEdit={openEditSprintDialog}
                  onDelete={handleDeleteSprint}
                  onCreateTask={openCreateTaskDialog}
                  onEditTask={openEditTaskDialog}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Sprints */}
        {completedSprints.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              Completed Sprints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedSprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  onEdit={openEditSprintDialog}
                  onDelete={handleDeleteSprint}
                  onCreateTask={openCreateTaskDialog}
                  onEditTask={openEditTaskDialog}
                />
              ))}
            </div>
          </div>
        )}

        {sprints.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sprints yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first sprint</p>
                {hasPermission('creer_projet') && (<Button onClick={() => setIsCreateSprintDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sprint
                </Button>)}
              </div>
            </CardContent>
          </Card>
        )}

        {hasPermission('cree tasks') && (<CreateSprintDialog
          isOpen={isCreateSprintDialogOpen}
          onClose={() => setIsCreateSprintDialogOpen(false)}
          onSubmit={handleCreateSprint}
          projectId={projectId}
        />)}

        {hasPermission('cree tasks') && (<EditSprintDialog
          isOpen={isEditSprintDialogOpen}
          onClose={() => {
            setIsEditSprintDialogOpen(false);
            setSelectedSprint(null);
          }}
          onSubmit={handleEditSprint}
          sprint={selectedSprint}
        />)}

        {hasPermission('cree tasks') && (<CreateTaskDialog
          isOpen={isCreateTaskDialogOpen}
          onClose={() => {
            setIsCreateTaskDialogOpen(false);
            setSelectedSprintForTask(0);
          }}
          onSubmit={handleCreateTask}
          sprintId={Number(selectedSprintForTask)}
        />)}

        <EditTaskDialog
          isOpen={isEditTaskDialogOpen}
          onClose={() => {
            setIsEditTaskDialogOpen(false);
            setSelectedTask(null);
          }}
          onSubmit={handleEditTask}
          task={selectedTask}
        />
      </div>
    </DashboardLayout>
  );
}