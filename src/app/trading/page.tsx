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
  tradingSection: {
    ru: {
      title: string;
      subtitle: string;
      featuresTitle: string;
      features: string[];
      bonusTitle: string;
      bonusText: string;
      reportingTitle: string;
      reportingItems: string[];
      howToStartTitle: string;
      howToStartSteps: string[];
      callToAction: string;
    };
    en: {
      title: string;
      subtitle: string;
      featuresTitle: string;
      features: string[];
      bonusTitle: string;
      bonusText: string;
      reportingTitle: string;
      reportingItems: string[];
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

export default function TradingBot() {
  const { language } = useLanguageStore();

  const translations: Translations = {
    tradingSection: {
      ru: {
        title: "Трейдинг с ботом от Crypto Corporation",
        subtitle:
          "Добро пожаловать в умный мир крипто-трейдинга с нашим телеграм-ботом! Теперь зарабатывать на криптовалюте можно быстро, просто и автоматически, прямо с телефона.",
        featuresTitle: "Что делает наш трейд-бот?",
        features: [
          "Анализирует рынок 24/7: Бот использует продвинутые алгоритмы и следит за десятками криптовалют в реальном времени.",
          "Совершает сделки автоматически: На основе сигналов бот покупает и продаёт активы, фиксируя прибыль при росте цен.",
          "Минимизирует риски: Применяются безопасные стратегии с защитой капитала и распределением вложений.",
        ],
        bonusTitle: "Бонус для новых пользователей",
        bonusText:
          "Каждый новый пользователь получает бонус $50 – отличная возможность протестировать бота без рисков! Бонус можно получить после регистрации и выполнения простых условий.",
        reportingTitle: "Отчётность и прозрачность",
        reportingItems: [
          "Все открытые и закрытые сделки",
          "Прибыль по каждой операции",
          "Обновлённый баланс и доходность",
        ],
        howToStartTitle: "Как начать?",
        howToStartSteps: [
          "Зайти в бот @Crypto_corporation_bot",
          "Зарегистрироваться и активировать трейдинг",
          "Получить бонус $50 и начать зарабатывать",
        ],
        callToAction:
          "Crypto Corporation — это простой старт в мире трейдинга. Включи трейд-бота сегодня и зарабатывай, пока другие наблюдают!",
      },
      en: {
        title: "Trading with Crypto Corporation Bot",
        subtitle:
          "Welcome to the smart world of crypto trading with our Telegram bot! Now you can earn on cryptocurrencies quickly, easily, and automatically, right from your phone.",
        featuresTitle: "🔹 What does our trading bot do?",
        features: [
          "Analyzes the market 24/7: The bot uses advanced algorithms and monitors dozens of cryptocurrencies in real-time.",
          "Executes trades automatically: Based on signals, the bot buys and sells assets, locking in profits when prices rise.",
          "Minimizes risks: Safe strategies with capital protection and diversified investments are applied.",
        ],
        bonusTitle: "Bonus for new users",
        bonusText:
          "Every new user receives a $50 bonus – a great opportunity to test the bot without risks! The bonus can be obtained after registration and completing simple conditions.",
        reportingTitle: "Reporting and transparency",
        reportingItems: [
          "All open and closed trades",
          "Profit for each operation",
          "Updated balance and profitability",
        ],
        howToStartTitle: "How to start?",
        howToStartSteps: [
          "Join the bot @Crypto_corporation_bot",
          "Register and activate trading",
          "Get the $50 bonus and start earning",
        ],
        callToAction:
          "Crypto Corporation — your easy start in the world of trading. Activate the trading bot today and earn while others watch!",
      },
    },
    stepsSection: {
      ru: {
        step1: "Зайти в бот @Crypto_corporation_bot",
        step2: "Зарегистрироваться и активировать трейдинг",
        step3: "Получить бонус $50 и начать зарабатывать",
      },
      en: {
        step1: "Join the bot @Crypto_corporation_bot",
        step2: "Register and activate trading",
        step3: "Get the $50 bonus and start earning",
      },
    },
    trustSection: {
      ru: {
        title: "ПОЧЕМУ МОЖНО НАМ ДОВЕРЯТЬ И РАБОТАТЬ С НАМИ?",
        items: [
          { icon: "1", text: "Продвинутые алгоритмы для анализа рынка" },
          { icon: "2", text: "Автоматизированные сделки с высокой точностью" },
          { icon: "3", text: "Прозрачная отчётность о каждой операции" },
          { icon: "4", text: "Безопасные стратегии с защитой капитала" },
          { icon: "5", text: "Поддержка пользователей 24/7" },
        ],
        button: "НАЧАТЬ ТРЕЙДИНГ",
      },
      en: {
        title: "WHY TRUST AND WORK WITH US?",
        items: [
          { icon: "1", text: "Advanced algorithms for market analysis" },
          { icon: "2", text: "Automated trades with high accuracy" },
          { icon: "3", text: "Transparent reporting for every operation" },
          { icon: "4", text: "Safe strategies with capital protection" },
          { icon: "5", text: "24/7 user support" },
        ],
        button: "START TRADING",
      },
    },
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Crypto Corporation - Trading Bot" />
        <meta name="keywords" content="Crypto trading, Telegram bot, Crypto Corporation" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFF" />
        <title>Crypto Corporation Trading</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
      </Head>
      <Layout>
        {/* Секція про трейдинг */}
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
              {translations.tradingSection[language].title}
            </motion.h1>
            <motion.h3
              className="text-[17px] font-medium text-center mb-6"
              variants={fadeIn("up", "tween", 0.3, 1)}
            >
              {translations.tradingSection[language].subtitle}
            </motion.h3>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.4, 1)}
            >
              {translations.tradingSection[language].featuresTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.5, 1)}
            >
              {translations.tradingSection[language].features.map((feature, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {feature}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.6, 1)}
            >
              {translations.tradingSection[language].bonusTitle}
            </motion.h4>
            <motion.p
              className="text-gray-700 mb-6"
              variants={fadeIn("up", "tween", 0.7, 1)}
            >
              {translations.tradingSection[language].bonusText}
            </motion.p>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.8, 1)}
            >
              {translations.tradingSection[language].reportingTitle}
            </motion.h4>
            <motion.ul
              className="list-none list-inside mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.9, 1)}
            >
              {translations.tradingSection[language].reportingItems.map((item, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {item}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 1.0, 1)}
            >
              {translations.tradingSection[language].howToStartTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 1.1, 1)}
            >
              {translations.tradingSection[language].howToStartSteps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {step}
                </li>
              ))}
            </motion.ul>
            <motion.h3
              className="text-[17px] font-medium text-center"
              variants={fadeIn("up", "tween", 1.2, 1)}
            >
              {translations.tradingSection[language].callToAction}
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
              {translations.tradingSection[language].howToStartTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Object.values(translations.stepsSection[language]) as string[]).map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                  variants={fadeIn("up", "tween", 0.2 * (index + 1), 0.5)}
                >
                  <div className="w-[40px] h-[40px] bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src={`/tradingLanding/${index + 1}.png`}
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
                      src={`/tradingLanding/${item.icon}.png`}
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