const Consultation=require("../models/consultation");

//Crete Consultation
const createConsultation=async(req,res)=>{
    try{
        const create=await Consultation.create({...req.body,userId:req.user.id});
        res.status(201).json(create);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//GET All consultations
const getConsultations=async(req,res)=>{
    try{
        const getAll=await Consultation.find({userId:req.user.id}).populate("clientId").populate("appointmentId");
        res.json(getAll);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//Get one Consultation
const getOneConsultation=async(req,res)=>{
    try{
        const getOne=await Consultation.findOne({_id:req.params.id,userId:req.user.id});
        res.json(getOne);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//Updte Consultation
const updateConsultation=async(req,res)=>{
    try{
        const update=await Consultation.findOneAndUpdate({_id:req.params.id,userId:req.user.id},req.body,{new:true}
        )
        res.json(update);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//delete Consultation
const deleteConsultation=async(req,res)=>{
    try{
        await Consultation.findOneAndDelete({_id:req.params.id,userId:req.user.id});
        res.json({message:"consultation Deleted"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={
    createConsultation,
    getConsultations,
    getOneConsultation,
    updateConsultation,
    deleteConsultation
}