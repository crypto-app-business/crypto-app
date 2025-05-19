"use client";
import Layout from "@/layout";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from "@/store/useLanguageStore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Типізація для translations
interface Translations {
  listingSection: {
    ru: {
      title: string;
      subtitle: string;
      listingTitle: string;
      listingDescription: string;
      uniqueFeaturesTitle: string;
      uniqueFeatures: string[];
      howToEarnTitle: string;
      howToEarnSteps: string[];
      whyParticipateTitle: string;
      whyParticipateItems: string[];
      howToStartTitle: string;
      howToStartSteps: string[];
      callToAction: string;
    };
    en: {
      title: string;
      subtitle: string;
      listingTitle: string;
      listingDescription: string;
      uniqueFeaturesTitle: string;
      uniqueFeatures: string[];
      howToEarnTitle: string;
      howToEarnSteps: string[];
      whyParticipateTitle: string;
      whyParticipateItems: string[];
      howToStartTitle: string;
      howToStartSteps: string[];
      callToAction: string;
    };
  };
  stepsSection: {
    ru: { [key: string]: string };
    en: { [key: string]: string };
  };
  trustSection: {
    ru: {
      title: string;
      items: { icon: string; text: string }[];
      button: string;
    };
    en: {
      title: string;
      items: { icon: string; text: string }[];
      button: string;
    };
  };
}

export default function Listing() {
  const { language } = useLanguageStore();

  const translations: Translations = {
    listingSection: {
      ru: {
        title: "Листинг монет в Crypto Corporation — платформа роста и дохода",
        subtitle:
          "В Crypto Corporation мы не просто размещаем монеты — мы строим мост между перспективными криптопроектами и инвесторами по всему миру. Наша система листинга — это мощный инструмент как для создателей токенов, так и для наших пользователей.",
        listingTitle: "Что такое листинг?",
        listingDescription:
          "Листинг монеты — это процесс добавления токена на биржу или платформу, где его можно покупать, продавать и торговать. У нас этот процесс сопровождается крупными инвестиционными контрактами и широкой поддержкой.",
        uniqueFeaturesTitle: "Что у нас уникального?",
        uniqueFeatures: [
          "Крупные контракты с молодыми, но перспективными проектами — мы получаем монеты по цене ниже рыночной",
          "Доход от роста цены — после листинга стоимость монеты может вырасти в несколько раз",
          "Доступ только внутри Crypto Corporation — ранний доступ до выхода на внешние биржи",
          "Партнёрские условия — мы сотрудничаем с проектами напрямую, исключая посредников",
        ],
        howToEarnTitle: "Как вы зарабатываете на листинге?",
        howToEarnSteps: [
          "Мы анонсируем листинг перспективной монеты",
          "Пользователи могут инвестировать заранее по специальной цене",
          "После выхода на биржи, вы фиксируете прибыль от роста стоимости токена",
          "Можно также удерживать токен в стейкинге или обменивать внутри платформы",
        ],
        whyParticipateTitle: "Почему стоит участвовать?",
        whyParticipateItems: [
          "Ранний доступ к перспективным монетам по низкой цене до их выхода на внешние биржи",
          "Возможность многократного роста стоимости токенов после листинга",
          "Безопасная платформа без посредников и скрытых комиссий",
          "Поддержка 24/7 для всех участников листинга",
        ],
        howToStartTitle: "Как начать участвовать в листинге?",
        howToStartSteps: [
          "Зарегистрируйтесь на платформе Crypto Corporation",
          "Следите за анонсами новых листингов в нашей системе",
          "Инвестируйте в монеты по специальной цене",
          "Фиксируйте прибыль после листинга или удерживайте токены",
        ],
        callToAction:
          "Листинг в Crypto Corporation — это твой шанс войти в проект раньше всех! Участвуй, следи за анонсами и не упусти рост будущих крипто-гигантов!",
      },
      en: {
        title: "Coin Listing with Crypto Corporation — A Platform for Growth and Income 💎",
        subtitle:
          "At Crypto Corporation, we don’t just list coins — we build a bridge between promising crypto projects and investors worldwide. Our listing system is a powerful tool for both token creators and our users.",
        listingTitle: "🔹 What is listing?",
        listingDescription:
          "Listing a coin is the process of adding a token to an exchange or platform where it can be bought, sold, and traded. With us, this process is backed by major investment contracts and extensive support.",
        uniqueFeaturesTitle: "💼 What makes us unique?",
        uniqueFeatures: [
          "Major contracts with young, promising projects — we acquire coins at below-market prices",
          "Profit from price growth — after listing, a coin’s value can increase multiple times",
          "Exclusive access within Crypto Corporation — early access before external exchange listings",
          "Partnership terms — we work directly with projects, eliminating intermediaries",
        ],
        howToEarnTitle: "How do you earn from listings?",
        howToEarnSteps: [
          "We announce the listing of a promising coin",
          "Users can invest early at a special price",
          "After the coin is listed on exchanges, you lock in profits from the token’s price increase",
          "You can also hold the token in staking or trade it within the platform",
        ],
        whyParticipateTitle: "Why should you participate?",
        whyParticipateItems: [
          "Early access to promising coins at a low price before they hit external exchanges",
          "Potential for multiple-fold growth in token value after listing",
          "Secure platform with no intermediaries or hidden fees",
          "24/7 support for all listing participants",
        ],
        howToStartTitle: "How to start participating in listings?",
        howToStartSteps: [
          "Register on the platform Crypto Corporation",
          "Follow announcements of new listings in our system",
          "Invest in coins at a special price",
          "Lock in profits after listing or hold the tokens",
        ],
        callToAction:
          "Listing with Crypto Corporation is your chance to enter a project before everyone else! Participate, follow announcements, and don’t miss the growth of future crypto giants!",
      },
    },
    stepsSection: {
      ru: {
        step1: "Зарегистрируйтесь на платформе Crypto Corporation",
        step2: "Следите за анонсами новых листингов в нашей системе",
        step3: "Инвестируйте в монеты по специальной цене",
        step4: "Фиксируйте прибыль после листинга или удерживайте токены",
      },
      en: {
        step1: "Register on the platform Crypto Corporation",
        step2: "Follow announcements of new listings in our system",
        step3: "Invest in coins at a special price",
        step4: "Lock in profits after listing or hold the tokens",
      },
    },
    trustSection: {
      ru: {
        title: "ПОЧЕМУ МОЖНО НАМ ДОВЕРЯТЬ И РАБОТАТЬ С НАМИ?",
        items: [
          { icon: "1", text: "Эксклюзивный доступ к новым монетам" },
          { icon: "2", text: "Прямое сотрудничество с проектами" },
          { icon: "3", text: "Прозрачная система инвестиций" },
          { icon: "4", text: "Безопасная платформа без комиссий" },
          { icon: "5", text: "Поддержка пользователей 24/7" },
        ],
        button: "НАЧАТЬ УЧАСТИЕ",
      },
      en: {
        title: "WHY TRUST AND WORK WITH US?",
        items: [
          { icon: "1", text: "Exclusive access to new coins" },
          { icon: "2", text: "Direct collaboration with projects" },
          { icon: "3", text: "Transparent investment system" },
          { icon: "4", text: "Secure platform with no fees" },
          { icon: "5", text: "24/7 user support" },
        ],
        button: "START PARTICIPATING",
      },
    },
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Crypto Corporation - Coin Listing" />
        <meta name="keywords" content="Crypto listing, Crypto Corporation, Coin investment" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFF" />
        <title>Crypto Corporation Listing</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
      </Head>
      <Layout>
        {/* Секція про листинг */}
        <motion.section
          className="w-full bg-[#e7e7e7] pt-[50px] pb-[50px] mt-[115px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          <div className="container max-w-[1250px] mx-auto px-4">
            <motion.h1
              className="text-[37px] font-bold text-center mb-6"
              variants={fadeIn("up", "tween", 0.2, 1)}
            >
              {translations.listingSection[language].title}
            </motion.h1>
            <motion.h3
              className="text-[17px] font-medium text-center mb-6"
              variants={fadeIn("up", "tween", 0.3, 1)}
            >
              {translations.listingSection[language].subtitle}
            </motion.h3>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.4, 1)}
            >
              {translations.listingSection[language].listingTitle}
            </motion.h4>
            <motion.p
              className="text-gray-700 mb-6"
              variants={fadeIn("up", "tween", 0.5, 1)}
            >
              {translations.listingSection[language].listingDescription}
            </motion.p>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.6, 1)}
            >
              {translations.listingSection[language].uniqueFeaturesTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.7, 1)}
            >
              {translations.listingSection[language].uniqueFeatures.map((feature, index) => (
                <li key={index} className="text-gray-700 mb-2 ">
                  {feature}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.8, 1)}
            >
              {translations.listingSection[language].howToEarnTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.9, 1)}
            >
              {translations.listingSection[language].howToEarnSteps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2 ">
                  {step}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.0, 1)}
            >
              {translations.listingSection[language].whyParticipateTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.1, 1)}
            >
              {translations.listingSection[language].whyParticipateItems.map((item, index) => (
                <li key={index} className="text-gray-700 mb-2 ">
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.2, 1)}
            >
              {translations.listingSection[language].howToStartTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.3, 1)}
            >
              {translations.listingSection[language].howToStartSteps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2 ">
                  {step}
                </li>
              ))}
            </motion.ul>
            <motion.h3
              className="text-[17px] font-medium text-center"
              variants={fadeIn("up", "tween", 1.4, 1)}
            >
              {translations.listingSection[language].callToAction}
            </motion.h3>
          </div>
        </motion.section>

        {/* Секція кроків */}
        <motion.section
          className="w-full py-[50px] bg-gray-50"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          <div className="container max-w-[1250px] mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              {translations.listingSection[language].howToStartTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(Object.values(translations.stepsSection[language]) as string[]).map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                  variants={fadeIn("up", "tween", 0.2 * (index + 1), 0.5)}
                >
                  <div className="w-[40px] h-[40px] bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src={`/listingLanding/${index + 1}.png`}
                      alt="icon"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Секція довіри (закоментована, як в оригіналі) */}
        {/* <motion.section
          className="w-full py-[60px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          <div className="container max-w-[1250px] mx-auto px-4 text-center">
            <motion.h2
              className="text-[28px] font-bold text-white pt-10 pb-10 mb-[30px] bg-[#f4a261]"
              variants={fadeIn("up", "tween", 0.2, 1)}
            >
              {translations.trustSection[language].title}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-5 gap-6 container max-w-[1250px] mx-auto">
              {translations.trustSection[language].items.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white bg-opacity-20 rounded-lg"
                  variants={fadeIn("up", "tween", 0.3 * (index + 1), 0.5)}
                >
                  <div className="w-[80px] h-[80px] bg-orange-200 rounded-full flex items-center justify-center mb-4">
                    <Image
                      src={`/listingLanding/${item.icon}.png`}
                      alt={item.icon}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
            <Link href="/login" className="text-blue-500 hover:underline">
              <motion.button
                className="px-8 py-3 bg-[#f4a261] text-white font-semibold rounded-full hover:bg-opacity-90 transition"
                variants={fadeIn("up", "tween", 1, 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations.trustSection[language].button}
              </motion.button>
            </Link>
          </div>
        </motion.section> */}

        {/* Кнопка заклику до дії */}
        <div className="flex justify-center items-center mb-[50px]">
          <Link href="/login" className="text-blue-500 hover:underline mr-auto ml-auto">
            <motion.button
              className="px-8 py-3 bg-[#71a7fe] text-white font-semibold rounded-full hover:bg-opacity-90 transition"
              variants={fadeIn("up", "tween", 1, 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.trustSection[language].button}
            </motion.button>
          </Link>
        </div>
      </Layout>
    </>
  );
}