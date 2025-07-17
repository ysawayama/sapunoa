import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  X,
  AlertTriangle
} from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  title?: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  closable = false,
  onClose,
  icon,
  showIcon = true,
  className,
  children
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-600',
      closeButton: 'text-blue-600 hover:text-blue-800 hover:bg-blue-100'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-600',
      closeButton: 'text-green-600 hover:text-green-800 hover:bg-green-100'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: 'text-amber-600',
      closeButton: 'text-amber-600 hover:text-amber-800 hover:bg-amber-100'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-600',
      closeButton: 'text-red-600 hover:text-red-800 hover:bg-red-100'
    },
    neutral: {
      container: 'bg-gray-50 border-gray-200 text-gray-800',
      icon: 'text-gray-600',
      closeButton: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
    }
  };

  const defaultIcons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    neutral: <AlertCircle className="w-5 h-5" />
  };

  const styles = variantStyles[variant];
  const displayIcon = icon || defaultIcons[variant];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex">
        {showIcon && (
          <div className={cn('flex-shrink-0', styles.icon)} aria-hidden="true">
            {displayIcon}
          </div>
        )}

        <div className={cn('flex-1', showIcon && 'ml-3')}>
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
          {children && (
            <div className="text-sm opacity-90 mt-2">{children}</div>
          )}
        </div>

        {closable && (
          <button
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 ml-4 -mr-1 -mt-1 p-1 rounded-lg transition-colors',
              styles.closeButton
            )}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast notification component
interface ToastProps extends AlertProps {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const Toast: React.FC<ToastProps> = ({
  duration = 5000,
  position = 'top-right',
  onClose,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  const animationClasses = isExiting
    ? 'animate-fadeOut opacity-0'
    : 'animate-fadeIn opacity-100';

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[position],
        animationClasses
      )}
    >
      <Alert
        {...props}
        closable
        onClose={handleClose}
        className="shadow-lg min-w-[300px] max-w-[400px]"
      />
    </div>
  );
};

// InlineAlert for form validation messages
interface InlineAlertProps {
  type?: 'error' | 'warning' | 'success' | 'info';
  message: string;
  className?: string;
}

export const InlineAlert: React.FC<InlineAlertProps> = ({
  type = 'error',
  message,
  className
}) => {
  const typeStyles = {
    error: 'text-red-600',
    warning: 'text-amber-600',
    success: 'text-green-600',
    info: 'text-blue-600'
  };

  const icons = {
    error: <XCircle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-sm',
        typeStyles[type],
        className
      )}
      role="alert"
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};