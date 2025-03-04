"use client"
import React from "react";
import Image from "next/image";
// import { Step as StepComponent } from "@/types/sections/step";
import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";

// interface StepProps {
//   step: StepComponent[];
// }

const step = [
  {
      "_createdAt": "2023-09-01T01:37:59Z",
      "_rev": "MDZjMGfJgf06ct7SsVkM0b",
      "_type": "step",
      "_id": "a8bd72f2-1d89-451d-b1c6-401b2aff9dba",
      "title": {
          "text1": "Начни зарабатывать прямо сейчас"
      },
      "_updatedAt": "2023-09-02T15:57:15Z",
      "arrowImage": {
          "alt": "arrow",
          "src": "/step/arrow.svg"
      },
      "article": [
          {
              "content": "Создайте аккаунт за пару минут. Простая и быстрая верификация. 🔑",
              "image": {
                  "alt": "mouse clicking on cryptocurrency",
                  "src": "/step/1.avif"
              },
              "_type": "article",
              "_key": "2abf8f8d4ef3",
              "title": "Регистрация"
          },
          {
              "image": {
                  "alt": "cryptocurrency wallet",
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
                  "alt": "hand holding cryptocurrency",
                  "src": "/step/3.avif"
              },
              "_type": "article",
              "_key": "3f4c2874ce66"
          }
      ]
  }
]

export function StepSection() {
  return (
    <motion.section
      className="px-[15px] sm:px-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#F4F9FF] py-20">
        {step.map((item, index) => (
          <div key={index} className="container mx-auto text-center">
            <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
              {item.title.text1}
            </h2>
            <div className="lg:flex grid justify-center gap-24">
              {item.article.map((arr, index) => (
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
                      object-fit="cover"
                      priority={false}
                      className="mb-4 cursor-pointer mx-auto hover:-translate-y-6 hover:scale-105 transition-all duration-300"
                    />
                    {index < 2 && (
                      <Image
                        src={item.arrowImage.src}
                        width={197} 
                        height={13} 
                        alt={item.arrowImage.alt}
                        object-fit="cover"
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
