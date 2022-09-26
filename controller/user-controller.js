const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_USER = [
  {
    id: "u1",
    name: "abc",
    email: "test@123.com",
    password: "test",
  },
];

const getUser = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USER });
};

const signUp = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USER.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("could not create user, email already exists", 422);
  }
  const createdUser = { id: uuidv4(), name, email, password };
  DUMMY_USER.push(createdUser);
  res.status(200).json({ users: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUSer = DUMMY_USER.find((u) => u.email === email);
  if (!identifiedUSer || identifiedUSer.password !== password) {
    throw new HttpError(
      "could not find user, credential seems to be wrong",
      401
    );
  }
  res.json({ message: "Logged in" });
};

exports.getUser = getUser;
exports.signUp = signUp;
exports.login = login;
