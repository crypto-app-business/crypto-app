import { useEffect, useState } from 'react';

interface Deposit {
  _id: string;
  id: string;
  currency: string;
  amount: number;
}


interface User {
  id: string;
  balance: Record<string, number>;
}

interface AdmintransferProps {
  user: User;
}

export default function AdminTransfer({ user }: AdmintransferProps) {
  const [transfer, setTransfer] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchtransfer = async () => {
      try {
        const response = await fetch('/api/transfer');
        const data = await response.json();

        if (data.success) {
          setTransfer(data.transfers);
        } else {
          setError(data.error || 'Failed to fetch transfer');
        }
      } catch (err) {
        console.error('Error fetching transfer:', err);
        setError('Помилка при отриманні поповнень');
      } finally {
        setLoading(false);
      }
    };

    fetchtransfer();
  }, []);

  const confirmDeposit = async (transferId: string, userId: string, adminId: string) => {
    try {
      const response = await fetch('/api/confirm-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferId, userId, adminId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Deposit confirmed successfully!');
        setTransfer(transfer.filter((deposit) => deposit._id !== transferId));
      } else {
        alert(data.error || 'Failed to confirm deposit.');
      }
    } catch (err) {
      console.error('Error confirming deposit:', err);
      alert('Ошибка потдверджения');
    }
  };

  const deleteDeposit = async (transferId: string, userId: string, adminId: string) => {
    try {
      const response = await fetch('/api/delete-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferId, userId, adminId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Deposit delete successfully!');
        setTransfer(transfer.filter((deposit) => deposit._id !== transferId));
      } else {
        alert(data.error || 'Failed to delete deposit.');
      }
    } catch (err) {
      console.error('Error delete deposit:', err);
      alert('Ошибка удаления');
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (transfer?.length === 0) {
    return <></>;
  }

  return (
    <div>
      <h3>Трансфери ожидает подтверждения</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {transfer.map((deposit) => (
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
              <strong>Сумма:</strong> {deposit.amount}
            </p>
            <div className='flex gap-[10px]'>
              <button
                onClick={() => confirmDeposit(deposit._id, deposit.id, user.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Подтвердить
              </button>
              <button
                onClick={() => deleteDeposit(deposit._id, deposit.id, user.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
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