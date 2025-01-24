import { useState } from 'react';

export default function DepositComponent({ id, selectedWallet }) {
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
    if (!selectedWallet || !amount) {
      alert('Please select a currency and enter an amount.');
      return;
    }

    if (amount < minAmounts[selectedWallet]) {
      alert(`Minimum amount for ${selectedWallet} is ${minAmounts[selectedWallet]}.`);
      return;
    }

    setMessage(`Для оформления баланса, отправтье ${amount} ${selectedWallet} на кошелек ниже`);
    setWallet(wallets[selectedWallet]);
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
          currency: selectedWallet,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOpen(false)
        alert('Deposit created successfully! Waiting for confirmation.');
        setIsPending(false);
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
      {!isOpen &&<button onClick={()=>{setIsOpen(true)}} className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
        Пополнить
      </button>}
    {isOpen &&<>
      <h2>Пополнения депозита</h2>
      <div className='mb-[10px]'>
        <label htmlFor="amount">Выбрать сумму:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Минимально: ${selectedWallet ? minAmounts[selectedWallet] : '...'} ${selectedWallet}`}
          className='text-blue'
        />
      </div>
      {!isPending && (
        <button onClick={handleDeposit} className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
          Оплатить
        </button>
      )}
      {isPending && (
        <div>
          <p>{message}</p>
          <p>
            <strong>Кошелек:</strong> {wallet}
          </p>
          <button onClick={handlePaid} className="mt-4 bg-[#71baff] text-white text-[16px] font-bold px-[25px] py-[10px] rounded-full hover:bg-gray-200 transition">
            Оплачено
          </button>
        </div>
      )}
    </>}
    </div>
  );
}
