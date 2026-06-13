require("dotenv").config({ path: __dirname + '/.env' });
console.log("JWT_SECRET Loaded:", process.env.JWT_SECRET ? "Yes" : "No");
const express=require("express");
const connectDB=require("./config/db");
const clientRoutes=require("./routes/clientRoutes");
const appointmentRoutes=require("./routes/appointmentRoutes");
const consultationRoutes=require("./routes/consultationRoutes");
const authRoutes=require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors=require("cors");
const app=express();

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(express.json());
connectDB();
app.get("/",(req,res)=>{
    res.send("Astrology CRM API Running");
});
app.use("/api/auth",authRoutes);
app.use("/api/clients",clientRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/consultations",consultationRoutes);
app.use("/api/dashboard", dashboardRoutes);
const PORT=5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});