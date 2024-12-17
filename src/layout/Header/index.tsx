"use client"
import { FirstButton } from "@/components/buttons/FirstButton";
import { SecondButton } from "@/components/buttons/SecondButton";
// import { client } from "@/lib/sanity";
import classNames from "classnames";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsList, BsX } from "react-icons/bs";
import { Menu } from "./Menu";
// import { Header as HeaderComponent } from "@/types/layout/header";
// import { useRouter } from "next/router";
import Link from 'next/link';


// interface HeaderProps {
//   header: HeaderComponent[];
// }

// const headerMochup = [
//   {
//     title: "Cryptocurrency",
//   },
//   {
//     title: "Exchanges",
//   },
//   {
//     title: "Watchlist",
//   },
//   {
//     title: "NFT",
//   },
//   {
//     title: "Portfolio",
//   },
//   {
//     title: "Products",
//     links: [
//       { label: "Exchanges", href: "/wallets/metamask" },
//       { label: "Wallets", href: "/wallets/trust-wallet" },
//     ],
//   },
// ];

// const headerMochup = [
//   { title: "Cryptocurrency" },
//   { title: "Exchanges" },
//   { title: "Watchlist" },
//   { title: "NFT" },
//   { title: "Portfolio" },
//   {
//     title: "Products",
//     links: [
//       { label: "Exchanges", href: "/wallets/metamask" },
//       { label: "Wallets", href: "/wallets/trust-wallet" },
//     ],
//   },
// ];

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [backgroundWhite, setBackgroundWhite] = useState(false);
  

  const handleWindowScroll = () => {
    const height = window.scrollY;
    const tresholdHeigth = 50;

    if (height > tresholdHeigth) {
      setBackgroundWhite(true);
    } else {
      setBackgroundWhite(false);
    }
  };

  // const handleBlackScreenClick = (e: any) => {
  //   e.stopPropagation();
  //   setDropdownOpen(false);
  // };

  useEffect(() => {
    setBackgroundWhite(dropdownOpen);
  }, [dropdownOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  // const item = header[0];


  return (
    <header
      className={classNames(
        "fixed flex items-center justify-center py-6 transition-all duration-700 w-full z-10",
        {
          "bg-white shadow-lg": backgroundWhite,
        },
      )}
    >
      <nav className="flex items-center gap-48 max-lg:w-full max-lg:justify-between md:gap-20">
        <div className="flex items-center">
          <figure className="sm:mx-8 m-auto w-[auto] xl:w-[10vw]">
            <Image
              // eslint-disable-next-line react-hooks/rules-of-hooks
              className="h-12 max-sm:mx-8 mr-8"
              src="/header/logo.svg" 
              alt="Your image description"
              object-fit="cover"
              priority={false}
              width={130} 
              height={52} 
            />
          </figure>
          {/* <div className="xl:flex gap-8 hidden"> */}
          <div className="xl:flex gap-8">
            <Menu />
          </div>
        </div>
        {/* <div className="hidden md:flex gap-3 mx-4 w-3/12 md:w-2/4"> */}
        <div className="flex gap-3 mx-4 w-3/12 md:w-2/4">
          <Link href="/login">
            <FirstButton className={""} onClick={undefined}>
              Log In
            </FirstButton>
          </Link>
          <Link href="/register">
            <SecondButton className={""} onClick={undefined}>
              Sign Up
            </SecondButton>
          </Link>
        </div>
        <div className="hidden sm:ml-80 text-2xl">
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
              onClick={()=>{}}
            >
              <div className="z-20 shadow-xl bg-white p-6 relative">
                <div className="gap-4 flex mb-6">
                  <Link href="/login">
                    <FirstButton className="w-full" onClick={undefined}>
                      Log In
                    </FirstButton>
                  </Link>
                  <Link href="/register">
                    <SecondButton className="w-full" onClick={undefined}>
                      Sign Up
                    </SecondButton>
                  </Link>
                </div>
                <Link href="/login" className="mr-4 bg-blue-500 px-4 py-2 rounded">
              Login
            </Link>
                <div className="mb-4">
                  <Menu  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
