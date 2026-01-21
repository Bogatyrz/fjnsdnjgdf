'use client';

import { useState } from 'react';
import projects from '@/lib/data/projects.json';
import { Project } from '@/lib/types';

const categories = ['All', 'UI Design', 'Web Design', 'Branding'];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-serif">Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A showcase of my recent work in UI/UX design, web design, and branding projects.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project as Project)}
              className="group cursor-pointer relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <span className="text-white text-3xl font-bold opacity-50 text-center">{project.title}</span>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-6 bg-white">
                <span className="text-sm font-medium text-purple-600">{project.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-[16/9] bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-5xl font-bold opacity-50">{selectedProject.title}</span>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">
                  {selectedProject.category}
                </span>
                {selectedProject.year && (
                  <span className="text-gray-500">{selectedProject.year}</span>
                )}
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
                {selectedProject.title}
              </h2>
              {selectedProject.client && (
                <p className="text-lg text-gray-600 mb-6">
                  Client: <span className="font-semibold">{selectedProject.client}</span>
                </p>
              )}
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {selectedProject.fullDescription || selectedProject.description}
              </p>
              {selectedProject.tags && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
