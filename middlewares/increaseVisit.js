import Post from "../models/post.model.js";

const increaseVisit = async (req, res, next) => {
  const slug = req.params.slug;

  // Check if the post exists
  const post = await Post.findOne({ slug });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Increment visit count
  await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });

  next();
};

export default increaseVisit;
