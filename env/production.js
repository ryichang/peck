var port = process.env.PORT;

module.exports = {
  port: port,
  db: process.env.MONGODB_URI,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  NWT_SECRET: process.env.NWT_SECRET,
};