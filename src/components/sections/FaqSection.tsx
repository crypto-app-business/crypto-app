"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BsChevronDown } from "react-icons/bs";
import classNames from "classnames";
import { Faq as FaqComponent } from "@/types/sections/faq";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

interface FaqProps {
  faq: FaqComponent[];
  open?: boolean;
  title?: string;
  children?: string;
}

const faq = [
  {
    "image": {
      "_type": "image",
      "alt": "faq criptocurrency",
      "asset": {
        "_ref": "image-78594d43fe13ca66a511d352017ec0ba833e5f67-732x578-png",
        "_type": "reference"
      }
    },
    "_createdAt": "2023-09-01T00:41:42Z",
    "subtitle": "Помощь",
    "_type": "faq",
    "title": {
      "text1": "Часто задаваемые вопросы"
    },
    "_rev": "MDZjMGfJgf06ct7SsVwL05",
    "_id": "97fa3a26-9439-48f3-a968-d079d4554acc",
    "_updatedAt": "2023-09-02T19:07:37Z",
    "articles": [
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
    ]
  }
];

// Функція для обробки тексту з підтримкою посилань і переносів рядків
const renderContentWithLinks = (content: string) => {
  // Регулярний вираз для URL і Telegram-ніків
  const urlRegex = /(https?:\/\/[^\s]+)|(@\w+)/g;
  const lines = content.split("\n"); // Розбиваємо на рядки

  return lines.map((line, lineIndex) => {
    const parts = line.split(urlRegex).filter(Boolean); // Розбиваємо на частини з URL і текстом

    return (
      <React.Fragment key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (/https?:\/\/[^\s]+/.test(part)) {
            // Обробка звичайних URL
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
            // Обробка Telegram-ніків
            const telegramHandle = part.substring(1); // Прибираємо "@"
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
          } else if (part.startsWith("Скачать презентацию")) {
            // Обробка Telegram-ніків
            // const telegramHandle = part.substring(1); // Прибираємо "@"
            return (
              <a
                key={`${lineIndex}-${partIndex}`}
                href={`/CryptoCorporationRU.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {part}
              </a>
            );
          } else {
            // Звичайний текст
            return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
          }
        })}
        {lineIndex < lines.length - 1 && <br />} {/* Додаємо перенос після кожного рядка, крім останнього */}
      </React.Fragment>
    );
  });
};

const FaqItem = ({ open, title, children }: FaqProps) => {
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
          {children && renderContentWithLinks(children)}
        </p>
      </aside>
    </article>
  );
};

export function FaqSection() {
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
              src="/faq/main.avif"
              width={640}
              height={505}
              alt={item.image.alt}
              objectFit="cover"
              priority={false}
            />
          </motion.figure>
          <article className="flex justify-center">
            <motion.div
              className="max-w-xl"
              variants={fadeIn("left", "tween", 0.3, 2)}
            >
              <span className="text-primary">{item.subtitle}</span>
              <h2 className="font-bold text-4xl mb-6 leading-[1.2]">
                {item.title.text1}
              </h2>
              <div className="my-6">
                {item.articles.map((arr, index) => (
                  <FaqItem key={index} title={arr.title} faq={[]}>
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