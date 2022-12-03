import { Schema, model } from "mongoose";

const groupSchema = Schema(
  {
    groupName: String,
    users: [{ type: String, ref: "user" }],
    private: { type: Boolean, default: false },
    owner: { type: String, ref: "user" },
    list: [{type: String, ref: 'article'}]
  },
  { timestamps: true }
);

export default model("groups", groupSchema);
