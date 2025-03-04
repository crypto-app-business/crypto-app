"use client"
// import { client } from "@/lib/sanity";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import React from "react";
// import { BsCheckCircleFill } from "react-icons/bs";
import { FirstButton } from "../buttons/FirstButton";
// import { Credit as CreditComponent } from "@/types/sections/credit";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

// interface CreditProps {
//   credit: CreditComponent[];
// }

const credit = [
  {
      "_id": "709521f1-a786-4042-a28e-dd856b5d08b2",
      "list": [
          "Up to 3% back on purchases",
          "Earn rewards in bitcoin or any crypto on NEFA",
          "No annual fee"
      ],
      "_updatedAt": "2023-08-29T19:16:45Z",
      "image": {
          "_type": "image",
          "alt": "credit card",
          "asset": {
              "_ref": "image-b80496111c8a54858604f4a4e50a1b52c4e98f2c-872x576-png",
              "_type": "reference"
          }
      },
      "_createdAt": "2023-08-28T19:47:13Z",
      "_rev": "KsXaVvUhkeFH1gwScPDhAi",
      "_type": "credit",
      "subtitle": {
          "text1": "Мы планируем в будущем запустить собственную крипто-карту, которая позволит удобно использовать цифровые активы для повседневных расчетов. Наша цель — обеспечить быструю, безопасную и простую интеграцию криптовалют в реальную экономику, чтобы вы могли расплачиваться своими активами так же легко, как обычной банковской картой. Следите за обновлениями, впереди много интересного! 🚀"
      },
      "title": {
          "span": "Crypto Corporation",
          "text1": "Представляем кредитную карту",
          "text2": " Credit Card"
      }
  }
]

export function CreditCard() {
  return (
    <motion.section
      className="container mx-auto py-[20px] sm:py-32 px-[15px] sm:px-0"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {credit.map((item, index) => (
          <React.Fragment key={index}>
            <motion.figure
              className="mb-12 px-4 md:px-4"
              variants={fadeIn("right", "tween", 0.3, 2)}
            >
              <Image
                key={index}
                src="/credit/main.png" 
                width={1920} 
                height={1268} 
                // eslint-disable-next-line react-hooks/rules-of-hooks
                // {...useNextSanityImage(client, item.image.asset._ref)}
                alt={item.image.alt}
                object-fit="cover"
                priority={false}
              />
            </motion.figure>
            <motion.article
              className="flex justify-center"
              variants={fadeIn("left", "tween", 0.3, 2)}
            >
              <div className="max-w-md">
                <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                  {item.title.text1}
                  <span className="text-blue-gradient">{item.title.span}</span>
                  {/* {item.title.text2} */}
                </h2>
                <p className="text-gray my-6">
                  {item.subtitle.text1}
                  {/* <span>{item.subtitle.span}</span> */}
                </p>
                {/* <ul className="my-6">
                  {item.list.map((arr, index) => (
                    <li key={index} className="mb-2">
                      <BsCheckCircleFill className="text-primary inline mr-2" />
                      {arr}
                    </li>
                  ))}
                </ul> */}
                <FirstButton className={""} onClick={undefined}>
                  Join the waitlist
                </FirstButton>
              </div>
            </motion.article>
          </React.Fragment>
        ))}
      </div>
    </motion.section>
  );
}
