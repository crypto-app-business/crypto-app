import React from 'react';

const TeamComponent = () => {
  const data = {
    activePartners: 0,
    personalPartners: 8,
    totalPartners: 38,
    lines: Array.from({ length: 10 }, (_, i) => `Линия ${i + 1}`),
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-md ">
      <h3 className="text-2xl font-bold mb-4">Команда</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="text-xl font-semibold">{data.activePartners}</div>
          <div className="text-gray-300">Активных партнёров</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl font-semibold">{data.personalPartners}</div>
          <div className="text-gray-300">Личные партнёры</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xl font-semibold">{data.totalPartners}</div>
          <div className="text-gray-300">Всего</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-[20px]">
        {data.lines.map((line, index) => (
          <button
            key={index}
            className="bg-purple-700 hover:bg-purple bg-[#7001a6] text-white min-w-[200px] py-2 px-4 rounded-lg text-sm font-medium shadow"
          >
            {line}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeamComponent;
