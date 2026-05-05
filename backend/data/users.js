const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    email: "test@mail.com",
    password: bcrypt.hashSync("123456", 10),
    name: "Test User"
  }
];

module.exports = users;