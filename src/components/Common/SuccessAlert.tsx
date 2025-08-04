import React from 'react';
import ErrorAlert from './ErrorAlert';

interface SuccessAlertProps {
  message: string | null;
  onClear?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  className?: string;
  showIcon?: boolean;
  closable?: boolean;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  onClear,
  autoClose = true,
  autoCloseDelay = 4000,
  className = '',
  showIcon = true,
  closable = true,
}) => {
  return (
    <ErrorAlert
      error={message}
      type="success"
      onClear={onClear}
      autoClose={autoClose}
      autoCloseDelay={autoCloseDelay}
      className={className}
      showIcon={showIcon}
      closable={closable}
    />
  );
};

export default SuccessAlert;