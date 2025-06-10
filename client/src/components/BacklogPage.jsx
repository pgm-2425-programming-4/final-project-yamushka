import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants/constants';

export default function BacklogPage() {
  const { projectId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['backlogTasks', projectId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/tasks?filters[project][id][$eq]=${projectId}&filters[taskStatus][statusName][$eq]=Backlog&populate=taskStatus,tags&pagination[page]=1&pagination[pageSize]=10`
      );
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const tasks = data.data;
  const pagination = data.meta.pagination;

  return (
    <main className="main-content">
      <h2>Backlog for project {projectId}</h2>
      <p>Total tasks: {pagination.total}</p>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.attributes.taskTitle || task.attributes.title || 'Untitled Task'}</td>
              <td>{task.attributes.taskStatus?.data?.attributes?.statusName || 'Unknown'}</td>
              <td>
                {task.attributes.tags?.data.map(tag => (
                  <span key={tag.id}>{tag.attributes.name}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
