"use client"
// import { client } from "@/lib/sanity";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import { SecondButton } from "../buttons/SecondButton";
import { SelectCurrencyButton } from "../buttons/SelectCurrencyButton";
// import { useState } from "react";
// import { Buy as BuyComponent } from "@/types/sections/buy";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

// interface BuyProps {
//   buy: BuyComponent[];
// }

// const formHandler = (e: any) => {
//   e.preventDefault();
// };

// const inputChangeHandler = (e: any) => {
//   console.log(e.target.value);
// };

const buy = [
            {
                "_type": "buy",
                "description": [
                    "Buy now and get 40% extra bonus Minimum pre-sale amount",
                    "25 Crypto Coin. We accept BTC crypto-currency"
                ],
                "_id": "e45717cd-2a64-49c6-918e-4b46dad47b4b",
                "title": {
                    "text1": "Buy & trade on the",
                    "text2": "original crypto exchange."
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
  // const [inputFirstValue, setInputFirstValue] = useState<string>("5,000");
  // const [inputSecondValue, setInputSecondValue] = useState<string>("0.10901");
  
  const item = buy[0];
  const descriptionParts = item.description;

  // const handleCurrencyChange = (selectedCurrency: any) => {
  //   setSelectedCurrency(selectedCurrency);
  // };

  // useEffect(() => {
  //   setInputFirstValue("5,000");
  //   setInputSecondValue("0.10901");
  // }, []);

  return (
    <motion.section
      className="container mx-auto mt-24 flex items-center"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="grid lg:grid-cols-2 max-md:justify-items-center gap-10 px-16 lg:p-12">
        <div className="flex items-center md:justify-center">
          <motion.div
            className="max-w-xl"
            variants={fadeIn("right", "tween", 0.2, 2)}
          >
            <h2 className="font-bold text-4xl mb-6 leading-normal">
              {item.title.text1}
              <br />
              {item.title.text2}
            </h2>
            <p className="text-gray mb-6">
              {descriptionParts[0]}
              <br />
              {descriptionParts[1]}
            </p>
            <form onSubmit={()=>{}}>
            {/* <form onSubmit={formHandler}> */}
              <div className="flex justify-between gap-4 md:gap-6 mb-6">
                <div className="border border-primary rounded-2xl py-3 md:py-4 px-4 md:px-6 flex items-center w-full">
                  <div className="border-r border-primary pr-4 md:pr-6">
                    <small className="text-primary">Amount</small>
                  </div>
                  {/* <label htmlFor="firstvalue"> */}
                    {/* <input
                      type="text"
                      id="firstvalue"
                      value={inputFirstValue}
                      onChange={()=> {}}
                      // onChange={(e)=>setInputFirstValue(e.target.value)}
                      className="text-right outline-none w-full"
                    /> */}
                    {/* <input
                      // id="firstvalue"
                      className="text-right outline-none w-full"
                    >
                    </input> */}
                  {/* </label> */}
                </div>
                <SelectCurrencyButton
                  value="BTC"
                  // onChange={handleCurrencyChange}
                  onChange={()=>{}}
                />
              </div>

              <div className="flex justify-between gap-4 md:gap-6 mb-6">
                <div className="border border-primary rounded-2xl py-3 md:py-4 px-4 md:px-6 flex items-center w-full">
                  <div className="border-r border-primary pr-4 md:pr-14">
                    <small className="text-primary">Get</small>
                  </div>
                  {/* <label htmlFor="secondvalue">
                    <input
                      type="text"
                      id="secondvalue"
                      value={inputSecondValue}
                      onChange={(e)=>setInputSecondValue(e.target.value)}
                      className="text-right outline-none w-full"
                    />
                  </label> */}
                </div>
                <SelectCurrencyButton
                  value="USD"
                  // onChange={handleCurrencyChange}
                  onChange={()=>{}}
                />
              </div>
            </form>
            <SecondButton className="w-full" onClick={undefined}>
              Buy Now
            </SecondButton>
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
