import { useParams } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasksByProject } from '../api/tasks.js';
import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskDialog from '../components/TaskDialog';
import Pagination from '../components/Pagination';
import { createTask } from '../api/createTask';
import '../styles/main.css';
import '../styles/backlog.css';

export default function BacklogPage() {
  const { documentId } = useParams({ strict: false });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingTestTask, setIsCreatingTestTask] = useState(false);
  const [testTaskResult, setTestTaskResult] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', documentId],
    queryFn: () => fetchTasksByProject(documentId),
    enabled: !!documentId,
  });

  // Filter to only show Backlog tasks
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

    //  een taak als een backlog-taak als:
    // 1. De status "Backlog" is, OF
    // 2. Er is geen status toegewezen
    const isBacklogTask = status === 'Backlog' || !status;

    // Extra debug info
    if (isBacklogTask) {
      console.log('🟢 BACKLOG TAAK GEVONDEN:', task.taskTitle);
    }

    // Debuggen: alle statuswaarden tonen
    console.log(
      `Taak ${task.id} "${task.taskTitle}" status: "${status}" -> is backlog? ${isBacklogTask ? 'JA' : 'NEE'}`
    );

    // Tijdelijk: alles tonen op backlog pagina
    // return isBacklogTask;
    return true;
  });

  // Calculate pagination
  const totalBacklogTasks = backlogTasks?.length || 0;
  const itemsPerPage = 10; // Default: 10 items per page

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = backlogTasks?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Handle page change
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    console.log(
      `Changed to page ${pageNumber}, showing tasks ${(pageNumber - 1) * itemsPerPage + 1}-${Math.min(pageNumber * itemsPerPage, totalBacklogTasks)}`
    );
  };

  if (isLoading) return <p>Loading backlog tasks...</p>;
  if (error) return <p>Error loading backlog tasks</p>;

  // Altijd debug info tonen
  console.log('Rendering BacklogPage with:', {
    documentId,
    tasks: tasks?.length || 0,
    backlogTasks: backlogTasks?.length || 0,
    isLoading,
    error: error ? error.toString() : null,
  });

  return (
    <div className="backlog-container">
      <div className="backlog-header">
        <h1>Backlog voor Project {documentId}</h1>
        <h2>Backlog Taken</h2>
        <div className="debug-info">
          <h3>Debug Info:</h3>
          <p>Project ID: {documentId}</p>
          <p>
            Taken geladen:{' '}
            {isLoading
              ? 'Bezig met laden...'
              : tasks
                ? `Ja, ${tasks.length} taken gevonden`
                : 'Nee'}
          </p>
          <p>Backlog taken: {backlogTasks?.length || 0}</p>
          {error && <p className="debug-error">Error: {error.toString()}</p>}

          <div>
            <button
              onClick={async () => {
                setIsCreatingTestTask(true);
                try {
                  const newTask = await createTask({
                    title: `Test taak ${Date.now().toString().slice(-4)}`,
                    description: 'Dit is een automatisch gegenereerde testtaak',
                    projectId: parseInt(documentId),
                    statusId: 2, // Backlog status
                  });
                  console.log('TEST TAAK AANGEMAAKT:', newTask);
                  setTestTaskResult({ success: true, data: newTask });
                  queryClient.invalidateQueries(['tasks', documentId]);
                } catch (err) {
                  console.error('FOUT BIJ AANMAKEN TEST TAAK:', err);
                  setTestTaskResult({ success: false, error: err.toString() });
                } finally {
                  setIsCreatingTestTask(false);
                }
              }}
              disabled={isCreatingTestTask}
              className="test-task-button"
            >
              {isCreatingTestTask ? 'Bezig...' : 'Test taak aanmaken'}
            </button>

            {testTaskResult && (
              <div className={`test-task-result ${testTaskResult.success ? 'success' : 'error'}`}>
                {testTaskResult.success ? (
                  <p>Taak aangemaakt met ID: {testTaskResult.data.id}</p>
                ) : (
                  <p>Fout: {testTaskResult.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          + Add Backlog Task
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <TaskForm
            projectId={parseInt(documentId)}
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
            <p>
              Of gebruik de "Test taak aanmaken" knop hierboven om snel een testtaak aan te maken.
            </p>

            <div className="all-tasks-debug">
              <h4>Alle taken in de database (ongeacht project):</h4>
              {tasks && tasks.length > 0 ? (
                <ul className="all-tasks-list">
                  {tasks.map(task => (
                    <li key={task.id} className="all-tasks-item">
                      <strong>{task.taskTitle}</strong> - Project: {task.project?.name || 'Geen'},
                      Status: {task.taskStatus?.statusName || 'Geen'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Geen taken gevonden in de database.</p>
              )}
            </div>
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
                ? 'No description'
                : typeof task.taskDescription === 'string'
                  ? task.taskDescription
                  : 'Click to view description'}
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
