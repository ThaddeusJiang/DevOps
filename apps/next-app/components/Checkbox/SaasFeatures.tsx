import { useWatch } from "react-hook-form";

import { OptionalFeatures, PricePlans } from "data/real";
import BasicFeatures from "./BasicFeatures"

export const FeaturesCheckboxs = ({ control, register }) => {
  const plan = useWatch({
    control,
    name: "plan",
  });

  const immutableFeatures = PricePlans.find((PricePlan) => PricePlan.id === plan).features;

  return plan === "CUSTOM" ? (
    <div className="col-span-6 sm:col-span-3">
      <label htmlFor="selectedFeatures" className="label">
        Selected Features
      </label>
      <BasicFeatures />
      {OptionalFeatures.map((feature) => (
        <div key={feature.value} className="form-control">
          <label className="label cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              id="selectedFeatures"
              {...register("selectedFeatures")}
              className="checkbox checkbox-sm"
              value={feature.value}
            />
            <span className="label-text">{feature.label}</span>
          </label>
        </div>
      ))}
    </div>
  ) : (
    <div className="col-span-6 sm:col-span-3">
      <label htmlFor="selectedFeatures" className="label">
        Selected Features
      </label>
      <BasicFeatures />
      {OptionalFeatures.map((feature) => (
        <div key={feature.value} className="form-control">
          <label className="label cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              id="selectedFeatures"
              disabled={!immutableFeatures.includes(feature.label)}
              checked={immutableFeatures.includes(feature.label)}
              readOnly
              className="checkbox checkbox-sm"
              value={feature.value}
            />
            <span className="label-text">{feature.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
};
