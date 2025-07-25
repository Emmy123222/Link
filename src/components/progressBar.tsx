import React from "react";

type ProgressBarProps = {
  steps: string[];
  currentStep: number; // 1-based index
};

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => (
  <div className="flex items-start bg-green-50 py-6">
    {steps.map((label, idx) => {
      const stepNum = idx + 1;
      const isActive = stepNum === currentStep;
      const isCompleted = stepNum < currentStep;

      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center min-w-[120px]">
            <div
              className={[
                "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg mb-2 transition-colors",
                isActive || isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white border-green-500 text-green-500"
              ].join(" ")}
            >
              {stepNum}
            </div>
            <div className="font-bold text-center">{label}</div>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={[
                "flex-1 h-0.5 mt-5",
                isCompleted ? "bg-green-500" : "bg-green-100"
              ].join(" ")}
            ></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default ProgressBar;