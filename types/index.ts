export interface User {
  id: number;
  name: string;
  email: string;
  telephone?: string;
  matricule?: string;
  roles:Role[];
  poste?: string;
  permissions?:Permission[];
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission{
  id: number;
  name: string;
}

export interface Privilege {
  id: number;
  name: string;
}

export interface Role{
  id:number;
  name: string;
  permissions : Privilege[];
}

export interface AddUser{
  name: string;
  email: string;
  telephone?: string;
  poste?: string;
  matricule:string;
  role:string;
}

export interface Project {
  id: number;
  nom: string;
  description: string;
  date_debut: string;
  date_fin: string;
  status: 'en_cours' | 'en_attente' | 'termine';
  chef_projet_id: number;
  created_at: string;
  updated_at: string;
  sprints?: Sprint[];
  tasks?: Task[];
  chefProjet?: User;
}

export interface Task {
  id: number;
  titre: string;
  description: string;
  statut: 'Future' | 'retard' | 'Schedule' | 'Terminé';
  assigner_a?: string;
  sprint_id: number;
  created_at: string;
  updated_at: string;
  developpeur?: User;
  sprint?: Sprint;
}

export interface Sprint {
  id: number;
  nom: string;
  description: string;
  date_debut: string;
  date_fin: string;
  projet_id: number;
  status?: 'planned' | 'active' | 'completed'; // Calculated field
  manually_completed?: boolean;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
  projet?: Project;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  telephone?: string;
  matricule?: string;
  poste?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}


export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}