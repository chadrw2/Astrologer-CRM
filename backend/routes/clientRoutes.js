const express=require("express");
const router=express.Router();

const {createClient,getClientById,getClients,deleteClient,searchClients}=require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/",createClient);
router.get("/search",searchClients);
router.get("/",getClients);
router.get("/:id",getClientById);
router.delete("/:id",deleteClient);
module.exports=router;