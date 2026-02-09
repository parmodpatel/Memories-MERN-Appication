import jwt from "jsonwebtoken";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "auth_token";

const buildVerifyOptions = () => {
  const options = {
    algorithms: ["HS256"],
  };
  return options;
};

const auth = (req, res, next) => {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "").trim()
    : "";
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfigured." });
  }

  try {
    const decoded = jwt.verify(token, secret, buildVerifyOptions());
    req.userId = decoded.sub;
    req.userEmail = decoded.email;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default auth;
