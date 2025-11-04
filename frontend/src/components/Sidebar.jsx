import { useState } from "react";
import useStore from "../store/useStore.js";
import { searchUsers, accessChat } from "../api/api.js";
import toast from "react-hot-toast";
import { getSocket } from "../socket.js";

export default function Sidebar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { chats, selectChat, selectedChat } = useStore();

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const { data } = await searchUsers(search);
      setResults(data);
    } catch (err) {
      toast.error("Search failed");
    }
  };

  const handleAccessChat = async (userId) => {
    try {
      const { data } = await accessChat(userId);
      selectChat(data);
      const socket = getSocket();
      socket.emit("join chat", data._id);
    } catch (err) {
      toast.error("Failed to start chat");
    }
  };

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 flex flex-col">
      <div className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Go
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto bg-gray-900 rounded">
            {results.map((u) => (
              <div
                key={u._id}
                className="p-2 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleAccessChat(u._id)}
              >
                {u.name} ({u.email})
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherUser = chat.users.find(
            (u) => u._id !== useStore.getState().user._id
          );
          return (
            <div
              key={chat._id}
              className={`p-4 border-b cursor-pointer hover:bg-base-200 ${
                selectedChat?._id === chat._id ? "bg-base-200" : ""
              }`}
              onClick={() => {
                selectChat(chat);
                getSocket().emit("join chat", chat._id);
              }}
            >
              <div className="font-semibold">{otherUser.name}</div>
              <div className="text-sm text-gray-600">
                {chat.latestMessage?.content || "No messages yet"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
