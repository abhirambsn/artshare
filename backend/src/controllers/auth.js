import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const createUser = async (req, res) => {
  const data = req.body;
  const name = data?.name;
  const username = data?.username;
  const password = data?.password;

  const pwdHash = await argon2.hash(password);
  const newUser = new User({
    name,
    username,
    password: pwdHash,
  });
  await newUser.save();
  return res.status(201).send(newUser);
};

export const login = async (req, res) => {
  const data = req.body;
  const username = data?.username;
  const password = data?.password;
  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).send({ msg: "Username not Found" });
  }
  const pwdHash = user.password;
  const verify = await argon2.verify(pwdHash, password);
  if (!verify) {
    return res.status(403).send({ msg: "Invalid Password" });
  }
  const token = jwt.sign(
    {
      id: user?._id.toString(),
      name: user?.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: 3 * 24 * 60 * 60 }
  );
  return res.status(200).send({ token, msg: "Login Successful" });
};

export const changePassword = async (req, res) => {
  const data = req.body;
};

export const resetPassword = async (req, res) => {
  const data = req.body;
};

export const profile = async (req, res) => {
  const user = req.user;
  const detail = await User.findById(user?.id)
    .select(["-password", "-__v", "-updatedAt"])
    .exec();
  return res.status(200).send(detail);
};
