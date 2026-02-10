import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const buildTokenOptions = () => {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    algorithm: "HS256",
  };
  return options;
};

const parseDurationToMs = (value) => {
  if (!value) {
    return 60 * 60 * 1000;
  }

  const raw = String(value).trim();
  if (/^\d+$/.test(raw)) {
    return Number(raw) * 1000;
  }

  const match = raw.match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * (unitMs[unit] || 60 * 60 * 1000);
};

const buildAuthCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: parseDurationToMs(process.env.JWT_EXPIRES_IN || "1h"),
  };
};

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET");
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    secret,
    buildTokenOptions()
  );
};

const normalizeEmail = (email) => email.trim().toLowerCase();

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name?.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken(user);
    res.cookie("auth_token", token, buildAuthCookieOptions());

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.message === "Missing JWT_SECRET") {
      return res.status(500).json({ message: "Server misconfigured." });
    }
    return res.status(500).json({ message: "Unable to create account." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+passwordHash"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user);
    res.cookie("auth_token", token, buildAuthCookieOptions());

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.message === "Missing JWT_SECRET") {
      return res.status(500).json({ message: "Server misconfigured." });
    }
    return res.status(500).json({ message: "Unable to sign in." });
  }
};

export const me = async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch profile." });
  }
};

export const logout = async (_req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  return res.status(204).send();
};
