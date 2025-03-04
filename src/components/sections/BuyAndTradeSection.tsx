"use client"
import Image from "next/image";
import { SecondButton } from "../buttons/SecondButton";
import { SelectCurrencyButton } from "../buttons/SelectCurrencyButton";
import { useState } from "react";
// import { Buy as BuyComponent } from "@/types/sections/buy";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import Link from "next/link";

// interface BuyProps {
//   buy: BuyComponent[];
// }

const buy = [
  {
    "_type": "buy",
    "description": [
      "Купи на присейле нашу монету и заработай на листинге от 1000%",
    ],
    "_id": "e45717cd-2a64-49c6-918e-4b46dad47b4b",
    "title": {
      "text1": "Покупай, меняй,",
      "text2": "выдерживай и зарабатывай!"
    },
    "_updatedAt": "2023-08-03T02:31:28Z",
    "image": {
      "asset": {
        "_type": "reference",
        "_ref": "image-8a307543e65df66898c2c1da156b4d13b7ab069d-669x625-png"
      },
      "_type": "image",
      "alt": "buy crypto"
    },
    "_createdAt": "2023-08-03T02:31:28Z",
    "_rev": "tKuZUEA2mvrrqefebNcxmT"
  }
]

export function BuyAndTradeSection() {
  // const [selectedCurrency, setSelectedCurrency] = useState<any[]>([]);
  const [inputFirstValue, setInputFirstValue] = useState<string>('1000');
  const [inputSecondValue, setInputSecondValue] = useState<string>('10000');

  const item = buy[0];
  const descriptionParts = item.description;

  // const handleCurrencyChange = (selectedCurrency: any) => {
  //   setSelectedCurrency(selectedCurrency);
  // };

  const handleFirstInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setInputFirstValue(value);
      setInputSecondValue((Number(value) * 10).toString());
    }
  };

  const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setInputSecondValue(value);
      setInputFirstValue((Number(value) / 10).toString());
    }
  };

  const formatNumber = (value: string) => {
    return Number(value).toLocaleString('en-US');
  };

  return (
    <motion.section
      className="container mx-auto mt-24 flex items-center mb-[20px]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="grid lg:grid-cols-2 max-md:justify-items-center gap-10 px-[15px] sm:px-16 lg:p-12">
        <div className="flex items-center md:justify-center">
          <motion.div
            className="max-w-xl"
            variants={fadeIn("right", "tween", 0.2, 2)}
          >
            <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
              {item.title.text1}
              <br />
              {item.title.text2}
            </h2>
            <p className="text-gray mb-6">
              {descriptionParts[0]}
              <br />
              {descriptionParts[1]}
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex justify-between gap-4 md:gap-6 mb-6">
                <div className="border border-primary rounded-2xl py-3 md:py-4 px-4 md:px-6 flex items-center w-full max-w-[370px]">
                  <div className="border-r border-primary pr-4 md:pr-6">
                    <small className="text-primary">Количество</small>
                  </div>
                  <label htmlFor="firstvalue">
                    <input
                      type="text"
                      id="firstvalue"
                      value={formatNumber(inputFirstValue)}
                      onChange={handleFirstInputChange}
                      className="text-right outline-none w-full"
                    />
                  </label>

                </div>
                <SelectCurrencyButton
                  value="USD"
                />
              </div>

              <div className="flex justify-between gap-4 md:gap-6 mb-6">
                <div className="border border-primary rounded-2xl py-3 md:py-4 px-4 md:px-6 flex items-center w-full max-w-[370px]">
                  <div className="border-r border-primary pr-4 md:pr-8">
                    <small className="text-primary">Получаете</small>
                  </div>
                  <label htmlFor="secondvalue">
                    <input
                      type="text"
                      id="secondvalue"
                      value={formatNumber(inputSecondValue)}
                      onChange={handleSecondInputChange}
                      className="text-right outline-none w-full"
                    />
                  </label>
                </div>
                <SelectCurrencyButton
                  value="CC"
                />
              </div>
            </form>
            <Link href='/login'>
              <SecondButton className="w-full" onClick={() => { }}>
                Купить
              </SecondButton>
            </Link>
          </motion.div>
        </div>
        <motion.figure
          className="row-start-1 xl:col-start-2"
          variants={fadeIn("left", "tween", 0.3, 2)}
        >
          <Image
            src="/coins/buySection/main.avif"
            alt={item.image.alt}
            width={800}
            height={800}
            priority={false}
          />
        </motion.figure>
      </div>
    </motion.section>
  );
}