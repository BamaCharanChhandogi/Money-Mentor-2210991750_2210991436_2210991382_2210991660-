
// eslint-disable-next-line react/prop-types
const Button = ({ children, type = 'button', className, onClick }) => (
  <button
    type={type}
    className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;