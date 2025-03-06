"use client";
import React from "react";
import { SecondButton } from "../buttons/SecondButton";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from "next/link";

const trading = [
  {
    "_updatedAt": "2023-08-28T20:51:59Z",
    "articles": {
      ru: [
        {
          "_key": "a g7c184e4dfe3",
          "title": "Мы — Crypto Corporation,",
          "_type": "article",
          "description": "ведущая компания в мире криптовалют, предлагающая полный спектр услуг: трейдинг, майнинг, листинг, стейкинг, NFT, а также собственную криптовалюту!"
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "Почему выбирают нас?",
          "_type": "article",
          "description": "✅ Профессиональный трейдинг – Максимальная прибыль благодаря мощным аналитическим инструментам и торговым стратегиям."
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "",
          "_type": "article",
          "description": "✅ Майнинг нового уровня – Эффективные технологии для высокой доходности, выгодные условия для майнеров."
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "",
          "_type": "article",
          "description": "✅ Листинг на топовых платформах – Помогаем криптопроектам выйти на рынок и привлечь инвесторов."
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "",
          "_type": "article",
          "description": "✅ Стейкинг с выгодными процентами – Ваши активы работают на вас! Стабильный пассивный доход без сложностей."
        },
        {
          "_type": "article",
          "description": "✅ NFT-экосистема – Создавайте, покупайте и продавайте уникальные цифровые активы на нашей платформе.",
          "_key": "f66a1bceef7e",
          "title": ""
        },
        {
          "_type": "article",
          "description": "✅ Собственная монета – Перспективный актив с реальными кейсами использования и ростом.",
          "_key": "f66a1bceef7e",
          "title": ""
        },
        {
          "_type": "article",
          "description": "✅ Лучшая поддержка – Работаем 24/7, всегда готовы помочь нашим клиентам и партнёрам.",
          "_key": "f66a1bceef7e",
          "title": ""
        },
        {
          "_type": "article",
          "description": "🌍 Будущее за криптовалютами и цифровыми активами – будьте на шаг впереди с нами! 🌍",
          "_key": "f66a1bceef7e",
          "title": ""
        },
      ],
      en: [
        {
          "_key": "a7c184e4dfe3",
          "title": "We are Crypto Corporation,",
          "_type": "article",
          "description": "a leading company in the cryptocurrency world, offering a full range of services: trading, mining, listing, staking, NFTs, and our own cryptocurrency!"
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "Why choose us?",
          "_type": "article",
          "description": "✅ Professional Trading – Maximum profit with powerful analytical tools and trading strategies."
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "",
          "_type": "article",
          "description": "✅ Next-Level Mining – Efficient technologies for high returns and favorable conditions for miners."
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "",
          "_type": "article",
          "description": "✅ Listing on Top Platforms – Helping crypto projects enter the market and attract investors."
        },
        {
          "_key": "01f1c2ef2e7d",
          "title": "",
          "_type": "article",
          "description": "✅ Staking with High Returns – Your assets work for you! Stable passive income without complications."
        },
        {
          "_type": "article",
          "description": "✅ NFT Ecosystem – Create, buy, and sell unique digital assets on our platform.",
          "_key": "f66a1bceef7e",
          "title": ""
        },
        {
          "_type": "article",
          "description": "✅ Our Own Coin – A promising asset with real use cases and growth potential.",
          "_key": "f66a1bceef7e",
          "title": ""
        },
        {
          "_type": "article",
          "description": "✅ Top Support – We work 24/7, always ready to assist our clients and partners.",
          "_key": "f66a1bceef7e",
          "title": ""
        },
        {
          "_type": "article",
          "description": "🌍 The future belongs to cryptocurrencies and digital assets – stay ahead with us! 🌍",
          "_key": "f66a1bceef7e",
          "title": ""
        },
      ]
    },
    "image": {
      "_type": "image",
      "alt": {
        ru: "инструмент для трейдинга",
        en: "trading tool"
      },
      "asset": {
        "_ref": "image-91571d33660540e32da09f556eeb9d446add0b44-838x756-png",
        "_type": "reference"
      }
    },
    "_createdAt": "2023-08-28T20:29:28Z",
    "_rev": "KsXaVvUhkeFH1gwScNpkt7",
    "_type": "trading",
    "_id": "1c65db08-5483-4e22-93a6-fffd0e807e0c",
    "title": {
      ru: {
        "span": "крипто-корпорации 🚀",
        "text1": "🚀 Преимущества нашей "
      },
      en: {
        "span": "Crypto Corporation 🚀",
        "text1": "🚀 Benefits of our "
      }
    }
  }
];

export function TradingSection() {
  const { language } = useLanguageStore();

  const translations = {
    getStarted: {
      ru: "Начать",
      en: "Get Started",
    },
    learnMore: {
      ru: "Узнать больше",
      en: "Learn More",
    },
  };

  return (
    <motion.section
      className="px-[15px] sm:px-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {trading.map((item, index) => (
        <div
          id={"nft"}
          key={index}
          className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#F4F9FF] py-20"
        >
          <div className="grid lg:grid-cols-2 max-md:justify-items-center gap-6">
            <motion.div
              className="max-w-lg lg:row-start-1 px-[5px] ml-0 sm:ml-12"
              variants={fadeIn("right", "tween", 0.3, 2)}
            >
              <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                {item.title[language].text1}
                <span className="text-blue-gradient">{item.title[language].span}</span>
              </h2>
              {item.articles[language].map((arr, index) => (
                <article key={index} className="mb-6">
                  <h3 className="font-bold text-xl mb-4">{arr.title}</h3>
                  <p className="text-gray">{arr.description}</p>
                </article>
              ))}
              <Link href="/login">
                <SecondButton className={""} onClick={undefined}>
                  {translations.getStarted[language]}
                </SecondButton>
              </Link>
                <a href="/login" className="py-4 px-10 text-primary underline">
                  {translations.learnMore[language]}
                </a>
            </motion.div>
            <motion.figure
              className="mb-8 row-start-1"
              variants={fadeIn("left", "tween", 0.3, 2)}
            >
              <Image
                src="/trading/main.avif"
                width={1920}
                height={1732}
                alt={item.image.alt[language]}
                objectFit="cover"
                priority={false}
              />
            </motion.figure>
          </div>
        </div>
      ))}
    </motion.section>
  );
}