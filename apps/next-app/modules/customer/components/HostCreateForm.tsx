import { FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

import { useRouter } from "next/dist/client/router";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import { get } from "lodash";
import * as yup from "yup";

import { Features, FeaturesCheckboxs } from "components/Checkbox";
import SectionLoading from "components/Loading/SectionLoading";
import { PricePlans } from "data/real";
import { MAX_MANSION_HOSTS } from "utils/constants";
import { safeJSONparse } from "utils/json";

import { createHost, findHosts } from "../apis/host";
import { findMansions } from "../apis/mansion";

const schema = yup.object().shape({
  mansion: yup.string().required("Required"),
  cname: yup
    .string()
    .required("Required")
    .matches(
      /^[a-z]+(-|[a-z0-9])*$/,
      "Please enter a string starting with a lowercase English letter and can contain half-width alphanumeric characters, hyphen and number"
    )
    .max(80, "Please specify 80 characters or less")
    .test("verifyUniquenessOfCname", "The cname should be unique", async function (value: string) {
      try {
        const { items } = await findHosts();
        const domains = items && (items.map((item: any) => get(item, "id")) as string[]);
        const cnames = domains.map((domain) => domain.split(".")[0]);
        return !cnames.includes(value);
      } catch (error) {
        console.error(error);
      }
    }),
  plan: yup.string().required("Required"),
  selectedFeatures: yup.array().of(yup.string()),
  romu: yup.boolean(),
  romuFeatures: yup.array().of(yup.string()),
  kintai: yup.boolean(),
  kintaiFeatures: yup.array().of(yup.string()),
  kyuyo: yup.boolean(),
  kyuyoFeatures: yup.array().of(yup.string()),
  memo: yup.string(),
});

type CreateHostSchema = yup.InferType<typeof schema>;

function PreviewHost({ control }) {
  // doc: https://react-hook-form.com/api/usewatch
  const formValues = useWatch({
    control,
  });

  const mansion = safeJSONparse(formValues.mansion);

  return formValues.mansion ? (
    <>
      <label htmlFor="preview" className="label">
        preview
      </label>

      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Domain:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {`${formValues?.cname}.${mansion?.domain}`}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Database Name:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {mansion?.databaseId}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">DB Container Name:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {`Data_${formValues.cname}`}
            </dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Storage Prefix:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formValues.cname}</dd>
          </div>

          <div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Frontdoor Name:</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {mansion.frontDoorName}
            </dd>
          </div>
        </dl>
      </div>
    </>
  ) : (
    <div />
  );
}

const HostCreateForm: FC = () => {
  const queryMansions = useQuery("mansions", () => findMansions({ count: true }));

  const router = useRouter();
  const createHostMutation = useMutation(
    async ({
      mansionId,
      cname,
      plan,
      memo,
      selectedFeatures,
      romu,
      romuFeatures,
      kintai,
      kintaiFeatures,
      kyuyo,
      kyuyoFeatures,
    }: {
      mansionId: string;
      cname: string;
      plan: string;
      memo: string;
      selectedFeatures: string[];
      romu: boolean;
      romuFeatures: string[];
      kintai: boolean;
      kintaiFeatures: string[];
      kyuyo: boolean;
      kyuyoFeatures: string[];
    }) => {
      const selected = { romu, kintai, kyuyo };
      const products = ["ROMU", "KINTAI", "KYUYO"].reduce(
        (prev, curr) => {
          let key = curr.toLowerCase();
          selected[key] === true && prev.push(curr);
          return prev;
        },
        ["TALENT"]
      );

      const id = await createHost({
        mansionId,
        cname,
        plan,
        memo,
        selectedFeatures,
        products,
        romuFeatures,
        kintaiFeatures,
        kyuyoFeatures,
      });
      return id;
    },
    {
      onSuccess: async (id) => {
        toast.success("Success");
        router.push(`/hosts/${id}`);
      },
    }
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateHostSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      cname: "",
      mansion: "",
      plan: "TRIAL",
      selectedFeatures: [],
      romu: false,
      romuFeatures: ["DIGITAL_CONTRACT", "SALARY_DETAIL", "MYNUMBER"],
      kintai: false,
      kintaiFeatures: ["SHIFT", "EXPENSE", "MAN_HOUR_MANAGEMENT"],
      kyuyo: false,
      kyuyoFeatures: [],
      memo: "",
    },
  });

  const onSubmit = (d) => {
    const mansion = safeJSONparse(d.mansion);
    const {
      cname,
      plan,
      memo,
      selectedFeatures,
      romu,
      romuFeatures,
      kintai,
      kintaiFeatures,
      kyuyo,
      kyuyoFeatures,
    } = d;

    createHostMutation.mutate({
      mansionId: mansion.id,
      cname,
      plan,
      memo,
      selectedFeatures: plan === "CUSTOM" ? selectedFeatures : [],
      romu,
      romuFeatures,
      kintai,
      kintaiFeatures,
      kyuyo,
      kyuyoFeatures,
    });
  };

  const mansions = queryMansions.data?.items || [];
  return (
    <>
      <DevTool control={control} />
      <form className=" relative" onSubmit={handleSubmit(onSubmit)}>
        {createHostMutation.isLoading && (
          <SectionLoading message="It will take long time, You are free to leave." />
        )}
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Information</h3>
            </div>

            <div className="grid grid-cols-6 gap-4 form-control">
              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="mansion" className="label">
                  mansion
                </label>
                <select
                  id="mansion"
                  className="select select-bordered"
                  placeholder="mansion"
                  {...register("mansion")}
                >
                  <option disabled value="">
                    -- select mansion --
                  </option>
                  {mansions.map((mansion) => {
                    const exceeded = mansion.hostCount >= MAX_MANSION_HOSTS;
                    return (
                      <option key={mansion.id} disabled={exceeded} value={JSON.stringify(mansion)}>
                        {mansion.id}
                        {exceeded && ` (hosts exceeded ${MAX_MANSION_HOSTS})`}
                      </option>
                    );
                  })}
                </select>
                {errors.mansion && (
                  <p role="alert" className="text-red-700 my-1">
                    {errors.mansion.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="cname" className="label">
                  cname
                </label>
                <input
                  id="cname"
                  className="input input-bordered"
                  placeholder="trial"
                  {...register("cname")}
                />
                {errors.cname && (
                  <p role="alert" className="text-red-700">
                    {errors.cname.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="plan" className="label">
                  plan
                </label>
                <select
                  id="plan"
                  className=" select select-bordered"
                  placeholder="plan"
                  {...register("plan")}
                >
                  {PricePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                {errors.plan && (
                  <p role="alert" className="text-red-700">
                    {errors.plan.message}
                  </p>
                )}
              </div>

              <FeaturesCheckboxs control={control} register={register} />
              <div className="divider col-span-6 sm:w-2/3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="romu"
                    {...register("romu")}
                    className="checkbox checkbox-md checkbox-primary"
                  />
                  <label htmlFor="romu" className="label">
                    労務
                  </label>
                </div>
              </div>

              <Features product={"romu"} control={control} register={register} />
              <div className="divider col-span-6 sm:w-2/3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="kintai"
                    {...register("kintai")}
                    className="checkbox checkbox-md checkbox-primary"
                  />
                  <label htmlFor="kintai" className="label">
                    勤怠
                  </label>
                </div>
              </div>

              <Features product={"kintai"} control={control} register={register} />
              <div className="divider col-span-6 sm:w-2/3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="kyuyo"
                    {...register("kyuyo")}
                    className="checkbox checkbox-md checkbox-primary"
                    disabled
                  />
                  <label htmlFor="kyuyo" className="label">
                    給与
                  </label>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3" />

              <div className="col-span-6 sm:col-span-3 form-control">
                <label htmlFor="memo" className="label">
                  memo
                </label>
                <textarea
                  id="memo"
                  className="textarea textarea-bordered"
                  {...register("memo")}
                  placeholder="The host is used for ..."
                  rows={3}
                />
                {errors.memo && (
                  <p role="alert" className="text-red-700">
                    {errors.memo.message}
                  </p>
                )}
              </div>

              <div className="col-span-6">
                <PreviewHost control={control} />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={createHostMutation.isLoading}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HostCreateForm;
