const express = require("express");
const {
  getAllusers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const {signup, login} = require("../controllers/auth.controller");


const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)

router.route("/").get(getAllusers).post(createNewUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;
