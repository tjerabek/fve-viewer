'use client';

import Image from "next/image";

export default function IconSun({ className }) {
  return (
    <>
      <Image
        src="sun-dark.svg"
        width={24}
        height={24}
        alt="Slunce"
        className={[className, "dark:hidden"].join(" ")}
      />
      <Image
        src="sun-light.svg"
        width={24}
        height={24}
        alt="Slunce"
        className={[className, "hidden dark:block"].join(" ")}
      />
    </>
  );
}
