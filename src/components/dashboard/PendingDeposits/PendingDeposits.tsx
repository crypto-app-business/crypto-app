import { useEffect, useState } from 'react';

interface Deposit {
  _id: string;
  currency: string;
  amount: number;
}

interface PendingDepositsProps {
  id: string; // ID користувача
}

export default function PendingDeposits({ id }: PendingDepositsProps) {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await fetch(`/api/get-deposits?id=${id}`);
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
  }, [id]);

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
      <h3>Ожидает подтверждения</h3>
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
              <strong>Криптовалюта:</strong> {deposit.currency}
            </p>
            <p>
              <strong>Сумма:</strong> {deposit.amount}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}