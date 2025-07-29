import api from './api';
import { Sprint } from '@/types';
import { calculateSprintStatus } from '@/utils/sprintUtils';

export const sprintService = {
  async getSprints(): Promise<Sprint[]> {
    const response = await api.get('/sprints');
    
    // Auto-calculate sprint statuses based on dates
    const sprintsWithCalculatedStatus = response.data.map((sprint: Sprint) => ({
      ...sprint,
      status: calculateSprintStatus(sprint.date_debut, sprint.date_fin, sprint.manually_completed ? 'completed' : sprint.status)
    }));
    
    return sprintsWithCalculatedStatus;
  },

  async getSprint(id: string): Promise<Sprint> {
    const response = await api.get(`/sprints/${id}`);
    
    // Auto-calculate sprint status based on dates
    const sprintWithCalculatedStatus = {
      ...response.data,
      status: calculateSprintStatus(response.data.date_debut, response.data.date_fin, response.data.manually_completed ? 'completed' : response.data.status)
    };
    
    return sprintWithCalculatedStatus;
  },

  async createSprint(data: Partial<Sprint>): Promise<Sprint> {
    // Auto-calculate status before sending to API
    const sprintData = {
      ...data,
      status: data.date_debut && data.date_fin ? calculateSprintStatus(data.date_debut, data.date_fin) : 'planned'
    };
    
    const response = await api.post('/sprints', sprintData);
    return response.data;
  },

  async updateSprint(id: number, data: Partial<Sprint>): Promise<Sprint> {
    // Auto-calculate status if dates are being updated
    const sprintData = {
      ...data,
      status: data.date_debut && data.date_fin ? calculateSprintStatus(data.date_debut, data.date_fin, data.manually_completed ? 'completed' : data.status) : data.status
    };
    
    const response = await api.put(`/sprints/${id}`, sprintData);
    return response.data;
  },

  async deleteSprint(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/sprints/${id}`);
    return response.data;
  }
};