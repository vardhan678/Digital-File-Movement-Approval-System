import React from 'react';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  className = '',
  ...rest
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
      {...rest}
    />
    {error && <p className="mt-1 text-xs text-red-500 animate-fade-in">{error}</p>}
  </div>
);

export default InputField;
