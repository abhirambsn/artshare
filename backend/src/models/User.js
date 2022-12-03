import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    privateList: [{ type: String, ref: "article" }],
  },
  { timestamps: true }
);

export default model("user", userSchema);
