import { useQuery } from "react-query";
import { useRouter } from "next/dist/client/router";

import TaskDetail from "components/TaskDetail";
import { readTask } from "modules/task/apis/task";
import { Task } from "types";

const TaskPage = () => {
  const router = useRouter();

  const { id } = router.query;
  const isNew = id === "new";

  const query = useQuery<Task, Error>(["tasks", id], async () => {
    if (!isNew) {
      const data = await readTask(id as string);
      return data;
    }
    return null;
  });

  if (query.isLoading) return "Loading...";

  if (query.error) return `An error has occurred: ${query.error.message}`;

  return <TaskDetail {...query.data} />;
};

export default TaskPage;
