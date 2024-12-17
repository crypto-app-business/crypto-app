"use client"
import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import Image from "next/image";
// import { Security as SecurityComponent } from "@/types/sections/security";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

// interface SecurityProps {
//   security: SecurityComponent[];
// }

const security= [
  {
      "_createdAt": "2023-08-30T19:48:10Z",
      "_rev": "Z6Bbpu6kqEP4OfFxEubJhw",
      "_type": "security",
      "_id": "36bb94ea-30a2-4f86-b8ed-30839bf59cd4",
      "title": {
          "text1": "Industry-leading security from day one"
      },
      "_updatedAt": "2023-08-30T19:50:11Z",
      "articles": [
          {
              "span": "Safety, security and compliance",
              "_type": "article",
              "description": "NEFA is a licensed New York trust company that undergoes regular bank exams and is subject to the cybersecurity audits conducted by the New York Department of Financial Services. Learn more about our commitment to security.",
              "_key": "2bed3b2f2d72"
          },
          {
              "span": "Hardware security keys",
              "_type": "article",
              "description": "With NEFA you can secure your account with a hardware security key via WebAuthn.",
              "_key": "e9a2004b98a4"
          },
          {
              "_type": "article",
              "description": "NEFA is SOC 1 Type 2 and SOC 2 Type 2 compliant. We are the world’s first cryptocurrency exchange and custodian to complete these exams.",
              "_key": "e62336a675f9",
              "span": "SOC Certifications"
          }
      ],
      "image": {
          "_type": "image",
          "alt": "cryptocurrency vault",
          "asset": {
              "_ref": "image-543aff4062c8a9663d4011224b9b93488d526c5d-795x656-png",
              "_type": "reference"
          }
      }
  }
]


export function SecuritySection() {
  return (
    <motion.section
      className="container mx-auto py-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
    >
      {security.map((item, index) => (
        <div key={index} className="grid lg:grid-cols-2">
          <motion.figure variants={fadeIn("right", "tween", 0.3, 2)}>
            <Image
              src="/security/main.avif"
              width={1920} 
              height={1584} 
              alt={item.image.alt}
              object-fit="cover"
              priority={false}
            />
          </motion.figure>
          <motion.article
            className="flex justify-center"
            variants={fadeIn("left", "tween", 0.3, 2)}
          >
            <div className="max-w-xl">
              <h2 className="font-bold text-4xl mb-6 leading-normal">
                {item.title.text1}
              </h2>
              <ul className="my-6">
                {item.articles.map((arr, index) => (
                  <li key={index} className="mb-6">
                    <span>
                      <BsCheckCircleFill className="text-primary inline mr-2" />
                      {arr.span}
                    </span>
                    <p className="text-gray mt-3">{arr.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </div>
      ))}
    </motion.section>
  );
}
