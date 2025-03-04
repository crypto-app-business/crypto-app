"use client";
import React from "react";
import { BsArrowUp } from "react-icons/bs";
import { useLanguageStore } from "@/store/useLanguageStore";

const backToTopContent = {
  ru: {
    buttonText: "Вернуться наверх",
  },
  en: {
    buttonText: "Back to Top",
  },
};

export function BackToTopSection() {
  const { language } = useLanguageStore();

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-0 sm:py-10">
      <div className="container mx-auto text-center pb-[10px] sm:py-6 flex justify-center">
        <button
          className="border border-[#DDDDDD] bg-[#FAFAFA] rounded-xl text-gray py-4 px-6 flex items-center justify-center gap-4"
          onClick={handleClick}
        >
          {backToTopContent[language].buttonText}
          <BsArrowUp />
        </button>
      </div>
    </section>
  );
}