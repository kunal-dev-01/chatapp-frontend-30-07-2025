import React, { useEffect, useState } from 'react';
import { AlertCircle, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string | null;
  type?: 'error' | 'warning' | 'info' | 'success';
  onClear?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  className?: string;
  showIcon?: boolean;
  closable?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  type = 'error',
  onClear,
  autoClose = false,
  autoCloseDelay = 5000,
  className = '',
  showIcon = true,
  closable = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Auto close functionality
      if (autoClose && autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [error, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClear?.();
    }, 200);
  };

  const getStyles = () => {
    const baseStyles = "border rounded-lg p-4 transition-all duration-200 ease-in-out transform";
    
    switch (type) {
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
      case 'success':
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`;
      default:
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      case 'success':
        return 'text-green-700 dark:text-green-300';
      default:
        return 'text-red-700 dark:text-red-300';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-red-600 dark:text-red-400';
    }
  };

  const getIcon = () => {
    const iconProps = {
      className: `w-4 h-4 flex-shrink-0 mt-0.5 ${getIconColor()}`,
    };

    switch (type) {
      case 'error':
        return <AlertCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'info':
        return <Info {...iconProps} />;
      case 'success':
        return <CheckCircle {...iconProps} />;
      default:
        return <AlertCircle {...iconProps} />;
    }
  };

  if (!isVisible || !error) {
    return null;
  }

  return (
    <div
      className={`
        ${getStyles()} 
        ${className}
        ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {showIcon && getIcon()}
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${getTextColor()} break-words`}>
            {error}
          </p>
        </div>

        {closable && onClear && (
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-md transition-colors duration-200
              ${getIconColor()} hover:bg-black/5 dark:hover:bg-white/5
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
            `}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar for auto close */}
      {autoClose && autoCloseDelay > 0 && (
        <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' :
              type === 'info' ? 'bg-blue-500' :
              'bg-green-500'
            } transition-all duration-${autoCloseDelay} ease-linear`}
            style={{
              animation: `shrink ${autoCloseDelay}ms linear`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ErrorAlert;