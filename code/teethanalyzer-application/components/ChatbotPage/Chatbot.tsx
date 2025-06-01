import ChatTextBox from "./ChatTextBox";
import ChatWindow from "./ChatWindow";
import { useState } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello I'm Denty! How can I help?" },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string) => {
    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();
      const botReply: Message = { sender: "bot", text: data.response };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not reach server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
     <div className="flex flex-col h-full w-full p-4">
      <ChatWindow messages={messages} isTyping={isTyping} />

      <div className="mb-3 w-full max-w-2xl mx-auto">
        <ChatTextBox onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chatbot;
