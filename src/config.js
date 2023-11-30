const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const ROLES = {
  COMPANY: "COMPANY",
  USER: "USER",
  ADMIN: "ADMIN",
};

const STORAGE = {
  BUCKET: process.env.BUCKET,
  ACCESS_KEY: process.env.ACCESS_KEY,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  ENDPOINT: process.env.R2_ENDPOINT,
  PUBLIC_URL: process.env.R2_PUBLIC_URL,
};

const EMAIL = {
  HOST: process.env.EMAIL_HOST,
  PORT: process.env.EMAIL_PORT,
  USER: process.env.EMAIL_USER,
  PASSWORD: process.env.EMAIL_PASSWORD,
  FROM: process.env.EMAIL_FROM,
};

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

module.exports = {
  PORT,
  SESSION_SECRET,
  TOKEN_SECRET,
  ROLES,
  STORAGE,
  REDIS_URL,
  EMAIL,
};
