import { updateTask } from "modules/task/apis/task";

import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

import { useRouter } from "next/router";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import dayjs from "dayjs";
import { isString } from "lodash";
import { Task } from "types";
import * as yup from "yup";

import { safeJSONparse } from "utils/json";

import StatusTag from "../StatusTag/StatusTag";

type Props = Task;

const schema = yup.object().shape({
  type: yup.string().required("Required"),
  httpRequest: yup.string().required("Required"),
  scheduledStartedAt: yup.string().required("Required"),
});

const TaskUpdateForm: FC<Props> = (props) => {
  const { id, name, state, host, type, httpRequest, scheduledStartedAt } = props;

  const router = useRouter();
  const queryClient = useQueryClient();

  const requestString = isString(httpRequest)
    ? JSON.stringify(safeJSONparse(httpRequest), null, 2)
    : JSON.stringify(httpRequest, null, 2);

  const scheduledStartedAtString = dayjs(scheduledStartedAt).format("YYYY-MM-DDTHH:mm");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type,
      httpRequest: requestString,
      scheduledStartedAt: scheduledStartedAtString,
    },
  });

  const updateTaskMutation = useMutation(updateTask, {
    onSuccess: async () => {
      await toast.success("Task updated");
      queryClient.refetchQueries(["tasks", id]);
      router.push(`/tasks/${id}`);
    },
    onError: async () => {
      await toast.error("Failed to update task");
    },
  });

  const onSubmit = (d) => {
    const newTask = {
      ...props,
      ...d,
      scheduledStartedAt: dayjs(d.scheduledStartedAt).toISOString(),
      state: "scheduled",
    };

    updateTaskMutation.mutate({ id, ...newTask });
  };

  return (
    <>
      <DevTool control={control} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              <StatusTag value={state} />
            </p>
          </div>
          <div className="border-t border-gray-200 py-6 px-4 space-y-6 sm:p-6">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">id</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{id}</dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">host</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a className="text-indigo-600" href={`https://${host}`}>
                    {host}
                  </a>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  <label htmlFor="type" className="label">
                    type
                  </label>
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    id="type"
                    name="type"
                    {...register("type")}
                    className="input input-bordered"
                  />

                  {errors.type && (
                    <p role="alert" className="text-red-700">
                      {errors.type.message}
                    </p>
                  )}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  <label htmlFor="httpRequest" className="label">
                    httpRequest
                  </label>
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2  overflow-x-auto">
                  <textarea
                    id="httpRequest"
                    name="httpRequest"
                    rows={7}
                    className="textarea textarea-bordered w-full"
                    {...register("httpRequest")}
                  />
                  {errors.httpRequest && (
                    <p role="alert" className="text-red-700">
                      {errors.httpRequest.message}
                    </p>
                  )}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">scheduledStartedAt</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    id="scheduledStartedAt"
                    name="scheduledStartedAt"
                    type="datetime-local"
                    {...register("scheduledStartedAt")}
                    className="input input-bordered w-auto"
                  />

                  {errors.scheduledStartedAt && (
                    <p role="alert" className="text-red-700">
                      {errors.scheduledStartedAt.message}
                    </p>
                  )}
                </dd>
              </div>
            </dl>
            <div className="text-right space-x-4">
              <button
                disabled={updateTaskMutation.isLoading}
                type="submit"
                className="btn btn-primary"
              >
                save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TaskUpdateForm;
