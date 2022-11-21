import { createAuditLogRequest } from "modules/customer/apis/auditLog";
import { findHosts } from "modules/customer/apis/host";

import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

import { useRouter } from "next/dist/client/router";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const createAuditLogRequestSchema = yup.object().shape({
  domain: yup.string().required("domain is required"),
  startDate: yup.string().required("startDate is required").matches(datePattern, "Not valid date"),
  endDate: yup.string().required("endDate is required").matches(datePattern, "Not valid date"),
});

type CreateAuditLogRequestType = yup.InferType<typeof createAuditLogRequestSchema>;

const AuditLog: FC<unknown> = () => {
  const router = useRouter();
  const queryDomains = useQuery("domains", () => findHosts({ limit: 100 }));
  const domains = queryDomains.data?.items.map((domain) => domain.id) || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAuditLogRequestType>({
    resolver: yupResolver(createAuditLogRequestSchema),
    defaultValues: {
      domain: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (d) => {
    createAuditLogRequest({
      state: "init",
      ...d,
    }).then(() => {
      toast("Success");
      router.push("/auditLogs/");
    });
  };

  return (
    <>
      <DevTool control={control} />
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-3 px-4 space-y-3 sm:p-6">
            <div>
              <h3 className="text-xl leading-6 font-bold text-gray-900">
                Create New Audit Log Request
              </h3>
            </div>
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-6 sm:col-span-3">
                <div className="form-control pt-3">
                  <label htmlFor="domain" className="label font-semibold">
                    Domain
                  </label>
                  <select
                    id="mansion"
                    className="select select-bordered"
                    placeholder="xyz.mojito.dev"
                    {...register("domain")}
                  >
                    <option disabled value="">
                      -- select domain --
                    </option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {errors.domain && (
                    <p role="alert" className="text-red-700 my-1">
                      {errors.domain.message}
                    </p>
                  )}
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="form-control pt-3">
                    <label htmlFor="startDate" className="label font-semibold">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      className="input input-bordered"
                      placeholder="Start date"
                      {...register("startDate")}
                    />
                    {errors.startDate && (
                      <p role="alert" className="text-red-700 my-1">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="form-control pt-3">
                    <label htmlFor="endDate" className="label font-semibold">
                      End Date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      className="input input-bordered"
                      placeholder="End date"
                      {...register("endDate")}
                    />
                    {errors.endDate && (
                      <p role="alert" className="text-red-700 my-1">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="form-control pt-3">
                    <label htmlFor="remark" className="label font-semibold">
                      Remark
                    </label>
                    <input id="remark" className="input input-bordered" placeholder="Remark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right space-x-4">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AuditLog;
