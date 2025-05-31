import { useState } from "react";

type TextBoxProps = {
  onSend: (text: string) => void;
};

const ChatTextBox = ({ onSend }: TextBoxProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex mt-4">
      <input
        type="text"
        className="flex-1 border rounded-l-xl p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask Denty something..."
      />
      <button
        className="bg-blue-500 text-white px-4 rounded-r-xl"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default ChatTextBox;
