import Image from "next/image";
import Link from "next/link";
import logo from "/public/assets/Goals Icon.png";
import { JSX } from "react";

const GoalsIcon = ({ isActive = false }: { isActive?: boolean }): JSX.Element => {
  return (
    <div
        className={`relative w-12 h-12 mx-auto mb-2 rounded-xl ${
            isActive ? "bg-blue-50" : "hover:bg-blue-50"
        }`}
    >
      <Image
        src={logo}
        alt="Logo: Goals Icon"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default GoalsIcon;
