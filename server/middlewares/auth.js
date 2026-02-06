import jwt from "jsonwebtoken";

const buildVerifyOptions = () => {
  const options = {};
  options.algorithms = ["HS256"];
  if (process.env.JWT_ISSUER) {
    options.issuer = process.env.JWT_ISSUER;
  }
  if (process.env.JWT_AUDIENCE) {
    options.audience = process.env.JWT_AUDIENCE;
  }
  return options;
};

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfigured." });
  }

  try {
    const decoded = jwt.verify(token, secret, buildVerifyOptions);
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default auth;
