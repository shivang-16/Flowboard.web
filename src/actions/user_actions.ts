"use server"
import { revalidateTag } from "next/cache";
import { getCookie } from "./get_cookie";


export const registerUser = async(data: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message || "Registration failed");
      }
  
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, message: `Error in registering user: ${error.message}` };
      } else {
        return { success: false, message: "An unknown error occurred while registering user" };
      }
    }
}

export const loginUser = async(data: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      const response = await res.json();
      console.log("here is the user" , response)
  
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in login user: ${error.message}`);
      } else {
        throw new Error(
          "An unknown error occurred while login user"
        );
      }
    }
}


export const getUser = async () => {
    const token = await getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          credentials: "include",
          // cache: "force-cache",
          next: {
            tags: ["userData"],
          },
        }
      );
  
      const data = await res.json();

      return data;
    } catch (error: unknown) {
      console.log(error)
  };
}

export const getAllUsers = async () => {
  const token = await getCookie("token");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        next: {
          tags: ["allUsers"],
        },
      }
    );

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

export const getUsersByProjectId = async (projectId: string) => {
  const token = await getCookie("token");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/project/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        credentials: "include",
        next: {
          tags: [`usersByProject-${projectId}`],
        },
      }
    );

    const data = await res.json();
    console.log(data, "===here is the data");
    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

export const assignUserToTask = async (taskId: string, userId: string) => {
  const token = await getCookie("token");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/assign/task`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({ taskId, userId }),
        credentials: "include",
      }
    );

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};

export const assignUserToProject = async (projectId: string, userId: string) => {
  const token = await getCookie("token");
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/assign/project/${projectId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({ userId }),
        credentials: "include",
      }
    );

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.log(error);
  }
};
