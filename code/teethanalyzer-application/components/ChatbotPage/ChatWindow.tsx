import ChatMessage from "./ChatMessage";

type Message = { sender: "user" | "bot"; text: string };

type ChatWindowProps = {
  messages: Message[];
};

const ChatWindow = ({ messages }: ChatWindowProps) => (
  <div className="flex flex-col p-4 space-y-2 overflow-y-auto h-[400px] bg-white rounded-xl shadow-inner">
    {messages.map((msg, idx) => (
      <ChatMessage key={idx} message={msg.text} sender={msg.sender} />
    ))}
  </div>
);

export default ChatWindow;
