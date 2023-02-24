import Image from "next/image";

export default function IconHouse({ className }) {
  return (
    <>
      <Image
        src="house-dark.svg"
        width={24}
        height={24}
        alt="Spotřeba"
        className={[className, "dark:hidden"].join(" ")}
      />
      <Image
        src="house-light.svg"
        width={24}
        height={24}
        alt="Spotřeba"
        className={[className, "hidden dark:block"].join(" ")}
      />
    </>
  );
}
