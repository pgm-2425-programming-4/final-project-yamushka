import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Backlog from "./Backlog";
import Pagination from "./Pagination";
import "../../design/css/reset.css";
import "../../design/css/main.css";

export default function PaginatedBacklog() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["backlogTasks"],
    queryFn: async () => {
        const res = await axios.get(
          "http://localhost:1337/api/tasks?filters[taskStatus][statusName][$eq]=Backlog&populate=taskStatus&pagination[page]=1&pagination[pageSize]=10"
        );
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <section className="backlog-view active">
      <div className="backlog-container">
        <Backlog tasks={data.data} />
        {}
        <Pagination meta={data.meta.pagination} />
      </div>
    </section>
  );
}
