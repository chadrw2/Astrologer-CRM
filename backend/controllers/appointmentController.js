const Appointment=require("../models/appointment");
const client = require("../models/client");

//CREATE Appointment
const createAppointment=async(req,res)=>{
    try{
        const clientt=await client.findOne({_id:req.body.clientId,userId:req.user.id});
    if(!clientt){
        return res.status(404).json({
            message:"client not found"
        });
    }
        const appointment=await Appointment.create({...req.body,userId:req.user.id});
        res.status(201).json(appointment);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//GET ALL Appointments
const getAppointments=async(req,res)=>{
    try{
    const getAppointment=await Appointment.find({userId:req.user.id}).populate("clientId");
    res.json(getAppointment);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};   

//GET ONE Appointment
const getAppointment=async(req,res)=>{
    try{
    const appointment=await Appointment.findOne({_id:req.params.id,userId:req.user.id}).populate("clientId");
    res.json(appointment);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};  

//UPDATE Appointment
const updateAppointment=async(req,res)=>{
    try{
        const update=await Appointment.findOneAndUpdate(
            {
                _id:req.params.id,
                userId:req.user.id
            },
            req.body,
            {new:true, runValidators:true}
        );
        if(!update) return res.status(404).json({message:"Appointment not found"});
        res.json(update);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//DELETE Appointment
const deleteAppointment=async (req,res)=>{
    try{
        await Appointment.findOneAndDelete({_id:req.params.id,userId:req.user.id});
        res.json({message:"Appointment Deleted"
        });
    }
    catch(err){
        res.status(500).json({message:err.message
        });
    }
};

module.exports={
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment
}