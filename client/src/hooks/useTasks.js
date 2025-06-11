import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants/constants';


function useTasks(projectId, filters = { search: '', status: 'all' }) {

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['projectTasks', projectId],
    queryFn: async () => {
      try {
        if (!projectId) {
          console.log('Geen project ID gevonden');
          return { data: [] };
        }

        const res = await axios.get(
          `${API_URL}/tasks?filters[project][documentId][$eq]=${projectId}&populate=taskStatus`
        );

        console.log(`Project ID: ${projectId}, Aantal taken: ${res.data?.data?.length || 0}`);

        return { data: res.data.data || [] };
      } catch (error) {
        console.error('Error bij ophalen taken:', error);
        return { data: [] };
      }
    },
    enabled: !!projectId,
  });

  // Filter functies
  const getStatusKey = statusName => {
    if (!statusName) return 'todo';

    const mapping = {
      Todo: 'todo',
      'In progress': 'in-progress',
      'In review': 'in-review',
      Done: 'done',
      Backlog: 'backlog',
    };

    return mapping[statusName] || 'todo';
  };

  const filterTasks = tasks => {
    if (!tasks || !Array.isArray(tasks)) return [];

    return tasks.filter(task => {
      if (!task || !task.attributes) return false;

      // Filter op tekst
      if (filters.search) {
        const taskTitle = (
          task.attributes?.taskTitle ||
          task.attributes?.title ||
          ''
        ).toLowerCase();
        const searchText = filters.search.toLowerCase();
        if (!taskTitle.includes(searchText)) {
          return false;
        }
      }

      // Filter op status
      if (filters.status !== 'all') {
        const taskStatusName = task.attributes?.taskStatus?.data?.attributes?.statusName;
        const statusKey = getStatusKey(taskStatusName);
        if (statusKey !== filters.status) {
          return false;
        }
      }

      return true;
    });
  };

  // Groepeer taken per status
  const groupByStatus = tasks => {
    const groups = {
      todo: [],
      'in-progress': [],
      'in-review': [],
      done: [],
    };

    if (!tasks || !Array.isArray(tasks)) {
      console.log('Geen geldige taken om te groeperen:', tasks);
      return groups;
    }

    const filteredTasks = filterTasks(tasks);
    console.log('Taken na filtering:', filteredTasks);

    filteredTasks.forEach(task => {
      if (!task || !task.attributes) return;

      const statusName = task.attributes?.taskStatus?.data?.attributes?.statusName;
      const taskTitle = task.attributes?.taskTitle || task.attributes?.title || 'Untitled';

      console.log(`Verwerken taak: ${taskTitle}`);
      console.log(`  - Status naam: ${statusName || 'undefined'}`);

      // Skip backlog taken
      if (statusName === 'Backlog') {
        console.log(`  - Backlog taak overslaan: ${taskTitle}`);
        return;
      }

      // Gebruik de mapping om de juiste groep te vinden
      const groupKey = getStatusKey(statusName);
      console.log(`  - Geplaatst in groep: ${groupKey}`);

      if (groups[groupKey]) {
        groups[groupKey].push(task);
        console.log(`  - Toegevoegd aan ${groupKey} (totaal: ${groups[groupKey].length})`);
      } else {
        console.log(`  - Onbekende groep: ${groupKey}, toegevoegd aan todo`);
        groups['todo'].push(task);
      }
    });

    console.log('Uiteindelijke groepen:', groups);
    Object.entries(groups).forEach(([key, tasks]) => {
      console.log(`${key}: ${tasks.length} taken`);
    });

    return groups;
  };

  // Bereken de gegroepeerde taken
  const groupedTasks =
    tasksData?.data && Array.isArray(tasksData.data)
      ? groupByStatus(tasksData.data)
      : { todo: [], 'in-progress': [], 'in-review': [], done: [] };

  // Column title mapping
  const columnTitles = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    'in-review': 'Ready for Review',
    done: 'Done',
  };

  // Return alles wat we nodig hebben
  return {
    tasks: tasksData?.data || [],
    groupedTasks,
    columnTitles,
    isLoading,
    getStatusKey,
  };
}

export default useTasks;
