import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function Progress({ currentStep, totalSteps, steps }: ProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors",
                    {
                      "bg-green-600 text-white": isCompleted,
                      "bg-brand-off-white text-brand-black": isActive,
                      "bg-brand-graphite text-brand-silver": !isCompleted && !isActive,
                    }
                  )}
                >
                  {stepNumber}
                </div>
                <span
                  className={cn("text-sm", {
                    "text-brand-off-white font-semibold": isActive,
                    "text-brand-platinum": !isActive,
                  })}
                >
                  {step}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn("h-0.5 flex-1 mx-4 mt-[-2rem] transition-colors", {
                    "bg-green-600": isCompleted,
                    "bg-brand-graphite": !isCompleted,
                  })}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
