import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/ChatbotPage/Chatbot"), {
  ssr: false,
});

export default function chatbot() {
  return (
    <Chatbot />
  );
}