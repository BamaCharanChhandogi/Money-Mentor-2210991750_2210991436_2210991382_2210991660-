/* eslint-disable react/prop-types */
import Button from '../ui/Button';

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense._id} className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold">{expense.category}</h2>
          <p>Amount: ${expense.amount}</p>
          <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
          <p>Description: {expense.description || 'N/A'}</p>
          <div className="flex space-x-2 mt-2">
            <Button onClick={() => onEdit(expense)}>Edit</Button>
            <Button onClick={() => onDelete(expense._id)} className="bg-red-500">Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
