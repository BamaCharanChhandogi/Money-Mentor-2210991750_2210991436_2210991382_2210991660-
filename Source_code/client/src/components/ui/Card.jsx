/* eslint-disable react/prop-types */
const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b border-gray-200 pb-2 mb-4">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div>
    {children}
  </div>
);

export default Card;