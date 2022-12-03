import Article from "../models/Article.js";
import Groups from "../models/Groups.js";
import User from "../models/User.js";
export const pushArticle = async (req, res) => {
  // Get Data
  const data = req.body;

  // Check for public grp or private
  const group = data?.group;
  const title = data?.title;
  const link = data?.link;

  let grp_data;

  if (group !== "public" && group !== "private") {
    const grp = await Groups.findOne({ name: group }).exec();
    if (!grp) {
      return res.status(404).send({ message: "Group not Found" });
    }
    grp_data = grp;
  }

  const article = new Article({
    title,
    link,
    isPrivate: group === "private" ? true : false,
    tags: [],
  });
  await article.save();

  if (group === "public") {
    return res.status(201).send({ message: "Article Added", id: article?._id });
  } else {
    if (group === "private") {
      const user = await User.findById(req.user?.id).exec();
      user.privateList.push(article?._id);
      await user.save();
    } else {
      grp_data.articles.push(article?._id);
      await grp_data.save();
    }
  }
  return res.status(201).send({ message: "Article Added", id: article?._id });
};

export const getArticlesOfUser = async (req, res) => {
  // Get List of articls by user from DB
  // Return
};

export const getAllPublicArticles = async (req, res) => {
  // Get List of all public Articles from DB
  // Return
};

export const searchArticleByTitle = async (req, res) => {
  // Get Title
  // Retrieve from Db
  // Return
};

export const getArticleById = async (req, res) => {
  // Get ID
  // Retrieve from DB
  // Return
};

export const createGroup = async (req, res) => {
  // Get User Data
  const user = req?.user;

  // Process Group Data if user is present
  const body = req.body;

  // Create Group

  // Return Details
};

export const getGroupDetails = async (req, res) => {
  // Get Group Id from params
  // Search Grp in DB
  // Return
};

export const askForInvite = async (req, res) => {
  // Get current user data
  const user = req?.data;

  // Get Group details from request
  const body = req.body;

  // Check for group and its owner from DB

  // Return
};

export const acceptInvite = async (req, res) => {
  // Get Invite Details
  const body = req.body;

  // Check Invite if found in DB then add the user to the group

  // Return
};

export const getInvites = async (req, res) => {
  // Get all the groups where the logged in user is a owner from the Database
};
