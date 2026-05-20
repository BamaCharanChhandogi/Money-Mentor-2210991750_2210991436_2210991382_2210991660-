// eslint-disable-next-line react/prop-types
const Input = ({ name, value, onChange, placeholder, type = 'text', className, required }) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type={type}
    className={`border border-gray-300 rounded p-2 w-full ${className}`}
    required={required}
  />
);

export default Input;