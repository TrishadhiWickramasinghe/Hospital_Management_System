'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Step {currentStep} of {steps.length} — {steps[currentStep - 1]?.title}
      </h2>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrentStep = index + 1 === currentStep;
          
          return (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold',
                  isCompleted && 'border-green-500 bg-green-500 text-white',
                  isCurrentStep && 'border-blue-500 bg-blue-50 text-blue-600',
                  !isCompleted && !isCurrentStep && 'border-slate-300 bg-white text-slate-400'
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : step.number}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-1 w-16 rounded-full',
                    isCompleted ? 'bg-green-500' : 'bg-slate-300'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
