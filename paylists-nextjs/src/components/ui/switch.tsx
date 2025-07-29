import React from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'gradient'
  className?: string
  label?: string
  id?: string
  showIcon?: boolean
  iconOn?: React.ReactNode
  iconOff?: React.ReactNode
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
  label,
  id,
  showIcon = false,
  iconOn,
  iconOff,
}: SwitchProps) {
  const sizeClasses = {
    xs: {
      container: 'w-6 h-3',
      thumb: 'w-2.5 h-2.5',
      translate: 'translate-x-3',
      icon: 'w-1.5 h-1.5',
    },
    sm: {
      container: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4',
      icon: 'w-2 h-2',
    },
    md: {
      container: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
      icon: 'w-2.5 h-2.5',
    },
    lg: {
      container: 'w-16 h-8',
      thumb: 'w-7 h-7',
      translate: 'translate-x-8',
      icon: 'w-3 h-3',
    },
    xl: {
      container: 'w-20 h-10',
      thumb: 'w-9 h-9',
      translate: 'translate-x-10',
      icon: 'w-4 h-4',
    },
  }

  const variantClasses = {
    default: {
      on: 'bg-gray-600 hover:bg-gray-700',
      off: 'bg-gray-300 hover:bg-gray-400',
    },
    primary: {
      on: 'bg-blue-600 hover:bg-blue-700',
      off: 'bg-gray-300 hover:bg-gray-400',
    },
    success: {
      on: 'bg-green-600 hover:bg-green-700',
      off: 'bg-gray-300 hover:bg-gray-400',
    },
    warning: {
      on: 'bg-yellow-500 hover:bg-yellow-600',
      off: 'bg-gray-300 hover:bg-gray-400',
    },
    danger: {
      on: 'bg-red-600 hover:bg-red-700',
      off: 'bg-gray-300 hover:bg-gray-400',
    },
    purple: {
      on: 'bg-purple-600 hover:bg-purple-700',
      off: 'bg-gray-300 hover:bg-gray-400',
    },
    gradient: {
      on: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
      off: 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500',
    },
  }

  const currentSize = sizeClasses[size]
  const currentVariant = variantClasses[variant]

  return (
    <div className={`flex items-center gap-2 ${className} flex-col`}>
      {label && (
        <label
          htmlFor={id}
          className={`
            text-sm font-medium transition-colors duration-200
            ${disabled
              ? 'text-gray-400 cursor-not-allowed'
              : checked
                ? 'text-gray-900'
                : 'text-gray-600 hover:text-gray-800 cursor-pointer'
            }
          `}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        id={id}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex items-center justify-start
          ${currentSize.container}
          rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          shadow-sm hover:shadow-md
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${checked
            ? `${currentVariant.on} focus:ring-blue-500`
            : `${currentVariant.off} focus:ring-gray-400`
          }
        `}
      >
        <span
          className={`
            inline-flex items-center justify-center ${currentSize.thumb}
            rounded-full bg-white shadow-lg
            transform transition-all duration-300 ease-in-out
            ${checked ? currentSize.translate : 'translate-x-0.5'}
            ${checked ? 'shadow-lg' : 'shadow-md'}
            hover:scale-105
          `}
        >
          {showIcon && (
            <span className={`${currentSize.icon} text-gray-400`}>
              {checked ? iconOn : iconOff}
            </span>
          )}
        </span>

        {/* Animated background effect */}
        <div
          className={`
            absolute inset-0 rounded-full transition-opacity duration-300
            ${checked ? 'opacity-100' : 'opacity-0'}
            ${variant === 'gradient'
              ? 'bg-gradient-to-r from-blue-400/20 to-purple-500/20'
              : 'bg-white/20'
            }
          `}
        />
      </button>
    </div>
  )
}

// Predefined icon components
export const SwitchIcons = {
  Check: () => (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  X: () => (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  Sun: () => (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
  ),
  Moon: () => (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  ),
}

export default Switch 