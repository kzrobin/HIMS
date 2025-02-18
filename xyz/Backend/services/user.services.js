const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password, // Assumed to already be hashed
}) => {
  // Check for required fields
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }

  // Calculate trial period (7 days)
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from trial start

  // Create the user
  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password, // Use the hashed password directly
    trialStartDate,
    trialEndDate,
  });

  return user;
};
