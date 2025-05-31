
export type Priority = 'high' | 'medium' | 'low';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

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

export interface Board {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  columns: Column[];
}

export interface BoardStore {
  boards: Board[];
  users: User[];
  currentUser: User;
  addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  addColumn: (boardId: string, column: Omit<Column, 'id' | 'tasks'>) => void;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (boardId: string, columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (boardId: string, columnId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  reorderTask: (boardId: string, columnId: string, taskId: string, newIndex: number) => void;
}
