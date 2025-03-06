"use client";
import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from '@/store/useLanguageStore';

const security = [
  {
    "_createdAt": "2023-08-30T19:48:10Z",
    "_rev": "Z6Bbpu6kqEP4OfFxEubJhw",
    "_type": "security",
    "_id": "36bb94ea-30a2-4f86-b8ed-30839bf59cd4",
    "title": {
      ru: {
        "text1": "🔒 Безопасность на первом месте в Crypto Corporation 🔒"
      },
      en: {
        "text1": "🔒 Security First at Crypto Corporation 🔒"
      }
    },
    "_updatedAt": "2023-08-30T19:50:11Z",
    "articles": {
      ru: [
        {
          "span": "Безопасность, защита и соответствие",
          "_type": "article",
          "description": "Мы понимаем, что безопасность — ключевой фактор в мире криптовалют. В Crypto Corporation мы используем передовые технологии защиты, чтобы обеспечить максимальную безопасность ваших активов и данных.",
          "_key": "2bed3b2f2d72"
        },
        {
          "span": "🔹 Как мы защищаем наших клиентов?",
          "_type": "article",
          "description": "✅ Многоуровневая система защиты – Данные и средства клиентов хранятся на защищённых серверах с продвинутым шифрованием.",
          "_key": "2bed3b2f2d72"
        },
        {
          "span": "Аппаратные ключи безопасности",
          "_type": "article",
          "description": "✅ Холодные кошельки – Большая часть активов хранится в офлайн-хранилищах, что исключает взломы и утечки.",
          "_key": "e9a2004b98a4"
        },
        {
          "_type": "article",
          "description": "✅ 2FA и биометрическая защита – Двухфакторная аутентификация (2FA), а также современные методы защиты аккаунтов.",
          "_key": "e62336a675f9",
          "span": "Сертификации SOC"
        },
        {
          "_type": "article",
          "description": "✅ DDoS-защита и мониторинг – Постоянный мониторинг сети и защита от кибератак обеспечивают стабильную работу платформы.",
          "_key": "e62336a675f9",
          "span": ""
        },
        {
          "_type": "article",
          "description": "✅ Прозрачные смарт-контракты – Все операции на блокчейне честные и открытые благодаря технологии смарт-контрактов.",
          "_key": "e62336a675f9",
          "span": ""
        },
        {
          "_type": "article",
          "description": "✅ Антифрод-система – Автоматические алгоритмы выявляют подозрительные операции и предотвращают мошенничество.",
          "_key": "e62336a675f9",
          "span": ""
        },
        {
          "_type": "article",
          "description": "✅ Круглосуточная поддержка – Наша команда 24/7 готова помочь в любых вопросах и оперативно реагирует на запросы.",
          "_key": "e62336a675f9",
          "span": ""
        }
      ],
      en: [
        {
          "span": "Safety, security and compliance",
          "_type": "article",
          "description": "We understand that security is a key factor in the world of cryptocurrencies. At Crypto Corporation, we use cutting-edge protection technologies to ensure the maximum safety of your assets and data.",
          "_key": "2bed3b2f2d72"
        },
        {
          "span": "🔹 How do we protect our clients?",
          "_type": "article",
          "description": "✅ Multi-layered security – Client data and funds are stored on secure servers with advanced encryption.",
          "_key": "2bed3b2f2d72"
        },
        {
          "span": "Hardware security keys",
          "_type": "article",
          "description": "✅ Cold wallets – The majority of assets are kept in offline storage, eliminating the risk of hacks and leaks.",
          "_key": "e9a2004b98a4"
        },
        {
          "_type": "article",
          "description": "✅ 2FA and biometric protection – Two-factor authentication (2FA) and modern account security methods.",
          "_key": "e62336a675f9",
          "span": "SOC Certifications"
        },
        {
          "_type": "article",
          "description": "✅ DDoS protection and monitoring – Continuous network monitoring and protection against cyberattacks ensure platform stability.",
          "_key": "e62336a675f9",
          "span": "SOC Certifications"
        },
        {
          "_type": "article",
          "description": "✅ Transparent smart contracts – All blockchain operations are fair and open thanks to smart contract technology.",
          "_key": "e62336a675f9",
          "span": "SOC Certifications"
        },
        {
          "_type": "article",
          "description": "✅ Anti-fraud system – Automated algorithms detect suspicious activities and prevent fraud.",
          "_key": "e62336a675f9",
          "span": "SOC Certifications"
        },
        {
          "_type": "article",
          "description": "✅ 24/7 support – Our team is available round-the-clock to assist with any questions and respond promptly to requests.",
          "_key": "e62336a675f9",
          "span": "SOC Certifications"
        }
      ]
    },
    "image": {
      "_type": "image",
      "alt": {
        ru: "хранилище криптовалют",
        en: "cryptocurrency vault"
      },
      "asset": {
        "_ref": "image-543aff4062c8a9663d4011224b9b93488d526c5d-795x656-png",
        "_type": "reference"
      }
    }
  }
];

export function SecuritySection() {
  const { language } = useLanguageStore();

  return (
    <motion.section
      className="container mx-auto py-[20px] sm:py-32 px-[15px] sm:px-0"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {security.map((item, index) => (
        <div key={index} className="grid lg:grid-cols-2">
          <motion.figure variants={fadeIn("right", "tween", 0.3, 2)}>
            <Image
              src="/security/main.avif"
              width={1920}
              height={1584}
              alt={item.image.alt[language]}
              objectFit="cover"
              priority={false}
            />
          </motion.figure>
          <motion.article
            className="flex justify-center"
            variants={fadeIn("left", "tween", 0.3, 2)}
          >
            <div className="max-w-xl">
              <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                {item.title[language].text1}
              </h2>
              <ul className="my-6">
                {item.articles[language].map((arr, index) => (
                  <li key={index} className="mb-6">
                    {arr.span &&<span>
                      <BsCheckCircleFill className="text-primary inline mr-2" />
                      {arr.span}
                    </span>}
                    <p className="text-gray mt-3">{arr.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </div>
      ))}
    </motion.section>
  );
}