const Client=require("../models/client");
const Appointment=require("../models/appointment");

const dashboard=async (req,res)=>{
    try{
        const totalClients=await Client.countDocuments();
        const totalAppointments=await Appointment.countDocuments();
        res.status(200).json({totalClients,totalAppointments});
    }
    catch(err){ res.status(500).json({Message:err.message})}
}

module.exports={dashboard};