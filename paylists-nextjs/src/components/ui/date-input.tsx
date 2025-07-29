import React, { forwardRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const handleContainerClick = () => {
      // Focus the input and show the date picker
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.focus();
        ref.current.showPicker?.();
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div
          className="cursor-pointer"
          onClick={handleContainerClick}
        >
          <Input
            ref={ref}
            type="date"
            className={cn(`${className}`, error && "pr-10")}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export { DateInput }; 