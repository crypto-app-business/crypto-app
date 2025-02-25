// import { client } from "@/lib/sanity";
// import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import classNames from "classnames";
import { Hero as ParticleComponent } from "@/types/sections/hero";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

interface ParticleProps {
  particle: ParticleComponent[];
}

interface classProps {
  className: string;
}

export default function OrangeCircleParticle({
  className,
  // particle,
}: classProps & ParticleProps) {
  // const item = particle[0];

  return (
    <motion.figure
      className={classNames(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
      variants={fadeIn("left", "tween", 0.3, 2)}
    >
      <Image
        src="/hero-section/2.svg"
        alt="Your image description" 
        width={30} 
        height={30} 
        objectFit="cover"
        priority={false}
      />
    </motion.figure>
  );
}
