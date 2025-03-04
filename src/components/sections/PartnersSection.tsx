"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";
import { useLanguageStore } from '@/store/useLanguageStore';

const partners = [
  {
    "description": {
      ru: "Мы сотрудничаем с бесчисленным множеством крупных организаций по всему миру.",
      en: "We collaborate with countless major organizations worldwide."
    },
    "_id": "4675d7a8-cfe4-4fd7-82ff-d2773feb1016",
    "title": {
      ru: {
        "text1": "Биржи"
      },
      en: {
        "text1": "Exchanges"
      }
    },
    "_updatedAt": "2023-08-29T14:38:13Z",
    "partner": [
      {
        "image": {
          "alt": {
            ru: "партнёр первый",
            en: "partner one"
          },
          "src": "/partners/BYBIT.png"
        },
        "_type": "partnerimage",
        "_key": "d15ac4cc476f"
      },
      {
        "_key": "5e7bd55ae0a3",
        "image": {
          "alt": {
            ru: "партнёр второй",
            en: "partner two"
          },
          "src": "/partners/BINANCE.png"
        },
        "_type": "partnerimage"
      },
      {
        "image": {
          "alt": {
            ru: "партнёр третий",
            en: "partner three"
          },
          "src": "/partners/OKX.png"
        },
        "_type": "partnerimage",
        "_key": "11a5d3ba1f2f"
      },
      {
        "image": {
          "alt": {
            ru: "партнёр четвёртый",
            en: "partner four"
          },
          "src": "/partners/BINGX.png"
        },
        "_type": "partnerimage",
        "_key": "fb6ff5e72dd6"
      }
    ],
    "_createdAt": "2023-08-28T18:59:48Z",
    "_rev": "Z6Bbpu6kqEP4OfFxEtyhbM",
    "_type": "partners"
  }
];

export const PartnersSection = () => {
  const { language } = useLanguageStore();

  return (
    <motion.section
      className="px-[15px] sm:px-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="rounded-3xl bg-[#F4F9FF] py-20">
        <div className="container mx-auto">
          {partners.map((partner, index) => (
            <article className="text-center m-4" key={index}>
              <h2 className="text-3xl font-bold mb-4">{partner.title[language].text1}</h2>
              <p className="text-gray">{partner.description[language]}</p>
              <article className="mx-4">
                <div className="grid lg:grid-cols-4 grid-cols-1 justify-items-center gap-6">
                  {partner.partner.map((item, index) => (
                    <motion.figure
                      variants={
                        index === 0
                          ? slideIn("right", "spring", 0.2, 2)
                          : index === 1
                          ? slideIn("right", "spring", 0.2, 3)
                          : index === 2
                          ? slideIn("right", "spring", 0.2, 4)
                          : slideIn("right", "spring", 0.2, 5)
                      }
                      key={index}
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt[language]}
                        width={1920}
                        height={1595}
                        objectFit="cover"
                        priority={false}
                      />
                    </motion.figure>
                  ))}
                </div>
              </article>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};