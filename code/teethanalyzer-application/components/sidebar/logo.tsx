import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import logo from "/public/assets/Tonguevision-icon482.png";
=======
import logo from "/public/assets/Dental Lens Logo.png";
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
import { JSX } from "react";

const Logo = (): JSX.Element => {
  return (
    <div className="relative w-16 h-16 mx-auto mb-4">
      <Image
        src={logo}
        alt="Logo: Dental Lens"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
