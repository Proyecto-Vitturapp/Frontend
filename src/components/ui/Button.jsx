export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled = false, className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-secondary-800 focus:ring-secondary-400',
    success: 'bg-success hover:bg-green-600 text-white focus:ring-success',
    danger: 'bg-error hover:bg-red-600 text-white focus:ring-error',
    ghost: 'hover:bg-secondary-100 text-secondary-600 focus:ring-secondary-400',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
