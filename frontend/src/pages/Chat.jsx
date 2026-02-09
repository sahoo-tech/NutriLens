

import { useState, useEffect } from "react";
import axios from "axios";

export default function ChatAssistant() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load chat from localStorage on first render
  useEffect(() => {
    const savedChat = localStorage.getItem("ai_chat_history");
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    }
  }, []);

  // Save chat to localStorage whenever chat changes
  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(chat));
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setChat((prev) => [...prev, { user: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userMessage,
      });

      setChat((prev) => [...prev, { bot: res.data.reply }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { bot: "❌ AI is not responding. Please try again." },
      ]);
    }

    setLoading(false);
  };

  // 🔹 Clear chat
  const clearChat = () => {
    localStorage.removeItem("ai_chat_history");
    setChat([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0f1f] to-[#0b1c3d]">
      <div className="w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-blue-400">
            🤖 AI Assistant
          </h2>
          <button
            onClick={clearChat}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
          {chat.map((c, i) => (
            <div key={i} className="flex flex-col gap-1">
              {c.user && (
                <div className="self-end bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                  {c.user}
                </div>
              )}

              {c.bot && (
                <div className="self-start bg-black/60 text-blue-100 px-4 py-2 rounded-2xl rounded-bl-sm border border-blue-500/20 max-w-[80%]">
                  {c.bot}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <p className="text-blue-400 text-sm animate-pulse">
              AI is typing...
            </p>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-black/60 border border-blue-500/30 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask about booking, check-in, amenities..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 rounded-xl disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
