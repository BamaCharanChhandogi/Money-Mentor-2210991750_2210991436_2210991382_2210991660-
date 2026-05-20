import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api';

const SharedExpenses = ({ familyGroupId }) => {
  const [sharedExpenses, setSharedExpenses] = useState([]);
  console.log(familyGroupId);
  

  useEffect(() => {
    const fetchSharedExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${BASE_URL}/shared-expenses/${familyGroupId}`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSharedExpenses(response.data.sharedExpenses);
      } catch (error) {
        console.error('Error fetching shared expenses:', error);
      }
    };

    fetchSharedExpenses();
  }, [familyGroupId]);

  const handleSplitUpdate = async (expenseId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BASE_URL}/shared-expenses/${expenseId}/split`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Optionally update local state or trigger refetch
    } catch (error) {
      console.error('Error updating split:', error);
    }
  };

  return (
    <div>
      <h3>Shared Expenses</h3>
      {sharedExpenses.map(expense => (
        <div key={expense._id}>
          <p>Paid by: {expense.paidBy.name}</p>
          <p>Amount: ${expense.amount}</p>
          <div>
            {expense.splits.map(split => (
              <div key={split._id}>
                <span>{split.user.name}</span>
                <span>${split.amount}</span>
                <span>{split.status}</span>
                {split.status === 'pending' && (
                  <>
                    <button onClick={() => handleSplitUpdate(expense._id, 'paid')}>
                      Mark as Paid
                    </button>
                    <button onClick={() => handleSplitUpdate(expense._id, 'rejected')}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SharedExpenses;