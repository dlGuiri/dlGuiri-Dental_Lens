"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatTextBox from "./ChatTextBox";

type Message = { sender: "user" | "bot"; text: string };

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (text: string) => {
    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

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
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-xl shadow-md">
      <ChatWindow messages={messages} />
      <ChatTextBox onSend={handleSend} />
    </div>
  );
};

export default Chatbot;
