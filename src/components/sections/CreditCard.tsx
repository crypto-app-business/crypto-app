"use client";
import Image from "next/image";
import React from "react";
import { FirstButton } from "../buttons/FirstButton";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from "next/link";

const credit = [
  {
    "_id": "709521f1-a786-4042-a28e-dd856b5d08b2",
    "list": {
      ru: [
        "До 3% возврата за покупки",
        "Зарабатывайте вознаграждения в биткоинах или любой криптовалюте на NEFA",
        "Нет годовой комиссии"
      ],
      en: [
        "Up to 3% back on purchases",
        "Earn rewards in bitcoin or any crypto on NEFA",
        "No annual fee"
      ]
    },
    "_updatedAt": "2023-08-29T19:16:45Z",
    "image": {
      "_type": "image",
      "alt": {
        ru: "кредитная карта",
        en: "credit card"
      },
      "asset": {
        "_ref": "image-b80496111c8a54858604f4a4e50a1b52c4e98f2c-872x576-png",
        "_type": "reference"
      }
    },
    "_createdAt": "2023-08-28T19:47:13Z",
    "_rev": "KsXaVvUhkeFH1gwScPDhAi",
    "_type": "credit",
    "subtitle": {
      ru: {
        "text1": "Мы планируем в будущем запустить собственную крипто-карту, которая позволит удобно использовать цифровые активы для повседневных расчетов. Наша цель — обеспечить быструю, безопасную и простую интеграцию криптовалют в реальную экономику, чтобы вы могли расплачиваться своими активами так же легко, как обычной банковской картой. Следите за обновлениями, впереди много интересного! 🚀"
      },
      en: {
        "text1": "We plan to launch our own crypto card in the future, allowing convenient use of digital assets for everyday transactions. Our goal is to provide fast, secure, and simple integration of cryptocurrencies into the real economy, so you can pay with your assets as easily as with a regular bank card. Stay tuned for updates—exciting things are ahead! 🚀"
      }
    },
    "title": {
      ru: {
        "span": "Crypto Corporation",
        "text1": "Представляем кредитную карту",
        "text2": " Credit Card"
      },
      en: {
        "span": "Crypto Corporation",
        "text1": "Introducing the",
        "text2": " Credit Card"
      }
    }
  }
];

export function CreditCard() {
  const { language } = useLanguageStore();

  const translations = {
    joinWaitlist: {
      ru: "Присоединиться к списку ожидания",
      en: "Join the waitlist",
    },
  };

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
                alt={item.image.alt[language]}
                objectFit="cover"
                priority={false}
              />
            </motion.figure>
            <motion.article
              className="flex justify-center"
              variants={fadeIn("left", "tween", 0.3, 2)}
            >
              <div className="max-w-md">
                <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                  {item.title[language].text1}
                  <span className="text-blue-gradient">{item.title[language].span}</span>
                  {/* {item.title[language].text2} */}
                </h2>
                <p className="text-gray my-6">
                  {item.subtitle[language].text1}
                </p>
                {/* <ul className="my-6">
                  {item.list[language].map((arr, index) => (
                    <li key={index} className="mb-2">
                      <BsCheckCircleFill className="text-primary inline mr-2" />
                      {arr}
                    </li>
                  ))}
                </ul> */}
                <Link href="/login">
                  <FirstButton className={""} onClick={undefined}>
                    {translations.joinWaitlist[language]}
                  </FirstButton>
                </Link>
              </div>
            </motion.article>
          </React.Fragment>
        ))}
      </div>
    </motion.section>
  );
}