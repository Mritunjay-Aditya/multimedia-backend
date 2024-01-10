import dotenv from "dotenv"
import connectDB from "./db/db_index.js";
dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Server Crashed Due to ", error);
        process.exit(1)
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed!!!", err);
})