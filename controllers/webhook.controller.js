import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { Webhook } from "svix";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body; // This should now be a Buffer
  const headers = req.headers;

  console.log("Headers:", headers);
  console.log("Raw Payload:", payload.toString()); // Convert buffer to string for debugging

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(payload, headers);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({
      message: "Webhook verification failed!",
    });
  }

  console.log("Event received:", evt);

  if (evt.type === "user.created") {
    try {
      const newUser = new User({
        clerkUserId: evt.data.id,
        username: evt.data.username || evt.data.email_addresses?.[0]?.email_address,
        email: evt.data.email_addresses?.[0]?.email_address,
        img: evt.data.profile_img_url,
      });
  
      const savedUser = await newUser.save();
      console.log("User saved to DB:", savedUser);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }
  

  if (evt.type === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: evt.data.id,
    });

    if (deletedUser) {
      await Post.deleteMany({ user: deletedUser._id });
      await Comment.deleteMany({ user: deletedUser._id });
    }
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};
