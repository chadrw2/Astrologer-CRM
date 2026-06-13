const express=require("express");
const router=express.Router();

const {dashboard}=require("../controllers/dashboardControlller");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/dashboard",dashboard);

module.exports=router;