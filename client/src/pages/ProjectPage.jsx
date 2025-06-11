import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// fetches
import { fetchTasksByProject } from '../api/tasks.js';
import { fetchProjectByDocumentId } from '../api/projects.js';

// components
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';

// styles
import '../styles/main.css';


export default function ProjectPage() {
  const { documentId } = useParams({ strict: false });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  
  // First get the project to get the numeric ID
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', documentId],
    queryFn: () => fetchProjectByDocumentId(documentId),
    enabled: !!documentId,
  });

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', documentId],
    queryFn: () => fetchTasksByProject(documentId),
    enabled: !!documentId,
  });

  const grouped = {
    Todo: [],
    'In progress': [],
    'In review': [],
    Done: [],
  };
  tasks?.forEach(task => {
    if (task) {
      const status = task.taskStatus?.statusName || 'Backlog';

      // Skip Backlog tasks, only show tasks in other columns
      if (status !== 'Backlog' && grouped[status]) {
        grouped[status].push(task);
      }
    }
  });

  if (projectLoading || isLoading) return <p>Loading...</p>;
  if (error) return <p>Fout bij laden van taken</p>;
  if (!project) return <p>Project niet gevonden</p>;

  return (
    <div className="project-page">
      <div className="project-header">
        <h2>{project?.projectName || 'Project Board'}</h2>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      </div>

      {showForm && project && (
        <div className="form-overlay">
          <TaskForm
            projectId={project.id}
            projectDocumentId={documentId}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {selectedTask && <TaskDialog task={selectedTask} onClose={() => setSelectedTask(null)} />}

      <div className="kanban-board">
        {Object.entries(grouped).map(([status, list]) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {list.length === 0 && <div className="empty-column">No tasks</div>}
            {list.map(task => (
              <div
                key={task.id}
                className="kanban-card"
                onClick={() => {
                  console.log('Task clicked:', task);
                  setSelectedTask(task);
                }}
              >
                <h4>{task.taskTitle}</h4>
                <p>
                  {!task.taskDescription
                    ? 'No description'
                    : typeof task.taskDescription === 'string'
                      ? task.taskDescription
                      : 'Click to view description'}
                </p>
                <div className="task-meta">
                  <span className="task-id">ID: {task.id}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
