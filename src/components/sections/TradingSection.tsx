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
              "title": "Professional Access, Non-stop Availability",
              "_type": "article",
              "description": "We provide premium access to crypto trading for both individuals and institutions through high liquidity, reliable order execution and constant uptime."
          },
          {
              "_key": "01f1c2ef2e7d",
              "title": "A Range of Powerful Apis",
              "_type": "article",
              "description": "Set up your own trading interface or deploy your algorithmic strategy with our high-performance FIX and HTTP APIs. Connect to our WebSocket for real-time data streaming."
          },
          {
              "_type": "article",
              "description": "Premium 24/7 support available to all customers worldwide by phone or email. Dedicated account managers for partners.",
              "_key": "f66a1bceef7e",
              "title": "Customer Support"
          }
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
          "span": "Tools",
          "text1": "Advanced Trading "
      }
  }
]

export function TradingSection() {
  return (
    <motion.section
      className="px-6"
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
              className="max-w-lg lg:row-start-1 ml-12"
              variants={fadeIn("right", "tween", 0.3, 2)}
            >
              <h2 className="font-bold text-4xl mb-6 leading-normal">
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
