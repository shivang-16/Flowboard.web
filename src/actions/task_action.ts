import { getCookie } from "./get_cookie";

export const createTask = async (task: any) => {
    const token = await getCookie("token");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            credentials: "include",
            body: JSON.stringify(task),
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error deleting task: ${(error as Error).message}`);
    }
};

export const getTasks = async () => {
  const token = await getCookie("token");
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      credentials: "include"
    });
    return await res.json();
  } catch (error) {
    throw new Error(`Error getting tasks: ${(error as Error).message}`);
  }
};

export const getTasksByProjectId = async (projectId: string) => {
    const token = await getCookie("token");
    console.log(token , "here is the token ");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/project/${projectId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            credentials: "include"
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error deleting task: ${(error as Error).message}`);
    }
};

export const updateTask = async (id:string, updates: any) => {
    const token = await getCookie("token");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            credentials: 'include',
            body: JSON.stringify(updates),
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error deleting task: ${(error as Error).message}`);
    }
};

export const deleteTask = async (id: string) => {
    const token = await getCookie("token");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            credentials: "include"
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error deleting task: ${(error as Error).message}`);
    }
};