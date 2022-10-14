import { FC } from "react";
import { useForm, useWatch } from "react-hook-form";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import { TaskDefinition } from "types";
import * as yup from "yup";

const MethodSelect = ({ control, register, errors }) => {
  const type = useWatch({
    control,
    name: "type",
  });

  return (
    <div>
      <select
        id="bodyMethod"
        key={type}
        className="input input-bordered"
        {...register("httpRequest.body.method", { required: "Method is Required" })}
      >
        {type === "http" ? (
          <>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </>
        ) : (
          <>
            <option value="runTask">runTask</option>
            <option value="runTask2">runTask2</option>
            <option value="runTask3">runTask3</option>
          </>
        )}
      </select>
      <div>{errors.httpRequest?.body?.method && errors.httpRequest?.body?.method.message}</div>
    </div>
  );
};

type Props = {
  value?: TaskDefinition;

  onSave: (value) => void;
  onDelete: (id) => void;
};

const schema = yup.object().shape({
  description: yup.string().required("Required"),
  cronExpression: yup.string().required("Required"),
  type: yup.string().required("Required"),
  httpRequest: yup.object().shape({
    body: yup.object().shape({
      api: yup.string().required("Required"),
      method: yup.string().required("Required"),
      params: yup.string(),
    }),
  }),
  activated: yup.boolean().required("Required"),
});

type FormData = {
  description: string;
  cronExpression: string;
  type: string;
  httpRequest: {
    body: {
      api: string;
      method: string;
      params?: string;
    };
  };
  activated: boolean;
};

const TaskDefinitionForm: FC<Props> = (props) => {
  const { value: originalValue, onSave, onDelete } = props;
  const definition = originalValue || {
    id: "",
    description: "",
    cronExpression: "",
    type: "http",
    httpRequest: {
      body: { api: "", method: "PUT", params: "" },
    },
    activated: false,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: definition.description,
      cronExpression: definition.cronExpression,
      type: definition.type ?? "http",
      httpRequest: {
        body: {
          api: definition.httpRequest?.body?.api,
          method: definition.httpRequest?.body?.method,
          params: definition.httpRequest?.body?.params,
        },
      },
      activated: definition.activated,
    },
  });

  const onSubmit = async (value) => {
    await onSave({
      ...props.value,
      ...value,
    });
  };

  return (
    <>
      <DevTool control={control} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic</h3>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="description" className="label">
                  Description
                </label>
                <input
                  id="description"
                  className="input input-bordered"
                  {...register("description")}
                />
                {errors.description && (
                  <p role="alert" className="text-red-700">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="cronExpression" className="label">
                  cron expression
                </label>
                <input
                  id="cronExpression"
                  className="input input-bordered"
                  {...register("cronExpression")}
                />

                {errors.cronExpression && (
                  <p role="alert" className="text-red-700">
                    {errors.cronExpression.message}
                  </p>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="type" className="label">
                  type
                </label>
                <select
                  id="type"
                  className="input input-bordered"
                  {...register("type", {
                    onChange: (e) => {
                      const val = e.target.value;
                      if (val === "http") {
                        setValue("httpRequest.body.method", "PUT");
                      } else {
                        setValue("httpRequest.body.method", "runTask");
                      }
                    },
                  })}
                >
                  <option value="http">http</option>
                  <option value="methodInvoke">methodInvoke</option>
                </select>

                {errors.type && (
                  <p role="alert" className="text-red-700">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-2 form-control">
                <label htmlFor="bodyApi" className="label">
                  api
                </label>
                <input
                  id="bodyApi"
                  className="input input-bordered"
                  {...register("httpRequest.body.api")}
                />

                {errors.httpRequest?.body?.api && (
                  <p role="alert" className="text-red-700">
                    {errors.httpRequest?.body?.api?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-1 form-control">
                <label htmlFor="bodyMethod" className="label">
                  method
                </label>

                <MethodSelect control={control} register={register} errors={errors} />

                {errors.httpRequest?.body?.method && (
                  <p role="alert" className="text-red-700">
                    {errors.httpRequest?.body?.method?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="params" className="label">
                  params
                </label>
                <input
                  id="params"
                  className="input input-bordered"
                  {...register("httpRequest.body.params")}
                />

                {errors.httpRequest?.body?.params && (
                  <p role="alert" className="text-red-700">
                    {errors.httpRequest?.body?.params?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <span className="label">Activated</span>
                {/* TODO: 搞一个 switch UI 很棒 */}
                <label htmlFor="activated" className=" ml-2">
                  <input
                    id="activated"
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register("activated")}
                  />
                </label>
                {errors.activated && (
                  <p role="alert" className="text-red-700">
                    {errors.activated.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right space-x-4">
            {definition.id && (
              <button
                type="button"
                className="btn btn-error"
                onClick={() => onDelete(definition.id)}
              >
                delete
              </button>
            )}

            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TaskDefinitionForm;
