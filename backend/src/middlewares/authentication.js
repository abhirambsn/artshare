import jwt from "jsonwebtoken";

export const verifyAuth = (req, res, next) => {
  const tokenHeader = req.headers["x-access-token"];
  if (!tokenHeader) {
    return res.status(400).send({
      message:
        "Header is not set, please set the x-access-token header as 'Bearer <token>'",
    });
  }
  const tokenList = tokenHeader.split(" ");
  if (tokenList.length < 2) {
    return res.status(400).send({
      message:
        "Header is not set correctly, please set the x-access-token header as 'Bearer <token>'",
    });
  }
  const token = tokenList[1].trim();
  if (token) {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      req.user = verify;
      next();
    } else {
      return res.status(401).send({ message: "Token is invalid" });
    }
  } else {
    return res.status(401).send({ message: "Unauthorized" })
  };
};
