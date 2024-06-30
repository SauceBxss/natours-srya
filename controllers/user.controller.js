const Users = require('../models/userModel')
const catchErrorsInEveryRoute = require('../utils/catchErrorsInEveryRoute');

const getAllusers =catchErrorsInEveryRoute(async (req, res, next) => {

const users = await Users.find()

  return res.status(200).json({
			results: users.length,
			status: "success",
			data: {
				users
			},
		})

})

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};

const createNewUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet defined",
  });
};

module.exports = {
  getAllusers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
};
