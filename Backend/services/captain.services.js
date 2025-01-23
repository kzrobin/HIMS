const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  vehicleType,
  capacity,
  plate,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !vehicleType ||
    !color ||
    !plate ||
    !capacity
  ) {
    console.log(
      `firstname : ${firstname}, lastname: ${lastname}, email: ${email} password: ${password}, vehicleType: ${vehicleType}, color: ${color}, plate:${plate}, capacity: ${capacity}`
    );
    throw new Error("All fields are required");
  }

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      vehicleType,
      color,
      capacity,
      plate,
    },
  });

  return captain;
};
