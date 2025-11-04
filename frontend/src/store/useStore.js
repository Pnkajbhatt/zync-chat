import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  chats: [],
  selectedChat: null,
  messages: [],
  typing: false,
  typingUser: null,

  // Set auth
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      chats: [],
      selectedChat: null,
      messages: [],
    });
    delete axios.defaults.headers.common["Authorization"];
  },

  // Fetch chats
  fetchChats: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/chats`);
      set({ chats: data });
    } catch (err) {
      console.error(err);
    }
  },

  // Select chat
  selectChat: (chat) => {
    set({ selectedChat: chat, messages: [] });
    get().fetchMessages(chat._id);
  },

  // Fetch messages
  fetchMessages: async (chatId) => {
    try {
      const { data } = await axios.get(`${API_URL}/messages/${chatId}`);
      set({ messages: data });
    } catch (err) {
      console.error(err);
    }
  },

  // Add message (real-time)
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  // Typing
  setTyping: (isTyping, userName) => {
    set({ typing: isTyping, typingUser: isTyping ? userName : null });
  },
}));

export default useStore;
