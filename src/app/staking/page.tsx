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
  stakingSection: {
    ru: {
      title: string;
      subtitle: string;
      stakingTitle: string;
      stakingDescription: string;
      benefitsTitle: string;
      benefits: string[];
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
      stakingTitle: string;
      stakingDescription: string;
      benefitsTitle: string;
      benefits: string[];
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

export default function Staking() {
  const { language } = useLanguageStore();

  const translations: Translations = {
    stakingSection: {
      ru: {
        title: "Стейкинг монеты CC от Crypto Corporation",
        subtitle:
          "СС (Crypto Corporation Coin) — это наша фирменная монета, созданная для пользователей внутри экосистемы. Она станет основой всех внутренних операций: от стейкинга до участия в проектах и листингах.",
        stakingTitle: "Что такое стейкинг?",
        stakingDescription:
          "Стейкинг — это способ пассивного заработка, при котором вы размещаете монеты CC на нашей платформе, и они начинают приносить прибыль. Чем дольше вы держите монеты — тем выше ваш доход.",
        benefitsTitle: "Преимущества стейкинга CC",
        benefits: [
          "Доходность 0.3% в сутки — в зависимости от суммы и срока размещения",
          "Сложный процент — ваши монеты приносят всё больше прибыли",
          "Безопасность и защита вложений",
          "Автоматическое начисление дохода",
          "Доступен прямо во внутренней бирже Crypto Corporation",
        ],
        listingTitle: "Листинг монет в Crypto Corporation — платформа роста и дохода",
        listingDescription:
          "В Crypto Corporation мы не просто размещаем монеты — мы строим мост между перспективными криптопроектами и инвесторами по всему миру. Наша система листинга — это мощный инструмент как для создателей токенов, так и для наших пользователей.",
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
          "Монета CC ещё не вышла на внешние биржи, и сейчас у вас есть возможность купить её по низкой цене",
          "На момент листинга стоимость монеты может вырасти, а значит — заработаете вдвойне: и от роста цены, и от стейкинга",
          "Всё происходит внутри защищённой платформы, без посредников и комиссий",
        ],
        howToStartTitle: "Как начать стейкинг?",
        howToStartSteps: [
          "Зарегистрируйтесь на платформе Crypto Corporation",
          "Купите или получите монеты CC",
          "Выберите стейкинг-контракт во внутренней бирже",
          "Получайте стабильный доход каждый день!",
        ],
        callToAction:
          "Crypto Corporation Coin (CC) — монета будущего. Стейкай, держи, зарабатывай!",
      },
      en: {
        title: "Staking CC Coin with Crypto Corporation",
        subtitle:
          "CC (Crypto Corporation Coin) is our proprietary coin created for users within the ecosystem. It will serve as the foundation for all internal operations: from staking to participation in projects and listings.",
        stakingTitle: "What is staking?",
        stakingDescription:
          "Staking is a passive income method where you lock CC coins on our platform, and they start generating profit. The longer you hold the coins, the higher your returns.",
        benefitsTitle: "Benefits of staking CC",
        benefits: [
          "Daily profitability of 0.3% — depending on the amount and duration of staking",
          "Compound interest — your coins generate increasing profits",
          "Security and protection of investments",
          "Automatic profit accrual",
          "Available directly on the Crypto Corporation internal exchange",
        ],
        listingTitle: "Coin Listing with Crypto Corporation — A Platform for Growth and Income",
        listingDescription:
          "At Crypto Corporation, we don’t just list coins — we build a bridge between promising crypto projects and investors worldwide. Our listing system is a powerful tool for both token creators and our users.",
        uniqueFeaturesTitle: "What makes us unique?",
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
          "CC Coin has not yet been listed on external exchanges, giving you the chance to buy it at a low price now",
          "At the time of listing, the coin’s value may rise, allowing you to earn both from price growth and staking",
          "Everything happens within a secure platform, with no intermediaries or fees",
        ],
        howToStartTitle: "How to start staking?",
        howToStartSteps: [
          "Register on the platform Crypto Corporation",
          "Buy or acquire CC coins",
          "Choose a staking contract on the internal exchange",
          "Receive stable income every day!",
        ],
        callToAction:
          "Crypto Corporation Coin (CC) — the coin of the future. Stake, hold, earn!",
      },
    },
    stepsSection: {
      ru: {
        step1: "Зарегистрируйтесь на платформе Crypto Corporation",
        step2: "Купите или получите монеты CC",
        step3: "Выберите стейкинг-контракт во внутренней бирже",
        step4: "Получайте стабильный доход каждый день!",
      },
      en: {
        step1: "Register on the platform Crypto Corporation",
        step2: "Buy or acquire CC coins",
        step3: "Choose a staking contract on the internal exchange",
        step4: "Receive stable income every day!",
      },
    },
    trustSection: {
      ru: {
        title: "ПОЧЕМУ МОЖНО НАМ ДОВЕРЯТЬ И РАБОТАТЬ С НАМИ?",
        items: [
          { icon: "1", text: "Безопасная платформа с защитой вложений" },
          { icon: "2", text: "Прозрачная система начисления дохода" },
          { icon: "3", text: "Эксклюзивный доступ к перспективным проектам" },
          { icon: "4", text: "Прямое сотрудничество с проектами без посредников" },
          { icon: "5", text: "Поддержка пользователей 24/7" },
        ],
        button: "НАЧАТЬ СТЕЙКИНГ",
      },
      en: {
        title: "WHY TRUST AND WORK WITH US?",
        items: [
          { icon: "1", text: "Secure platform with investment protection" },
          { icon: "2", text: "Transparent profit accrual system" },
          { icon: "3", text: "Exclusive access to promising projects" },
          { icon: "4", text: "Direct collaboration with projects, no intermediaries" },
          { icon: "5", text: "24/7 user support" },
        ],
        button: "START STAKING",
      },
    },
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Crypto Corporation - CC Coin Staking and Listing" />
        <meta name="keywords" content="Crypto staking, CC Coin, Crypto Corporation, Coin listing" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFF" />
        <title>Crypto Corporation Staking</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
      </Head>
      <Layout>
        {/* Секція про стейкінг і листинг */}
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
              {translations.stakingSection[language].title}
            </motion.h1>
            <motion.h3
              className="text-[17px] font-medium text-center mb-6"
              variants={fadeIn("up", "tween", 0.3, 1)}
            >
              {translations.stakingSection[language].subtitle}
            </motion.h3>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.4, 1)}
            >
              {translations.stakingSection[language].stakingTitle}
            </motion.h4>
            <motion.p
              className="text-gray-700 mb-6"
              variants={fadeIn("up", "tween", 0.5, 1)}
            >
              {translations.stakingSection[language].stakingDescription}
            </motion.p>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.6, 1)}
            >
              {translations.stakingSection[language].benefitsTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.7, 1)}
            >
              {translations.stakingSection[language].benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {benefit}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.8, 1)}
            >
              {translations.stakingSection[language].listingTitle}
            </motion.h4>
            <motion.p
              className="text-gray-700 mb-6"
              variants={fadeIn("up", "tween", 0.9, 1)}
            >
              {translations.stakingSection[language].listingDescription}
            </motion.p>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.0, 1)}
            >
              {translations.stakingSection[language].uniqueFeaturesTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.1, 1)}
            >
              {translations.stakingSection[language].uniqueFeatures.map((feature, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {feature}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.2, 1)}
            >
              {translations.stakingSection[language].howToEarnTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.3, 1)}
            >
              {translations.stakingSection[language].howToEarnSteps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2">
                 {step}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.4, 1)}
            >
              {translations.stakingSection[language].whyParticipateTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.5, 1)}
            >
              {translations.stakingSection[language].whyParticipateItems.map((item, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.6, 1)}
            >
              {translations.stakingSection[language].howToStartTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.7, 1)}
            >
              {translations.stakingSection[language].howToStartSteps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {step}
                </li>
              ))}
            </motion.ul>
            <motion.h3
              className="text-[17px] font-medium text-center"
              variants={fadeIn("up", "tween", 1.8, 1)}
            >
              {translations.stakingSection[language].callToAction}
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
              {translations.stakingSection[language].howToStartTitle}
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
                      src={`/stakingLanding/${index + 1}.png`}
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
                      src={`/stakingLanding/${item.icon}.png`}
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