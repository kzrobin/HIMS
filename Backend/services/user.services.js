const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
 
  // verify available fields
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  // create user 
  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
};
