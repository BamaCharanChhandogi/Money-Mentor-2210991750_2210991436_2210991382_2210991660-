/* eslint-disable react/prop-types */

const Alert = ({ variant = 'info', children, className }) => {
  const variantClasses = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    destructive: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertCircle = () => (
  <svg className="h-5 w-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2"></line>
    <circle cx="12" cy="8" r="1" fill="currentColor"></circle>
  </svg>
);

export const AlertTitle = ({ children }) => (
  <strong className="block text-lg">
    {children}
  </strong>
);

export const AlertDescription = ({ children }) => (
  <p>
    {children}
  </p>
);

export default Alert;