import React from "react";
import Image from "next/image";
import image from "@/public/NavbarLogo.png";
const NavbarLogo: React.FC = () => {
  return (
    <Image
      className="bg-whitesmoke bg-opacity-100 py-2"
      width={180}
      height={150}
      alt="NavBar Logo"
      src={image}
    />
  );
};

export default NavbarLogo;
