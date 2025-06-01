import Image from "next/image";
import Link from "next/link";
import logo from "/public/assets/Goals Icon.png";
import { JSX } from "react";

const GoalsIcon = ({ isActive = false }: { isActive?: boolean }): JSX.Element => {
  return (
    <Link
      href="/calendar"
      className={`group relative w-12 h-12 mx-auto mb-2 rounded-xl cursor-pointer transition-colors overflow-hidden ${
        isActive ? "bg-blue-50" : "hover:bg-blue-50"
      }`}
    >
      <div className="absolute inset-0 z-0 rounded-xl transition-colors" />
      <Image
        src={logo}
        alt="Logo: Calendar Icon"
        className="object-contain z-10 relative" // Add p-2 to see hover effect
        priority
      />
    </Link>
  );
};

export default GoalsIcon;
