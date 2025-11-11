const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const userCtrl = require("../controllers/userController");

router.get("/", auth(["admin"]), userCtrl.getAllUsers);
router.delete("/:id", auth(["admin"]), userCtrl.deleteUser);

module.exports = router;
