import { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddTaskForm({ projectId }) {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {

      const res = await axios.get(
        `${API_URL}/statuses?filters[statusName][$eq]=Backlog`
      );
      const backlogStatusId = res.data?.data?.[0]?.id;
      if (!backlogStatusId) throw new Error("Backlog status niet gevonden");

      // Nieuwe taak aanmaken
      return axios.post(`${API_URL}/tasks`, {
        data: {
          title,
          project: projectId,
          taskStatus: backlogStatusId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", projectId]);
      setTitle("");
    },
    onError: (err) => {
      console.error("Fout bij taak toevoegen:", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      mutation.mutate();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input
        type="text"
        placeholder="Titel van taak"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
        required
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={mutation.isLoading}
      >
        Toevoegen aan Backlog
      </button>
    </form>
  );
}

export default AddTaskForm;
