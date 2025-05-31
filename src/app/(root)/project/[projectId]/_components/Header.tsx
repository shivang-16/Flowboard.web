import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { tags, users } from './data';

interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  tasks: string[];
  analytics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };
  statuses: { label: string; value: number }[];
  updatedAt: string;
  createdAt: string;
}

interface HeaderProps {
  project: Project | null;
}

export const Header: React.FC<HeaderProps> = ({ project }) => {
  console.log(project, "here");
  return (
    <div className="mb-3">
      {/* Upper part with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-t-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
              <span>Tasks</span>
              <span>/</span>
              <span>{project?.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">{project?.name}</h1>
              <button className="text-sm text-white/80 hover:text-white">Change</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-2">
                {users.map((user) => (
                  <img
                    key={user.id}
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-white/10"
                  />
                ))}
              </div>
              <button className="px-3 py-1.5 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                Invite member
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lower part with glass-like effect */}
      <div className="bg-[#17161c] backdrop-blur-md rounded-b-3xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">Priority</span>
              <span className="px-2 py-1 text-sm bg-white/10 text-white rounded">High</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white/80">Tags</span>
              <div className="flex gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`px-2 py-1 text-sm rounded bg-white/10 text-white`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Type to search..."
                className="pl-9 pr-4 py-2 w-64 text-sm bg-white/10 border-none text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};