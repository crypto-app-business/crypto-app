import { useState } from 'react';

export default function DepositComponent({ id }) {
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const wallets = {
    USDT: '0x123456789abcdefUSDT',
    ETH: '0xabcdef123456789ETH',
    BTC: 'bc1q123456789abcdefBTC',
  };

  const minAmounts = {
    USDT: 10,
    ETH: 1,
    BTC: 0.001,
  };

  const handleDeposit = async () => {
    if (!currency || !amount) {
      alert('Please select a currency and enter an amount.');
      return;
    }

    if (amount < minAmounts[currency]) {
      alert(`Minimum amount for ${currency} is ${minAmounts[currency]}.`);
      return;
    }

    setMessage(`Для оформления баланса, отправтье ${amount} ${currency} на кошелек ниже`);
    setWallet(wallets[currency]);
    setIsPending(true);
  };

  const handlePaid = async () => {
    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          currency,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOpen(false)
        alert('Deposit created successfully! Waiting for confirmation.');
        setIsPending(false);
        setCurrency('');
        setAmount('');
        setMessage('');
        setWallet('');
      } else {
        alert('Failed to create deposit. Try again later.');
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
    }
  };

  return (
    <div style={{ }}>
      {!isOpen &&<button onClick={()=>{setIsOpen(true)}} className="mt-4 bg-white text-blue font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition">
        Пополнить
      </button>}
    {isOpen &&<>
      <h2>Пополнения депозита</h2>
      <div className='mb-[10px]'>
        <label htmlFor="currency">Выбрать криптовалюту</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className='bg-blue'
        >
          <option value="">Выбрать...</option>
          <option value="USDT">USDT</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="BTC">Bitcoin (BTC)</option>
        </select>
      </div>
      <div className='mb-[10px]'>
        <label htmlFor="amount">Выбрать сумму:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Минимально: ${currency ? minAmounts[currency] : '...'} ${currency}`}
          className='text-blue'
        />
      </div>
      {!isPending && (
        <button onClick={handleDeposit} style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>
          Оплатить
        </button>
      )}
      {isPending && (
        <div>
          <p>{message}</p>
          <p>
            <strong>Кошелек:</strong> {wallet}
          </p>
          <button onClick={handlePaid} style={{ padding: '10px 20px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}>
            Оплачено
          </button>
        </div>
      )}
    </>}
    </div>
  );
}
