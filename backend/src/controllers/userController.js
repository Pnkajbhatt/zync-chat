import User from "../models/User.js";

// @desc    Search users by name/email (exclude self)
// @route   GET /api/users?search=john
export const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");

  res.json(users);
};

// @desc    Get current user profile
// @route   GET /api/users/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
