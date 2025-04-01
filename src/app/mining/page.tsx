"use client";
import Layout from "@/layout";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { useLanguageStore } from "@/store/useLanguageStore";
// import Image from "next/image";
import Head from "next/head";

export default function Home() {
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
    // Додаємо нові переклади з закоментованого тексту
    miningSection: {
      ru: {
        title: "💎 Майнинг с Crypto Corporation 💎",
        subtitle: "Хотите зарабатывать на криптовалютах без сложного оборудования? Crypto Corporation предлагает аренду мощностей для майнинга перспективных альткоинов! 🚀",
        howItWorks: "🔹 Как это работает?",
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
          className="w-full bg-green-100 pt-[100px] pb-[100px] mt-[115px] mb-[100px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          <div className="container max-w-[1250px] mx-auto px-4">
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
              {translations.stepsSection[language].title || "How It Works"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(translations.stepsSection[language]).map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                  variants={fadeIn("up", "tween", 0.2 * (index + 1), 0.5)}
                >
                  <div className="w-[40px] h-[40px] bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  {/* <p className="text-gray-700">{step}</p> */}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-primary bg-opacity-5 relative px-[15px] pt-[120px] sm:px-32 sm:pt-72 pb-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: "some" }}
        >
          {/* <div className="container grid lg:grid-cols-2 max-md:justify-items-center max-md:justify-center px-2 mx-auto">
            <article className="static">
              <motion.h6
                className="text-primary text-2xl"
                variants={fadeIn("right", "tween", 0.3, 2)}
              >
                {translations.slogan[language]}
              </motion.h6>
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
              />
            </article>
            <motion.article className="hidden relative lg:block">
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
            </motion.article>
          </div> */}
        </motion.section>
      </Layout>
    </>
  );
}