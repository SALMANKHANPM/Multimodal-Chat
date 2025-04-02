import React from "react";
import Image from "next/image";
import image from "@/public/KlGlug.png";
const KlGlugLogo: React.FC = () => {
  return (
    <Image
      className="bg-whitesmoke bg-opacity-100 py-2"
      width={100}
      height={120}
      alt="NavBar Logo"
      src={image}
    />
  );
};

export default KlGlugLogo;
