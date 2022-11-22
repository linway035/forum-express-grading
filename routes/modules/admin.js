const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admin-controller");
const { authenticatedAdmin } = require("../../middleware/auth");

router.get("/restaurants", authenticatedAdmin, adminController.getRestaurants); //加入authenticatedAdmin
router.use("/", (req, res) => res.redirect("/admin/restaurants"));
module.exports = router;
