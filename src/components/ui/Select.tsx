import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled' | 'unstyled';
  selectSize?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder = 'Select an option',
      variant = 'default',
      selectSize = 'md',
      className,
      disabled,
      required,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
      sm: 'px-3 py-1.5 pr-8 text-sm',
      md: 'px-4 py-2 pr-10 text-base',
      lg: 'px-4 py-3 pr-12 text-lg'
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
            htmlFor={selectId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            value={value}
            onChange={onChange}
            className={cn(
              'w-full rounded-lg appearance-none transition-all duration-200',
              variantClasses[variant],
              sizeClasses[selectSize],
              (!value || value === '') && 'text-gray-400',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
            {error && (
              <AlertCircle
                className={cn(iconSizeClasses[selectSize], 'text-red-500')}
                aria-hidden="true"
              />
            )}
            <ChevronDown
              className={cn(
                iconSizeClasses[selectSize],
                error ? 'text-red-500' : 'text-gray-400'
              )}
              aria-hidden="true"
            />
          </div>
        </div>

        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-2 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Custom dropdown component with search functionality
interface CustomSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  variant?: 'default' | 'filled';
  selectSize?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  error,
  hint,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  variant = 'default',
  selectSize = 'md',
  disabled,
  required,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const variantClasses = {
    default: cn(
      'border border-gray-300 bg-white',
      'focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
      error && 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20',
      disabled && 'bg-gray-50 cursor-not-allowed'
    ),
    filled: cn(
      'border border-transparent bg-gray-100',
      'focus-within:bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
      error && 'bg-red-50 focus-within:border-red-500 focus-within:ring-red-500/20',
      disabled && 'bg-gray-100 cursor-not-allowed'
    )
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg text-left transition-all duration-200 flex items-center justify-between',
            variantClasses[variant],
            sizeClasses[selectSize],
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!selectedOption && 'text-gray-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform',
              isOpen && 'rotate-180',
              error ? 'text-red-500' : 'text-gray-400'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <ul
              className="max-h-60 overflow-auto py-1"
              role="listbox"
              aria-label={label || 'Options'}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-2 text-sm text-gray-500">No options found</li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }
                    }}
                    className={cn(
                      'px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors',
                      option.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'hover:bg-primary-50 text-gray-900',
                      option.value === value && 'bg-primary-100'
                    )}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
};