const commentsRouter = require("express").Router();
// models
const Comment = require("../models/comment");
const Blog = require("../models/blog");

commentsRouter.get("/:id/comments", async (request, response) => {
  const comments = await Comment.find({}).populate("blog", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.status(200).json(comments);
});

commentsRouter.post("/:id/comments", async (request, response, next) => {
  try {
    const body = request.body;
    const id = request.params.id;
    const comment = new Comment({
      comment: body.comment,
      blog: request.params.id,
    });
    const result = await comment.save();
    const blog = await Blog.findById(request.params.id);
    blog.comments = blog.comments.concat(result._id);
    await blog.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = commentsRouter;
