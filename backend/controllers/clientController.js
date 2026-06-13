const Client=require("../models/client");

//CREATE CLIENT
const createClient=async(req,res)=>{
    try{
        const client=await Client.create({...req.body,userId:req.user.id});
        res.status(201).json(client);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

//GET ALL CLIENTs
const getClients=async(req,res)=>{
    try{
        const clients=await Client.find({userId:req.user.id});
        res.json(clients);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

//GET ONE CLIENT
const getClientById= async(req,res)=>{
    try{
        const client=await Client.findOne({_id:req.params.id, userId:req.user.id});

        if(!client){
            return res.status(404).json({message:"Client not found"});
        }
        res.json(client);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

//DELETE CLIENT
const deleteClient=async(req,res)=>{
    try{
        const client=await Client.findOneAndDelete({_id:req.params.id,userId:req.user.id});
        if(!client) return res.status(404).json({message:"client not found"});
        res.json({message:"Client Deleted Successfully"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

//SEARCH CLIENTS
const searchClients=async(req,res)=>{
    try{
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        
        const clients = await Client.find({
            userId: req.user.id,
            $or: [
                { name: { $regex: query, $options: "i" } },
                { phone: { $regex: query, $options: "i" } }
            ]
        });
        res.json(clients);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports={
    createClient,
    getClients,
    getClientById,
    deleteClient,
    searchClients
}