
export type Priority = 'high' | 'medium' | 'low';

  
export interface IUser {
  _id: string
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  salt: string;
  avatar?: any;
  };

export interface Task {
  _id: string;
  name: string;
  description: string;
  createdBy: any;
  assignedTo?: any;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  order: number;
}
