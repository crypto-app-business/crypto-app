"use client"
import React from "react";
import { SecondButton } from "../buttons/SecondButton";
// import { client } from "@/lib/sanity";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
// import { Trading as TradingComponent } from "@/types/sections/trading";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

// interface TradingProps {
//   trading: TradingComponent[];
// }

const trading = [
  {
    "_updatedAt": "2023-08-28T20:51:59Z",
    "articles": [
      {
        "_key": "a7c184e4dfe3",
        "title": "Мы —Crypto Corporation ,",
        "_type": "article",
        "description": " ведущая компания в мире криптовалют, предлагающая полный спектр услуг: трейдинг, майнинг, листинг, стейкинг, NFT, а также собственную криптовалюту!"
      },
      {
        "_key": "01f1c2ef2e7d",
        "title": "Почему выбирают нас?",
        "_type": "article",
        "description": `✅ Профессиональный трейдинг – Максимальная прибыль благодаря мощным аналитическим инструментам и торговым стратегиям.`
      },
      {
        "_key": "01f1c2ef2e7d",
        "title": "",
        "_type": "article",
        "description": `✅ Майнинг нового уровня – Эффективные технологии для высокой доходности, выгодные условия для майнеров.`
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
    "image": {
      "_type": "image",
      "alt": "trading tool",
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
      "span": "крипто-корпорации 🚀",
      "text1": "🚀 Преимущества нашей "
    }
  }
]

export function TradingSection() {
  return (
    <motion.section
      className="px-[15px] sm:px-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {trading.map((item, index) => (
        <div
          key={index}
          className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#F4F9FF] py-20"
        >
          <div className="grid lg:grid-cols-2 max-md:justify-items-center gap-6">
            <motion.div
              className="max-w-lg lg:row-start-1 px-[5px] ml-0 sm:ml-12"
              variants={fadeIn("right", "tween", 0.3, 2)}
            >
              <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                {item.title.text1}
                <span className="text-blue-gradient">{item.title.span}</span>
              </h2>
              {item.articles.map((arr, index) => (
                <article key={index} className="mb-6">
                  <h3 className="font-bold text-xl mb-4">{arr.title}</h3>
                  <p className="text-gray">{arr.description}</p>
                </article>
              ))}
              <SecondButton className={""} onClick={undefined}>
                Get Started
              </SecondButton>
              <a href="#" className="py-4 px-10 text-primary underline">
                Learn More
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
                alt={item.image.alt}
                object-fit="cover"
                priority={false}
              />
            </motion.figure>
          </div>
        </div>
      ))}
    </motion.section>
  );
}
