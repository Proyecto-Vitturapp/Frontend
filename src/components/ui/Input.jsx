export function Input({ label, type = 'text', value, onChange, placeholder, error, required = false, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error ? 'border-error' : 'border-secondary-300'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}
