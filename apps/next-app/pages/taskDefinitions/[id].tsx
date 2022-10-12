import { useQuery } from "react-query";
import { useRouter } from "next/dist/client/router";

import { TaskDefinition } from "types";

import TaskDefinitionDetail from "components/TaskDefinitionDetail";
import { readTaskDefinition } from "modules/task/apis/taskDefinition";

const TaskDefinitionPage = () => {
  const router = useRouter();

  const { id } = router.query;

  const query = useQuery<TaskDefinition, Error>(["taskDefinitions", id], async () => {
    if (id && id !== "new") {
      const data = await readTaskDefinition(id as string);
      return data;
    }
    return null;
  });

  if (query.isLoading) return "Loading...";

  if (query.error) return `An error has occurred: ${query.error.message}`;

  return <TaskDefinitionDetail value={query.data} />;
};

export default TaskDefinitionPage;
