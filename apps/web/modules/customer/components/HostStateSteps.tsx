import classNames from "classnames";

const HostStateSteps = ({ host }) => {
  const { state } = host;
  const steps = ["creating", "created", "publishing", "published", "confirmed"];
  const stepIndex = steps.indexOf(state);
  return (
    <ul className="w-full steps steps-vertical sm:steps-horizontal">
      {steps.map((step, index) => (
        <li
          key={step}
          data-content={stepIndex >= index ? "✓" : "◯"}
          className={classNames({
            " step": true,
            " step-primary": stepIndex >= index,
          })}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};

export default HostStateSteps;
