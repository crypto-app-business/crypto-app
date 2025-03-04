'use client'
// import { BsChevronDown } from "react-icons/bs";
// import classNames from "classnames";

interface Coin {
  name: string;
  code: string;
  icon: string;
  alt: string;
}

interface Props {
  value: string;
}

export function SelectCurrencyButton({ value = "BTC" }: Props) {
  const data: Coin[] = [
    {
      name: "BTC",
      code: "BTC",
      icon: "btc.svg",
      alt: "Bitcoin",
    },
    {
      name: "USD",
      code: "USD",
      icon: "usd.svg",
      alt: "Dollar",
    },
    {
      name: "CC",
      code: "CC",
      icon: "COIN.png",
      alt: "CC",
    },
  ];

  const selectedCoin = data.find(({ code }) => code === value) || data[0];

  return (
    <div className="relative min-w-[115px]">
      <div className="border border-primary rounded-2xl py-3 md:py-4 px-4 md:px-6 flex items-center cursor-default">
        <figure className="w-[26px] pr-2">
          <img
            src={selectedCoin.icon}
            alt={selectedCoin.alt}
            className="flex items-center"
          />
        </figure>
        <span className="inline-block mr-2">{selectedCoin.name}</span>
        {/* <BsChevronDown className="opacity-50" /> */}
      </div>
    </div>
  );
}