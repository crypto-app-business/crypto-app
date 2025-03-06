"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";
import { useLanguageStore } from '@/store/useLanguageStore';

const step = [
  {
    "_createdAt": "2023-09-01T01:37:59Z",
    "_rev": "MDZjMGfJgf06ct7SsVkM0b",
    "_type": "step",
    "_id": "a8bd72f2-1d89-451d-b1c6-401b2aff9dba",
    "title": {
      ru: {
        "text1": "Начни зарабатывать прямо сейчас"
      },
      en: {
        "text1": "Start earning right now"
      }
    },
    "_updatedAt": "2023-09-02T15:57:15Z",
    "arrowImage": {
      "alt": {
        ru: "стрелка",
        en: "arrow"
      },
      "src": "/step/arrow.svg"
    },
    "article": {
      ru: [
        {
          "content": "Создайте аккаунт за пару минут. Простая и быстрая верификация. 🔑",
          "image": {
            "alt": "мышь кликает на криптовалюту",
            "src": "/step/1.avif"
          },
          "_type": "article",
          "_key": "2abf8f8d4ef3",
          "title": "Регистрация"
        },
        {
          "image": {
            "alt": "криптовалютный кошелёк",
            "src": "/step/2.avif"
          },
          "_type": "article",
          "_key": "263ab02a6649",
          "title": "Пополнение",
          "content": "Внесите средства удобным способом: криптовалютой или фиатом. 💰"
        },
        {
          "title": "Зарабатывайте",
          "content": "Трейдинг, стейкинг, майнинг, NFT – выбирайте свой путь к прибыли! 📈",
          "image": {
            "alt": "рука держит криптовалюту",
            "src": "/step/3.avif"
          },
          "_type": "article",
          "_key": "3f4c2874ce66"
        }
      ],
      en: [
        {
          "content": "Create an account in a few minutes. Simple and fast verification. 🔑",
          "image": {
            "alt": "mouse clicking on cryptocurrency",
            "src": "/step/1.avif"
          },
          "_type": "article",
          "_key": "2abf8f8d4ef3",
          "title": "Registration"
        },
        {
          "image": {
            "alt": "cryptocurrency wallet",
            "src": "/step/2.avif"
          },
          "_type": "article",
          "_key": "263ab02a6649",
          "title": "Deposit",
          "content": "Add funds conveniently: via cryptocurrency or fiat. 💰"
        },
        {
          "title": "Earn",
          "content": "Trading, staking, mining, NFTs – choose your path to profit! 📈",
          "image": {
            "alt": "hand holding cryptocurrency",
            "src": "/step/3.avif"
          },
          "_type": "article",
          "_key": "3f4c2874ce66"
        }
      ]
    }
  }
];

export function StepSection() {
  const { language } = useLanguageStore();

  return (
    <motion.section
      className="px-[15px] sm:px-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div id={"portfolio"} className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#F4F9FF] py-20">
        {step.map((item, index) => (
          <div key={index} className="container mx-auto text-center">
            <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
              {item.title[language].text1}
            </h2>
            <div className="lg:flex grid justify-center gap-24">
              {item.article[language].map((arr, index) => (
                <motion.article
                  key={index}
                  className="text-center relative px-4 mx-2"
                  variants={
                    index === 0
                      ? slideIn("right", "spring", 0.2, 3)
                      : index === 1
                      ? slideIn("right", "spring", 0.2, 4)
                      : slideIn("right", "spring", 0.2, 5)
                  }
                >
                  <figure className="relative mx-2">
                    <Image
                      src={arr.image.src}
                      width={640}
                      height={617}
                      alt={arr.image.alt}
                      objectFit="cover"
                      priority={false}
                      className="mb-4 cursor-pointer mx-auto hover:-translate-y-6 hover:scale-105 transition-all duration-300"
                    />
                    {index < 2 && (
                      <Image
                        src={item.arrowImage.src}
                        width={197}
                        height={13}
                        alt={item.arrowImage.alt[language]}
                        objectFit="cover"
                        priority={false}
                        className="hidden lg:block absolute top-1/2 -right-40"
                      />
                    )}
                  </figure>
                  <h3 className="text-2xl font-bold mb-4">{arr.title}</h3>
                  <p className="text-gray max-w-sm">{arr.content}</p>
                </motion.article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}