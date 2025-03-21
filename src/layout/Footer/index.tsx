"use client"
import React from "react";
// import Image from "next/image";
// import { BsArrowRight } from "react-icons/bs";
// import { SecondButton } from "@/components/buttons/SecondButton";
// import { Footer as FooterComponent } from "@/types/layout/footer";

// interface FooterProps {
//   footer: FooterComponent[];
// }

// const footer = [
//   {
//       "_createdAt": "2023-09-02T15:41:10Z",
//       "_type": "footer",
//       "links": [
//           "Buy Crypto",
//           "Exchanges",
//           "Watchlist",
//           "Portfolio",
//           "NFT"
//       ],
//       "links3": [
//           "Help Center",
//           "Contact Us",
//           "System Status",
//           "Area of Avaibility",
//           "Privacy Policy"
//       ],
//       "image": {
//           "alt": "nefa logo",
//           "src": "/footer/logo.svg"
//       },
//       "_rev": "jT8xuzfmfyyeoKovz8dtqs",
//       "_id": "03d035be-f862-4fe1-8dac-139ad0396069",
//       "_updatedAt": "2023-09-02T15:50:10Z",
//       "links2": [
//           "Products",
//           "Abous Us",
//           "Careers",
//           "Blog",
//           "Security"
//       ]
//   }
// ]

export function Footer() {
  return (
    <footer className="px-28 max-md:px-4 w-11/12">
      {/* <div className="container mx-auto border-y border-lightgray py-6">
        <div className="grid lg:grid-cols-4">
          {footer.map((item, index) => (
            <React.Fragment key={index}>
              <article className="xl:flex md:justify-between p-6 xl:border-r border-lightgray">
                <figure className="mb-6 max-lg:mx-auto -ml-12">
                  <Image
                    src={item.image.src}
                    width={130} 
                    height={52}
                    alt={item.image.alt}
                    object-fit="cover"
                    priority={false}
                  />
                </figure>
                <ul>
                  {item.links.map((arr, index) => (
                    <li key={index} className="mb-4">
                      <a
                        href="#"
                        className="text-gray hover:text-primary transition ease-in-out delay-100"
                      >
                        {arr}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="xl:flex md:justify-center p-6 xl:border-r border-lightgray">
                <ul>
                  {item.links2.map((arr, index) => (
                    <li key={index} className="mb-4">
                      <a
                        href="#"
                        className="text-gray hover:text-primary transition ease-in-out delay-100"
                      >
                        {arr}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="xl:flex md:justify-center p-6 xl:border-r border-lightgray">
                <ul>
                  {item.links3.map((arr, index) => (
                    <li key={index} className="mb-4">
                      <a
                        href="#"
                        className="text-gray hover:text-primary transition ease-in-out delay-100"
                      >
                        {arr}
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="p-6 w-full">
                <span className="text-gray">Newsletter</span>
                <p className="text-gray font-thin w-80">
                  Never miss anything crypto when you&apos; re on the go
                </p>
                <div className="flex gap-2 my-4">
                  <div
                    // type="email"
                    className="border border-lightgray rounded-xl p-4 outline-none focus:border-primary w-full"
                    // placeholder="Enter your email"
                    // defaultValue=""
                  >Enter your email</div>
                  <SecondButton
                    className="!px-5 aspect-square !rounded-xl"
                    aria-label="Arrow Right"
                    onClick={undefined}
                  >
                    <BsArrowRight />
                  </SecondButton>
                </div>
              </article>
            </React.Fragment>
          ))}
        </div>
      </div>
      <p className="text-gray text-center py-6">
        &copy; Copyright 2022 NEFA LLC. All rights reserved
      </p> */}
    </footer>
  );
}
