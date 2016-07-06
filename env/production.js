var port = process.env.PORT;

module.exports = {
  port: port,
  db: process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/peckbox',
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET
};