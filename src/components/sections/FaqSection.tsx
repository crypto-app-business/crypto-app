"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BsChevronDown } from "react-icons/bs";
import classNames from "classnames";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from "@/store/useLanguageStore";

interface FaqItemProps {
  open?: boolean; // Необов'язковий проп
  title: string;
  children: string;
}

const faq = [
  {
    "image": {
      "_type": "image",
      "alt": {
        ru: "faq криптовалюта",
        en: "faq cryptocurrency"
      },
      "src": "/faq/main.avif"
    },
    "_createdAt": "2023-09-01T00:41:42Z",
    "subtitle": {
      ru: "Помощь",
      en: "Help"
    },
    "_type": "faq",
    "title": {
      ru: {
        "text1": "Часто задаваемые вопросы"
      },
      en: {
        "text1": "Frequently Asked Questions"
      }
    },
    "_rev": "MDZjMGfJgf06ct7SsVwL05",
    "_id": "97fa3a26-9439-48f3-a968-d079d4554acc",
    "_updatedAt": "2023-09-02T19:07:37Z",
    "articles": {
      ru: [
        {
          "title": "Где найти социальные сети компании?",
          "content": `
            Присоединяйтесь к нашим социальным сетям!\n
            Новостной телеграмм канал компании - https://t.me/crypto_corporation_rus\n
            Телеграм канал (для трейдера) - https://t.me/cc_trade_channel\n
            Гостевой чат - https://t.me/cc_guest_chat\n
            Ютуб канал - https://www.youtube.com/@Crypto_CC_Corporation\n
            Инстаграм компании - https://www.instagram.com/crypto_corporation_cc/
          `,
          "_type": "article",
          "_key": "70e86e62febf"
        },
        {
          "_type": "article",
          "_key": "7fbbf3c4edcc",
          "title": "Как связаться с поддержкой?",
          "content": "Официальная поддержка компании - @Crypto_corporation_support"
        },
        {
          "_type": "article",
          "_key": "f086ad3ad37d",
          "title": "Где взять презентацию компании?",
          "content": "Скачать презентацию"
        }
      ],
      en: [
        {
          "title": "Where can I find the company's social media?",
          "content": `
            Join our social networks!\n
            Company news Telegram channel - https://t.me/crypto_corporation_rus\n
            Telegram channel (for traders) - https://t.me/cc_trade_channel\n
            Guest chat - https://t.me/cc_guest_chat\n
            YouTube channel - https://www.youtube.com/@Crypto_CC_Corporation\n
            Company Instagram - https://www.instagram.com/crypto_corporation_cc/
          `,
          "_type": "article",
          "_key": "70e86e62febf"
        },
        {
          "_type": "article",
          "_key": "7fbbf3c4edcc",
          "title": "How to contact support?",
          "content": "Official company support - @Crypto_corporation_support"
        },
        {
          "_type": "article",
          "_key": "f086ad3ad37d",
          "title": "Where can I get the company presentation?",
          "content": "Download presentation"
        }
      ]
    }
  }
];

// Функція для обробки тексту з підтримкою посилань і переносів рядків
const renderContentWithLinks = (content, language) => {
  const urlRegex = /(https?:\/\/[^\s]+)|(@\w+)/g;
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = line.split(urlRegex).filter(Boolean);

    return (
      <React.Fragment key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (/https?:\/\/[^\s]+/.test(part)) {
            return (
              <a
                key={`${lineIndex}-${partIndex}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {part}
              </a>
            );
          } else if (part.startsWith("@")) {
            const telegramHandle = part.substring(1);
            return (
              <a
                key={`${lineIndex}-${partIndex}`}
                href={`https://t.me/${telegramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {part}
              </a>
            );
          } else if (part === "Скачать презентацию" || part === "Download presentation") {
            return (
              <a
                key={`${lineIndex}-${partIndex}`}
                href={`${language==='ru'? '/CryptoCorporationRU.pdf' : '/CryptoCorporationENG.pdf'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {part}
              </a>
            );
          } else {
            return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
          }
        })}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

const FaqItem = ({ open, title, children }: FaqItemProps) => {
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(!!open);

  const iconClass = classNames({
    "transition-all duration-300": true,
    "rotate-180": isOpen,
  });

  const contentClass = classNames({
    "text-gray transition-all duration-300 overflow-hidden": true,
    "h-full": isOpen,
    "h-0": !isOpen,
  });

  return (
    <article className="mb-3 border-b border-lightgray pb-4">
      <aside
        className="flex justify-between py-3 cursor-pointer hover:text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <BsChevronDown className={iconClass} />
      </aside>
      <aside className={contentClass}>
        <p className="select-none">
          {children && renderContentWithLinks(children, language)}
        </p>
      </aside>
    </article>
  );
};

export function FaqSection() {
  const { language } = useLanguageStore();

  return (
    <motion.section
      className="container mx-auto py-[20px] sm:py-32 px-[15px] sm:px-0"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {faq.map((item, index) => (
        <div key={index} className="grid lg:grid-cols-2">
          <motion.figure variants={fadeIn("right", "tween", 0.3, 2)}>
            <Image
              src={item.image.src}
              width={640}
              height={505}
              alt={item.image.alt[language]}
              objectFit="cover"
              priority={false}
            />
          </motion.figure>
          <article className="flex justify-center">
            <motion.div
              className="max-w-xl"
              variants={fadeIn("left", "tween", 0.3, 2)}
            >
              <span className="text-primary">{item.subtitle[language]}</span>
              <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                {item.title[language].text1}
              </h2>
              <div className="my-6">
                {item.articles[language].map((arr, index) => (
                  <FaqItem key={index} title={arr.title}>
                    {arr.content}
                  </FaqItem>
                ))}
              </div>
            </motion.div>
          </article>
        </div>
      ))}
    </motion.section>
  );
}