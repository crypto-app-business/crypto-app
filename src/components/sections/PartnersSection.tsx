"use client"
// import { client } from "@/lib/sanity";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import React from "react";
// import { Partners as PartnersComponents } from "@/types/sections/partners";
import { motion } from "framer-motion";
import { slideIn } from "@/utils/motion";

// interface PartnerProps {
//   partners: PartnersComponents[];
// }

const partners = [
  {
      "description": "We're partners with countless major organisations around the globe",
      "_id": "4675d7a8-cfe4-4fd7-82ff-d2773feb1016",
      "title": {
          "text1": "Биржи"
      },
      "_updatedAt": "2023-08-29T14:38:13Z",
      "partner": [
          {
              "image": {
                  "alt": "partner one",
                  "src": "/partners/1.avif"
              },
              "_type": "partnerimage",
              "_key": "d15ac4cc476f"
          },
          {
              "_key": "5e7bd55ae0a3",
              "image": {
                  "alt": "partner two",
                  "src": "/partners/2.avif"
              },
              "_type": "partnerimage"
          },
          {
              "image": {
                  "alt": "partner three",
                  "src": "/partners/3.avif"
              },
              "_type": "partnerimage",
              "_key": "11a5d3ba1f2f"
          },
          {
              "image": {
                  "alt": "partner four",
                  "src": "/partners/4.avif"
              },
              "_type": "partnerimage",
              "_key": "fb6ff5e72dd6"
          }
      ],
      "_createdAt": "2023-08-28T18:59:48Z",
      "_rev": "Z6Bbpu6kqEP4OfFxEtyhbM",
      "_type": "partners"
  }
]

export const PartnersSection = () => {
  return (
    <motion.section
      className="px-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      <div className="rounded-3xl  bg-[#F4F9FF]  py-20">
        <div className="container mx-auto">
          {partners.map((partner, index) => (
            <article className="text-center m-4" key={index}>
              <h2 className="text-3xl font-bold mb-4">{partner.title.text1}</h2>
              <p className="text-gray">{partner.description}</p>
              <article className="mx-4">
                <div className="grid lg:grid-cols-4 grid-cols-1 justify-items-center gap-6">
                  {partner.partner.map((item, index) => (
                    <motion.figure
                      variants={
                        index === 0
                          ? slideIn("right", "spring", 0.2, 2)
                          : index === 1
                          ? slideIn("right", "spring", 0.2, 3)
                          : index === 2
                          ? slideIn("right", "spring", 0.2, 4)
                          : slideIn("right", "spring", 0.2, 5)
                      }
                      key={index}
                    >
                      <Image
                        src={item.image.src} 
                        alt={item.image.alt}
                        width={1920} 
                        height={1595} 
                        object-fit="cover"
                        priority={false}
                      />
                    </motion.figure>
                  ))}
                </div>
              </article>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
