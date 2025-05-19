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
  nftSection: {
    ru: {
      title: string;
      subtitle: string;
      offeringsTitle: string;
      offerings: string[];
      updatesTitle: string;
      updatesDescription: string;
      howToGetTitle: string;
      howToGetSteps: string[];
      callToAction: string;
    };
    en: {
      title: string;
      subtitle: string;
      offeringsTitle: string;
      offerings: string[];
      updatesTitle: string;
      updatesDescription: string;
      howToGetTitle: string;
      howToGetSteps: string[];
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

export default function NFT() {
  const { language } = useLanguageStore();

  const translations: Translations = {
    nftSection: {
      ru: {
        title: "Уникальные NFT-предложения от Crypto Corporation",
        subtitle:
          "В Crypto Corporation мы открываем совершенно новый уровень для наших пользователей — NFT-инфраструктура, сочетающая технологии, искусство и прибыль!",
        offeringsTitle: "Что у нас есть?",
        offerings: [
          "Эксклюзивные коллекции NFT — ограниченные по количеству, с уникальным дизайном и смысловой ценностью. За время, отведенное компанией, мы занимаемся продвижением и перепродажей данной картины.",
          "NFT с функцией дохода — у нас есть NFT, которые приносят пассивный доход или открывают доступ к закрытым функциям платформы.",
          "NFT-контракты — интеграция с трейдингом, стейкингом, реферальной системой и даже майнингом!",
          "NFT-доступы — некоторые NFT дают доступ к раннему участию в листингах, закрытым инвестициям и премиум-ботам.",
        ],
        updatesTitle: "Постоянное обновление и гибкость",
        updatesDescription:
          "Мы мониторим рынок в реальном времени и оперативно реагируем на новые интересные возможности. Как только появляются уникальные активы или трендовые направления, мы выпускаем новые коллекции или адаптируем существующие, чтобы наши пользователи всегда были на шаг впереди.",
        howToGetTitle: "Как получить NFT?",
        howToGetSteps: [
          "Зарегистрируйтесь на платформе Crypto Corporation",
          "Участвуйте в розыгрышах, акциях или приобретайте NFT напрямую",
          "Храните в своём кабинете",
          "Зарабатывайте на перепродаже NFT на рынке",
        ],
        callToAction:
          "Crypto Corporation NFT — это не просто токены. Это живой, постоянно обновляющийся инструмент для заработка, участия и роста в криптомире!",
      },
      en: {
        title: "🖼 Unique NFT Offerings from Crypto Corporation",
        subtitle:
          "At Crypto Corporation, we’re unlocking a whole new level for our users — an NFT infrastructure that combines technology, art, and profit!",
        offeringsTitle: "🔹 What do we offer?",
        offerings: [
          "Exclusive NFT collections — limited in quantity, with unique designs and meaningful value. During the period designated by the company, we handle the promotion and resale of these assets.",
          "Income-generating NFTs — we offer NFTs that provide passive income or unlock access to exclusive platform features.",
          "NFT contracts — integrated with trading, staking, referral systems, and even mining!",
          "NFT access passes — certain NFTs grant early access to listings, private investments, and premium bots.",
        ],
        updatesTitle: "Constant Updates and Flexibility",
        updatesDescription:
          "We monitor the market in real-time and quickly adapt to new and exciting opportunities. Whenever unique assets or trending directions emerge, we release new collections or update existing ones to keep our users one step ahead.",
        howToGetTitle: "How to get NFTs?",
        howToGetSteps: [
          "Register on the platform Crypto Corporation",
          "Participate in giveaways, promotions, or purchase NFTs directly",
          "Store them in your account",
          "Earn by reselling NFTs on the market",
        ],
        callToAction:
          "Crypto Corporation NFTs are more than just tokens. They’re a dynamic, constantly evolving tool for earning, participating, and growing in the crypto world!",
      },
    },
    stepsSection: {
      ru: {
        step1: "Зарегистрируйтесь на платформе Crypto Corporation",
        step2: "Участвуйте в розыгрышах, акциях или приобретайте NFT напрямую",
        step3: "Храните в своём кабинете",
        step4: "Зарабатывайте на перепродаже NFT на рынке",
      },
      en: {
        step1: "Register on the platform Crypto Corporation",
        step2: "Participate in giveaways, promotions, or purchase NFTs directly",
        step3: "Store them in your account",
        step4: "Earn by reselling NFTs on the market",
      },
    },
    trustSection: {
      ru: {
        title: "ПОЧЕМУ МОЖНО НАМ ДОВЕРЯТЬ И РАБОТАТЬ С НАМИ?",
        items: [
          { icon: "1", text: "Эксклюзивные NFT с уникальным дизайном" },
          { icon: "2", text: "Пассивный доход от NFT-контрактов" },
          { icon: "3", text: "Интеграция с другими функциями платформы" },
          { icon: "4", text: "Безопасное хранение и прозрачные сделки" },
          { icon: "5", text: "Поддержка пользователей 24/7" },
        ],
        button: "ПОЛУЧИТЬ NFT",
      },
      en: {
        title: "WHY TRUST AND WORK WITH US?",
        items: [
          { icon: "1", text: "Exclusive NFTs with unique designs" },
          { icon: "2", text: "Passive income from NFT contracts" },
          { icon: "3", text: "Integration with other platform features" },
          { icon: "4", text: "Secure storage and transparent transactions" },
          { icon: "5", text: "24/7 user support" },
        ],
        button: "GET NFT",
      },
    },
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Crypto Corporation - Unique NFT Offerings" />
        <meta name="keywords" content="NFT, Crypto Corporation, Crypto art, Passive income" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FFF" />
        <title>Crypto Corporation NFT</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />
      </Head>
      <Layout>
        {/* Секція про NFT */}
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
              {translations.nftSection[language].title}
            </motion.h1>
            <motion.h3
              className="text-[17px] font-medium text-center mb-6"
              variants={fadeIn("up", "tween", 0.3, 1)}
            >
              {translations.nftSection[language].subtitle}
            </motion.h3>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.4, 1)}
            >
              {translations.nftSection[language].offeringsTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.5, 1)}
            >
              {translations.nftSection[language].offerings.map((offering, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {offering}
                </li>
              ))}
            </motion.ul>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.6, 1)}
            >
              {translations.nftSection[language].updatesTitle}
            </motion.h4>
            <motion.p
              className="text-gray-700 mb-6"
              variants={fadeIn("up", "tween", 0.7, 1)}
            >
              {translations.nftSection[language].updatesDescription}
            </motion.p>
            <motion.h4
              className="text-xl font-semibold mb-2"
              variants={fadeIn("up", "tween", 0.8, 1)}
            >
              {translations.nftSection[language].howToGetTitle}
            </motion.h4>
            <motion.ul
              className="list-none mb-6 pl-5"
              variants={fadeIn("up", "tween", 0.9, 1)}
            >
              {translations.nftSection[language].howToGetSteps.map((step, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {step}
                </li>
              ))}
            </motion.ul>
            <motion.h3
              className="text-[17px] font-medium text-center"
              variants={fadeIn("up", "tween", 1.0, 1)}
            >
              {translations.nftSection[language].callToAction}
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
              {translations.nftSection[language].howToGetTitle}
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
                      src={`/nftLanding/${index + 1}.png`}
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
                      src={`/nftLanding/${item.icon}.png`}
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