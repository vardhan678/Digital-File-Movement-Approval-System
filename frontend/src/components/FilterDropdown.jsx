import React from 'react';

const FilterDropdown = ({ label, value, onChange, options, className = '' }) => (
  <div className={className}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field text-sm cursor-pointer"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);

export default FilterDropdown;
