import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'unstyled';
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      className,
      type = 'text',
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const variantClasses = {
      default: cn(
        'border border-gray-300 bg-white',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        disabled && 'bg-gray-50 cursor-not-allowed'
      ),
      filled: cn(
        'border border-transparent bg-gray-100',
        'focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error && 'bg-red-50 focus:border-red-500 focus:ring-red-500/20',
        disabled && 'bg-gray-100 cursor-not-allowed'
      ),
      unstyled: 'border-0 focus:ring-0 p-0'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <div className={iconSizeClasses[inputSize]}>{leftIcon}</div>
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full rounded-lg transition-all duration-200',
              variantClasses[variant],
              sizeClasses[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || isPassword || error) && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {(rightIcon || isPassword || error) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {error && (
                <AlertCircle
                  className={cn(iconSizeClasses[inputSize], 'text-red-500')}
                  aria-hidden="true"
                />
              )}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className={iconSizeClasses[inputSize]} />
                  ) : (
                    <Eye className={iconSizeClasses[inputSize]} />
                  )}
                </button>
              )}
              {rightIcon && !isPassword && !error && (
                <div className={cn(iconSizeClasses[inputSize], 'text-gray-400')}>
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-2 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component with similar styling
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'filled' | 'unstyled';
  inputSize?: 'sm' | 'md' | 'lg';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      variant = 'default',
      inputSize = 'md',
      className,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const variantClasses = {
      default: cn(
        'border border-gray-300 bg-white',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        disabled && 'bg-gray-50 cursor-not-allowed'
      ),
      filled: cn(
        'border border-transparent bg-gray-100',
        'focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        error && 'bg-red-50 focus:border-red-500 focus:ring-red-500/20',
        disabled && 'bg-gray-100 cursor-not-allowed'
      ),
      unstyled: 'border-0 focus:ring-0 p-0'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full rounded-lg transition-all duration-200 resize-y min-h-[100px]',
            variantClasses[variant],
            sizeClasses[inputSize],
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${textareaId}-hint`} className="mt-2 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';