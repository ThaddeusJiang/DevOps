import { basicFeatures } from "../../data/real";

const BasicFeatures = () => (
  <>
    {basicFeatures.map((feature) => (
      <div key={feature.value} className="form-control">
        <label className="label cursor-pointer justify-start space-x-2">
          <input
            type="checkbox"
            id={`basicFeatures-${feature.value}`}
            className="checkbox checkbox-sm"
            value={feature.value}
            checked
            disabled
          />
          <span className="label-text">{feature.label}</span>
        </label>
      </div>
    ))}
  </>
);

export default BasicFeatures;
