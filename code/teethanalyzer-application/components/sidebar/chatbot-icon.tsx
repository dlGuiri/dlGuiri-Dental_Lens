import Image from "next/image";
import Link from "next/link";
<<<<<<< HEAD
import logo from "/public/assets/Tonguevision-icon482.png";
=======
import logo from "/public/assets/Chatbot Icon.png";
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
import { JSX } from "react";

const ChatbotIcon = ({ isActive = false }: { isActive?: boolean }): JSX.Element => {
  return (
    <Link
      href="/chatbot"
      className={`group relative w-12 h-12 mx-auto mb-2 rounded-xl cursor-pointer transition-colors overflow-hidden ${
        isActive ? "bg-blue-50" : "hover:bg-blue-50"
      }`}
    >
      <div className="absolute inset-0 z-0 rounded-xl transition-colors" />
      <Image
        src={logo}
        alt="Logo: ChatBot Icon"
        className="object-contain z-10 relative" // Add p-2 to see hover effect
        priority
      />
    </Link>
  );
};

export default ChatbotIcon;
