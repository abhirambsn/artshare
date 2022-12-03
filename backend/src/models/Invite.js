import { Schema, model } from "mongoose";

const inviteSchema = Schema(
  {
    toGrp: { type: String, ref: "group" },
    user: { type: String, ref: "user" },
    expireAt: { type: Date, expires: 3600 },
  },
  { timestamps: true }
);

export default model("invite", inviteSchema);
