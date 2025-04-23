"use client";
import Layout from "@/layout";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from "@/store/useLanguageStore";
import Head from "next/head";
import Image from "next/image"; // Імпорт для іконок
import Link from "next/link";

// Типізація для translations
interface Translations {
  slogan: Record<string, string>;
  title: Record<string, string>;
  description: Record<string, string>;
  webDefi: Record<string, string>;
  tradingBot: Record<string, string>;
  miningSection: {
    ru: {
      title: string;
      subtitle: string;
      howItWorks: string;
      howItWorks2: string;
      steps: string[];
      availableCoins: string;
      coinList: string[];
      whyProfitable: string;
      benefits: string[];
      callToAction: string;
    };
    en: {
      title: string;
      subtitle: string;
      howItWorks: string;
      howItWorks2: string;
      steps: string[];
      availableCoins: string;
      coinList: string[];
      whyProfitable: string;
      benefits: string[];
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

export default function Home() {
  const { language } = useLanguageStore();

  const translations: Translations = {
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
    miningSection: {
      ru: {
        title: "💎 Майнинг с Crypto Corporation 💎",
        subtitle: "Хотите зарабатывать на криптовалютах без сложного оборудования? Crypto Corporation предлагает аренду мощностей для майнинга перспективных альткоинов! 🚀",
        howItWorks: "🔹 Как это работает?",
        howItWorks2: "Здесь мы объясняем, как работает сам процесс:",
        steps: [
          "1️⃣ Выбираете контракт – у нас 20 вариантов с разными уровнями доходности.",
          "2️⃣ Покупаете мощность – чем больше мощности, тем выше заработок.",
          "3️⃣ Получаете пассивный доход – монеты начисляются автоматически!",
        ],
        availableCoins: "✅ Доступные альткоины для майнинга",
        coinList: [
          "Ethereum (ETH)",
          "Litecoin (LTC)",
          "Kaspa (KAS)",
          "Dogecoin (DOGE)",
          "И другие перспективные монеты!",
        ],
        whyProfitable: "🔥 Почему выгодно майнить с нами?",
        benefits: [
          "Не нужно покупать дорогое оборудование",
          "Нет затрат на электроэнергию и охлаждение",
          "Автоматические выплаты в удобную криптовалюту",
          "Надёжная защита и прозрачная система",
        ],
        callToAction: "🚀 Начни майнить прямо сейчас с Crypto Corporation и получай стабильный доход!",
      },
      en: {
        title: "💎 Mining with Crypto Corporation 💎",
        subtitle: "Want to earn on cryptocurrencies without complicated equipment? Crypto Corporation offers power rental for mining promising altcoins! 🚀",
        howItWorks: "🔹 How it works?",
        howItWorks2: "Here we explain how the process works:",
        steps: [
          "1️⃣ Choose a contract – we have 20 options with different profitability levels.",
          "2️⃣ Purchase power – the more power, the higher the earnings.",
          "3️⃣ Receive passive income – coins are credited automatically!",
        ],
        availableCoins: "✅ Available altcoins for mining",
        coinList: [
          "Ethereum (ETH)",
          "Litecoin (LTC)",
          "Kaspa (KAS)",
          "Dogecoin (DOGE)",
          "And other promising coins!",
        ],
        whyProfitable: "🔥 Why is it profitable to mine with us?",
        benefits: [
          "No need to buy expensive equipment",
          "No costs for electricity and cooling",
          "Automatic payouts in your preferred cryptocurrency",
          "Reliable protection and transparent system",
        ],
        callToAction: "🚀 Start mining now with Crypto Corporation and get stable income!",
      },
    },
    stepsSection: {
      ru: {
        step1: "Вы регистрируетесь на Crypto Corporation. Это займет не более 2 минут",
        step2: "Выберите мощность контракта. Больше мощности - больше биткойнов",
        step3: "Вы оплачиваете ваш новый контракт",
        step4: "Мы отправляем ваш заказ в огромные дата-центры Bitfury и Wattum, расположенные в Европе, США, Канаде, Казахстане, Грузии и Исландии",
        step5: "Начинается процесс добычи на высококлассном оборудовании со 100% гарантией бесперебойной работы, которое обслуживается квалифицированным персоналом 24/7",
        step6: "Вы ежедневно получаете добытые для вас новые биткойны, которые доступны для вывода в тот же день",
      },
      en: {
        step1: "You register on Crypto Corporation. It takes no more than 2 minutes",
        step2: "Choose the contract power. More power - more bitcoins",
        step3: "You pay for your new contract",
        step4: "We send your order to the massive Bitfury and Wattum data centers located in Europe, USA, Canada, Kazakhstan, Georgia, and Iceland",
        step5: "The mining process begins on top-class equipment with 100% uptime guarantee, serviced by qualified personnel 24/7",
        step6: "You receive newly mined bitcoins daily, available for withdrawal the same day",
      },
    },
    trustSection: {
      ru: {
        title: "ПОЧЕМУ МОЖНО НАМ ДОВЕРЯТЬ И РАБОТАТЬ С НАМИ?",
        items: [
          { icon: "1", text: "Стабильная мощность и 100% защита от сбоев Bitfury и Wattum" },
          { icon: "2", text: "Майнинг на мощностях Bitfury и Wattum - лидеры отрасли" },
          { icon: "3", text: "Оперативное зачисление монет на ваш счет" },
          { icon: "4", text: "Настоящий Майнинг - Все монеты Новые" },
          { icon: "5", text: "Максимальная эффективность при использовании высококачественного оборудования" },
        ],
        button: "НАЧАТЬ МАЙНИНГ",
      },
      en: {
        title: "WHY TRUST AND WORK WITH US?",
        items: [
          { icon: "1", text: "Stable power and 100% protection from outages by Bitfury and Wattum" },
          { icon: "2", text: "Mining on Bitfury and Wattum facilities - industry leaders" },
          { icon: "3", text: "Fast crediting of coins to your account" },
          { icon: "4", text: "Real Mining - All Coins New" },
          { icon: "5", text: "Maximum efficiency with high-quality equipment" },
        ],
        button: "START MINING",
      },
    },
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="NEFA - Criptocurrency landing page" />
        <meta name="keywords" content="Criptocurrency landing page, NEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFF" />
        <title>Nefa</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
      </Head>
      <Layout>
        {/* Секція про майнінг */}
        <motion.section
          className="w-full bg-[#e7e7e7] pt-[50px] pb-[50px] mt-[115px] "
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          <div className="container max-w-[1250px] mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                className="text-[37px] font-bold text-center mb-6"
                variants={fadeIn("up", "tween", 0.2, 1)}
              >
                {translations.miningSection[language].title}
              </motion.h1>
              <motion.h3
                className="text-[17px] font-medium text-center mb-6"
                variants={fadeIn("up", "tween", 0.3, 1)}
              >
                {translations.miningSection[language].subtitle}
              </motion.h3>
              <motion.h4
                className="text-xl font-semibold mb-2"
                variants={fadeIn("up", "tween", 0.4, 1)}
              >
                {translations.miningSection[language].howItWorks}
              </motion.h4>
              <motion.ul
                className="list-decimal list-inside mb-6 pl-5"
                variants={fadeIn("up", "tween", 0.5, 1)}
              >
                {translations.miningSection[language].steps.map((step, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    {step}
                  </li>
                ))}
              </motion.ul>
              <motion.h4
                className="text-xl font-semibold mb-2"
                variants={fadeIn("up", "tween", 0.6, 1)}
              >
                {translations.miningSection[language].availableCoins}
              </motion.h4>
              <motion.ul
                className="list-disc list-inside mb-6 pl-5"
                variants={fadeIn("up", "tween", 0.7, 1)}
              >
                {translations.miningSection[language].coinList.map((coin, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    {coin}
                  </li>
                ))}
              </motion.ul>
              <motion.h4
                className="text-xl font-semibold mb-2"
                variants={fadeIn("up", "tween", 0.8, 1)}
              >
                {translations.miningSection[language].whyProfitable}
              </motion.h4>
              <motion.ul
                className="list-disc list-inside mb-6 pl-5"
                variants={fadeIn("up", "tween", 0.9, 1)}
              >
                {translations.miningSection[language].benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-700 mb-2">
                    {benefit}
                  </li>
                ))}
              </motion.ul>
              <motion.h3
                className="text-[17px] font-medium text-center"
                variants={fadeIn("up", "tween", 1, 1)}
              >
                {translations.miningSection[language].callToAction}
              </motion.h3>
            </div>
            <motion.div
              className="w-full aspect-[608/1080] max-h-[600px] overflow-hidden"
              variants={fadeIn("left", "tween", 0.3, 1)}
            >
              <video
                className="w-full h-full object-contain rounded-xl"
                autoPlay
                muted
                loop
                // controls
                poster="/placeholder-poster.jpg"
                preload="metadata"
              >
                <source src="/videos/mining-demo.mp4" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        </motion.section>

        {/* Нова секція "Почему можно нам доверять и работать с нами?" */}
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
                      src={`/miningLanding/${item.icon}.png`} // Шлях до іконок у public/miningLanding/
                      alt={item.icon}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className=" text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
            <Link
              href="/login"
              className="text-blue-500 hover:underline"
            >
              <motion.button
                className=" px-8 py-3 bg-[#f4a261] text-white font-semibold rounded-full hover:bg-opacity-90 transition"
                variants={fadeIn("up", "tween", 1, 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations.trustSection[language].button}
              </motion.button>
            </Link>
          </div>
        </motion.section> */}

        {/* Секція кроків */}
        <motion.section
          className="w-full py-[50px] bg-gray-50"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          <div className="container max-w-[1250px] mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              {translations.miningSection[language].howItWorks2}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(translations.stepsSection[language]).map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                  variants={fadeIn("up", "tween", 0.2 * (index + 1), 0.5)}
                >
                  <div className="w-[40px] h-[40px] bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src={`/miningLanding/${index+1}.png`} // Шлях до іконок у public/miningLanding/
                      alt="icon"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step as string}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <div className="flex justify-center items-center mb-[50px]">
          <Link
            href="/login"
            className="text-blue-500 hover:underline mr-auto ml-auto"
          >
            <motion.button
              className=" px-8 py-3 bg-[#71a7fe] text-white font-semibold rounded-full hover:bg-opacity-90 transition"
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