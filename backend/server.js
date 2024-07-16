import app from "./index.js";
import connectDB from "./Utils/connectDB.js";

connectDB;
app.listen(8979, ()=>{
    console.log("Server is up and running at 8979");
})