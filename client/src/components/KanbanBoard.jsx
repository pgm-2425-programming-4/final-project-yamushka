import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants/constants';
import TaskDialog from './TaskDialog';
import AddTaskForm from './AddTaskForm';
import TaskColumn from './TaskColumn';
import TaskFilters from './TaskFilters';
import ProjectHeader from './ProjectHeader';
import useTasks from '../hooks/useTasks';

function KanbanBoard() {
  const { projectId } = useParams();

  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  const { data: statusData } = useQuery({
    queryKey: ['statuses'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${API_URL}/statuses`);
        return res.data.data;
      } catch (error) {
        console.error('Error bij ophalen statussen:', error);
        return [];
      }
    },
  });

  // Haal project informatie op
  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/projects?filters[documentId][$eq]=${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });

  // Haal project gegevens uit de response
  const actualProject = projectData?.data?.[0];
  const actualProjectId = actualProject?.id;
  const projectName = actualProject?.attributes?.name || actualProject?.name;

  const { groupedTasks, columnTitles, isLoading: tasksLoading } = useTasks(projectId, filters);

  // Event handlers
  const handleTaskClick = task => {
    setSelectedTask(task);
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
    });
  };

  return (
    <div className="kanban-wrapper">
      <Sidebar currentProjectId={projectId} />

      <main className="main-content">
        <ProjectHeader
          projectId={projectId}
          projectName={projectName}
          isLoading={projectLoading}
          onAddTask={() => setShowAddTask(true)}
        />

        <TaskFilters filters={filters} onChange={handleFilterChange} onReset={resetFilters} />

        <section className="kanban-board">
          {/* Maak een kolom voor elke status */}
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <TaskColumn
              key={status}
              status={status}
              title={columnTitles[status]}
              tasks={tasks}
              isLoading={tasksLoading}
              onTaskClick={handleTaskClick}
            />
          ))}
        </section>
      </main>

      {/* Dialogen */}
      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          statuses={statusData || []}
        />
      )}

      {showAddTask && (
        <AddTaskForm
          projectId={actualProjectId}
          projectDocumentId={projectId}
          onClose={() => setShowAddTask(false)}
          statuses={statusData || []}
        />
      )}
    </div>
  );
}

export default KanbanBoard;
