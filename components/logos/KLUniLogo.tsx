import React from "react";
import Image from "next/image";
import image from "@/public/KLULogo.png";

const KLUniversityLogo: React.FC = () => {
  return (
    <Image
      className="bg-whitesmoke bg-opacity-100 py-2"
      width={100}
      height={200}
      alt="KL University Logo"
      src={image}
    />
  );
};

export default KLUniversityLogo;
