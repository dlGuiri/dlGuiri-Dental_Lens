type ChatMessageProps = {
  message: string;
  sender: "user" | "bot";
};

const ChatMessage = ({ message, sender }: ChatMessageProps) => {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-xl text-white ${
          isUser ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
