import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStatuses } from '../api/status/fetchStatuses';
import { fetchLabels } from '../api/label/fetchLabels';

// Gedeelde hook voor status en label data
export const useFormData = () => {
  const {
    data: statuses,
    isLoading: statusesLoading,
    error: statusesError,
  } = useQuery({
    queryKey: ['statuses'],
    queryFn: fetchStatuses,
  });

  const {
    data: labels,
    isLoading: labelsLoading,
    error: labelsError,
  } = useQuery({
    queryKey: ['labels'],
    queryFn: fetchLabels,
  });

  return {
    statuses,
    statusesLoading,
    statusesError,
    labels,
    labelsLoading,
    labelsError,
  };
};

// Gedeelde label toggle functie
export const useLabelToggle = (initialLabels = []) => {
  const [selectedLabels, setSelectedLabels] = useState(initialLabels);

  const handleLabelToggle = labelId => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  return { selectedLabels, setSelectedLabels, handleLabelToggle };
};
