'use client';

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getProjects } from "@/actions/project_actions"; // Import getProjects
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Header } from "./Header";
import { Plus, Minus } from 'lucide-react';
import { useParams } from 'next/navigation'; // Import useParams
import CreateTaskDialog from "./CreateTaskModel";
import { getTasksByProjectId, updateTask } from '@/actions/task_action';
import TaskCard from './TaskCard';
import { Task } from "@/types";

interface Job {
  id: string;
  status: string;
  job: Job[]
}


interface Tasks {
  [key: string]: Task[];
}

// Define Project type based on previous context
interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  tasks: string[]; // Assuming tasks are string IDs
  analytics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  statuses: { label: string; value: number }[]; // Add statuses property
  updatedAt: string;
  createdAt: string;
}

export default function TrackerBoard() { // Remove params from here
  const { projectId }: {projectId: string} = useParams() ; // Use useParams hook to get projectId
  console.log(projectId)
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();

  const [project, setProject] = useState<Project | null>(null); // State for project
  const [tasks, setTasks] = useState<Tasks>({});
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [columnInputValues, setColumnInputValues] = useState<string[]>([]);
  const [jobsCache, setJobsCache] = useState<Job[]>([]);

  console.log(project)

  const [newJob, setNewJob] = useState({
    title: "",
    job_link: "",
    job_type: "",
    apply_link: "",
    job_location: "",
    job_salary: "",
    job_description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnName, setCurrentColumnName] = useState<string>("");

  // Modify initializeTasks to use project statuses
  const initializeTasks = (projectStatuses: { label: string; value: number }[]) => {
    const initialTasks = projectStatuses.reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
      // Preserve existing jobs if column already exists
      acc[statusObj.label] = tasks[statusObj.label] || [];
      return acc;
    }, {});
    setTasks(initialTasks || {});
    setColumnNames(projectStatuses.map(status => status.label) || []);
    setColumnInputValues(projectStatuses.map(status => status.label) || []);
  };

const fetchTasks = async () => {
  try {
    const data = await getTasksByProjectId(projectId);
    if (data?.success && Array.isArray(data.tasks)) {
      const organizedTasks = columnNames.reduce((acc: Tasks, label) => {
        acc[label] = data.tasks.filter((task: { status: string }) => task.status === label);
        return acc;
      }, {});
      setTasks(prev => ({ ...prev, ...organizedTasks }));
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

useEffect(() => {
  const loadProjectAndTasks = async () => {
    try {
      const projectRes = await getProjects(projectId);
      if (projectRes.success && projectRes.project) {
        setProject(projectRes.project);
        initializeTasks(projectRes.project.statuses || []);
        const tasksData = await getTasksByProjectId(projectId);
        if (tasksData?.success && Array.isArray(tasksData.tasks)) {
          const organizedTasks = (projectRes.project.statuses || []).reduce((acc: Tasks, statusObj: { label: string; value: number }) => {
            acc[statusObj.label] = tasksData.tasks.filter((task: { status: string }) => task.status === statusObj.label);
            return acc;
          }, {});
          setTasks(organizedTasks);
        }
      }
    } catch (error) {
      console.error("Error loading project or tasks:", error);
    }
  };
  loadProjectAndTasks();
}, [projectId]);

  useEffect(() => {
    // Only refresh jobs when modal closes (new job added)
    if (!isModalOpen && project) { 
      fetchTasks(); 
    }
  }, [isModalOpen, project]); 

  const handleAddColumn = () => {
    const newColumnName = `new-column-${columnNames.length + 1}`;
    const updatedColumnNames = [...columnNames, newColumnName];

    setTasks({ ...tasks, [newColumnName]: [] });
    setColumnNames(updatedColumnNames);
    setColumnInputValues([...columnInputValues, newColumnName]);

    // TODO: Implement backend action to add status to project
    toast("Column added locally. Backend update needed.");
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    const updatedColumnNames = [...columnNames];
    const oldName = updatedColumnNames[index];
    updatedColumnNames[index] = newName;
    setColumnNames(updatedColumnNames);

    const updatedTasks = { ...tasks, [newName]: tasks[oldName] };
    delete updatedTasks[oldName];
    setTasks(updatedTasks);

    // TODO: Implement backend action to update status name in project
    toast("Column name updated locally. Backend update needed.");
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues = [...columnInputValues];
    updatedInputValues[index] = value;
    setColumnInputValues(updatedInputValues);
  };

  const handleRemoveColumn = (index: number, name: string) => {
    if (tasks[name]?.length > 0) { // Use optional chaining
      toast.error("Cannot remove a column that is not empty");
      return;
    }

    // TODO: Implement backend action to delete status from project
    const updatedTasks = { ...tasks };
    delete updatedTasks[name];
    setTasks(updatedTasks);

    const updatedColumnNames = columnNames.filter((_, i) => i !== index);
    const updatedColumnInputValues = columnInputValues.filter((_, i) => i !== index);
    setColumnNames(updatedColumnNames);
    setColumnInputValues(updatedColumnInputValues);

    toast("Column removed locally. Backend update needed.");
  };

  // console.log(tasks, "here outside tasks");


  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceList = [...tasks[source.droppableId]];
    const destinationList = [...tasks[destination.droppableId]];

    const [removed] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, removed);

    const updatedTasks = {
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    } as Tasks;

    setTasks(updatedTasks);

    // TODO: Implement backend action to update task/job status within the project
    // The current updateJobStatus is user-specific.
    // toast("Task status updated locally. Backend update needed.");

    // The following lines related to updating user job_statuses should be removed or adapted for project statuses
    const data = await updateTask(removed._id, { status: destination.droppableId });
    // await fetchJobs();
    // const updatedStatuses = columnNames.map(label => ({ label, value: updatedTasks[label]?.length || 0 }));
    // updateUser({ job_statuses: updatedStatuses })
    if (data.success) {
      toast.success(data.message || "Status updated");
    } else {
      toast.error(data.error);
      setTasks(tasks);
    }
  };

  return (
    <div className="flex flex-col w-full h-[91vh] overflow-hidden pl-8">
      <Header project={project}/>

      <div className="flex-1 overflow-hidden mt-3">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 w-full h-full overflow-x-auto">
            {columnNames.map((listName, index) => (
              <Droppable droppableId={listName} key={listName}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-w-[300px] max-w-[350px] bg-[#17161c] rounded-3xl p-4 h-full overflow-auto relative group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={columnInputValues[index]}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleColumnNameChange(index, e.currentTarget.value);
                            }
                          }}
                          className="text-sm font-semibold text-gray-300 bg-transparent focus:bg-[#353345] focus:p-1 rounded focus:outline-none"
                        />
                        <span className="text-sm text-gray-500">
                          {tasks[listName]?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 hover:bg-[#353345] rounded transition-colors"
                          onClick={() => {
                            setCurrentColumnName(listName);
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleRemoveColumn(index, listName)}
                          className="p-1 hover:bg-[#353345] rounded transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                {tasks[listName]?.map((task: Task, index: number) => (
                  <Draggable 
                    key={task._id} 
                    draggableId={task._id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <TaskCard 
                          task={task}
                          boardId={projectId}
                          columnId={listName}
                          taskIndex={index}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
            <button
              onClick={handleAddColumn}
              className="p-2 h-10 bg-[#2F2D3B] text-gray-400 hover:bg-[#353345] rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </DragDropContext>
      </div>
      {isModalOpen && (
        <CreateTaskDialog
          open={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
          boardId={projectId}
          columnId={currentColumnName}
        />
      )}
    </div>
  );
}
