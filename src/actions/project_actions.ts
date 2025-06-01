'use server'

import { getCookie } from "./get_cookie";

export const createProject = async (project: {name: string, description: string}) => {
    const token = await getCookie("token");
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
            credentials: "include",
            body: JSON.stringify(project),
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error creating project: ${(error as Error).message}`);
    }
};

export const getProjects = async (id?: string) => {
    const token = await getCookie("token");

    try {
        const url = id ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${id}` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
            credentials: "include"
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error creating project: ${(error as Error).message}`);
    }
};

export const updateProject = async (id: string, updates: any) => {
    const token = await getCookie("token");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(updates),
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error creating project: ${(error as Error).message}`);
    }
};

export const deleteProject = async (id: string) => {
    const token = await getCookie("token");

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `token=${token}`,
            },
            credentials: 'include',
        });
        return await res.json();
    } catch (error) {
        throw new Error(`Error creating project: ${(error as Error).message}`);
    }
};
