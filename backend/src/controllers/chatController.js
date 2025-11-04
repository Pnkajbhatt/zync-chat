import Chat from "../models/Chat.js";
import User from "../models/User.js";

// @desc    Access or create 1:1 chat
// @route   POST /api/chats
export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId)
    return res.status(400).json({ message: "UserId param required" });

  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (chat) {
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });
    return res.json(chat);
  }

  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(201).json(fullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetch all chats for logged-in user
// @route   GET /api/chats
export const fetchChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    res.json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
