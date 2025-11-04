import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore.js";
import { getSocket } from "../socket.js";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ChatBox() {
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, messages, user, addMessage, typing, typingUser } =
    useStore();
  const socket = getSocket();
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("stop typing", selectedChat._id);
    try {
      const { data } = await axios.post(`${API_URL}/messages`, {
        content: newMessage,
        chatId: selectedChat._id,
      });
      socket.emit("new message", data);
      addMessage(data);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    if (!typing) {
      socket.emit("typing", selectedChat._id);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
    }, 1000);
  };

  const otherUser = selectedChat.users.find((u) => u._id !== user._id);

  const getAvatarUrl = (u) => {
    if (!u) return `https://ui-avatars.com/api/?name=User&background=random`;
    const a = u.avatar;
    if (a) {
      if (/^https?:\/\//i.test(a)) return a;
      const path = a.startsWith("/") ? a : `/${a}`;
      return `${API_URL}${path}`;
    }
    const name = u.name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-base-100 flex items-center gap-3">
        <Link
          to={`/profile/${otherUser._id}`}
          className="block text-inherit cursor-pointer hover:opacity-80 transition"
        >
          <div className="avatar online">
            <div className="w-10 rounded-full">
              <img src={getAvatarUrl(otherUser)} alt={`${otherUser.name}'s avatar`} />
            </div>
          </div>
        </Link>
        <div>
          <div className="font-semibold">{otherUser.name}</div>
          {typing && (
            <div className="text-sm text-green-600">
              {typingUser} is typing...
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`chat ${
              m.sender._id === user._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-8 rounded-full">
                <img src={getAvatarUrl(m.sender)} />
              </div>
            </div>
            <div className="chat-bubble">{m.content}</div>
            <div className="chat-footer opacity-50 text-xs">
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-base-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={newMessage}
            onChange={handleTyping}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
