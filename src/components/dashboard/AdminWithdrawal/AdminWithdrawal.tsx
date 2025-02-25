import { useEffect, useState } from 'react';

interface Deposit {
  _id: string;
  id: string;
  currency: string;
  amount: number;
  waletId: string;
}

interface User {
  id: string;
  balance: Record<string, number>;
}

interface AdminDepositsProps {
  user: User;
}

export default function AdminWithdrawal({ user }: AdminDepositsProps) {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await fetch('/api/get-all-withdrawal');
        const data = await response.json();

        if (data.success) {
          setDeposits(data.deposits);
        } else {
          setError(data.error || 'Failed to fetch deposits');
        }
      } catch (err) {
        console.error('Error fetching deposits:', err);
        setError('Помилка при отриманні поповнень');
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  const confirmDeposit = async (depositId: string, userId: string, adminId: string) => {
    try {
      const response = await fetch('/api/confirm-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId, userId, adminId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Deposit confirmed successfully!');
        setDeposits(deposits.filter((deposit) => deposit._id !== depositId));
      } else {
        alert(data.error || 'Failed to confirm deposit.');
      }
    } catch (err) {
      console.error('Error confirming deposit:', err);
      alert('Помилка при підтвердженні зняття');
    }
  };

  const disconfirmDeposit = async (depositId: string, userId: string, adminId: string) => {
    try {
      const response = await fetch('/api/delete-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId, userId, adminId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Deposit confirmed successfully!');
        setDeposits(deposits.filter((deposit) => deposit._id !== depositId));
      } else {
        alert(data.error || 'Failed to confirm deposit.');
      }
    } catch (err) {
      console.error('Error confirming deposit:', err);
      alert('Помилка при підтвердженні зняття');
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (deposits.length === 0) {
    return <></>;
  }

  return (
    <div>
      <h3>Ожидает вывода</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {deposits.map((deposit) => (
          <li
            key={deposit._id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <p>
              <strong>Пользователь:</strong> {deposit.id}
            </p>
            <p>
              <strong>Криптовалюта:</strong> {deposit.currency}
            </p>
            <p>
              <strong>Кошелек:</strong> {deposit.waletId}
            </p>
            <p>
              <strong>Сумма:</strong> {deposit.amount}
            </p>
            <div className='flex gap-[10px]'>
              <button
                onClick={() => confirmDeposit(deposit._id, deposit.id, user.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4daf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Подтвердить
              </button>
              <button
                onClick={() => disconfirmDeposit(deposit._id, deposit.id, user.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4daf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Отменить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}