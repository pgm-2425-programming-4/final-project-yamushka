import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchTasksByProject } from '../api/tasks.js';
import './kanbanBoard.css';

export default function ProjectPage() {
  const { documentId } = useParams({ strict: false });

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
    Backlog: [],
    Todo: [],
    'In progress': [],
    'In review': [],
    Done: [],
  };

  tasks?.forEach(task => {
    const status = task.attributes.taskStatus?.data?.attributes?.statusName || 'Backlog';
    if (grouped[status]) {
      grouped[status].push(task);
    }
  });

  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Fout bij laden van taken</p>;

  return (
    <div className="kanban-board">
      {Object.entries(grouped).map(([status, list]) => (
        <div key={status} className="kanban-column">
          <h3>{status}</h3>
          {list.map(task => (
            <div key={task.id} className="kanban-card">
              <h4>{task.attributes.taskTitle}</h4>
              <p>{task.attributes.taskDescription || 'Geen beschrijving'}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
