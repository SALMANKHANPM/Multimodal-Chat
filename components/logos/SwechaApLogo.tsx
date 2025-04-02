import React from "react";
import Image from "next/image";
import image from "@/public/SwechaAp.png";
const SwechaApLogo: React.FC = () => {
  return (
    <Image
      className="top-0 left-0"
      width={100}
      height={200}
      alt="Swecha Ap Logo"
      src={image}
    />
  );
};

export default SwechaApLogo;
