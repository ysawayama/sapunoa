import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  indeterminate = false,
  striped = false,
  animated = false,
  className
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-amber-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };

  const stripedPattern = striped
    ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%]'
    : '';

  const animatedClass = animated && striped ? 'animate-stripes' : '';

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-700">{label}</span>}
          {showLabel && !indeterminate && (
            <span className="text-sm font-medium text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant],
            stripedPattern,
            animatedClass,
            indeterminate && 'w-full animate-indeterminate'
          )}
          style={!indeterminate ? { width: `${percentage}%` } : undefined}
        />
      </div>
    </div>
  );
};

// Circular progress component
interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  indeterminate?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  strokeWidth,
  variant = 'default',
  showLabel = false,
  label,
  indeterminate = false,
  className
}) => {
  const sizeMap = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 80
  };

  const defaultStrokeWidth = {
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6
  };

  const variantClasses = {
    default: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  };

  const diameter = sizeMap[size];
  const stroke = strokeWidth || defaultStrokeWidth[size];
  const radius = (diameter - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn('inline-flex items-center justify-center relative', className)}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
    >
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.25 : offset}
          strokeLinecap="round"
          className={cn(
            variantClasses[variant],
            'transition-all duration-300 ease-out',
            indeterminate && 'animate-spin origin-center'
          )}
        />
      </svg>

      {showLabel && !indeterminate && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-900">
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Step progress component for multi-step processes
interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  variant?: 'default' | 'simple' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  variant = 'default',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: {
      dot: 'w-6 h-6 text-xs',
      line: 'h-0.5',
      text: 'text-xs'
    },
    md: {
      dot: 'w-8 h-8 text-sm',
      line: 'h-0.5',
      text: 'text-sm'
    },
    lg: {
      dot: 'w-10 h-10 text-base',
      line: 'h-1',
      text: 'text-base'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Progress line */}
        <div
          className={cn(
            'absolute top-4 left-0 right-0 bg-gray-200',
            sizes.line,
            variant === 'dots' && 'hidden md:block'
          )}
          style={{
            width: `calc(100% - ${variant === 'dots' ? '2rem' : '0px'})`
          }}
        >
          <div
            className={cn('h-full bg-primary-600 transition-all duration-300')}
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center',
                  variant === 'simple' && 'flex-1'
                )}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center font-medium transition-all duration-300',
                    sizes.dot,
                    isCompleted && 'bg-primary-600 text-white',
                    isCurrent && 'bg-primary-600 text-white ring-4 ring-primary-100',
                    isUpcoming && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {variant === 'dots' ? (
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        isCompleted || isCurrent ? 'bg-white' : 'bg-gray-400'
                      )}
                    />
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Step label */}
                {variant !== 'dots' && (
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        'font-medium',
                        sizes.text,
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      )}
                    >
                      {step.label}
                    </div>
                    {step.description && variant === 'default' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};