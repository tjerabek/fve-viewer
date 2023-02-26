'use client';

import Image from "next/image";

export default function IconPowerplant({ className }) {
  return (
    <>
      <Image
        src="power-plant-dark.svg"
        width={24}
        height={24}
        alt="Síť"
        className={[className, "dark:hidden"].join(" ")}
      />
      <Image
        src="power-plant-light.svg"
        width={24}
        height={24}
        alt="Síť"
        className={[className, "hidden dark:block"].join(" ")}
      />
    </>
  );
}
