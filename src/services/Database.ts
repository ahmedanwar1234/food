
import mongoose from "mongoose";
import { MONGO_URL } from "../config";

export default async()=>{

   await mongoose.connect(MONGO_URL).then((result)=>{
        console.log("success connect with mongofucker")
    }).catch(error=>{
        console.log(error)
    })
}
