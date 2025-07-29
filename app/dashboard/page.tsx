'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { 
  FolderOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await projectService.getProjects();
        setProjects(fetchedProjects.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'en_cours').length;
  const completedProjects = projects.filter(p => p.status === 'termine').length;
  const totalTasks = projects.reduce((acc, project) => acc + (project.tasks?.length || 0), 0);
  const completedTasks = projects.reduce((acc, project) => 
    acc + (project.tasks?.filter(task => task.statut === 'Terminé').length || 0), 0
  );

  const stats = [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      color: 'text-blue-600',
    },
    {
      name: 'Active Projects',
      value: activeProjects,
      icon: Clock,
      color: 'text-green-600',
    },
    {
      name: 'Completed Projects',
      value: completedProjects,
      icon: CheckCircle2,
      color: 'text-purple-600',
    },
    {
      name: 'Task Progress',
      value: `${completedTasks}/${totalTasks}`,
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  const recentProjects = projects.slice(0, 3);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/projects/${project.id}/sprints`)}
                    >
                      <div>
                        <h3 className="font-medium">{project.nom}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          project.status === 'en_cours' ? 'bg-green-100 text-green-800' :
                          project.status === 'termine' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No projects yet</p>
                    <Button onClick={() => router.push('/projects')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push('/projects')}
                >
                  <FolderOpen className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Manage Projects</span>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <span>Team Management</span>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-3" />
                  <span>View Reports</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}