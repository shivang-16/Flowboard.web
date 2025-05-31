"use client";

import { useState, useEffect } from "react";
import { createProject, getProjects } from "@/actions/project_actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import useRouter

type Project = {
  _id: string; // Assuming _id from MongoDB
  name: string;
  description?: string;
  owner: string; // Assuming owner is a string ID
  tasks: string[]; // Assuming tasks are string IDs
  analytics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  updatedAt: string;
  createdAt: string;
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
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
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const projectData = { name, description };
      const res = await createProject(projectData);
      if (res.success) {
        toast.success(res.message);
        setIsModalOpen(false);
        setName("");
        setDescription("");
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Projects</h1>
          <p className="text-sm text-gray-400 mb-6">{projects.length} open &nbsp; · &nbsp; {projects.length} closed</p>
        </div>
        <div className="mb-6">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Project
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-[#161b22] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">New Project</h2>
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
                className="bg-red-500 text-white py-2 px-4 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleCreateProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.length > 0 ? (
          projects.map((project) => {
            const total = project.analytics.totalTasks;
            const donePercent = total > 0 ? (project.analytics.completedTasks / total) * 100 : 0;
            const progressPercent = total > 0 ? ((total - project.analytics.completedTasks - project.analytics.overdueTasks) / total) * 100 : 0;

            return (
              <div
                key={project._id}
                className="bg-[#161b22] border cursor-pointer border-gray-700 rounded-xl p-5 hover:shadow-lg hover:shadow-[#1f6feb]/30 transition duration-200"
                onClick={() => router.push(`/project/${project._id}`)} // Add onClick handler
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-lg text-white">{project.name}</h2>
                  <span className="text-xs text-gray-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>

                <p className="text-sm text-gray-500 mb-4 italic">{project.description || "No description provided"}</p>

                <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                  <span>✅ {project.analytics.completedTasks} done</span>
                  <span>🚧 {total - project.analytics.completedTasks - project.analytics.overdueTasks} in progress</span>
                  <span>📋 {project.analytics.overdueTasks} to do</span>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500"
                    style={{ width: `${donePercent}%` }}
                  ></div>
                  <div
                    className="absolute top-0 h-full bg-purple-500"
                    style={{ width: `${progressPercent}%`, left: `${donePercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">No projects available. Create one!</p>
        )}
      </div>
    </div>
  );
}
