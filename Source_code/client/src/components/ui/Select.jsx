/* eslint-disable react/prop-types */
const Select = ({ onValueChange, value, children }) => (
  <select
    onChange={(e) => onValueChange(e.target.value)}
    value={value}
    className="border border-gray-300 rounded p-2 w-full"
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children }) => (
  <div>
    {children}
  </div>
);

export const SelectValue = ({ placeholder }) => (
  <option value="" disabled>
    {placeholder}
  </option>
);

export const SelectContent = ({ children }) => (
  <div>
    {children}
  </div>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>
    {children}
  </option>
);

export default Select;