"use client"
// import { client } from "@/lib/sanity";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsChevronRight } from "react-icons/bs";
// import { Coins as CoinsComponents } from "@/types/sections/crypto";

// interface CoinsProps {
//   coins: {
//     trendcoins: CoinsComponents[];
//     gainercoins: CoinsComponents[];
//     recentlycoins: CoinsComponents[];
//   };
// }

export function CryptoCurrencySection() {
  // const { trendcoins, gainercoins, recentlycoins } = coins;

  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);
  const trendcoins = [
    {
        "text": "Bitcoin",
        "image": {
            "alt": "Bitcoin",
            "src": "/coins/trendcoins/1.avif"
        },
        "price": "$43,180.13",
        "span": "+",
        "chartImage": {
            "chartAlt": "Bitcoin chart",
            "src": "/coins/trendcoins/1.1.svg"
        }
    },
    {
        "price": "$3,480.65",
        "span": "-",
        "chartImage": {
            "chartAlt": "Ethereum chart",
            "src": "/coins/trendcoins/2.1.svg"
        },
        "text": "Ethereum",
        "image": {
            "_type": "image",
            "alt": "Ethereum",
            "src": "/coins/trendcoins/2.avif"
        },
        "alt": null
    },
    {
        "text": "Solana",
        "image": {
            "_type": "image",
            "alt": "Solana",
            "src": "/coins/trendcoins/3.avif"
        },
        "alt": null,
        "price": "$150,20",
        "span": "+",
        "chartImage": {
            "chartAlt": "Solana chart",
            "src": "/coins/trendcoins/3.1.svg"
        }
    },
    {
        "text": "Dogecoin",
        "image": {
            "_type": "image",
            "src": "/coins/trendcoins/4.avif"
        },
        "alt": null,
        "price": "$0,1572",
        "span": "+",
        "chartImage": {
            "src": "/coins/trendcoins/4.1.svg",
            "chartAlt": "Dogecoin chart",
        }
    }
  ]

  const gainercoins = [
                {
                    "image": {
                        "src": "/coins/gainercoins/1.avif",
                        "alt": "PAPPAY"
                    },
                    "alt": null,
                    "price": "$0.00374",
                    "span": "+",
                    "chartImage": {
                        "chartAlt": "PAPPAY chart",
                        "src": "/coins/gainercoins/1.1.svg",
                    },
                    "text": "PAPPAY"
                },
                {
                    "text": "Bitcoin Asia",
                    "image": {
                        "alt": "Bitcoin Asia",
                        "src": "/coins/gainercoins/2.avif",
                    },
                    "alt": null,
                    "price": "$0.02096",
                    "span": "+",
                    "chartImage": {
                        "chartAlt": "Bitcoin Asia chart",
                        "src": "/coins/gainercoins/2.1.svg",
                    }
                },
                {
                    "alt": null,
                    "price": "$0.004907",
                    "span": "+",
                    "chartImage": {
                        "chartAlt": "MoonRock chart",
                        "src": "/coins/gainercoins/3.1.svg",
                    },
                    "text": "MoonRock",
                    "image": {
                        "src": "/coins/gainercoins/3.avif",
                        "alt": "MoonRock"
                    }
                },
                {
                    "text": "NinjaFloki",
                    "image": {
                        "alt": "NinjaFloki",
                        "src": "/coins/gainercoins/4.avif",
                    },
                    "alt": null,
                    "price": "$0.000123",
                    "span": "+",
                    "chartImage": {
                        "chartAlt": "NinjaFloki chart",
                        "src": "/coins/gainercoins/4.1.svg",
                    }
                }
            ]
  const recentlycoins = [
                {
                    "chartImage": {
                        "src": "/coins/recentlycoins/1.1.svg",
                        "chartAlt": "Metacraft chart",
                    },
                    "text": "Metacraft",
                    "image": {
                        "alt": "Metacraft",
                        "src": "/coins/recentlycoins/1.avif",
                    },
                    "alt": null,
                    "price": "$0.0608",
                    "span": "-"
                },
                {
                    "alt": null,
                    "price": "$0.5875",
                    "span": "-",
                    "chartImage": {
                        "chartAlt": "Frog chart",
                        "src": "/coins/recentlycoins/2.1.svg",
                    },
                    "text": "Frog",
                    "image": {
                        "alt": "Frog",
                        "src": "/coins/recentlycoins/2.avif",
                    }
                },
                {
                    "price": "$0.04041",
                    "span": "+",
                    "chartImage": {
                        "src": "/coins/recentlycoins/3.1.svg",
                        "chartAlt": "Musk Doge chart",
                    },
                    "text": "Musk Doge",
                    "image": {
                        "alt": "Musk Doge",
                        "src": "/coins/recentlycoins/3.avif",
                    },
                    "alt": null
                },
                {
                    "text": "2SHARE",
                    "image": {
                        "alt": "2SHARE",
                        "src": "/coins/recentlycoins/4.avif",
                    },
                    "alt": null,
                    "price": "$1,366.24",
                    "span": "+",
                    "chartImage": {
                        "chartAlt": "2SHARE chart",
                        "src": "/coins/recentlycoins/4.1.svg",
                    }
                }
            ]
        
  return (
    <section className="-mt-20 mx-12 relative px-5 lg:px-10 max-sm:flex max-sm:justify-center">
      <div className="max-md:w-[max-content] lg:container mx-auto rounded-3xl bg-white py-8 lg:px-4 shadow">
        <article className="grid lg:grid-cols-2 xl:grid-cols-3 md:justify-center w-full">
          {/* trending coins */}
          <aside className="px-5 mb-6">
            <div className="flex justify-between mb-6">
              <figure className="font-bold text-lg flex gap-4 items-center">
                <Image
                      src={"/coins/logo1.png"}
                      alt={"logo1"}
                      object-fit="cover"
                      priority={false}
                      width={16}
                      height={16}
                      className="inline w-[1em] h-[1em] mr-2 align-middle"
                    /> Trending
              </figure>
              <Link href="#" className="text-primary cursor-pointer">
                More
                <BsChevronRight className="inline ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-3 mb-4 text-base">
              <span className="text-gray">Name</span>
              <span className="text-gray">Price</span>
              <span className="text-gray">Chart</span>
            </div>
            {trendcoins.map((coin, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-3 mb-2 py-2 border-b border-lightgray text-sm w-max">
                  <figure className="flex items-center">
                    <Image
                      src={coin.image.src}
                      alt={coin.image.alt || ""}
                      object-fit="cover"
                      priority={false}
                      width={64}
                      height={64}
                      className="inline w-[1em] h-[1em] mr-2 align-middle"
                    />
                    {coin.text}
                  </figure>

                  <p className="flex items-center">
                    {coin.span === "+" ? (
                      <span className="text-green mr-1">{coin.span}</span>
                    ) : (
                      <span className="text-red mr-1">{coin.span}</span>
                    )}
                    {coin.price}
                  </p>
                  <figure>
                    <Image
                      src={coin.chartImage.src}
                      alt={coin.chartImage.chartAlt || ""}
                      object-fit="cover"
                      priority={false}
                      width={115}
                      height={42}
                    />
                  </figure>
                </div>
              </React.Fragment>
            ))}
          </aside>
          {/* gainer coins */}
          <aside className="px-5 mb-6">
            <div className="flex justify-between mb-6">
              <figure className="font-bold text-lg flex gap-4 items-center">
                <Image
                      src={"/coins/logo2.png"}
                      alt={"logo2"}
                      object-fit="cover"
                      priority={false}
                      width={16}
                      height={16}
                      className="inline w-[1em] h-[1em] mr-2 align-middle"
                    /> Top Gainers
              </figure>
              <Link href="#" className="text-primary cursor-pointer">
                More
                <BsChevronRight className="inline ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-3 mb-4 text-base">
              <span className="text-gray">Name</span>
              <span className="text-gray">Price</span>
              <span className="text-gray">Chart</span>
            </div>
            {gainercoins.map((coin, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-3 mb-2 py-2 border-b border-lightgray text-sm w-max">
                  <figure className="flex items-center">
                    <Image
                      src={coin.image.src}
                      alt={coin.image.alt || ""}
                      object-fit="cover"
                      priority={false}
                      width={64}
                      height={64}
                      className="inline w-[1em] h-[1em] mr-2 align-middle"
                    />
                    {coin.text}
                  </figure>

                  <p className="flex items-center">
                    {coin.span === "+" ? (
                      <span className="text-green mr-1">{coin.span}</span>
                    ) : (
                      <span className="text-red mr-1">{coin.span}</span>
                    )}
                    {coin.price}
                  </p>
                  <figure>
                    <Image
                      src={coin.chartImage.src}
                      alt={coin.chartImage.chartAlt || ""}
                      object-fit="cover"
                      priority={false}
                      width={115}
                      height={42}
                    />
                  </figure>
                </div>
              </React.Fragment>
            ))}
          </aside>
          {/* recently coins */}
          <aside className="px-5 mb-6">
            <div className="flex justify-between mb-6">
              <figure className="font-bold text-lg flex gap-4 items-center">
                <Image
                      src={"/coins/logo3.png"}
                      alt={"logo3"}
                      object-fit="cover"
                      priority={false}
                      width={16}
                      height={16}
                      className="inline w-[1em] h-[1em] mr-2 align-middle"
                    /> Recently Added
                
              </figure>
              <Link href="#" className="text-primary cursor-pointer">
                More
                <BsChevronRight className="inline ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-3 mb-4 text-base">
              <span className="text-gray">Name</span>
              <span className="text-gray">Price</span>
              <span className="text-gray">Chart</span>
            </div>
            {recentlycoins.map((coin, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-3 mb-2 py-2 border-b border-lightgray text-sm w-max">
                  <figure className="flex items-center">
                    <Image
                      src={coin.image.src}
                      alt={coin.image.alt || ""}
                      object-fit="cover"
                      priority={false}
                      width={64}
                      height={64}
                      className="inline w-[1em] h-[1em] mr-2 align-middle"
                    />
                    {coin.text}
                  </figure>

                  <p className="flex items-center">
                    {coin.span === "+" ? (
                      <span className="text-green mr-1">{coin.span}</span>
                    ) : (
                      <span className="text-red mr-1">{coin.span}</span>
                    )}
                    {coin.price}
                  </p>
                  <figure>
                    <Image
                      src={coin.chartImage.src}
                      alt={coin.chartImage.chartAlt || ""}
                      object-fit="cover"
                      priority={false}
                      width={115}
                      height={42}
                    />
                  </figure>
                </div>
              </React.Fragment>
            ))}
          </aside>
        </article>
      </div>
    </section>
  );
}
