"use client";
import React, { MouseEvent } from "react";
import { FirstButton } from "@/components/buttons/FirstButton";
import { SecondButton } from "@/components/buttons/SecondButton";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsList, BsX } from "react-icons/bs";
import { Menu } from "./Menu";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";

const headerContent = {
  ru: {
    logIn: "Войти",
    signUp: "Зарегистрироваться",
  },
  en: {
    logIn: "Log In",
    signUp: "Sign Up",
  },
};

const header = [
  {
    image: {
      image: {
        _type: "image",
        src: "/header/logo.png",
      },
      alt: "nefa logo",
      asset: {
        _ref: "image-39e664896e55c6dc0f730aea65d6abdbca07a1c6-130x52-svg",
        _type: "reference",
      },
    },
    _createdAt: "2023-05-28T07:27:31Z",
    _rev: "gnkOZoscrUXGAbmI48Stkn",
    _type: "header",
    links: [
      { text: "Cryptocurrency", id: "cryptocurrency" },
      { text: "Exchanges", id: "exchanges" },
      { text: "Watchlist", id: "watchlist" },
      { text: "NFT", id: "nft" },
      { text: "Portfolio", id: "portfolio" },
    ],
    _id: "063453e3-8b2c-4b4e-ae7d-7633b46e049a",
    _updatedAt: "2023-05-30T01:13:26Z",
  },
];

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [backgroundWhite, setBackgroundWhite] = useState(false);
  const { language } = useLanguageStore();

  const handleWindowScroll = () => {
    const height = window.scrollY;
    const tresholdHeight = 50;

    if (height > tresholdHeight) {
      setBackgroundWhite(true);
    } else {
      setBackgroundWhite(false);
    }
  };

  const handleBlackScreenClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDropdownOpen(false);
  };

  useEffect(() => {
    setBackgroundWhite(dropdownOpen);
  }, [dropdownOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  const item = header[0];
  return (
    <header
      className={classNames(
        "fixed flex items-center justify-center py-6 transition-all duration-700 w-full z-10",
        {
          "bg-white shadow-lg": backgroundWhite,
        }
      )}
    >
      <nav className="flex items-center gap-48 max-lg:w-full max-lg:justify-between md:gap-20">
        <div className="flex items-center">
          <figure className="sm:mx-8 m-auto w-[auto] xl:w-[10vw]">
            <Image
              src={item.image.image.src}
              className="max-sm:mx-8 mr-8"
              width={66}
              height={66}
              alt={item.image.alt}
              objectFit="cover"
              priority={false}
            />
          </figure>
          <div className="xl:flex gap-8 hidden">
            <Menu header={header} />
          </div>
        </div>
        <div className="hidden md:flex gap-3 mx-4 w-3/12 md:w-2/4">
          <Link className="w-full" href="/login">
            <FirstButton className={""} onClick={undefined}>
              {headerContent[language].logIn}
            </FirstButton>
          </Link>
          <Link className="w-full" href="/register">
            <SecondButton className={""} onClick={undefined}>
              {headerContent[language].signUp}
            </SecondButton>
          </Link>
        </div>
        <div className="md:hidden sm:ml-80 text-2xl">
          <button
            className="z-50 p-4 block transition-all"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {dropdownOpen ? <BsX /> : <BsList />}
          </button>
          {/* dropdown */}
          <div
            className={classNames({
              "text-base left-0 top-full right-0 absolute transition-all duration-400":
                true,
              "invisible opacity-0": !dropdownOpen,
              "visible opacity-100": dropdownOpen,
            })}
          >
            <div
              className="h-screen left-0 bg-black bg-opacity-30"
              onClick={handleBlackScreenClick}
            >
              <div className="z-20 shadow-xl bg-white p-6 relative">
                <div className="gap-4 flex mb-6">
                  <Link className="w-full" href="/login">
                    <FirstButton className="w-full" onClick={undefined}>
                      {headerContent[language].logIn}
                    </FirstButton>
                  </Link>
                  <Link className="w-full" href="/register">
                    <SecondButton className="w-full" onClick={undefined}>
                      {headerContent[language].signUp}
                    </SecondButton>
                  </Link>
                </div>
                <div className="mb-4">
                  <Menu header={header} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}