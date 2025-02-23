import { MoonLoader } from 'react-spinners';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RequestStatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | null;
  message?: string;
  onHide?: () => void;
}

export default function RequestStatusIndicator({ status, message, onHide }: RequestStatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(!!status);

  useEffect(() => {
    if (status && (status === 'success' || status === 'error')) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onHide) onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsVisible(!!status);
  }, [status, onHide]);

  if (!isVisible || !status) {
    return null;
  }

  const getContent = () => {
    switch (status) {
      case 'loading':
        return <MoonLoader color="#9333EA" size={100} />;
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-row gap-[10px] items-center"
          >
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
            >
              {/* Плавна зміна кольору кола */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                strokeWidth="6"
                initial={{ fill: "#3581FF33" }}
                animate={{ fill: "#3581FF" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              {/* Плавне відмальовування галочки за 2 секунди */}
              <motion.path
                d="M30 50 L45 65 L70 35"
                stroke="#fff"
                strokeWidth="6"
                fill="none"
                initial={{ strokeDasharray: "60, 80", strokeDashoffset: 50 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </motion.svg>
            <p className="text-white text-[24px] font-bold mt-2">{message || 'Виконано!'}</p>
          </motion.div>
        );
      case 'error':
        return <p className="text-white text-[24px] font-bold">{message || 'Помилка!'}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00163A80] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center min-h-[200px] p-4 rounded">
        {getContent()}
      </div>
    </div>
  );
}
