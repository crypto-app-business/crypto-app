"use client"
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
      "subtitle": "SUPPORT",
      "_type": "faq",
      "title": {
          "text1": "Frequently asked questions"
      },
      "_rev": "MDZjMGfJgf06ct7SsVwL05",
      "_id": "97fa3a26-9439-48f3-a968-d079d4554acc",
      "_updatedAt": "2023-09-02T19:07:37Z",
      "articles": [
          {
              "title": "should I choose NEFA?",
              "content": "We're industry pioneers, having been in the cryptocurrency\n industry since 2016. We've facilitated more than 21 billion USD\n worth of transactions on our exchange for customers in over 40\n countries. Today, we're trusted by over 8 million customers\n around the world and have received praise for our easy-to-use\n app, secure wallet, and range of features.",
              "_type": "article",
              "_key": "70e86e62febf"
          },
          {
              "_type": "article",
              "_key": "7fbbf3c4edcc",
              "title": "secure is NEFA?",
              "content": "We're industry pioneers, having been in the cryptocurrency\n industry since 2016. We've facilitated more than 21 billion USD\n worth of transactions on our exchange for customers in over 40\n countries. Today, we're trusted by over 8 million customers\n around the world and have received praise for our easy-to-use\n app, secure wallet, and range of features."
          },
          {
              "_type": "article",
              "_key": "f086ad3ad37d",
              "title": "Do I have to buy a whole Bitcoin?",
              "content": "We're industry pioneers, having been in the cryptocurrency\n industry since 2016. We've facilitated more than 21 billion USD\n worth of transactions on our exchange for customers in over 40\n countries. Today, we're trusted by over 8 million customers\n around the world and have received praise for our easy-to-use\n app, secure wallet, and range of features."
          },
          {
              "content": "We're industry pioneers, having been in the cryptocurrency\n industry since 2016. We've facilitated more than 21 billion USD\n worth of transactions on our exchange for customers in over 40\n countries. Today, we're trusted by over 8 million customers\n around the world and have received praise for our easy-to-use\n app, secure wallet, and range of features.",
              "_type": "article",
              "_key": "fbd96d6e7d9c",
              "title": "How do I actually buy Bitcoin?"
          }
      ]
  }
]

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
        <p className="select-none">{children}</p>
      </aside>
    </article>
  );
};

export function FaqSection() {
  return (
    <motion.section
      className="container mx-auto py-32"
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
              object-fit="cover"
              priority={false}
            />
          </motion.figure>
          <article className="flex justify-center">
            <motion.div
              className="max-w-xl"
              variants={fadeIn("left", "tween", 0.3, 2)}
            >
              <span className="text-primary">{item.subtitle}</span>
              <h2 className="font-bold text-4xl mb-6 leading-normal">
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
