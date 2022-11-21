import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

import { useRouter } from "next/dist/client/router";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import { get } from "lodash";
import * as yup from "yup";

import SectionLoading from "components/Loading/SectionLoading";

import { findMansions, upsertMansion } from "../apis/mansion";

const createMansionSchema = yup.object().shape({
  mansionId: yup
    .string()
    .required("Mansion Name is required")
    .matches(
      /^([0-9a-z-]*)$/,
      "The mansion name should contain only numbers, lowercase letters and hyphen"
    )
    .test(
      "verifyUniquenessOfMansion",
      "The Mansion Name should be unique",
      async function (value: string) {
        try {
          const { items: mansions } = await findMansions({ count: true });
          const mansionIds = mansions && (mansions.map((item: any) => get(item, "id")) as string[]);
          return !mansionIds.includes(value);
        } catch (error) {
          console.error(error);
        }
      }
    ),
  domain: yup.string().required("DNS is required"),
  frontDoorName: yup.string().required("FrontDoor is required"),
  appServices: yup.array().of(
    yup.object().shape({
      name: yup.string().required("App Service's Name is required"),
      host: yup.string().required("App Service's Host is required"),
    })
  ),
  cosmosDB: yup.object().shape({
    databaseAccount: yup.string().required("Database Account is required"),
    databaseName: yup.string().required("Database Name is required"),
  }),
  storage: yup.object().shape({
    storageAccount: yup.string().required("Storage Account is required"),
  }),
});

type createMansionType = yup.InferType<typeof createMansionSchema>;

function MansionCreateForm() {
  const router = useRouter();

  const createMansionMutation = useMutation(
    async ({
      mansionId,
      domain,
      frontDoorName,
      appServices,
      cosmosDB,
      storage,
    }: createMansionType) => {
      const id = await upsertMansion({
        mansionId,
        domain,
        frontDoorName,
        appServices,
        cosmosDB,
        storage,
      });
      return id;
    },
    {
      onSuccess: async () => {
        toast.success("Success");
        router.push(`/mansions/`);
      },
    }
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<createMansionType>({
    resolver: yupResolver(createMansionSchema),
    mode: "onBlur",
    defaultValues: {
      mansionId: "",
      domain: "",
      frontDoorName: "",
      appServices: [
        { name: "", host: "" },
        { name: "", host: "" },
      ],
      cosmosDB: { databaseAccount: "", databaseName: "" },
      storage: { storageAccount: "" },
    },
  });

  const handleAppServicesChange = (e) => {
    setValue("mansionId", e.target.value);
    setValue("appServices.0.name", `AS-mojito-${e.target.value}`);
    setValue("appServices.1.name", `AS-mojito-${e.target.value}-west`);
    setValue("appServices.0.host", `https://as-mojito-${e.target.value}.azurewebsites.net`);
    setValue("appServices.1.host", `https://as-mojito-${e.target.value}-west.azurewebsites.net`);
    setValue("frontDoorName", `mojito-${e.target.value}`);
    setValue("cosmosDB.databaseName", `mojito-${e.target.value}`);
  };

  const onSubmit = (d) => {
    const { mansionId, domain, frontDoorName, appServices, cosmosDB, storage } = d;

    createMansionMutation.mutate({
      mansionId,
      domain,
      frontDoorName,
      appServices,
      cosmosDB,
      storage,
    });
  };

  return (
    <>
      <DevTool control={control} />
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        {createMansionMutation.isLoading && (
          <SectionLoading message="It will take long time, You are free to leave." />
        )}
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-3 px-4 space-y-3 sm:p-6">
            <div>
              <h3 className="text-xl leading-6 font-bold text-gray-900">Create New Mansion</h3>
            </div>
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-6 sm:col-span-3">
                {/* mansion name start */}
                <div className="form-control pt-3">
                  <label htmlFor="mansionId" className="label font-semibold">
                    Mansion Name
                  </label>
                  <input
                    id="mansionId"
                    className="input input-bordered"
                    placeholder="Example: dev-0002"
                    {...register("mansionId")}
                    onChange={(e) => handleAppServicesChange(e)}
                  />
                  {errors.mansionId && (
                    <p role="alert" className="text-red-700 my-1">
                      {errors.mansionId.message}
                    </p>
                  )}
                </div>
              </div>
              {/* mansion name end */}
              <div className="col-span-6 sm:col-span-3" />
              <div className="col-span-6 border-b py-1" />

              {/* app service start */}
              <div className="col-span-6">
                <div className="form-control pt-1">
                  <label htmlFor="appServices" className="label font-semibold">
                    App Services
                  </label>
                  <div className="flex flex-col sm:flex-row items-start justify-center gap-3">
                    <div className="flex flex-col justify-start w-full">
                      <label htmlFor="appService name" className="text-xs p-2 pt-0">
                        Name (east)
                      </label>
                      <input
                        id="appServices name"
                        className="input input-bordered"
                        placeholder="App Services Name (East)"
                        {...register("appServices.0.name")}
                      />
                      {errors.appServices && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.appServices[0]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col justify-start w-full">
                      <label htmlFor="appServices host" className="text-xs p-2 pt-0">
                        Host (east)
                      </label>
                      <input
                        id="appServices host"
                        className="input input-bordered"
                        placeholder="App Services Host (East)"
                        {...register("appServices.0.host")}
                      />
                      {errors.appServices && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.appServices[0]?.host?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 border-b py-2 sm:hidden" />

                  <div className="flex flex-col sm:flex-row items-start justify-center gap-3">
                    <div className="flex flex-col justify-start w-full">
                      <label htmlFor="appService name" className="text-xs p-2 pt-2">
                        Name (west)
                      </label>
                      <input
                        id="appServices name"
                        className="input input-bordered"
                        placeholder="App Services Name (West)"
                        {...register("appServices.1.name")}
                      />
                      {errors.appServices && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.appServices[1]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col justify-start w-full">
                      <label htmlFor="appServices host" className="text-xs p-2 pt-2">
                        Host (west)
                      </label>
                      <input
                        id="appServices host"
                        className="input input-bordered"
                        placeholder="App Services Host (West)"
                        {...register("appServices.1.host")}
                      />
                      {errors.appServices && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.appServices[1]?.host?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* app service end */}

              {/* network start */}
              <div className="col-span-6">
                <div className="form-control">
                  <label className="label font-semibold">Network</label>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="w-full">
                      <label htmlFor="domain" className="label font-medium p-2 pt-0">
                        DNS Zones
                      </label>
                      <input
                        id="domain"
                        className="input input-bordered w-full"
                        placeholder="mojito.dev or mojito.work"
                        {...register("domain")}
                      />
                      {errors.domain && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.domain.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label htmlFor="plan" className="label font-medium p-2 pt-0">
                        Front Door
                      </label>
                      <input
                        id="frontDoorName"
                        className="input input-bordered w-full"
                        placeholder="Front Door"
                        {...register("frontDoorName")}
                      />
                      {errors.frontDoorName && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.frontDoorName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* network end */}

              {/* CosmosDB start */}
              <div className="col-span-6">
                <div className="form-control">
                  <label className="label font-semibold">CosmosDB</label>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="w-full">
                      <label htmlFor="domain" className="label font-medium p-2 pt-0">
                        CosmosDB Account
                      </label>
                      <input
                        id="domain"
                        className="input input-bordered w-full"
                        placeholder="CosmosDB Account"
                        {...register("cosmosDB.databaseAccount")}
                      />
                      {errors.cosmosDB?.databaseAccount && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.cosmosDB.databaseAccount.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label htmlFor="plan" className="label font-medium p-2 pt-0">
                        CosmosDB Database Name
                      </label>
                      <input
                        id="databaseId"
                        className="input input-bordered w-full"
                        placeholder="Database Name"
                        {...register("cosmosDB.databaseName")}
                      />
                      {errors.cosmosDB?.databaseName && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.cosmosDB.databaseName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* CosmosDB end */}

              {/* Storage start */}
              <div className="col-span-6">
                <div className="form-control">
                  <label className="label font-semibold">Storage</label>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="w-full">
                      <label htmlFor="domain" className="label font-medium p-2 pt-0">
                        Storage Account
                      </label>
                      <input
                        id="domain"
                        className="input input-bordered w-full"
                        placeholder="Storage Account"
                        {...register("storage.storageAccount")}
                      />
                      {errors.storage?.storageAccount && (
                        <p role="alert" className="text-red-700 my-1">
                          {errors.storage.storageAccount.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full hidden sm:block" />
                  </div>
                </div>
              </div>
              {/* Storage end */}
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={createMansionMutation.isLoading}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default MansionCreateForm;
