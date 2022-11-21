import { FC } from "react";
import { useForm } from "react-hook-form";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import { Customer } from "types";
import * as yup from "yup";

type Props = Customer & {
  isNew: boolean;

  onSave: (value) => void;
};

const schema = yup.object().shape({
  companyName: yup.string().required("Required"),
  connectUserName: yup.string().required("Required"),
  connectUserEmail: yup.string().email().required("Required"),
  type: yup.string(),
  plan: yup.string(),
  domain: yup.string().required("Required"),
});

type FormData = {
  companyName: string;
  connectUserName: string;
  connectUserEmail: string;
  type?: string;
  plan?: string;
  domain: string;
};

const CustomerInfoForm: FC<Props> = (props) => {
  const {
    id,
    companyName,
    connectUserName,
    connectUserEmail,
    type,
    plan,

    appliedAt,
    startedAt,
    updatedAt,
    onSave,
  } = props;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName,
      connectUserName,
      connectUserEmail,
      type,
      plan,
      domain: id,
    },
  });

  const onSubmit = (d) => {
    onSave({ ...props, ...d, id: d.domain });
  };

  return (
    <>
      <DevTool control={control} />
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Information</h3>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="companyName" className="label">
                  Company name
                </label>
                <input
                  id="companyName"
                  className="input input-bordered"
                  placeholder="??? Company"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p role="alert" className="text-red-700">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="connectUserName" className="label">
                  connectUserName
                </label>
                <input
                  id="connectUserName"
                  className="input input-bordered"
                  placeholder="FirstName LastName"
                  {...register("connectUserName")}
                />
                {errors.connectUserName && (
                  <p role="alert" className="text-red-700">
                    {errors.connectUserName.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="connectUserEmail" className="label">
                  connectUserEmail
                </label>
                <input
                  id="connectUserEmail"
                  className="input input-bordered"
                  placeholder="user@example.com"
                  {...register("connectUserEmail")}
                />

                {errors.connectUserEmail && (
                  <p role="alert" className="text-red-700">
                    {errors.connectUserEmail.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 form-control">
                <label htmlFor="type" className="label">
                  type
                </label>
                <select
                  id="type"
                  className="input input-bordered"
                  placeholder="type"
                  {...register("type")}
                >
                  <option value={undefined}>empty</option>
                  <option value="trial">trial</option>
                  <option value="paid">paid</option>
                  <option value="leave">leave</option>
                </select>

                {errors.type && (
                  <p role="alert" className="text-red-700">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 ">
                <label htmlFor="plan" className="label">
                  plan
                </label>
                <select
                  id="plan"
                  className="input input-bordered"
                  placeholder="plan"
                  {...register("plan")}
                >
                  <option value={undefined}>empty</option>
                  <option value="standard">standard</option>
                </select>

                {errors.plan && (
                  <p role="alert" className="text-red-700">
                    {errors.plan.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="domain" className="label">
                  domain
                </label>
                <input
                  id="domain"
                  className="input input-bordered"
                  placeholder="???.mojito.work"
                  {...register("domain")}
                  // disabled={!isNew}
                />

                {errors.domain && (
                  <p role="alert" className="text-red-700">
                    {errors.domain.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="connectionString" className="label">
                  Applied Date
                </label>
                <span className="TODO:">{appliedAt}</span>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="connectionString" className="label">
                  Started Date
                </label>
                <span className="TODO:">{startedAt}</span>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="connectionString" className="label">
                  Updated Date
                </label>
                <span className="TODO:">{updatedAt}</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CustomerInfoForm;
