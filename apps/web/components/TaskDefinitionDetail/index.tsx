import { UserCircleIcon } from "@heroicons/react/outline";
import { FC } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/dist/client/router";

import toast from "react-hot-toast";
import TaskDefinitionForm from "modules/task/components/TaskDefinitionForm";
import { TaskDefinition } from "types";
import {
  createTaskDefinition,
  deleteTaskDefinition,
  updateTaskDefinition,
} from "modules/task/apis/taskDefinition";

const navigation = [
  {
    name: "Basic",
    href: "#Basic",
    icon: UserCircleIcon,
    current: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  value: TaskDefinition;
};

const TaskDefinitionDetail: FC<Props> = (props) => {
  const { value: definition } = props;
  const router = useRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (taskDefinition) => {
      if (definition?.id) {
        await updateTaskDefinition(taskDefinition);
      } else {
        await createTaskDefinition(taskDefinition);
      }
    },
    {
      onSuccess: async () => {
        toast.success("Success");
        queryClient.refetchQueries(["taskDefinitions", definition?.id]);
        router.push("/taskDefinitions");
      },
    }
  );

  const onSave = (value) => {
    mutation.mutate(value);
  };

  const deleteMutation = useMutation(deleteTaskDefinition, {
    onSuccess: () => {
      toast.success("Deleted Success");
      router.push("/taskDefinitions");
    },
  });

  const onDelete = async (id) => {
    await deleteMutation.mutate(id);
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 relative">
      <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3 ">
        <nav className="space-y-1 bg-white shadow rounded-md sticky top-0">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white"
                  : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-indigo-500 group-hover:text-indigo-500"
                    : "text-gray-400 group-hover:text-gray-500",
                  "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <div id="Information">
          <TaskDefinitionForm value={definition} onSave={onSave} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default TaskDefinitionDetail;
