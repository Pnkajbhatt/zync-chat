import { useEffect, useRef } from "react";
import useStore from "../store/useStore.js";
import { getSocket } from "../socket.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatBox from "../components/ChatBox.jsx";

export default function ChatLayout() {
  const { user, selectedChat, fetchChats, addMessage, setTyping } = useStore();
  const socket = getSocket();
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("setup", user._id);

    socket.on("message received", (newMessage) => {
      const { selectedChat } = useStore.getState();
      if (selectedChat?._id === newMessage.chat._id) {
        addMessage(newMessage);
      }
    });

    socket.on("typing", ({ userId }) => {
      const sender = selectedChat?.users.find((u) => u._id === userId);
      setTyping(true, sender?.name);
    });

    socket.on("stop typing", () => {
      setTyping(false, null);
    });

    return () => {
      socket.off("message received");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket, user, selectedChat, addMessage, setTyping]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="flex h-screen bg-base-200">
      <Sidebar />
      {selectedChat ? (
        <ChatBox />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}
