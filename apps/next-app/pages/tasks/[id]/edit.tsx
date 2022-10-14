import { readTask } from "modules/task/apis/task";

import { FC } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/dist/client/router";

import { Task } from "types";

import TaskUpdateForm from "components/TaskUpdateForm/TaskUpdateForm";

const TaskUpdatePage: FC = () => {
  const router = useRouter();

  const { id } = router.query;

  const query = useQuery<Task, Error>(["tasks", id], async () => {
    const data = await readTask(id as string);
    return data;
  });

  if (query.isLoading) return <>Loading...</>;

  if (query.error) return <>An error has occurred: ${query.error.message}</>;

  return <TaskUpdateForm {...query.data} />;
};

export default TaskUpdatePage;
