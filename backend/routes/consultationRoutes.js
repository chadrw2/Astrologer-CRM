const express=require("express");
const router=express.Router();

const {createConsultation,getConsultations,getOneConsultation,updateConsultation,deleteConsultation}=require("../controllers/consultationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/",createConsultation);
router.get("/",getConsultations);
router.get("/:id",getOneConsultation);
router.put("/:id",updateConsultation);
router.delete("/:id",deleteConsultation);

module.exports=router;