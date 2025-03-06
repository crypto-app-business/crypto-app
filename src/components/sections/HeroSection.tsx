"use client";
import Image from "next/image";
import { SecondButton } from "../buttons/SecondButton";
import { Hero as HeroComponent } from "@/types/sections/hero";
import StarParticle from "../particles/StarParticle";
import BlueCircleParticle from "../particles/BlueCircleParticle";
import PurpleCircleParticle from "../particles/PurpleCircleParticle";
import OrangeCircleParticle from "../particles/OrangeCircleParticle";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import Link from "next/link";
import { useLanguageStore } from '@/store/useLanguageStore';

interface HeroProps {
  hero: HeroComponent[];
}

export function HeroSection({ hero }: HeroProps) {
  const { language } = useLanguageStore();

  const translations = {
    slogan: {
      ru: "Всё так просто, что аж прибыльно!",
      en: "Everything is so simple, it’s downright profitable!",
    },
    title: {
      ru: "Добро пожаловать в Crypto Corporation — будущее уже здесь! 🚀",
      en: "Welcome to Crypto Corporation — the future is here! 🚀",
    },
    description: {
      ru: "Мы создаём новые возможности в мире блокчейна, криптовалют и децентрализованных технологий. Наша миссия — дать каждому доступ к инновационным финансовым инструментам, обеспечивая безопасность, прозрачность и свободу.",
      en: "We are creating new opportunities in the world of blockchain, cryptocurrencies, and decentralized technologies. Our mission is to provide everyone with access to innovative financial tools, ensuring security, transparency, and freedom.",
    },
    webDefi: {
      ru: "Web Defi",
      en: "Web DeFi",
    },
    tradingBot: {
      ru: "TradingBot",
      en: "Trading Bot",
    },
  };

  return (
    <motion.section
      className="bg-primary bg-opacity-5 relative px-[15px] pt-[120px] sm:px-32 sm:pt-72 pb-24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="container grid lg:grid-cols-2 max-md:justify-items-center max-md:justify-center px-2 mx-auto">
        <article className="static">
          <motion.h6
            className="text-primary text-2xl"
            variants={fadeIn("right", "tween", 0.3, 2)}
          >
            {translations.slogan[language]}
          </motion.h6>
          <StarParticle
            className="hidden sm:block sm:absolute top-36 right-2/4 w-32"
            particle={hero}
          />
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2]"
            variants={fadeIn("right", "tween", 0.3, 2)}
          >
            {translations.title[language]}
          </motion.h1>
          <motion.div
            className="mt-4 mb-8"
            variants={fadeIn("right", "tween", 0.3, 2)}
          >
            <p className="text-gray">{translations.description[language]}</p>
          </motion.div>
          <motion.div
            className="col-span-2 flex gap-4 lg:mb-12 w-max"
            variants={fadeIn("right", "tween", 0.3, 2)}
          >
            <Link className="w-full" href="/login">
              <SecondButton className="w-full lg:w-auto mb-2" onClick={undefined}>
                {translations.webDefi[language]}
              </SecondButton>
            </Link>
            <Link className="w-full" href="https://t.me/Crypto_corporation_bot" target="_blank" rel="noopener noreferrer">
              <SecondButton className="w-full lg:w-auto mb-2" onClick={undefined}>
                {translations.tradingBot[language]}
              </SecondButton>
            </Link>
          </motion.div>
          <PurpleCircleParticle
            className="hidden sm:block absolute bottom-24 left-20"
            particle={hero}
          />
        </article>
        <motion.article className="hidden relative lg:block">
          <BlueCircleParticle
            className="absolute -top-24 left-32"
            particle={hero}
          />
          <motion.figure variants={fadeIn("left", "tween", 0.3, 2)}>
            <Image
              src="/hero-section/hero.avif"
              alt="Your image description"
              width={1920}
              height={1595}
              objectFit="cover"
              priority={false}
            />
          </motion.figure>
          <OrangeCircleParticle
            className="absolute left-[95%] top-56"
            particle={hero}
          />
        </motion.article>
      </div>
    </motion.section>
  );
}