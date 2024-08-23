"use client";
import Image from "next/image";
import Logo from "app/logo.png";

export default function LogoComponent() {
  return <Image src={Logo} width={200} height={100} alt="Temple Tarot" />;
}
