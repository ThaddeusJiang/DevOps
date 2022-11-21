import { useWatch } from "react-hook-form";

import { kintaiFeatures, kyuyoFeatures, romuFeatures } from "data/real";

export const Features = ({ control, register, product }) => {
  const selected = useWatch({
    control,
    name: `${product}`,
  });

  return selected ? (
    <div className="col-span-6 sm:col-span-3 ">
      <label htmlFor="selectedFeatures" className="label">
        {product.toUpperCase()} Selected Features
      </label>
      {(() => {
        switch (product) {
          case "romu":
            return (
              <>
                {romuFeatures.map((feature) => (
                  <div key={feature.value} className="form-control">
                    <div className="label cursor-pointer justify-start space-x-2">
                      <input
                        type="checkbox"
                        id="romuFeatures"
                        {...register("romuFeatures")}
                        className="checkbox checkbox-sm"
                        value={feature.value}
                      />
                      <label className="label-text" htmlFor="romuFeatures">
                        {feature.label}
                      </label>
                    </div>
                  </div>
                ))}
              </>
            );
          case "kintai":
            return (
              <>
                {kintaiFeatures.map((feature) => (
                  <div key={feature.value} className="form-control">
                    <div className="label cursor-pointer justify-start space-x-2">
                      <input
                        type="checkbox"
                        id="kintaiFeatures"
                        {...register("kintaiFeatures")}
                        className="checkbox checkbox-sm"
                        value={feature.value}
                      />

                      <label className="label-text" htmlFor="kintaiFeatures">
                        {feature.label}
                      </label>
                    </div>
                  </div>
                ))}
              </>
            );
          case "kyuyo":
            return (
              <>
                {kyuyoFeatures.map((feature) => (
                  <div key={feature.value} className="form-control">
                    <div className="label cursor-pointer justify-start space-x-2">
                      <input
                        type="checkbox"
                        id="kyuyoFeatures"
                        {...register("kyuyoFeatures")}
                        className="checkbox checkbox-sm"
                        value={feature.value}
                      />
                      <label className="label-text" htmlFor="kyuyoFeatures">
                        {feature.label}
                      </label>
                    </div>
                  </div>
                ))}
              </>
            );
          default:
            return null;
        }
      })()}
    </div>
  ) : (
    <div className="col-span-6 sm:col-span-3" />
  );
};
