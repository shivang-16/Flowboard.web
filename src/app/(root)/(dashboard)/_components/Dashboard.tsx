"use client";

import { useState, useEffect } from "react";
import { createProject, getProjects, updateProject, deleteProject } from "@/actions/project_actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; 
import { Edit, Trash } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 

type Project = {
  _id: string; 
  name: string;
  description?: string;
  owner: string; 
  tasks: string[]; 
  analytics: {
    todoTask: number;
    completedTasks: number;
    inProgressTasks: number;
  };
  updatedAt: string;
  createdAt: string;
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); 
  const router = useRouter(); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        if (res.success) {
          setProjects(res.projects);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Error fetching projects");
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const projectData = { name, description };
      
      let res;
      if (isEditMode && currentProject) {
        res = await updateProject(currentProject._id, projectData);
      } else {
        res = await createProject(projectData);
      }
      
      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setIsEditMode(false);
        setCurrentProject(null);
        // Re-fetch projects to update the list
        const updatedRes = await getProjects();
        if (updatedRes.success) {
          setProjects(updatedRes.projects);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await deleteProject(projectId);
      if (res.success) {
        toast.success(res.message || "Project deleted successfully");
        // Update the projects list
        setProjects(projects.filter(project => project._id !== projectId));
      } else {
        toast.error(res.message || "Failed to delete project");
      }
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Projects</h1>
          <p className="text-sm text-gray-400 mb-6">{projects.length} open &nbsp;</p>
        </div>
        <div className="mb-6">
          <button
            className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => {
              setIsEditMode(false);
              setCurrentProject(null);
              setName("");
              setDescription("");
              setIsModalOpen(true);
            }}
          >
            Create New Project
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-[#161b22] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">{isEditMode ? "Edit Project" : "New Project"}</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
            ></textarea>
            <div className="flex justify-end">
              <button
                className="bg-gray-800 text-white py-2 px-4 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
              onClick={handleCreateProject}
              >
                {isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-[#161b22] border border-gray-700 rounded-xl p-5 animate-pulse"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between text-xs font-medium mb-2">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.length > 0 ? (
            projects.map((project) => {
              const total = project.analytics.todoTask + project.analytics.completedTasks + project.analytics.inProgressTasks + project.analytics.todoTask;
              const donePercent = total > 0 ? (project.analytics.completedTasks / total) * 100 : 0;
              const progressPercent = total > 0 ? ((total - project.analytics.completedTasks - project.analytics.todoTask) / total) * 100 : 0;

              return (
                <div
                  key={project._id}
                  className="bg-[#161b22] border border-gray-700 rounded-xl p-5 hover:shadow-lg hover:shadow-[#1f6feb]/30 transition duration-200 group relative"
                >
                  {/* Edit and Delete buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      className="h-6 w-6 p-0 hover:bg-gray-700 text-gray-400 hover:text-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project._id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-900 hover:text-red-400 text-gray-400"
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div 
                    className="cursor-pointer" 
                    onClick={() => router.push(`/project/${project._id}`)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-semibold text-lg text-white">{project.name}</h2>
                      <span className="text-xs text-gray-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 italic">{project.description || "No description provided"}</p>

                    <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                      <span>📋 {project.analytics.todoTask} to do</span>
                      <span>🚧 {project.analytics.inProgressTasks} in progress</span>
                      <span>✅ {project.analytics.completedTasks} done</span>
                    </div>

                    <div className="w-full h-2 bg-gray-800 rounded-full relative overflow-hidden">
                      {/* To Do segment */}
                      <div
                        className="absolute top-0 left-0 h-full bg-yellow-500" // Yellow for To Do
                        style={{ width: `${(project.analytics.todoTask / total) * 100}%` }}
                      ></div>
                      {/* In Progress segment */}
                      <div
                        className="absolute top-0 h-full bg-purple-500" // Purple for In Progress
                        style={{
                          width: `${(project.analytics.inProgressTasks / total) * 100}%`,
                          left: `${(project.analytics.todoTask / total) * 100}%`,
                        }}
                      ></div>
                      {/* Done segment */}
                      <div
                        className="absolute top-0 h-full bg-green-500" // Green for Done
                        style={{
                          width: `${(project.analytics.completedTasks / total) * 100}%`,
                          left: `${((project.analytics.todoTask + project.analytics.inProgressTasks) / total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">No projects available. Create one!</p>
          )}
        </div>
      )}
    </div>
  );
}
