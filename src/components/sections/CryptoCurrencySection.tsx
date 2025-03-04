"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale,
  Filler,
  Tooltip
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip);

interface Coin {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  sparkline?: number[];
}

export function CryptoCurrencySection() {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://api.coincap.io/v2/assets", {
          params: { 
            limit: 20,
            interval: "d1"
          }
        });

        const coinsWithSparkline = res.data.data.map(coin => ({
          ...coin,
          // Генеруємо тестові дані для графіка
          sparkline: Array.from({length: 7}, () => 
            parseFloat(coin.priceUsd) * (0.9 + Math.random() * 0.2)
          )
        }));

        setCoins(coinsWithSparkline);
      } catch (error) {
        console.error("Ошибка загрузки криптовалют:", error);
      }
    };

    fetchData();
  }, []);

  const trendingCoins = coins.slice(0, 6);
  const gainerCoins = [...coins].sort((a, b) => 
    parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)
  ).slice(0, 6);
  const recentlyAdded = coins.slice(-6);

  return (
    <section className="-mt-20 sm:mx-12 relative px-[15px] sm:px-5 lg:px-10 max-sm:flex max-sm:justify-center">
      <div className="max-md:w-[max-content] lg:container mx-auto rounded-3xl bg-white py-8 lg:px-4 shadow">
        <article className="grid lg:grid-cols-2 xl:grid-cols-3 md:justify-center w-full">
          <CoinColumn title="Trending" coins={trendingCoins} logoSrc="/coins/logo1.png" />
          <CoinColumn title="Top Gainers" coins={gainerCoins} logoSrc="/coins/logo2.png" />
          <CoinColumn title="Recently Added" coins={recentlyAdded} logoSrc="/coins/logo3.png" />
        </article>
      </div>
    </section>
  );
}

function CoinColumn({ title, coins, logoSrc }) {
  const createGradient = (ctx, color) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 80);
    gradient.addColorStop(0, color + "33");
    gradient.addColorStop(1, color + "00");
    return gradient;
  };

  return (
    <aside className=" px-[5px] sm:px-5 mb-6">
      <div className="flex justify-between mb-6">
        <figure className="font-bold text-lg flex gap-4 items-center">
          <Image src={logoSrc} alt={title} width={16} height={16} className="inline w-[1em] h-[1em] mr-2" />
          {title}
        </figure>
      </div>

      <div className="grid grid-cols-3 mb-4 text-base">
        <span className="text-gray">Name</span>
        <span className="text-gray">Price</span>
        <span className="text-gray">Chart</span>
      </div>

      {coins.map((coin, index) => {
        const isPositive = parseFloat(coin.changePercent24Hr) > 0;
        const chartColor = isPositive ? "#4CAF50" : "#F44336";
        
        return (
          <div key={index} className="flex flex-row justify-between w-full mb-2 py-2 border-b border-lightgray text-sm">
            <figure className="flex items-center">
              <Image 
                src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
                alt={coin.name} 
                width={32} 
                height={32} 
                className="inline w-[1em] h-[1em] mr-2" 
              />
              {coin.name}
            </figure>

            <p className="flex items-center">
              <span className={isPositive ? "text-green mr-1" : "text-red mr-1"}>
                {isPositive ? "+" : ""}
                {parseFloat(coin.changePercent24Hr).toFixed(2)}%
              </span>
              ${parseFloat(coin.priceUsd).toLocaleString()}
            </p>

            <figure className="w-[100px] h-[50px]">
              <Line
                data={{
                  labels: coin.sparkline?.map((_, i) => i) || [],
                  datasets: [
                    {
                      data: coin.sparkline || [],
                      borderColor: chartColor,
                      backgroundColor: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return;
                        return createGradient(ctx, chartColor);
                      },
                      borderWidth: 1.5,
                      pointRadius: 0,
                      fill: "start",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  elements: { 
                    line: { 
                      tension: 0.4,
                      borderJoinStyle: 'round',
                      borderCapStyle: 'round'
                    } 
                  },
                  scales: { 
                    x: { display: false }, 
                    y: { display: false } 
                  },
                  plugins: { 
                    legend: { display: false }, 
                    tooltip: { enabled: false } 
                  }
                }}
              />
            </figure>
          </div>
        )}
      )}
    </aside>
  );
}