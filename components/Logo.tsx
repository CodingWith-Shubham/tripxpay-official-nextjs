import Image, { ImageProps } from "next/image";

const Logo = (props: Omit<ImageProps, "src" | "alt">) => (
  <Image src="/logo.svg" alt="Logo" width={40} height={40} {...props} />
);

export default Logo; 
