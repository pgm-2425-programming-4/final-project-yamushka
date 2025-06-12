import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchTasksByProject } from '../api/tasks.js';
import { fetchProjectByDocumentId } from '../api/projects.js';
import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';
import Pagination from '../components/Pagination';
import '../styles/main.css';
import '../styles/backlog.css';

export default function BacklogPage() {
  const { documentId } = useParams({ strict: false });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Haal eerst het project op om de naam te krijgen
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

  // Laat alleen backlog taken zien
  const backlogTasks = tasks?.filter(task => {
    if (!task) return false;

    // Debug voor deze specifieke taak
    console.log('Analyseren van taak voor Backlog:', {
      id: task.id,
      taskTitle: task.taskTitle,
      project: task.project ? `ID: ${task.project.id}, Name: ${task.project.name}` : 'GEEN PROJECT',
      taskStatus: task.taskStatus
        ? `ID: ${task.taskStatus.id}, Name: ${task.taskStatus.statusName}`
        : 'GEEN STATUS',
    });

    // Check of de taak een status heeft en of die "Backlog" is
    const status = task.taskStatus?.statusName;

    // Toon altijd ALLE taken op de backlogpagina voor nu (debug)
    const isForCurrentProject = task.project?.id === parseInt(documentId);
    console.log(
      `Taak ${task.id} project check: ${isForCurrentProject ? 'JA' : 'NEE'} (taak project: ${task.project?.id}, huidig: ${documentId})`
    );

    // Een taak als een backlog-taak als:
    // 1. De status "Backlog" is, OF
    // 2. Er is geen status toegewezen
    const isBacklogTask = status === 'Backlog' || !status;

    // Extra debug info
    if (isBacklogTask) {
      console.log('Backlog taak gevonden:', task.taskTitle);
    }

    // Debuggen: alle statuswaarden tonen
    console.log(
      `Taak ${task.id} "${task.taskTitle}" status: "${status}" -> is backlog? ${isBacklogTask ? 'JA' : 'NEE'}`
    );

    // Tijdelijk: alles tonen op backlog pagina
    // return isBacklogTask;
    return true;
  });

  // Bereken paginering
  const totalBacklogTasks = backlogTasks?.length || 0;
  const itemsPerPage = 10; // Standaard: 10 items per pagina

  // Haal huidige pagina items op
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = backlogTasks?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Ga naar andere pagina
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    console.log(
      `Changed to page ${pageNumber}, showing tasks ${(pageNumber - 1) * itemsPerPage + 1}-${Math.min(pageNumber * itemsPerPage, totalBacklogTasks)}`
    );
  };

  if (projectLoading || isLoading) return <p>Backlog taken laden...</p>;
  if (error) return <p>Fout bij laden backlog taken</p>;
  if (!project) return <p>Project niet gevonden</p>;

  return (
    <div className="backlog-container">
      <div className="backlog-header">
        <h1>{project?.name || 'Project'}</h1>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          + Add Backlog Task
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

      <div className="backlog-tasks">
        {totalBacklogTasks === 0 && (
          <div className="empty-backlog">
            <h3>Geen backlog taken gevonden</h3>
            <p>Er zijn momenteel geen taken met de status "Backlog" voor dit project.</p>
            <p>Gebruik de "Add Backlog Task" knop om een nieuwe taak toe te voegen.</p>
          </div>
        )}
        {currentItems.map(task => (
          <div
            key={task.id}
            className="backlog-task-card"
            onClick={() => {
              console.log('Backlog task clicked:', task);
              setSelectedTask(task);
            }}
          >
            <h4>{task.taskTitle}</h4>
            <p>
              {!task.taskDescription
                ? 'Geen beschrijving'
                : typeof task.taskDescription === 'string'
                  ? task.taskDescription
                  : 'Klik om beschrijving te bekijken'}
            </p>
            <div className="task-meta">
              <p>
                <span className="task-meta-label">Task ID:</span> {task.id}
              </p>
              <p>
                <span className="task-meta-label">Project:</span>{' '}
                {task.project ? `${task.project.name} (ID: ${task.project.id})` : 'Geen project'}
              </p>
              <p>
                <span className="task-meta-label">Status:</span>{' '}
                {task.taskStatus
                  ? `${task.taskStatus.statusName} (ID: ${task.taskStatus.id})`
                  : 'Geen status'}
              </p>
            </div>
          </div>
        ))}

        {totalBacklogTasks > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalBacklogTasks}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
