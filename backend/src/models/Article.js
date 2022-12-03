import { Schema, model } from "mongoose";

const articleSchema = Schema(
  {
    title: String,
    link: String,
    isPrivate: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default model("article", articleSchema);
