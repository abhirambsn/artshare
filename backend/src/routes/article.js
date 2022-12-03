import express from "express";
import {
  acceptInvite,
  askForInvite,
  createGroup,
  getAllPublicArticles,
  getArticleById,
  getArticlesOfUser,
  getGroupDetails,
  getInvites,
  pushArticle,
  searchArticleByTitle,
} from "../controllers/article.js";
import { verifyAuth } from "../middlewares/authentication.js";

const router = express.Router();

router.get("/myarticles", verifyAuth, getArticlesOfUser);
router.get("/all", getAllPublicArticles);
router.get("/:id", getArticleById);
router.post("/", verifyAuth, pushArticle);
router.post("/search", searchArticleByTitle);
router.post("/group/create", verifyAuth, createGroup);
router.get("/group/:groupId", verifyAuth, getGroupDetails);
router.post("/invite/:groupId", verifyAuth, askForInvite);
router.post("/invite/:groupId/accept", verifyAuth, acceptInvite);
router.get("/invite", verifyAuth, getInvites);

export default router;
